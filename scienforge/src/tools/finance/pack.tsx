"use client";

import { makeTool } from "@/lib/makeTool";
import Formula from "@/components/Formula";
import { trim } from "@/lib/format";

/** Amounts are currency-agnostic: the user works in whatever they typed in. */
function money(v: number): string {
  return v.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export const compoundInterest = makeTool({
  slug: "compound-interest",
  category: "finance", group: "Interest and growth",
  title: "Compound interest calculator",
  label: "Compound interest",
  description: "Project the growth of a starting balance with regular contributions, at any interest rate and compounding frequency.",
  keywords: ["compound interest", "savings", "investment growth", "apy", "future value"],
  columns: 3,
  inputs: [
    { key: "p", label: "Starting amount", initial: "1000" },
    { key: "r", label: "Annual rate", unit: "%", initial: "7" },
    { key: "y", label: "Years", initial: "20" },
    { key: "add", label: "Added each month", initial: "0", optional: true },
    { kind: "select", key: "freq", label: "Compounding", initial: "12",
      options: [
        { value: "1", label: "Yearly" }, { value: "4", label: "Quarterly" },
        { value: "12", label: "Monthly" }, { value: "365", label: "Daily" },
      ] },
  ],
  compute: ({ n, s }) => {
    if (!(n.p >= 0) || !Number.isFinite(n.r) || !(n.y > 0)) return null;
    const k = Number(s.freq), i = n.r / 100 / k, periods = k * n.y;
    const growth = (1 + i) ** periods;
    const fvLump = n.p * growth;
    const monthly = n.add > 0 ? n.add : 0;
    const perPeriodContrib = (monthly * 12) / k;
    const fvContrib = i === 0 ? perPeriodContrib * periods : perPeriodContrib * ((growth - 1) / i);
    const total = fvLump + fvContrib;
    const paidIn = n.p + monthly * 12 * n.y;
    return {
      name: "Final balance",
      value: money(total),
      rows: [
        { label: "Total contributed", value: money(paidIn) },
        { label: "Interest earned", value: money(total - paidIn) },
        { label: "Effective annual rate", value: `${trim(((1 + i) ** k - 1) * 100, 5)}%` },
        { label: "Growth multiple", value: `${trim(total / Math.max(paidIn, 1e-9), 4)} ×` },
        { label: "Doubling time (rule of 72)", value: n.r > 0 ? `${trim(72 / n.r, 4)} years` : "—" },
      ],
      note: "Amounts are in the same currency you entered. Ignores tax, fees and inflation, all of which matter over long periods.",
    };
  },
  Article: () => (
    <>
      <p>Compound interest is interest earned on interest already earned. Because each period&rsquo;s growth becomes part of the base for the next, the balance grows exponentially rather than linearly.</p>
      <Formula>A = P (1 + r/n)^(nt)&nbsp;&nbsp;&nbsp;FV of contributions = C · ((1 + i)^N − 1) / i</Formula>
      <h2>Time matters more than rate</h2>
      <p>The exponent is where the leverage sits. £1,000 at 7% becomes £1,967 after ten years, £3,870 after twenty and £7,612 after thirty. Each additional decade adds more than the last, which is why starting early outweighs almost any other decision in long-horizon saving.</p>
      <h2>The rule of 72</h2>
      <p>Divide 72 by the annual percentage rate for a close approximation of the doubling time. At 6%, money doubles in about twelve years; at 9%, in eight. It is accurate to within a few percent for rates between roughly 4 and 15.</p>
      <h2>Compounding frequency</h2>
      <p>More frequent compounding gives slightly more, with diminishing returns. At a 10% nominal rate, yearly compounding yields 10.00%, monthly 10.47%, and continuous compounding 10.52% — the ceiling. Always compare effective annual rates rather than nominal ones.</p>
      <h2>Inflation and fees</h2>
      <p>A 7% return with 3% inflation is roughly 4% in real terms, and the same exponential arithmetic works against you. A 1% annual fee on a portfolio compounding at 7% for thirty years consumes roughly a quarter of the final balance. This calculator shows nominal figures only.</p>
      <p>These are arithmetic projections, not predictions. Actual returns vary, and nothing here is financial advice — for decisions that matter, talk to a qualified adviser.</p>
    </>
  ),
});

export const loanPayment = makeTool({
  slug: "loan-payment",
  category: "finance", group: "Borrowing",
  title: "Loan payment calculator",
  label: "Loan payment",
  description: "Find the monthly payment on an amortising loan, with total interest paid and the split on the first payment.",
  keywords: ["loan payment", "amortisation", "mortgage", "monthly payment", "interest"],
  columns: 3,
  inputs: [
    { key: "p", label: "Loan amount", initial: "250000" },
    { key: "r", label: "Annual rate", unit: "%", initial: "5.5" },
    { key: "y", label: "Term", unit: "years", initial: "25" },
  ],
  compute: ({ n }) => {
    if (!(n.p > 0) || !(n.y > 0) || !Number.isFinite(n.r)) return null;
    const i = n.r / 100 / 12, N = n.y * 12;
    const pay = i === 0 ? n.p / N : (n.p * i) / (1 - (1 + i) ** -N);
    const totalPaid = pay * N;
    const firstInterest = n.p * i;
    return {
      name: "Monthly payment",
      value: money(pay),
      rows: [
        { label: "Total paid over the term", value: money(totalPaid) },
        { label: "Total interest", value: money(totalPaid - n.p) },
        { label: "Interest as % of principal", value: `${trim(((totalPaid - n.p) / n.p) * 100, 5)}%` },
        { label: "First payment: interest", value: money(firstInterest) },
        { label: "First payment: principal", value: money(pay - firstInterest) },
        { label: "Number of payments", value: String(N) },
      ],
      note: "Amounts are in the same currency you entered. Principal and interest only — insurance, tax and fees are not included.",
    };
  },
  Article: () => (
    <>
      <p>An amortising loan is repaid in equal instalments, each covering the interest accrued that month plus a slice of the outstanding principal. The payment size is fixed; the split between interest and principal is not.</p>
      <Formula>M = P · i / (1 − (1 + i)^(−N))</Formula>
      <p>P is the principal, i the monthly rate (annual rate divided by twelve) and N the total number of payments.</p>
      <h2>Early payments are almost all interest</h2>
      <p>On a 25-year loan at 5.5%, the first payment is roughly two thirds interest. The balance shifts gradually and only crosses over to majority-principal around the halfway point. This is why paying off a loan a few years early saves far less than the remaining years suggest — most of the interest has already been paid.</p>
      <h2>Term versus payment</h2>
      <p>Extending the term reduces the monthly payment but increases the total interest sharply, because the balance stays high for longer. On £250,000 at 5.5%, moving from 25 to 35 years cuts the payment by roughly 12% while adding well over £100,000 in interest.</p>
      <h2>Overpayments</h2>
      <p>An extra payment goes entirely against principal, so it removes all the future interest that principal would have generated. Early overpayments are dramatically more effective than late ones. Check whether your lender charges early repayment penalties first.</p>
      <h2>What the formula ignores</h2>
      <p>Real loans add arrangement fees, insurance, taxes and sometimes variable rates. The APR is the figure designed to include most of these, and it is the one to compare between lenders. This calculator gives the pure amortisation figure and is not financial advice.</p>
    </>
  ),
});

/* ------------------------------------------------------------------ */
export const simpleInterest = makeTool({
  slug: "simple-interest",
  category: "finance",
  group: "Interest and growth",
  title: "Simple interest calculator",
  label: "Simple interest",
  description:
    "Calculate simple interest on a loan or investment, with the total amount owed or earned over the term.",
  keywords: ["simple interest", "interest calculator", "principal and interest", "simple interest formula"],
  related: ["compound-interest"],
  columns: 3,
  inputs: [
    { key: "p", label: "Principal", initial: "1000" },
    { key: "r", label: "Annual interest rate", unit: "%", initial: "5" },
    { key: "t", label: "Time period", unit: "years", initial: "3" },
  ],
  compute: ({ n }) => {
    if (!(n.p > 0) || !Number.isFinite(n.r) || !(n.t > 0)) return null;
    const interest = (n.p * n.r * n.t) / 100;
    const total = n.p + interest;
    const monthlyEquivalent = interest / (n.t * 12);
    return {
      name: "Total interest",
      value: money(interest),
      rows: [
        { label: "Total amount", value: money(total) },
        { label: "Original principal", value: money(n.p) },
        { label: "Average interest per month", value: money(monthlyEquivalent) },
        { label: "Average interest per year", value: money(interest / n.t) },
      ],
      note: "Amounts are in the same currency you entered. Simple interest accrues only on the original principal, never on previously earned interest.",
    };
  },
  Article: () => (
    <>
      <p>
        Simple interest grows in a straight line: the same fixed amount is earned or owed
        every period, calculated only on the original principal. It never compounds — the
        interest earned in year one does not itself earn interest in year two.
      </p>
      <Formula>I = P × r × t</Formula>
      <p>
        P is the principal, r is the annual interest rate as a decimal, and t is time in
        years. Multiply the three together and the result is the total interest — not the
        total amount owed, which is principal plus interest.
      </p>

      <h2>Working through an example</h2>
      <p>
        $1,000 at 5% simple interest for 3 years: I = 1000 × 0.05 × 3 = $150 in interest,
        for a total of $1,150. Every year contributes exactly $50, because each
        year&rsquo;s interest is calculated on the same unchanging $1,000 — not on the
        growing balance.
      </p>

      <h2>Simple interest versus compound interest</h2>
      <p>
        Compound interest calculates each period&rsquo;s interest on the current balance,
        which includes all previously earned interest — so the amount earned grows every
        period. Simple interest stays flat. Over short periods the difference is small; over
        long ones it becomes substantial. The same $1,000 at 5% for 20 years earns $1,000 in
        simple interest (doubling the principal) but $1,653 in interest compounded annually
        — the compounding adds an extra 65% on top of the simple case.
      </p>

      <h2>Where simple interest actually appears</h2>
      <p>
        Despite compounding being more common in savings and investment products, simple
        interest still shows up in specific places:
      </p>
      <ul>
        <li>
          <strong>Short-term loans.</strong> Many personal and auto loans use simple
          interest calculated on the remaining principal, recalculated each payment period.
        </li>
        <li>
          <strong>Bonds.</strong> Many bonds pay a fixed coupon calculated as simple
          interest on the face value, paid out rather than reinvested automatically.
        </li>
        <li>
          <strong>Certain promissory notes and private loans</strong> between individuals,
          where the simplicity of the calculation is itself a feature.
        </li>
        <li>
          <strong>Educational examples.</strong> Because the arithmetic is linear, simple
          interest is the standard starting point for teaching the concept of interest
          before introducing compounding.
        </li>
      </ul>

      <h2>A subtlety with loan repayments</h2>
      <p>
        On a simple-interest loan being paid down over time, interest is typically
        recalculated each period on the remaining balance — not the original principal —
        which means the interest portion of each payment shrinks over the life of the loan
        even though the rate never changes. This calculator assumes a lump-sum principal
        outstanding for the whole term, which suits a single deposit or a bond, but not an
        amortizing loan with regular payments; for that, use a loan payment or amortization
        calculator instead.
      </p>
    </>
  ),
});

/* ------------------------------------------------------------------ */
export const mortgagePayment = makeTool({
  slug: "mortgage-payment",
  category: "finance",
  group: "Borrowing",
  title: "Mortgage payment calculator",
  label: "Mortgage payment",
  description:
    "Calculate the monthly mortgage payment from home price, down payment, interest rate and loan term, with total interest over the life of the loan.",
  keywords: ["mortgage calculator", "mortgage payment", "home loan", "monthly mortgage"],
  related: ["loan-payment", "auto-loan"],
  columns: 4,
  inputs: [
    { key: "price", label: "Home price", initial: "300000" },
    { key: "down", label: "Down payment", initial: "60000" },
    { key: "rate", label: "Annual interest rate", unit: "%", initial: "6.5" },
    { key: "years", label: "Loan term", unit: "years", initial: "30" },
  ],
  compute: ({ n }) => {
    if (!(n.price > 0) || !(n.down >= 0) || n.down >= n.price || !(n.rate >= 0) || !(n.years > 0)) return null;
    const principal = n.price - n.down;
    const monthlyRate = n.rate / 100 / 12;
    const numPayments = n.years * 12;
    const payment = monthlyRate === 0
      ? principal / numPayments
      : (principal * monthlyRate * (1 + monthlyRate) ** numPayments) / ((1 + monthlyRate) ** numPayments - 1);
    const totalPaid = payment * numPayments;
    const totalInterest = totalPaid - principal;
    const downPct = (n.down / n.price) * 100;
    return {
      name: "Monthly payment",
      value: money(payment),
      rows: [
        { label: "Loan amount", value: money(principal) },
        { label: "Down payment", value: `${money(n.down)} (${trim(downPct, 4)}%)` },
        { label: "Total paid over term", value: money(totalPaid) },
        { label: "Total interest", value: money(totalInterest) },
        { label: "PMI likely required?", value: downPct < 20 ? "Yes — under 20% down" : "No — 20% or more down" },
      ],
      note: "Principal and interest only. Property tax, homeowners insurance and any PMI are billed separately and typically added to the monthly payment.",
    };
  },
  Article: () => (
    <>
      <p>
        A mortgage payment is calculated the same way as any amortizing loan: the payment
        is fixed for the life of the loan, but the split between interest and principal
        shifts every month as the balance shrinks.
      </p>
      <Formula>M = P × [r(1+r)ⁿ] / [(1+r)ⁿ − 1]</Formula>
      <p>
        P is the loan amount (home price minus down payment), r is the monthly interest
        rate (annual rate divided by 12), and n is the total number of monthly payments.
      </p>

      <h2>Where your money actually goes early on</h2>
      <p>
        On a 30-year loan, the first payment is overwhelmingly interest — often 70-80% of
        it — because interest is charged on the outstanding balance, which is largest at
        the very start. Only the remaining sliver reduces principal. This ratio flips
        gradually over the loan&rsquo;s life; by the final years, almost the entire payment
        is principal. This is why paying off a mortgage early saves far more interest in
        year 3 than it does in year 28 — more principal is still outstanding.
      </p>

      <h2>Why the down payment threshold matters</h2>
      <p>
        Putting down less than 20% typically triggers private mortgage insurance (PMI),
        an extra monthly charge that protects the lender, not you, in case of default. It
        adds real cost — often 0.5-1.5% of the loan annually — without buying you any
        equity. It usually cancels automatically once your loan balance drops to 78% of the
        original home value, but the total amount paid in the meantime can be substantial
        on a large loan.
      </p>

      <h2>The 15-year versus 30-year trade-off</h2>
      <p>
        A shorter term carries a lower interest rate and eliminates decades of interest
        payments, but the monthly payment is meaningfully higher because the same
        principal is repaid over half the time. A $240,000 loan at 6.5% costs about $1,517
        a month over 30 years (total interest around $306,000) versus about $2,090 a month
        over 15 years (total interest around $136,000) — roughly $170,000 saved in
        interest, at the cost of $573 more per month.
      </p>

      <h2>What this calculator leaves out</h2>
      <p>
        Real monthly housing costs usually include property tax and homeowners insurance
        bundled into the payment (often called PITI: principal, interest, tax, insurance),
        plus PMI if applicable, and possibly HOA fees. This calculator isolates principal
        and interest specifically, since tax rates and insurance costs vary enormously by
        location and are not part of the loan math itself.
      </p>
    </>
  ),
});

/* ------------------------------------------------------------------ */
export const autoLoan = makeTool({
  slug: "auto-loan",
  category: "finance",
  group: "Borrowing",
  title: "Auto loan calculator",
  label: "Auto loan",
  description:
    "Calculate the monthly payment on a car loan from the vehicle price, down payment, trade-in value, interest rate and term.",
  keywords: ["auto loan calculator", "car loan", "car payment calculator", "vehicle financing"],
  related: ["mortgage-payment", "loan-payment"],
  columns: 4,
  inputs: [
    { key: "price", label: "Vehicle price", initial: "28000" },
    { key: "down", label: "Down payment", initial: "3000" },
    { key: "trade", label: "Trade-in value", initial: "", optional: true },
    { key: "rate", label: "Annual interest rate", unit: "%", initial: "7" },
    { key: "months", label: "Loan term", unit: "months", initial: "60" },
  ],
  compute: ({ n }) => {
    if (!(n.price > 0) || !(n.down >= 0) || !(n.rate >= 0) || !(n.months > 0)) return null;
    const trade = Number.isFinite(n.trade) && n.trade > 0 ? n.trade : 0;
    const principal = n.price - n.down - trade;
    if (principal <= 0) return null;
    const monthlyRate = n.rate / 100 / 12;
    const payment = monthlyRate === 0
      ? principal / n.months
      : (principal * monthlyRate * (1 + monthlyRate) ** n.months) / ((1 + monthlyRate) ** n.months - 1);
    const totalPaid = payment * n.months;
    const totalInterest = totalPaid - principal;
    return {
      name: "Monthly payment",
      value: money(payment),
      rows: [
        { label: "Amount financed", value: money(principal) },
        { label: "Total paid over term", value: money(totalPaid) },
        { label: "Total interest", value: money(totalInterest) },
        { label: "Interest as % of amount financed", value: `${trim((totalInterest / principal) * 100, 4)}%` },
      ],
      note: "Excludes sales tax, title, registration and dealer fees, which many lenders roll into the financed amount.",
    };
  },
  Article: () => (
    <>
      <p>
        An auto loan amortizes the same way a mortgage does — same formula, shorter term.
        The vehicle price minus any down payment and trade-in value becomes the amount
        actually financed, and that amount is what accrues interest.
      </p>
      <Formula>M = P × [r(1+r)ⁿ] / [(1+r)ⁿ − 1]</Formula>

      <h2>Why the term length matters more than people expect</h2>
      <p>
        Stretching a loan from 48 to 72 months lowers the monthly payment, which is why
        longer terms are heavily marketed — but it increases total interest paid
        substantially, since interest accrues for twice as long on a slowly-shrinking
        balance. It also raises the risk of being &ldquo;underwater&rdquo;: owing more than
        the car is worth, since vehicles depreciate faster in early years than a long loan
        pays down principal.
      </p>

      <h2>New versus used loan rates</h2>
      <p>
        Lenders generally charge a lower rate for new vehicles than used ones, reflecting
        lower default risk and better collateral value on a newer asset. The gap can be
        several percentage points, which meaningfully changes the total cost calculation —
        worth checking both a new and comparable used option before assuming the sticker
        price difference tells the whole story.
      </p>

      <h2>Trade-in value is a negotiation, not a fact</h2>
      <p>
        The number you enter here should be what the dealer actually credits toward the
        purchase, which is frequently lower than independent valuation guides suggest.
        Dealers profit on the spread between what they give you for a trade and what they
        can resell it for, so it is worth checking your car&rsquo;s value independently
        before accepting a trade-in offer, or considering selling it privately instead if
        the gap is large.
      </p>

      <h2>What is missing from the sticker price</h2>
      <p>
        Sales tax, title fees, registration and documentation fees are not included here
        and vary significantly by location — some jurisdictions tax the full price, others
        tax the price minus trade-in value, which changes the effective cost meaningfully.
        Many buyers also roll these fees into the loan itself, which increases the
        principal financed and therefore the total interest paid, beyond what this
        calculator shows for the vehicle price alone.
      </p>
    </>
  ),
});

/* ------------------------------------------------------------------ */
export const retirementSavings = makeTool({
  slug: "retirement-savings",
  category: "finance",
  group: "Planning",
  title: "Retirement savings calculator",
  label: "Retirement savings",
  description:
    "Project how a starting balance and regular contributions grow over time at a given rate of return, for retirement or any long-term goal.",
  keywords: ["retirement calculator", "retirement savings", "future value", "401k calculator", "compound growth"],
  related: ["compound-interest", "investment-return"],
  columns: 4,
  inputs: [
    { key: "current", label: "Current savings", initial: "10000" },
    { key: "monthly", label: "Monthly contribution", initial: "500" },
    { key: "years", label: "Years until retirement", initial: "30" },
    { key: "rate", label: "Expected annual return", unit: "%", initial: "7" },
  ],
  compute: ({ n }) => {
    if (!(n.current >= 0) || !(n.monthly >= 0) || !(n.years > 0) || !Number.isFinite(n.rate)) return null;
    const monthlyRate = n.rate / 100 / 12;
    const numMonths = n.years * 12;
    const futureOfCurrent = n.current * (1 + monthlyRate) ** numMonths;
    const futureOfContributions = monthlyRate === 0
      ? n.monthly * numMonths
      : n.monthly * (((1 + monthlyRate) ** numMonths - 1) / monthlyRate);
    const total = futureOfCurrent + futureOfContributions;
    const totalContributed = n.current + n.monthly * numMonths;
    const totalGrowth = total - totalContributed;
    return {
      name: "Projected balance at retirement",
      value: money(total),
      rows: [
        { label: "Total contributed", value: money(totalContributed) },
        { label: "Growth from returns", value: money(totalGrowth) },
        { label: "From current savings growing alone", value: money(futureOfCurrent) },
        { label: "From future contributions", value: money(futureOfContributions) },
      ],
      note: "Ignores taxes, fees, inflation and any employer match. A real 7% return above inflation is a common long-run planning assumption for a diversified stock portfolio, not a guarantee.",
    };
  },
  Article: () => (
    <>
      <p>
        Retirement savings grow from two separate sources: the return earned on money
        already saved, and new contributions added regularly, which then also start
        earning returns of their own. Both compound over time, but they compound
        differently — a lump sum grows on its own, while a stream of contributions grows
        as an annuity.
      </p>
      <Formula>
        Future value of current savings: FV = P(1 + r)ⁿ{"\n"}
        Future value of contributions: FV = C × [(1 + r)ⁿ − 1] / r
      </Formula>

      <h2>Why starting early dominates everything else</h2>
      <p>
        Time in the market compounding is the single biggest lever in this calculation,
        larger than the contribution amount for most realistic scenarios. Someone who
        invests $300/month for 40 years at 7% ends up with more than someone who invests
        $600/month for 20 years at the same rate — despite contributing the same total
        amount — because the first saver&rsquo;s early contributions had decades longer to
        compound. This is the practical argument for starting retirement savings as early
        as possible, even with small amounts.
      </p>

      <h2>The 7% assumption, and why it is not guaranteed</h2>
      <p>
        7% is a commonly used long-run average for a diversified stock portfolio after
        adjusting for inflation, based on historical US market returns over many decades.
        It says nothing about any specific year or even decade — markets can and do decline
        for extended periods, and sequence-of-returns risk (a downturn early or late in
        your saving/withdrawal timeline) can significantly affect outcomes even when the
        long-run average holds. Treat any single number here as a planning estimate, not a
        forecast.
      </p>

      <h2>What is missing from this projection</h2>
      <ul>
        <li>
          <strong>Employer matching.</strong> If your employer matches contributions to a
          401(k) or similar plan, that match is essentially free money that should be added
          to your monthly contribution figure before running the numbers — leaving it out
          understates your real trajectory substantially.
        </li>
        <li>
          <strong>Taxes.</strong> Traditional retirement accounts defer tax until
          withdrawal; Roth accounts tax contributions now but not withdrawals. The
          effective amount you actually get to spend differs between the two even at an
          identical account balance.
        </li>
        <li>
          <strong>Fees.</strong> Fund expense ratios and account fees compound negatively
          the same way returns compound positively — a 1% annual fee on a 40-year
          timeline meaningfully erodes the final balance, more than the flat 1% suggests.
        </li>
        <li>
          <strong>Inflation.</strong> If the 7% figure is already inflation-adjusted (a
          real return), the projected balance is in today&rsquo;s purchasing power. If it
          is a nominal return instead, the actual purchasing power at retirement will be
          lower than the dollar figure suggests.
        </li>
      </ul>
    </>
  ),
});

/* ------------------------------------------------------------------ */
export const investmentReturn = makeTool({
  slug: "investment-return",
  category: "finance",
  group: "Planning",
  title: "Investment return (CAGR) calculator",
  label: "Investment return",
  description:
    "Calculate the compound annual growth rate of an investment from its starting value, ending value and holding period.",
  keywords: ["cagr calculator", "investment return calculator", "annualized return", "compound annual growth rate"],
  related: ["compound-interest", "retirement-savings"],
  columns: 3,
  inputs: [
    { key: "start", label: "Starting value", initial: "10000" },
    { key: "end", label: "Ending value", initial: "18000" },
    { key: "years", label: "Holding period", unit: "years", initial: "5" },
  ],
  compute: ({ n }) => {
    if (!(n.start > 0) || !(n.end > 0) || !(n.years > 0)) return null;
    const cagr = ((n.end / n.start) ** (1 / n.years) - 1) * 100;
    const totalReturn = ((n.end - n.start) / n.start) * 100;
    const gain = n.end - n.start;
    const doublingTime = cagr > 0 ? 72 / cagr : Infinity;
    return {
      name: "Compound annual growth rate",
      value: `${trim(cagr, 5)}%`,
      rows: [
        { label: "Total return over the period", value: `${trim(totalReturn, 5)}%` },
        { label: "Total gain", value: money(gain) },
        { label: "Value multiple", value: `${trim(n.end / n.start, 5)}×` },
        { label: "Rule-of-72 doubling time at this rate", value: Number.isFinite(doublingTime) ? `${trim(doublingTime, 4)} years` : "N/A (no growth)" },
      ],
    };
  },
  Article: () => (
    <>
      <p>
        CAGR answers a specific question: what single, steady annual rate would have
        produced this exact outcome? It smooths an irregular, lumpy investment path into
        one clean number, which is what makes it the standard way to compare investments
        with different starting points, timeframes or volatility.
      </p>
      <Formula>CAGR = (Ending value / Starting value)^(1/years) − 1</Formula>

      <h2>CAGR versus total return</h2>
      <p>
        Total return tells you the overall percentage gain or loss — simple, but useless
        for comparison unless the time periods match exactly. An investment that grew 80%
        over 10 years and one that grew 80% over 3 years had wildly different annual
        performance, even though their total returns are identical. CAGR normalises for
        time and reveals that gap: roughly 6.1% a year in the first case, about 21.6% a
        year in the second.
      </p>

      <h2>Why CAGR is a smoothed fiction, not a lived reality</h2>
      <p>
        CAGR describes the equivalent of steady growth, but real investments rarely grow
        steadily. An investment that goes up 50%, then down 20%, then up 25% over three
        years has a specific CAGR — yet at no point did the investment actually grow at
        that steady rate in any single year. This matters because volatility itself
        affects real-world outcomes (through sequence-of-returns risk, for instance) in
        ways a single smoothed average cannot capture.
      </p>

      <h2>The Rule of 72</h2>
      <p>
        A quick mental shortcut: dividing 72 by the annual growth rate gives an
        approximate number of years for an investment to double. At 8% annual growth,
        72/8 = 9 years to double — reasonably close to the exact logarithmic answer for
        rates under about 15%, and a fast way to sanity-check a CAGR result without a
        calculator.
      </p>

      <h2>What CAGR does not tell you</h2>
      <p>
        Two investments can have identical CAGR while carrying very different risk — one
        might have grown smoothly, the other might have crashed 60% and then recovered
        sharply. CAGR is silent on volatility, on drawdowns, and on how an investor might
        have reacted emotionally to the path in between. It is a useful comparison tool
        for outcomes, not a complete description of an investment&rsquo;s behaviour.
      </p>
    </>
  ),
});

/* ------------------------------------------------------------------ */
export const savingsGoal = makeTool({
  slug: "savings-goal",
  category: "finance",
  group: "Planning",
  title: "Savings goal calculator",
  label: "Savings goal",
  description:
    "Find the monthly contribution needed to reach a savings target by a given date, accounting for interest earned along the way.",
  keywords: ["savings goal calculator", "how much to save", "savings target", "monthly savings needed"],
  related: ["retirement-savings", "compound-interest"],
  columns: 4,
  inputs: [
    { key: "goal", label: "Savings goal", initial: "20000" },
    { key: "current", label: "Current savings", initial: "2000" },
    { key: "years", label: "Time to reach goal", unit: "years", initial: "4" },
    { key: "rate", label: "Expected annual return", unit: "%", initial: "4" },
  ],
  compute: ({ n }) => {
    if (!(n.goal > 0) || !(n.current >= 0) || !(n.years > 0) || !Number.isFinite(n.rate)) return null;
    if (n.current >= n.goal) {
      return {
        name: "You have already reached this goal",
        value: money(n.current),
        rows: [{ label: "Target", value: money(n.goal) }],
      };
    }
    const monthlyRate = n.rate / 100 / 12;
    const numMonths = n.years * 12;
    const futureOfCurrent = n.current * (1 + monthlyRate) ** numMonths;
    const remaining = n.goal - futureOfCurrent;
    let monthly: number;
    if (remaining <= 0) {
      monthly = 0;
    } else if (monthlyRate === 0) {
      monthly = remaining / numMonths;
    } else {
      monthly = remaining / (((1 + monthlyRate) ** numMonths - 1) / monthlyRate);
    }
    const totalContributed = n.current + Math.max(monthly, 0) * numMonths;
    return {
      name: "Required monthly contribution",
      value: money(Math.max(monthly, 0)),
      rows: [
        { label: "Goal", value: money(n.goal) },
        { label: "Current savings will grow to", value: money(futureOfCurrent) },
        { label: "Total you will contribute", value: money(totalContributed) },
        { label: "Growth from returns", value: money(n.goal - totalContributed) },
      ],
      note: monthly <= 0 ? "Your current savings alone are projected to reach the goal without further contributions." : undefined,
    };
  },
  Article: () => (
    <>
      <p>
        This calculator runs the retirement-savings problem backward: instead of
        projecting a balance from a fixed contribution, it solves for the contribution
        needed to hit a specific target by a specific date.
      </p>
      <Formula>
        Required monthly contribution = (Goal − FV of current savings) / [((1+r)ⁿ − 1) / r]
      </Formula>
      <p>
        The current savings are first projected forward on their own; whatever gap remains
        between that projection and the goal is what the monthly contributions need to
        fill, factoring in that those contributions also earn returns along the way.
      </p>

      <h2>Why the required amount is lower than a naive division</h2>
      <p>
        Simply dividing the goal by the number of months ignores that both the current
        savings and every contribution made along the way keep earning returns. The
        earlier a contribution is made, the longer it has to grow, so contributions made
        in year one do more work than contributions made in the final year. Over a long
        enough timeframe and at a reasonable rate of return, this effect can meaningfully
        lower the monthly amount actually required compared with simple division.
      </p>

      <h2>Sensitivity to the assumed rate of return</h2>
      <p>
        This calculation is more sensitive to the rate of return than people expect,
        especially over longer periods. A goal that requires $380/month at an assumed 7%
        return might require $460/month at 4% — the same goal, the same timeframe, a
        meaningfully different required monthly amount. Because future returns are never
        actually guaranteed, it is sensible to run this calculation at a conservative rate
        rather than an optimistic one, and treat the result as a lower bound on what you
        should actually be setting aside.
      </p>

      <h2>Adjusting the plan over time</h2>
      <p>
        This is a one-time calculation based on the numbers entered today. In practice,
        actual returns will differ from the assumption in any given year, so revisiting
        the calculation periodically — checking the current balance against where the
        plan assumed it would be — lets you catch a shortfall early and adjust the monthly
        contribution while there is still time to compound the correction, rather than
        discovering the gap only when the goal date arrives.
      </p>
    </>
  ),
});

/* ------------------------------------------------------------------ */
export const creditCardPayoff = makeTool({
  slug: "credit-card-payoff",
  category: "finance",
  group: "Borrowing",
  title: "Credit card payoff calculator",
  label: "Credit card payoff",
  description:
    "Find how long it takes to pay off a credit card balance at a fixed monthly payment, and the total interest paid along the way.",
  keywords: ["credit card payoff calculator", "credit card debt", "minimum payment calculator", "pay off credit card"],
  related: ["loan-payment", "simple-interest"],
  columns: 3,
  inputs: [
    { key: "balance", label: "Current balance", initial: "5000" },
    { key: "apr", label: "Annual percentage rate (APR)", unit: "%", initial: "22" },
    { key: "payment", label: "Fixed monthly payment", initial: "200" },
  ],
  compute: ({ n }) => {
    if (!(n.balance > 0) || !(n.apr >= 0) || !(n.payment > 0)) return null;
    const monthlyRate = n.apr / 100 / 12;
    const minPaymentToEverPayOff = n.balance * monthlyRate;
    if (n.payment <= minPaymentToEverPayOff) {
      return {
        name: "This payment will never pay off the balance",
        value: "Increase your monthly payment",
        rows: [
          { label: "Interest charged per month at this balance", value: money(minPaymentToEverPayOff) },
          { label: "Your payment", value: money(n.payment) },
        ],
        note: "Your payment does not even cover the interest accruing each month, so the balance will grow indefinitely rather than shrink.",
      };
    }
    let balance = n.balance;
    let months = 0;
    let totalInterest = 0;
    while (balance > 0 && months < 1200) {
      const interest = balance * monthlyRate;
      totalInterest += interest;
      balance = balance + interest - n.payment;
      months++;
    }
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    return {
      name: "Time to pay off",
      value: years > 0 ? `${years} years, ${remMonths} months` : `${remMonths} months`,
      rows: [
        { label: "Total months", value: String(months) },
        { label: "Total interest paid", value: money(totalInterest) },
        { label: "Total amount paid", value: money(n.balance + totalInterest) },
        { label: "Interest as % of original balance", value: `${trim((totalInterest / n.balance) * 100, 4)}%` },
      ],
      note: "Assumes no new charges are added to the card and the payment stays fixed every month.",
    };
  },
  Article: () => (
    <>
      <p>
        Credit card interest compounds monthly on the remaining balance, and because rates
        are typically very high — often 18-29% APR — a payment that looks reasonable can
        still leave the balance barely shrinking, or in the worst case, growing.
      </p>
      <Formula>
        Each month: balance = balance + (balance × monthly rate) − payment
      </Formula>

      <h2>The trap of paying only the minimum</h2>
      <p>
        Minimum payments on most cards are calculated as a small percentage of the
        balance — often 2-3% — which means the payment itself shrinks as the balance
        shrinks, dramatically extending the payoff timeline. A $5,000 balance at 22% APR
        paid at a fixed $100/month (2% of the original balance) can take well over 6 years
        to clear, and the total interest paid can exceed the original balance itself.
      </p>

      <h2>Why some payments never work</h2>
      <p>
        If your fixed monthly payment is less than or equal to the interest charged that
        month, the balance does not decrease at all — it grows, because unpaid interest
        gets added to the principal and starts accruing its own interest the following
        month. This calculator checks for that case directly: any payment below the
        current month&rsquo;s interest charge is mathematically incapable of ever reaching
        zero, no matter how long you wait.
      </p>

      <h2>The outsized effect of paying a little more</h2>
      <p>
        Because interest compounds on the balance every month, small increases in the
        fixed payment produce disproportionately large reductions in total interest paid
        and payoff time — increasing a payment by 25% often cuts the payoff time by much
        more than 25%, since more of each new dollar reaches the principal rather than
        being consumed by growing interest. This is the single most effective lever most
        people have for reducing credit card debt cost, more so than negotiating a rate
        reduction, though both help.
      </p>

      <h2>What this does not model</h2>
      <p>
        This assumes no new purchases are added and the payment never changes, which is
        rarely how real credit card use works. Any new charge added to the balance resets
        the clock on that portion, and many people paying down a balance continue using
        the same card, which can undermine the entire payoff plan. If avoiding new charges
        is not realistic, a useful practical step is to physically separate the card being
        paid off from ongoing spending until the balance reaches zero.
      </p>
    </>
  ),
});

/* ------------------------------------------------------------------ */
export const debtToIncome = makeTool({
  slug: "debt-to-income-ratio",
  category: "finance",
  group: "Planning",
  title: "Debt-to-income ratio calculator",
  label: "Debt-to-income ratio",
  description:
    "Calculate your debt-to-income ratio from monthly debt payments and gross income, with the thresholds lenders typically use.",
  keywords: ["debt to income ratio", "dti calculator", "dti ratio", "mortgage qualification"],
  related: ["mortgage-payment"],
  columns: 3,
  inputs: [
    { key: "housing", label: "Monthly housing payment", initial: "1500" },
    { key: "otherDebt", label: "Other monthly debt payments", initial: "400",
      hint: "Car loans, student loans, credit card minimums" },
    { key: "income", label: "Gross monthly income", initial: "6000" },
  ],
  compute: ({ n }) => {
    if (!(n.housing >= 0) || !(n.otherDebt >= 0) || !(n.income > 0)) return null;
    const totalDebt = n.housing + n.otherDebt;
    const frontEnd = (n.housing / n.income) * 100;
    const backEnd = (totalDebt / n.income) * 100;
    let verdict: string;
    if (backEnd <= 36) verdict = "Generally considered healthy";
    else if (backEnd <= 43) verdict = "Approaching the typical mortgage-qualification limit";
    else if (backEnd <= 50) verdict = "High — may limit loan approval options";
    else verdict = "Very high — most lenders would decline additional credit";
    return {
      name: "Back-end DTI (total debt)",
      value: `${trim(backEnd, 4)}%`,
      rows: [
        { label: "Front-end DTI (housing only)", value: `${trim(frontEnd, 4)}%` },
        { label: "Total monthly debt", value: money(totalDebt) },
        { label: "Gross monthly income", value: money(n.income) },
        { label: "Typical assessment", value: verdict },
      ],
      note: "Thresholds vary by lender and loan type. Uses gross (pre-tax) income, which is the standard convention lenders use.",
    };
  },
  Article: () => (
    <>
      <p>
        Debt-to-income ratio compares how much of your gross monthly income already goes
        toward debt payments. Lenders use it as a primary measure of whether you can
        realistically take on additional debt without becoming overextended.
      </p>
      <Formula>DTI = (Total monthly debt payments / Gross monthly income) × 100%</Formula>

      <h2>Front-end versus back-end DTI</h2>
      <p>
        Front-end DTI counts only housing costs — mortgage or rent, property tax,
        insurance. Back-end DTI adds every other recurring debt payment: car loans,
        student loans, minimum credit card payments, personal loans. Mortgage lenders
        typically look at both, since a healthy front-end ratio can hide an unhealthy
        back-end one if other debts are high.
      </p>

      <h2>Common thresholds</h2>
      <table>
        <thead><tr><th>Back-end DTI</th><th>General assessment</th></tr></thead>
        <tbody>
          <tr><td>Under 36%</td><td>Considered healthy by most lenders</td></tr>
          <tr><td>36-43%</td><td>Approaching the limit for many conventional mortgages</td></tr>
          <tr><td>43-50%</td><td>High; may require a stronger credit profile to qualify for new credit</td></tr>
          <tr><td>Over 50%</td><td>Most lenders would decline additional credit at this level</td></tr>
        </tbody>
      </table>
      <p>
        These are general guidelines, not fixed rules — different loan programs, credit
        scores and down payment sizes shift the actual threshold a specific lender will
        accept. FHA loans, for instance, sometimes allow higher DTI ratios than
        conventional ones.
      </p>

      <h2>Why gross income, not net</h2>
      <p>
        DTI conventionally uses gross (pre-tax) income rather than take-home pay, which
        can make the ratio look more favourable than your actual monthly cash flow feels.
        This is the standard lenders use, but it is worth separately budgeting based on
        net income for your own planning purposes — a DTI that looks comfortable on gross
        income can still leave a tight monthly budget once taxes, retirement
        contributions and other withholdings are accounted for.
      </p>

      <h2>DTI is not the whole picture</h2>
      <p>
        A low DTI does not automatically mean healthy finances — someone with a low DTI
        but no savings and high discretionary spending can be in a worse practical
        position than someone with a moderate DTI and substantial reserves. DTI measures
        debt burden relative to income specifically, and it says nothing about savings,
        emergency funds or the stability of that income going forward.
      </p>
    </>
  ),
});
