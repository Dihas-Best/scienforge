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
      <p>
        A percentage is a fraction with 100 fixed on the bottom. Every percentage question
        reduces to one of three underlying shapes — finding a part from a whole, finding
        what fraction one number is of another, or finding how much something changed —
        and knowing which shape you are looking at is most of the actual work. The
        arithmetic itself is trivial once the shape is identified.
      </p>
      <Formula>
        part = whole × (p / 100){"\n"}
        p = (part / whole) × 100{"\n"}
        change = ((new − old) / old) × 100
      </Formula>

      <h2>The three shapes, worked through</h2>
      <p>
        <strong>Finding a part.</strong> &ldquo;What is 15% of 80?&rdquo; Multiply: 80 ×
        0.15 = 12. This is the most mechanical of the three and rarely trips anyone up.
      </p>
      <p>
        <strong>Finding a percentage.</strong> &ldquo;80 is what percent of 120?&rdquo;
        Divide the part by the whole and multiply by 100: (80/120) × 100 = 66.7%. The
        common error here is dividing the wrong number by the other — always divide the
        smaller reference quantity into the total it is being compared against, not the
        other way round.
      </p>
      <p>
        <strong>Finding a change.</strong> &ldquo;A price moved from 80 to 120 — what
        percentage change is that?&rdquo; Subtract, then divide by the <em>original</em>
        value: (120 − 80) / 80 × 100 = 50%. Dividing by the new value instead of the
        original is the single most common percentage-change mistake, and it silently
        produces a smaller, wrong answer — dividing by 120 here would incorrectly give
        33.3%.
      </p>

      <h2>Increase then decrease does not return you home</h2>
      <p>
        Add 20% to 100 and you get 120. Take 20% off 120 and you get 96, not 100. The two
        percentages are calculated on different bases — the increase is 20% of 100, but
        the decrease is 20% of 120, a larger number, so it removes more than was added.
        To exactly reverse a 20% increase you must divide by 1.2 rather than subtract 20%,
        which works out to a 16.7% decrease, not 20%. This asymmetry is behind a
        surprising amount of misleading retail pricing — a store advertising &ldquo;40%
        off, then an extra 20% off&rdquo; is not offering 60% off; it is offering 1 − (0.6
        × 0.8) = 52% off, calculated by successively discounting what remains rather than
        adding the two percentages together.
      </p>

      <h2>Percentage points versus percent — a distinction worth keeping straight</h2>
      <p>
        If an interest rate moves from 4% to 6%, that is a rise of <em>two percentage
        points</em>, but it is a rise of <em>50 percent</em> relative to the original rate
        (a change of 2 divided by the original 4, times 100). Both descriptions are
        correct and they describe very different magnitudes. News coverage and marketing
        material frequently blur the two — sometimes carelessly, sometimes because the
        percent figure sounds more dramatic than the percentage-point one — and the gap
        between them widens as the original percentage gets smaller. A rate moving from 1%
        to 2% is only a single percentage point, but it is a 100% increase.
      </p>

      <h2>Compounding percentages multiply, they do not add</h2>
      <p>
        Successive percentage changes multiply rather than sum. Three consecutive 10%
        increases give a factor of 1.1³ = 1.331, a 33.1% overall rise — not the 30% that
        naive addition would suggest, because each 10% is taken on an already-larger base.
        The same logic runs in reverse for losses: recovering from a 50% loss requires a
        100% gain, not a 50% gain, since the 50% gain would only be calculated on the
        already-diminished amount. This is one of the more counterintuitive but
        consequential facts in everyday percentage arithmetic, and it is the entire reason
        a portfolio that drops 50% and then rises 50% ends up smaller than where it
        started, not back to even.
      </p>
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
      <p>
        A right triangle is fully determined by any two of its sides, because the fixed
        90° angle removes a degree of freedom that a general triangle does not have.
        Pythagoras&rsquo; theorem gives the third side directly, and the inverse
        trigonometric functions then give both remaining angles from the side lengths
        alone — no additional measurement needed.
      </p>
      <Formula>
        a² + b² = c²{"\n"}
        sin A = a/c&nbsp;&nbsp;&nbsp;cos A = b/c&nbsp;&nbsp;&nbsp;tan A = a/b
      </Formula>

      <h2>Which ratio to reach for</h2>
      <p>
        The mnemonic SOH-CAH-TOA encodes the three ratios: sine is opposite over
        hypotenuse, cosine is adjacent over hypotenuse, tangent is opposite over adjacent.
        When you know two sides and want an angle, the practical approach is to pick
        whichever ratio uses exactly the two sides you already have, then apply its
        inverse function. Knowing the opposite and hypotenuse, for instance, points
        directly at arcsine rather than arccosine or arctangent — there is no need to
        solve for the third side first if the angle is all you actually want.
      </p>

      <h2>The two acute angles always sum to 90°</h2>
      <p>
        This follows from the fact that every triangle&rsquo;s interior angles sum to
        180°, and a right triangle has already spent 90° of that budget on the right
        angle itself. The two remaining angles are called complementary, and this
        relationship is exactly why sin A = cos B for the two acute angles in the same
        triangle — it is also the historical origin of the word &ldquo;cosine,&rdquo;
        which literally means the sine of the complementary angle.
      </p>

      <h2>Pythagorean triples</h2>
      <p>
        Most right triangles have at least one irrational side length, but a special
        family — Pythagorean triples — have all three sides as whole numbers. The
        smallest and most famous is 3-4-5; others include 5-12-13, 8-15-17, and 7-24-25.
        Any whole-number multiple of a triple is itself a valid triple (6-8-10 is just
        3-4-5 doubled), which is why builders and carpenters use the 3-4-5 method —
        measuring 3 units along one edge, 4 along the perpendicular edge, and checking the
        diagonal comes out to exactly 5 — to verify a corner is truly square using nothing
        more than a tape measure.
      </p>

      <h2>The inradius, and why it is worth knowing</h2>
      <p>
        Every triangle has an inscribed circle — the largest circle that fits entirely
        inside it, touching all three sides. For a right triangle specifically, the radius
        of that circle has an unusually clean formula: r = (a + b − c) / 2, using the two
        legs and the hypotenuse. This shortcut does not exist in anywhere near as simple a
        form for a general (non-right) triangle, where the inradius instead requires
        knowing the full area and perimeter through a more general formula. It occasionally
        shows up in construction and packing problems where the largest circular object
        that fits in a right-angled corner needs to be sized quickly.
      </p>

      <h2>What two sides cannot tell you</h2>
      <p>
        Given only two sides, this calculator assumes they are the two legs (the sides
        adjacent to the right angle), not one leg and the hypotenuse. If you have a leg
        and the hypotenuse instead, the third side is found by rearranging Pythagoras
        (b = √(c² − a²)) rather than the direct addition used here — worth checking
        which two measurements you actually have before reading off a result.
      </p>
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
    { key: "ang", label: "Sector angle", initial: "60", optional: true,
      units: [
        { value: "deg", label: "degrees", toBase: 1 },
        { value: "rad", label: "radians", toBase: 57.29577951 },
      ] },
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
      <p>
        Everything about a circle follows from its radius and the constant π, defined as
        the ratio of any circle&rsquo;s circumference to its diameter. That ratio is
        exactly the same for every circle regardless of size — a coin and a planet share
        the identical π — which is the entire reason the constant is interesting enough
        to have its own symbol and to have been studied for thousands of years.
      </p>
      <Formula>
        C = 2πr&nbsp;&nbsp;&nbsp;A = πr²&nbsp;&nbsp;&nbsp;arc = rθ&nbsp;&nbsp;&nbsp;sector = ½r²θ
      </Formula>
      <p>
        The arc-length and sector-area formulas both require the angle θ to be in
        radians, not degrees — this is the single most common source of wrong answers
        when working these problems by hand. One radian is defined as the angle that
        subtends an arc exactly equal in length to the radius, so a full 360° turn is
        2π radians. Converting between the two is a matter of multiplying degrees by
        π/180, or dividing radians by that same factor to go the other way.
      </p>

      <h2>Area scales with the square of the radius, not the radius itself</h2>
      <p>
        Double the radius and the circumference doubles in step — but the area
        quadruples, because area depends on r². This single fact has real practical
        consequences: a 16-inch pizza has roughly 78% more surface area than a 12-inch
        one, not the 33% more that comparing the diameters alone might suggest, which is
        why the larger size at a pizzeria is almost always the better value per dollar
        even when it costs noticeably more.
      </p>

      <h2>Why radians exist instead of just using degrees everywhere</h2>
      <p>
        Degrees are a historical convention — 360 was chosen by ancient Babylonian
        astronomers, likely because it is close to the number of days in a year and
        divides evenly by many small numbers, but it has no deeper mathematical
        justification. Radians exist because they make the underlying mathematics
        genuinely simpler, not just differently arbitrary: the derivative of sin(x) is
        exactly cos(x) only when x is measured in radians. Using degrees instead forces
        an awkward, unavoidable factor of π/180 to appear throughout calculus, physics
        and engineering formulas, which is why virtually all higher mathematics defaults
        to radians and treats degrees as a display convenience for humans rather than a
        working unit.
      </p>

      <h2>Sectors, segments and chords — related but distinct shapes</h2>
      <p>
        A sector is the pie-slice shape bounded by two radii and the arc between them —
        its area is what the sector-area formula above computes. A segment is different:
        it is the region cut off by a straight chord rather than by two radii, meaning it
        excludes the triangular portion at the centre. The chord length itself — the
        straight-line distance between the two endpoints of the arc — is given by
        2r·sin(θ/2), and it is always shorter than the arc it subtends, since a straight
        line is always the shortest path between two points while the arc curves around
        the outside.
      </p>

      <h2>Circles in the real world rarely appear alone</h2>
      <p>
        Most practical circle problems are really about circles embedded in something
        else — a pipe&rsquo;s cross-sectional area for flow calculations, a wheel&rsquo;s
        circumference for distance-per-revolution, a satellite dish&rsquo;s collecting
        area for signal strength, which scales with the dish&rsquo;s area exactly the way
        pizza value does. Whenever a problem involves circular motion, circular
        cross-sections, or radial symmetry, these four formulas are almost always the
        starting point, with the specific physical quantity substituted in afterward.
      </p>
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
      <p>
        Standard deviation measures spread — specifically, the typical distance of a data
        point from the mean, expressed in the same units as the original data. This is
        precisely why it is preferred over variance for interpretation: variance is
        measured in squared units (dollars squared, centimetres squared), which has no
        intuitive real-world meaning, while standard deviation converts that back into
        the original, meaningful unit by taking a square root.
      </p>
      <Formula>
        σ = √( Σ(xᵢ − x̄)² / N )&nbsp;&nbsp;&nbsp;s = √( Σ(xᵢ − x̄)² / (n − 1) )
      </Formula>

      <h2>Why sample standard deviation divides by n − 1, not n</h2>
      <p>
        Using the sample&rsquo;s own mean, rather than the true population mean, to
        calculate deviations systematically underestimates the real spread — because by
        definition, the sample mean is the value that minimises the sum of squared
        deviations for that particular sample, meaning it sits slightly closer to your
        specific data points than the true population mean would. Dividing by n − 1
        instead of n is a mathematically derived correction for this bias, known as
        Bessel&rsquo;s correction, and it makes the sample variance an unbiased estimator
        of the true population variance. Use n only when your data genuinely constitutes
        the entire population you care about — every student in one specific class,
        every transaction in a closed dataset — rather than a sample drawn from some
        larger group you are trying to draw conclusions about.
      </p>

      <h2>Reading a standard deviation</h2>
      <p>
        For data that follows a roughly normal (bell-curve) distribution, standard
        deviation has a precise, useful interpretation known as the empirical rule:
        about 68% of values fall within one standard deviation of the mean, about 95%
        fall within two, and about 99.7% fall within three. This is what makes standard
        deviation intuitively meaningful rather than an abstract number — a value two
        standard deviations from the mean is genuinely rare in a normal distribution.
        The rule fails badly for skewed distributions, though — income is the classic
        example, where a small number of very high earners stretch the distribution so
        far that the mean sits well above where most people actually earn, and the
        median becomes the far more honest summary of a typical value.
      </p>

      <h2>Sensitivity to outliers</h2>
      <p>
        Because deviations from the mean are squared before being averaged, a single
        extreme value can dominate the entire result — a squared deviation grows much
        faster than the deviation itself, so one data point ten times further from the
        mean than the rest contributes a hundred times more to the sum of squares.
        Median and interquartile range are the standard robust alternatives when a
        dataset contains genuine outliers that cannot be justified as errors and removed
        — they describe the centre and spread of a distribution without being skewed by
        a small number of extreme values the way mean and standard deviation are.
      </p>

      <h2>Coefficient of variation — comparing spread across different scales</h2>
      <p>
        Standard deviation alone cannot tell you whether one dataset is more variable
        than another if the two are measured on different scales or have very different
        means — a standard deviation of 5 is enormous for data centred around 10, but
        trivial for data centred around 10,000. The coefficient of variation, calculated
        as standard deviation divided by the mean, expresses spread as a proportion of
        the average value, which makes comparing variability across genuinely different
        datasets — different currencies, different units, different orders of magnitude
        — meaningful in a way raw standard deviation cannot be.
      </p>

      <h2>Population versus sample — the decision that changes your answer</h2>
      <p>
        This distinction is not a minor technicality; the two formulas can give
        noticeably different results, especially for small datasets, where the gap
        between dividing by n and dividing by n − 1 is proportionally larger. Six data
        points divided by 6 versus divided by 5 produces a real difference in the final
        number. Before reading off a result, it is worth explicitly deciding: is this
        dataset the entire group I care about, or is it a sample I am using to estimate
        something about a larger group I have not fully measured? That single question
        determines which formula is the statistically correct one to use.
      </p>
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
      <p>
        Counting problems come down to a single diagnostic question: does the order of
        the selection matter? If it does, you want permutations. If it does not — if
        rearranging the same items counts as the same outcome — you want combinations.
        Nearly every confusion in this topic traces back to skipping that question and
        guessing at a formula instead.
      </p>
      <Formula>nPr = n! / (n − r)!&nbsp;&nbsp;&nbsp;nCr = n! / (r!(n − r)!)</Formula>

      <h2>A worked distinction between the two</h2>
      <p>
        Choosing three people from a group of ten to be president, secretary and
        treasurer specifically is a permutation problem: 10P3 = 720, because assigning the
        same three people to different roles produces a genuinely different outcome —
        swapping who is president and who is secretary matters. Choosing the same three
        people from ten simply to form an unranked committee is a combination problem:
        10C3 = 120, because a committee of Alice, Bob and Carol is identical to a
        committee of Carol, Bob and Alice — there is no role attached to distinguish the
        orderings. Notice the permutation count is always exactly r! times larger than the
        combination count (720 / 120 = 6 = 3!), because r! is precisely the number of ways
        to reorder any given group of r chosen items, and permutations count every one of
        those reorderings as distinct while combinations collapse them into one.
      </p>

      <h2>Repetition changes the entire calculation</h2>
      <p>
        Everything above assumes each item can be chosen at most once. If items can be
        reused — digits in a PIN code, letters in a password, dice rolled multiple times
        — the count becomes n^r instead, since every one of the r positions independently
        has all n options available regardless of what was already chosen. A four-digit
        PIN allowing repeated digits has 10⁴ = 10,000 possible combinations, but a
        four-digit code where no digit may repeat has only 10P4 = 5,040 — nearly half as
        many. This is precisely why security guidance sometimes discourages repeated
        characters in passwords: repetition does not reduce the search space at all in
        the way people intuitively expect, since 10,000 versus 5,040 is not actually a
        large difference relative to how brute-force guessing scales with total length.
      </p>

      <h2>Combinations are the same thing as binomial coefficients</h2>
      <p>
        nCr is not merely related to the binomial coefficient — it <em>is</em> the
        binomial coefficient, the number that appears as the coefficient of xʳ when
        expanding (1 + x)ⁿ algebraically. It is also exactly the entries found in
        Pascal&rsquo;s triangle, where each row corresponds to a fixed n and each position
        along the row corresponds to r. This is not a coincidence or an analogy — the
        combinatorial definition (ways to choose r items from n) and the algebraic
        definition (a coefficient in a polynomial expansion) are provably the same
        quantity, which is part of why combinations turn up constantly throughout
        probability theory, genetics (Punnett square combinatorics), and computer science
        (counting possible subsets or hash collisions).
      </p>

      <h2>Why factorials grow so explosively</h2>
      <p>
        Factorials grow far faster than exponential functions, which is why this
        calculator caps n at 170 — beyond that, 171! already exceeds the largest number a
        standard double-precision floating point number can represent, producing
        infinity rather than a real answer. 10! is 3,628,800; 20! is already over
        2.4 quintillion. This explosive growth is the mathematical reason that problems
        like the travelling salesman problem (which naively requires checking (n−1)!
        possible routes) become computationally intractable for even moderately large n —
        20 cities alone would require checking more routes than there are seconds since
        the Big Bang.
      </p>
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
      <p>
        A logarithm answers a single question: what power do I need to raise this base to,
        in order to get this number? log₁₀(1000) = 3 because 10³ = 1000. A logarithm is
        the precise inverse operation of exponentiation, in the same sense that
        subtraction is the inverse of addition and division is the inverse of
        multiplication — every exponential statement has a corresponding logarithmic one,
        and moving between the two forms is what most logarithm problems actually require.
      </p>
      <Formula>
        log_b(x) = y&nbsp;&nbsp;⟺&nbsp;&nbsp;b^y = x{"\n"}
        log_b(x) = ln(x) / ln(b)
      </Formula>

      <h2>The three bases that actually show up in practice</h2>
      <p>
        <strong>Base 10</strong> appears wherever quantities span many orders of
        magnitude and a compressed scale is useful — pH, the decibel scale, the Richter
        scale for earthquake magnitude, and star brightness (apparent magnitude) all use
        base-10 logarithms specifically because they let enormous ranges of underlying
        physical quantity be expressed in small, comparable numbers.
      </p>
      <p>
        <strong>Base e</strong> (Euler&rsquo;s number, approximately 2.71828) is the
        natural choice throughout calculus and continuous growth models, because e is
        defined precisely so that the derivative of eˣ is itself — no other base gives
        this clean self-referential property. Compound interest, radioactive decay,
        population growth models and the normal distribution all involve base e
        somewhere underneath, even when the visible formula does not show it explicitly.
      </p>
      <p>
        <strong>Base 2</strong> belongs to computer science, where it counts bits — the
        number of times you can halve a search space, the depth of a balanced binary
        tree, or the number of possible values representable in a given number of binary
        digits. log₂(1024) = 10 is why 1024 bytes forms a kilobyte in binary-based
        measurement, and why doubling a computer&rsquo;s memory or storage adds exactly
        one to its log₂ value.
      </p>

      <h2>The algebraic properties that make logarithms genuinely useful</h2>
      <Formula>
        log(ab) = log a + log b{"\n"}
        log(a/b) = log a − log b{"\n"}
        log(aⁿ) = n · log a
      </Formula>
      <p>
        These three identities are the entire reason logarithms were invented and used
        for centuries before electronic calculators existed: they convert multiplication
        into addition, division into subtraction, and exponentiation into multiplication —
        each one operation simpler than the one it replaces. Slide rules, mechanical
        devices used for calculation from the 17th century until pocket calculators
        arrived in the 1970s, worked by physically adding lengths that represented
        logarithms, turning otherwise laborious multiplication into a simple physical
        measurement. The same identities are why logarithmic graph axes make exponential
        data readable at a glance: a quantity that doubles at a constant rate traces a
        perfectly straight line on a log-scaled axis, whereas on an ordinary linear axis
        it curves upward so steeply that early, smaller values become impossible to read
        against later, much larger ones.
      </p>

      <h2>Changing base is just a division away</h2>
      <p>
        Most calculators and programming languages provide only natural log and
        base-10 log as built-in functions, but any base can be reached by dividing one
        logarithm by another: log₇(50) is calculated as ln(50)/ln(7), or equally validly
        as log₁₀(50)/log₁₀(7) — the two give an identical answer. It does not matter which
        of the two common bases you pick for this calculation, as long as you use the
        same one in both the numerator and the denominator; mixing ln in one and log₁₀ in
        the other produces a meaningless result.
      </p>

      <h2>What the antilog undoes</h2>
      <p>
        The antilog is simply the reverse operation: given a logarithm value and a base,
        it reconstructs the original number by raising the base to that power. If
        log₁₀(x) = 3, the antilog recovers x = 10³ = 1000. This is genuinely useful when
        working backward from a measurement already expressed on a logarithmic scale — for
        instance, converting a pH reading back into an actual hydrogen ion concentration,
        or converting a decibel figure back into a raw power or amplitude ratio.
      </p>
    </>
  ),
});

/* ------------------------------------------------------------------ */
export const gcfLcm = makeTool({
  slug: "gcf-lcm",
  category: "math",
  group: "Number tools",
  title: "GCF and LCM calculator",
  label: "GCF and LCM",
  description:
    "Find the greatest common factor and least common multiple of up to four whole numbers, with the prime factorisation of each.",
  keywords: ["gcf", "gcd", "lcm", "greatest common factor", "least common multiple", "highest common factor"],
  related: ["prime-factorisation"],
  columns: 4,
  inputs: [
    { key: "a", label: "First number", initial: "48" },
    { key: "b", label: "Second number", initial: "180" },
    { key: "c", label: "Third number", initial: "", optional: true },
    { key: "d", label: "Fourth number", initial: "", optional: true },
  ],
  compute: ({ n }) => {
    const nums = [n.a, n.b, n.c, n.d]
      .filter((x) => Number.isFinite(x) && x > 0 && Number.isInteger(x) && x <= 1e12);
    if (nums.length < 2) return null;
    const gcd2 = (x: number, y: number): number => (y === 0 ? x : gcd2(y, x % y));
    const gcf = nums.reduce((a, b) => gcd2(a, b));
    const lcm = nums.reduce((a, b) => (a / gcd2(a, b)) * b);
    const factor = (v: number) => {
      const parts: string[] = [];
      let x = v;
      for (let p = 2; p * p <= x; p++) {
        let e = 0;
        while (x % p === 0) { x /= p; e++; }
        if (e) parts.push(e === 1 ? `${p}` : `${p}^${e}`);
      }
      if (x > 1) parts.push(`${x}`);
      return parts.join(" × ") || "1";
    };
    return {
      name: "Greatest common factor",
      value: String(gcf),
      rows: [
        { label: "Least common multiple", value: String(lcm) },
        { label: "Coprime?", value: gcf === 1 ? "Yes" : "No" },
        ...nums.map((v, i) => ({ label: `Factors of ${v}`, value: factor(v) })),
        ...(nums.length === 2
          ? [{ label: "Check: GCF × LCM", value: `${gcf * lcm} = ${nums[0]} × ${nums[1]}` }]
          : []),
      ],
      note: "Whole positive numbers only.",
    };
  },
  Article: () => (
    <>
      <p>
        The greatest common factor is the largest number that divides every input exactly. The
        least common multiple is the smallest number every input divides into. They are
        opposite ends of the same idea, and both fall straight out of prime factorisation.
      </p>

      <h2>Through prime factors</h2>
      <p>
        Factor each number into primes. For the GCF take the <em>lowest</em> power of each
        shared prime; for the LCM take the <em>highest</em> power of every prime that appears.
      </p>
      <Formula>
        48 = 2⁴ × 3{"\n"}
        180 = 2² × 3² × 5{"\n"}
        GCF = 2² × 3 = 12{"\n"}
        LCM = 2⁴ × 3² × 5 = 720
      </Formula>

      <h2>The Euclidean algorithm</h2>
      <p>
        Factorising is slow for large numbers. Euclid&rsquo;s method is far faster: divide the
        larger by the smaller, keep the remainder, repeat until the remainder is zero. The last
        non-zero remainder is the GCF.
      </p>
      <Formula>
        180 ÷ 48 = 3 remainder 36{"\n"}
        48 ÷ 36 = 1 remainder 12{"\n"}
        36 ÷ 12 = 3 remainder 0&nbsp;&nbsp;→ GCF = 12
      </Formula>
      <p>
        This is one of the oldest algorithms still in everyday use, dating to around 300 BC, and
        it remains the method computers actually use. It is fast enough to handle numbers with
        hundreds of digits.
      </p>

      <h2>The identity linking them</h2>
      <Formula>GCF(a, b) × LCM(a, b) = a × b</Formula>
      <p>
        This holds for exactly two numbers and is the usual way to get the LCM: find the GCF by
        Euclid, then divide the product by it. It fails for three or more, where you must chain
        the operation pairwise instead.
      </p>

      <h2>Where they get used</h2>
      <ul>
        <li>
          <strong>Simplifying fractions.</strong> Divide top and bottom by their GCF to reach
          lowest terms in one step.
        </li>
        <li>
          <strong>Adding fractions.</strong> The LCM of the denominators is the least common
          denominator, which keeps the arithmetic as small as possible.
        </li>
        <li>
          <strong>Repeating events.</strong> Two buses leaving every 12 and 18 minutes coincide
          every LCM(12,18) = 36 minutes. Gear teeth, traffic lights and scheduling problems all
          reduce to this.
        </li>
        <li>
          <strong>Cryptography.</strong> Numbers whose GCF is 1 are coprime, and coprimality is
          central to RSA and to modular arithmetic generally.
        </li>
      </ul>
    </>
  ),
});

/* ------------------------------------------------------------------ */
export const primeFactorisation = makeTool({
  slug: "prime-factorisation",
  category: "math",
  group: "Number tools",
  title: "Prime factorisation and prime checker",
  label: "Prime factorisation",
  description:
    "Break any whole number into its prime factors, check whether it is prime, and list all of its divisors.",
  keywords: ["prime factorisation", "prime factors", "is it prime", "divisors", "factor tree"],
  related: ["gcf-lcm"],
  columns: 2,
  inputs: [
    { key: "v", label: "Number to factorise", initial: "5040", hint: "Whole numbers up to about 10^12" },
  ],
  compute: ({ n }) => {
    if (!Number.isFinite(n.v) || !Number.isInteger(n.v) || n.v < 2 || n.v > 1e12) return null;
    let x = n.v;
    const fs: [number, number][] = [];
    for (let p = 2; p * p <= x; p += p === 2 ? 1 : 2) {
      let e = 0;
      while (x % p === 0) { x /= p; e++; }
      if (e) fs.push([p, e]);
    }
    if (x > 1) fs.push([x, 1]);
    const pretty = fs.map(([p, e]) => (e === 1 ? `${p}` : `${p}^${e}`)).join(" × ");
    const isPrime = fs.length === 1 && fs[0][1] === 1;
    const divisorCount = fs.reduce((a, [, e]) => a * (e + 1), 1);
    const divisorSum = fs.reduce((a, [p, e]) => a * ((p ** (e + 1) - 1) / (p - 1)), 1);
    const rows = [
      { label: "Prime?", value: isPrime ? "Yes" : "No" },
      { label: "Distinct prime factors", value: String(fs.length) },
      { label: "Number of divisors", value: String(divisorCount) },
      { label: "Sum of divisors", value: trim(divisorSum, 12) },
    ];
    if (divisorCount <= 40) {
      const divs: number[] = [];
      for (let d = 1; d * d <= n.v; d++) {
        if (n.v % d === 0) { divs.push(d); if (d !== n.v / d) divs.push(n.v / d); }
      }
      divs.sort((a, b) => a - b);
      rows.push({ label: "All divisors", value: divs.join(", ") });
    }
    return { name: "Prime factorisation", value: pretty, rows };
  },
  Article: () => (
    <>
      <p>
        Every whole number greater than 1 is either prime, or can be written as a product of
        primes in exactly one way. That uniqueness is the fundamental theorem of arithmetic,
        and it is why primes are called the building blocks of the integers.
      </p>

      <h2>Trial division</h2>
      <p>
        Divide by 2 as often as it goes, then 3, then 5, and so on upward. You only ever need to
        test up to the square root of what remains: if a number has a factor larger than its
        square root, the matching cofactor is smaller than the square root and you would have
        found it already.
      </p>
      <Formula>
        5040 ÷ 2 = 2520 ÷ 2 = 1260 ÷ 2 = 630 ÷ 2 = 315{"\n"}
        315 ÷ 3 = 105 ÷ 3 = 35{"\n"}
        35 ÷ 5 = 7,&nbsp;&nbsp;7 is prime{"\n"}
        5040 = 2⁴ × 3² × 5 × 7
      </Formula>

      <h2>Counting divisors without listing them</h2>
      <p>
        Once you have the factorisation, the number of divisors follows immediately. If
        n = p₁^a × p₂^b × …, then each divisor picks an exponent from 0 to a for the first
        prime, 0 to b for the second, and so on:
      </p>
      <Formula>d(n) = (a + 1)(b + 1)(c + 1) …</Formula>
      <p>
        For 5040 = 2⁴ × 3² × 5 × 7 that gives 5 × 3 × 2 × 2 = 60 divisors. Listing them by hand
        would take a while; the factorisation gives it in one line.
      </p>

      <h2>Why this is computationally hard</h2>
      <p>
        Checking whether a number is prime is fast. Actually factorising a large one is not, and
        no efficient general algorithm is known. Trial division on a 600-digit number would
        outlast the universe.
      </p>
      <p>
        RSA encryption rests entirely on this asymmetry. Multiplying two large primes is
        instant; recovering them from the product is infeasible. The public key is the product,
        and the private key is the pair of factors. If someone found a fast factorisation
        algorithm, most of the internet&rsquo;s encryption would fall over — which is also why
        quantum computing attracts so much attention, since Shor&rsquo;s algorithm factors
        efficiently on hardware that does not yet exist at the necessary scale.
      </p>

      <h2>Useful facts about primes</h2>
      <ul>
        <li>2 is the only even prime. Every other even number has 2 as a factor.</li>
        <li>1 is not prime, by definition — including it would break the uniqueness of factorisation.</li>
        <li>There are infinitely many primes, proved by Euclid around 300 BC.</li>
        <li>Primes thin out but never stop; near a large number n, roughly 1 in ln(n) integers is prime.</li>
      </ul>
    </>
  ),
});

/* ------------------------------------------------------------------ */
export const scientificNotation = makeTool({
  slug: "scientific-notation",
  category: "math",
  group: "Number tools",
  title: "Scientific notation converter",
  label: "Scientific notation",
  description:
    "Convert between decimal, scientific notation, engineering notation and E-notation, with significant figure counting.",
  keywords: ["scientific notation", "standard form", "engineering notation", "e notation", "significant figures"],
  columns: 2,
  inputs: [
    { key: "v", label: "Number", initial: "0.00045678", hint: "Accepts 4.5e-4, 45678, 4k7 and so on" },
    { key: "sf", label: "Round to significant figures", initial: "4", optional: true },
  ],
  compute: ({ n }) => {
    if (!Number.isFinite(n.v) || n.v === 0) {
      if (n.v === 0) {
        return { name: "Scientific notation", value: "0 × 10⁰", rows: [{ label: "Zero", value: "Has no exponent form" }] };
      }
      return null;
    }
    const sf = Number.isFinite(n.sf) && n.sf >= 1 && n.sf <= 15 ? Math.round(n.sf) : 6;
    const exp = Math.floor(Math.log10(Math.abs(n.v)));
    const mantissa = n.v / 10 ** exp;
    // Engineering notation uses exponents that are multiples of three.
    const engExp = Math.floor(exp / 3) * 3;
    const engMant = n.v / 10 ** engExp;
    const sup = (e: number) =>
      String(e).replace(/-/g, "⁻").replace(/[0-9]/g, (d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[Number(d)]);
    const prefixes: Record<number, string> = {
      [-12]: "pico", [-9]: "nano", [-6]: "micro", [-3]: "milli", 0: "—",
      3: "kilo", 6: "mega", 9: "giga", 12: "tera",
    };
    return {
      name: "Scientific notation",
      value: `${trim(mantissa, sf)} × 10${sup(exp)}`,
      rows: [
        { label: "Engineering notation", value: `${trim(engMant, sf)} × 10${sup(engExp)}` },
        { label: "SI prefix", value: prefixes[engExp] ?? "outside the common range" },
        { label: "E-notation", value: n.v.toExponential(sf - 1) },
        { label: "Decimal form", value: trim(n.v, 15) },
        { label: `Rounded to ${sf} s.f.`, value: String(Number(n.v.toPrecision(sf))) },
        { label: "Order of magnitude", value: String(exp) },
      ],
    };
  },
  Article: () => (
    <>
      <p>
        Scientific notation writes any number as a value between 1 and 10 multiplied by a power
        of ten. It keeps very large and very small quantities readable and makes the precision
        of a measurement explicit.
      </p>
      <Formula>0.00045678 = 4.5678 × 10⁻⁴</Formula>
      <p>
        The exponent counts how many places the decimal point moved. Moving it right gives a
        negative exponent, moving it left a positive one. The mantissa always has exactly one
        non-zero digit before the point.
      </p>

      <h2>Engineering notation</h2>
      <p>
        A variant that restricts exponents to multiples of three, so the mantissa runs from 1 to
        1000 rather than 1 to 10. This exists because it maps directly onto SI prefixes.
        4.5678 × 10⁻⁴ becomes 456.78 × 10⁻⁶, which is 456.78 microunits — immediately readable
        to anyone working with components.
      </p>
      <table>
        <thead><tr><th>Exponent</th><th>Prefix</th><th>Symbol</th></tr></thead>
        <tbody>
          <tr><td>10¹²</td><td>tera</td><td>T</td></tr>
          <tr><td>10⁹</td><td>giga</td><td>G</td></tr>
          <tr><td>10⁶</td><td>mega</td><td>M</td></tr>
          <tr><td>10³</td><td>kilo</td><td>k</td></tr>
          <tr><td>10⁻³</td><td>milli</td><td>m</td></tr>
          <tr><td>10⁻⁶</td><td>micro</td><td>µ</td></tr>
          <tr><td>10⁻⁹</td><td>nano</td><td>n</td></tr>
          <tr><td>10⁻¹²</td><td>pico</td><td>p</td></tr>
        </tbody>
      </table>

      <h2>E-notation</h2>
      <p>
        Calculators and programming languages write 4.5678 × 10⁻⁴ as <code>4.5678e-4</code>,
        because superscripts are awkward in plain text. It means exactly the same thing. Note
        that <code>e</code> here is unrelated to Euler&rsquo;s number.
      </p>

      <h2>Significant figures</h2>
      <p>
        Scientific notation resolves an ambiguity that plain decimals cannot. Written as 4500,
        it is unclear whether the trailing zeros are measured or merely placeholders. Written as
        4.5 × 10³ it clearly carries two significant figures; as 4.500 × 10³, four.
      </p>
      <p>
        The rules for counting: all non-zero digits count; zeros between non-zero digits count;
        leading zeros never count; trailing zeros count only after a decimal point. So 0.00320
        has three significant figures — the two leading zeros are placeholders, the trailing one
        is real.
      </p>

      <h2>Arithmetic shortcuts</h2>
      <p>
        Multiplying means multiplying mantissas and adding exponents; dividing means dividing
        mantissas and subtracting exponents. This is often faster mentally than the decimal
        version, and it makes order-of-magnitude estimation easy — a skill worth more in physics
        than exact arithmetic, since it tells you within seconds whether an answer is plausible.
      </p>
    </>
  ),
});
