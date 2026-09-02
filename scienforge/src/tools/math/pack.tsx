"use client";

import { makeTool } from "@/lib/makeTool";
import Formula from "@/components/Formula";
import { trim } from "@/lib/format";

const PI = Math.PI;

export const percentage = makeTool({
  slug: "percentage",
  category: "math", group: "Algebra",
  title: "Percentage calculator",
  label: "Percentage",
  description: "Work out a percentage of a number, percentage change between two numbers, and what percentage one number is of another.",
  keywords: ["percentage", "percent change", "percent of", "increase", "decrease"],
  columns: 3,
  inputs: [
    { key: "a", label: "First number", initial: "80" },
    { key: "b", label: "Second number", initial: "120" },
    { key: "p", label: "Percentage", unit: "%", initial: "15" },
  ],
  compute: ({ n }) => {
    if (!Number.isFinite(n.a) || !Number.isFinite(n.b)) return null;
    const change = ((n.b - n.a) / n.a) * 100;
    return {
      name: "Change from first to second",
      value: `${trim(change, 5)}%`,
      rows: [
        { label: "First as a % of second", value: `${trim((n.a / n.b) * 100, 5)}%` },
        { label: `${trim(n.p, 4)}% of the first`, value: trim((n.p / 100) * n.a, 6) },
        { label: `First increased by ${trim(n.p, 4)}%`, value: trim(n.a * (1 + n.p / 100), 6) },
        { label: `First decreased by ${trim(n.p, 4)}%`, value: trim(n.a * (1 - n.p / 100), 6) },
        { label: "Difference", value: trim(n.b - n.a, 6) },
      ],
    };
  },
  Article: () => (
    <>
      <p>A percentage is a fraction with 100 on the bottom. Every percentage question reduces to one of three shapes, and knowing which one you have is most of the work.</p>
      <Formula>part = whole × (p / 100){"\n"}p = (part / whole) × 100{"\n"}change = ((new − old) / old) × 100</Formula>
      <h2>Increase then decrease does not return you home</h2>
      <p>Add 20% to 100 and you get 120. Take 20% off 120 and you get 96, not 100. The two percentages are taken of different bases. To reverse a 20% increase you must divide by 1.2, which is a 16.7% decrease. This is behind a lot of misleading retail pricing and a lot of arithmetic errors in spreadsheets.</p>
      <h2>Percentage points versus percent</h2>
      <p>If an interest rate moves from 4% to 6%, that is a rise of two percentage points but a rise of 50 percent. Both are correct and they mean different things. News coverage frequently blurs the two, and the difference is often large.</p>
      <h2>Compounding percentages</h2>
      <p>Successive changes multiply rather than add. Three consecutive 10% increases give a factor of 1.1³ = 1.331, a 33.1% rise, not 30%. For the same reason, a 50% loss requires a 100% gain to recover.</p>
    </>
  ),
});

export const rightTriangle = makeTool({
  slug: "right-triangle",
  category: "math", group: "Geometry",
  title: "Right triangle calculator",
  label: "Right triangle",
  description: "Solve a right triangle from two sides: get the third side, both acute angles, area, perimeter and the trigonometric ratios.",
  keywords: ["right triangle", "pythagoras", "hypotenuse", "trigonometry", "sohcahtoa"],
  columns: 2,
  inputs: [
    { key: "a", label: "Side a (opposite)", initial: "3" },
    { key: "b", label: "Side b (adjacent)", initial: "4" },
  ],
  compute: ({ n }) => {
    if (!(n.a > 0) || !(n.b > 0)) return null;
    const c = Math.hypot(n.a, n.b);
    const A = (Math.atan2(n.a, n.b) * 180) / PI;
    return {
      name: "Hypotenuse",
      value: trim(c, 6),
      rows: [
        { label: "Angle opposite a", value: `${trim(A, 5)}°` },
        { label: "Angle opposite b", value: `${trim(90 - A, 5)}°` },
        { label: "Area", value: trim(0.5 * n.a * n.b, 6) },
        { label: "Perimeter", value: trim(n.a + n.b + c, 6) },
        { label: "sin, cos, tan of A", value: `${trim(n.a / c, 4)}, ${trim(n.b / c, 4)}, ${trim(n.a / n.b, 4)}` },
        { label: "Inradius", value: trim((n.a + n.b - c) / 2, 6) },
      ],
    };
  },
  Article: () => (
    <>
      <p>A right triangle is fully determined by any two of its sides, because the right angle fixes everything else. Pythagoras gives the third side and the inverse trigonometric functions give the angles.</p>
      <Formula>a² + b² = c²&nbsp;&nbsp;&nbsp;sin A = a/c&nbsp;&nbsp;cos A = b/c&nbsp;&nbsp;tan A = a/b</Formula>
      <h2>Which ratio to reach for</h2>
      <p>The mnemonic SOH-CAH-TOA encodes it: sine is opposite over hypotenuse, cosine is adjacent over hypotenuse, tangent is opposite over adjacent. When you know two sides and want an angle, pick the ratio that uses the two sides you have and apply its inverse.</p>
      <h2>The two acute angles always sum to 90°</h2>
      <p>Because the interior angles of any triangle total 180° and one of them is already 90°. This is why sin A = cos B in a right triangle — the two angles are complementary, and that identity is where the &ldquo;co&rdquo; in cosine comes from.</p>
      <h2>Pythagorean triples</h2>
      <p>Some right triangles have all three sides as whole numbers: 3-4-5, 5-12-13, 8-15-17, 7-24-25. Any multiple of a triple is another triple, which is why builders use the 3-4-5 method to square a corner with nothing more than a tape measure.</p>
    </>
  ),
});

export const circleGeometry = makeTool({
  slug: "circle",
  category: "math", group: "Geometry",
  title: "Circle calculator",
  label: "Circle",
  description: "Compute radius, diameter, circumference and area of a circle from any one of them, plus arc length and sector area.",
  keywords: ["circle", "circumference", "area", "radius", "diameter", "arc length", "sector"],
  columns: 3,
  inputs: [
    { key: "r", label: "Radius", initial: "5" },
    { key: "ang", label: "Sector angle", unit: "degrees", initial: "60", optional: true },
    { key: "d", label: "Or enter diameter", initial: "", optional: true },
  ],
  compute: ({ n }) => {
    const r = Number.isFinite(n.d) && n.d > 0 ? n.d / 2 : n.r;
    if (!(r > 0)) return null;
    const rows = [
      { label: "Diameter", value: trim(2 * r, 6) },
      { label: "Circumference", value: trim(2 * PI * r, 6) },
      { label: "Radius", value: trim(r, 6) },
    ];
    if (n.ang > 0) {
      const rad = (n.ang * PI) / 180;
      rows.push({ label: "Arc length", value: trim(r * rad, 6) });
      rows.push({ label: "Sector area", value: trim(0.5 * r * r * rad, 6) });
      rows.push({ label: "Chord length", value: trim(2 * r * Math.sin(rad / 2), 6) });
    }
    return { name: "Area", value: trim(PI * r * r, 6), rows };
  },
  Article: () => (
    <>
      <p>Everything about a circle follows from its radius and the constant π, which is the ratio of any circle&rsquo;s circumference to its diameter. That ratio is the same for every circle, which is the whole reason π is interesting.</p>
      <Formula>C = 2πr&nbsp;&nbsp;&nbsp;A = πr²&nbsp;&nbsp;&nbsp;arc = rθ&nbsp;&nbsp;&nbsp;sector = ½r²θ</Formula>
      <p>The arc and sector formulas require θ in radians, not degrees. One radian is the angle that cuts an arc equal in length to the radius, so a full turn is 2π radians. Converting is a matter of multiplying degrees by π/180.</p>
      <h2>Area scales with the square</h2>
      <p>Double the radius and the circumference doubles, but the area quadruples. A 16-inch pizza has 78% more food than a 12-inch one, not 33% more, which makes the larger size almost always better value.</p>
      <h2>Why radians exist at all</h2>
      <p>Degrees are arbitrary — 360 is a historical choice with no mathematical basis. Radians make the formulas clean and, more importantly, make calculus work: the derivative of sin x is cos x only when x is measured in radians. In any degrees-based version an awkward factor of π/180 appears everywhere.</p>
    </>
  ),
});

export const standardDeviation = makeTool({
  slug: "standard-deviation",
  category: "math", group: "Statistics",
  title: "Standard deviation and mean calculator",
  label: "Standard deviation",
  description: "Enter a list of numbers to get the mean, median, sample and population standard deviation, variance and range.",
  keywords: ["standard deviation", "mean", "variance", "median", "statistics"],
  columns: 2,
  inputs: [
    { kind: "select", key: "type", label: "Data represents", initial: "sample",
      options: [{ value: "sample", label: "A sample (n − 1)" }, { value: "population", label: "The whole population (n)" }] },
    { key: "data", label: "Numbers", initial: "4, 8, 15, 16, 23, 42", hint: "Separate with commas or spaces." },
  ],
  compute: ({ s }) => {
    const xs = (s.data || "")
      .split(/[\s,;]+/).map(Number).filter((x) => Number.isFinite(x));
    if (xs.length < 2) return null;
    const n = xs.length;
    const mean = xs.reduce((a, b) => a + b, 0) / n;
    const ss = xs.reduce((a, b) => a + (b - mean) ** 2, 0);
    const div = s.type === "population" ? n : n - 1;
    const variance = ss / div;
    const sd = Math.sqrt(variance);
    const sorted = [...xs].sort((a, b) => a - b);
    const median = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
    return {
      name: "Standard deviation",
      value: trim(sd, 6),
      rows: [
        { label: "Count", value: String(n) },
        { label: "Mean", value: trim(mean, 6) },
        { label: "Median", value: trim(median, 6) },
        { label: "Variance", value: trim(variance, 6) },
        { label: "Range", value: `${trim(sorted[0], 5)} to ${trim(sorted[n - 1], 5)}` },
        { label: "Sum", value: trim(xs.reduce((a, b) => a + b, 0), 6) },
        { label: "Coefficient of variation", value: mean !== 0 ? `${trim((sd / mean) * 100, 4)}%` : "—" },
      ],
    };
  },
  Article: () => (
    <>
      <p>Standard deviation measures spread. It is the typical distance of a data point from the mean, expressed in the same units as the data — which is why it is preferred over variance, whose units are squared and therefore hard to interpret.</p>
      <Formula>σ = √( Σ(xᵢ − x̄)² / N )&nbsp;&nbsp;&nbsp;s = √( Σ(xᵢ − x̄)² / (n − 1) )</Formula>
      <h2>Why n − 1 for a sample</h2>
      <p>Using the sample mean rather than the true population mean systematically underestimates the spread, because the sample mean sits closer to your particular data points than the real mean does. Dividing by n − 1 instead of n corrects this bias. Use n only when your data genuinely is the entire population — every student in one class, not a sample of students.</p>
      <h2>Reading a standard deviation</h2>
      <p>For roughly normal data, about 68% of values fall within one standard deviation of the mean, 95% within two and 99.7% within three. This is the empirical rule, and it is what makes a standard deviation intuitively meaningful. It fails badly for skewed distributions such as income, where the median is a more honest summary.</p>
      <h2>Sensitivity to outliers</h2>
      <p>Because deviations are squared, a single extreme value can dominate the result. Median and interquartile range are the robust alternatives when your data has genuine outliers you cannot justify removing.</p>
    </>
  ),
});

export const combinatorics = makeTool({
  slug: "permutations-combinations",
  category: "math", group: "Statistics",
  title: "Permutations and combinations calculator",
  label: "Permutations & combinations",
  description: "Compute nPr, nCr, factorials and the number of arrangements with and without repetition allowed.",
  keywords: ["permutations", "combinations", "npr", "ncr", "factorial", "binomial"],
  columns: 2,
  inputs: [
    { key: "n", label: "n (items to choose from)", initial: "10" },
    { key: "r", label: "r (items chosen)", initial: "3" },
  ],
  compute: ({ n }) => {
    const N = Math.round(n.n), R = Math.round(n.r);
    if (!(N >= 0) || !(R >= 0) || R > N || N > 170) return null;
    const fact = (k: number) => { let f = 1; for (let i = 2; i <= k; i++) f *= i; return f; };
    const perm = fact(N) / fact(N - R);
    const comb = perm / fact(R);
    return {
      name: "Combinations nCr (order does not matter)",
      value: trim(comb, 10),
      rows: [
        { label: "Permutations nPr (order matters)", value: trim(perm, 10) },
        { label: "With repetition, ordered (nʳ)", value: trim(N ** R, 10) },
        { label: "With repetition, unordered", value: trim(fact(N + R - 1) / (fact(R) * fact(N - 1)), 10) },
        { label: "n!", value: trim(fact(N), 10) },
        { label: "r!", value: trim(fact(R), 10) },
      ],
    };
  },
  Article: () => (
    <>
      <p>Counting problems come down to one question: does the order of the selection matter? If it does you want permutations; if it does not you want combinations.</p>
      <Formula>nPr = n! / (n − r)!&nbsp;&nbsp;&nbsp;nCr = n! / (r!(n − r)!)</Formula>
      <h2>A worked distinction</h2>
      <p>Choosing three people from ten to be president, secretary and treasurer is a permutation: 10P3 = 720, because swapping two of them produces a different outcome. Choosing three people from ten to form a committee is a combination: 10C3 = 120, because a committee is the same committee however you list its members. The permutation count is always larger by exactly r!, the number of ways to order the chosen group.</p>
      <h2>Repetition changes everything</h2>
      <p>If items can be reused — digits in a PIN, for instance — the count becomes n^r. A four-digit PIN has 10⁴ = 10,000 possibilities, but a four-digit code with no repeated digits has only 10P4 = 5,040.</p>
      <h2>Combinations are binomial coefficients</h2>
      <p>nCr is the same object as the coefficient of xʳ in the expansion of (1 + x)ⁿ, and the same as the entries in Pascal&rsquo;s triangle. That connection is why combinations appear throughout probability, from coin-flip distributions to the binomial theorem.</p>
    </>
  ),
});

export const logarithm = makeTool({
  slug: "logarithm",
  category: "math", group: "Number tools",
  title: "Logarithm calculator",
  label: "Logarithm",
  description: "Compute a logarithm in any base, with natural log, base 10 and base 2 shown alongside, plus the antilog.",
  keywords: ["logarithm", "log", "ln", "log2", "natural log", "antilog"],
  columns: 2,
  inputs: [
    { key: "x", label: "Number", initial: "1000" },
    { key: "b", label: "Base", initial: "10" },
  ],
  compute: ({ n }) => {
    if (!(n.x > 0) || !(n.b > 0) || n.b === 1) return null;
    return {
      name: `log base ${trim(n.b, 4)} of ${trim(n.x, 6)}`,
      value: trim(Math.log(n.x) / Math.log(n.b), 8),
      rows: [
        { label: "Natural log (ln)", value: trim(Math.log(n.x), 8) },
        { label: "Log base 10", value: trim(Math.log10(n.x), 8) },
        { label: "Log base 2", value: trim(Math.log2(n.x), 8) },
        { label: "Antilog (base^x)", value: trim(n.b ** n.x, 8) },
        { label: "e^x", value: trim(Math.exp(n.x), 8) },
      ],
    };
  },
  Article: () => (
    <>
      <p>A logarithm answers the question &ldquo;what power do I raise this base to, to get this number?&rdquo; log₁₀(1000) = 3 because 10³ = 1000. It is exactly the inverse of exponentiation.</p>
      <Formula>log_b(x) = y&nbsp;&nbsp;⟺&nbsp;&nbsp;b^y = x&nbsp;&nbsp;&nbsp;log_b(x) = ln(x) / ln(b)</Formula>
      <h2>The three bases you actually meet</h2>
      <p>Base 10 for orders of magnitude, decibels, pH and the Richter scale. Base e ≈ 2.71828 for anything involving continuous growth or calculus, because the derivative of eˣ is itself. Base 2 for computer science, where it counts bits and the depth of binary trees.</p>
      <h2>The properties that make logs useful</h2>
      <Formula>log(ab) = log a + log b{"\n"}log(a/b) = log a − log b{"\n"}log(aⁿ) = n · log a</Formula>
      <p>Logarithms turn multiplication into addition. Before calculators this is why slide rules and log tables existed, and it remains why logarithmic axes make exponential data legible: a curve that doubles at a constant rate becomes a straight line.</p>
      <h2>Change of base</h2>
      <p>Most calculators only have ln and log₁₀, but any base can be obtained by dividing: log₇(50) = ln(50)/ln(7). It does not matter which of the two you use as long as you use the same one twice.</p>
    </>
  ),
});
