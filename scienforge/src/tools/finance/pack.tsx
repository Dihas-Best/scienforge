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
