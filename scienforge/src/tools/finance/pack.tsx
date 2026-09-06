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
