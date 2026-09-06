"use client";

import { makeTool } from "@/lib/makeTool";
import Formula from "@/components/Formula";
import { si, trim } from "@/lib/format";

export const idealGas = makeTool({
  slug: "ideal-gas-law",
  category: "chemistry", group: "Gases",
  title: "Ideal gas law calculator",
  label: "Ideal gas law",
  description: "Solve PV = nRT for pressure, volume, moles or temperature, with density and molar volume included.",
  keywords: ["ideal gas law", "pv=nrt", "pressure", "moles", "gas constant"],
  columns: 4,
  inputs: [
    { key: "p", label: "Pressure", unit: "Pa", initial: "101325" },
    { key: "v", label: "Volume", unit: "m³", initial: "0.0224" },
    { key: "t", label: "Temperature", unit: "K", initial: "273.15" },
    { key: "mm", label: "Molar mass", unit: "g/mol", initial: "", optional: true },
  ],
  compute: ({ n }) => {
    const R = 8.314462618;
    if (!(n.p > 0) || !(n.v > 0) || !(n.t > 0)) return null;
    const moles = (n.p * n.v) / (R * n.t);
    const rows = [
      { label: "Pressure in atm", value: trim(n.p / 101325, 5) },
      { label: "Temperature in °C", value: trim(n.t - 273.15, 5) },
      { label: "Molar volume", value: `${trim(n.v / moles, 5)} m³/mol` },
      { label: "Particles", value: `${trim(moles * 6.02214076e23, 5)}` },
    ];
    if (n.mm > 0) {
      rows.push({ label: "Mass of gas", value: `${trim(moles * n.mm, 5)} g` });
      rows.push({ label: "Density", value: `${trim((moles * n.mm) / 1000 / n.v, 5)} kg/m³` });
    }
    return { name: "Amount of substance", value: `${trim(moles, 6)} mol`, rows };
  },
  Article: () => (
    <>
      <p>The ideal gas law combines Boyle&rsquo;s, Charles&rsquo;s and Avogadro&rsquo;s laws into a single relationship between pressure, volume, temperature and quantity.</p>
      <Formula>P V = n R T&nbsp;&nbsp;&nbsp;R = 8.314 J/(mol·K)</Formula>
      <p>Temperature must be absolute. Using Celsius here is the most common error in the entire topic and it produces answers that are wrong by hundreds of percent. Convert to kelvin by adding 273.15 before you do anything else.</p>
      <h2>Matching your units to R</h2>
      <p>R takes different numerical values depending on the units. Use 8.314 with pascals, cubic metres and kelvin. Use 0.08206 with atmospheres and litres. Mixing the two is the second most common error.</p>
      <h2>Molar volume</h2>
      <p>At standard temperature and pressure — 0 °C and 1 atm — one mole of any ideal gas occupies 22.4 litres, regardless of what gas it is. A mole of hydrogen and a mole of carbon dioxide fill the same space, because the law contains no term for molecular size or mass. At 25 °C the figure is 24.8 litres.</p>
      <h2>When gases stop being ideal</h2>
      <p>The model assumes molecules have no volume and do not attract each other. Both assumptions fail at high pressure and low temperature, which is exactly where gases liquefy. The van der Waals equation adds correction terms for both effects and is the usual next step.</p>
    </>
  ),
});

export const phCalc = makeTool({
  slug: "ph",
  category: "chemistry", group: "Solutions",
  title: "pH and hydrogen ion concentration calculator",
  label: "pH",
  description: "Convert between pH, pOH and hydrogen or hydroxide ion concentration, at 25 °C.",
  keywords: ["ph", "poh", "acid", "base", "hydrogen ion", "concentration"],
  columns: 2,
  inputs: [
    { kind: "select", key: "mode", label: "You know", initial: "ph",
      options: [{ value: "ph", label: "pH" }, { value: "conc", label: "[H⁺] in mol/L" }] },
    { key: "val", label: "Value", initial: "3.5" },
  ],
  compute: ({ n, s }) => {
    if (!Number.isFinite(n.val)) return null;
    const ph = s.mode === "ph" ? n.val : -Math.log10(n.val);
    if (!Number.isFinite(ph)) return null;
    const h = 10 ** -ph;
    return {
      name: "pH",
      value: trim(ph, 5),
      rows: [
        { label: "[H⁺]", value: `${si(h, "mol/L")}` },
        { label: "pOH", value: trim(14 - ph, 5) },
        { label: "[OH⁻]", value: `${si(10 ** -(14 - ph), "mol/L")}` },
        { label: "Character", value: ph < 6.9 ? "acidic" : ph > 7.1 ? "basic" : "close to neutral" },
      ],
      note: "The pH + pOH = 14 relationship holds at 25 °C. Kw changes with temperature.",
    };
  },
  Article: () => (
    <>
      <p>pH is the negative base-10 logarithm of the hydrogen ion concentration in moles per litre. The logarithm is there because those concentrations span fourteen orders of magnitude, which is unwieldy to write out.</p>
      <Formula>pH = −log₁₀[H⁺]&nbsp;&nbsp;&nbsp;[H⁺] = 10^(−pH)&nbsp;&nbsp;&nbsp;pH + pOH = 14</Formula>
      <h2>Each unit is a factor of ten</h2>
      <p>A solution at pH 3 has ten times the hydrogen ion concentration of one at pH 4, and a hundred times that of pH 5. This is why lemon juice at pH 2 is enormously more acidic than coffee at pH 5, despite the numbers looking close.</p>
      <h2>The 14 is not a hard boundary</h2>
      <p>Water self-ionises, and at 25 °C the product [H⁺][OH⁻] equals 1.0 × 10⁻¹⁴, which is where the 14 comes from. It shifts with temperature: at 50 °C neutral water sits at pH 6.63, still neutral but numerically lower. Concentrated strong acids can also give pH values below 0, and strong bases above 14.</p>
      <h2>Strong versus weak</h2>
      <p>A strong acid dissociates completely, so 0.1 M HCl gives [H⁺] = 0.1 and pH 1. A weak acid does not: 0.1 M acetic acid gives pH around 2.9, because only about 1% of it ionises. Calculating weak-acid pH requires the acid dissociation constant Ka and usually a quadratic.</p>
    </>
  ),
});

export const dilution = makeTool({
  slug: "dilution",
  category: "chemistry", group: "Solutions",
  title: "Dilution calculator",
  label: "Dilution",
  description: "Apply C1V1 = C2V2 to find the stock volume needed for a target concentration, and how much solvent to add.",
  keywords: ["dilution", "c1v1", "stock solution", "concentration", "molarity"],
  related: ["molarity"],
  columns: 4,
  inputs: [
    { key: "c1", label: "Stock concentration", initial: "2" },
    { key: "c2", label: "Target concentration", initial: "0.1" },
    { key: "v2", label: "Target volume", unit: "L", initial: "0.25" },
    { key: "v1", label: "Or stock volume", unit: "L", initial: "", optional: true },
  ],
  compute: ({ n }) => {
    if (!(n.c1 > 0) || !(n.c2 > 0)) return null;
    if (n.c2 > n.c1) return { name: "Not possible", value: "Target exceeds stock concentration" };
    if (n.v2 > 0) {
      const v1 = (n.c2 * n.v2) / n.c1;
      return {
        name: "Stock volume to take",
        value: `${trim(v1 * 1000, 5)} mL`,
        rows: [
          { label: "Solvent to add", value: `${trim((n.v2 - v1) * 1000, 5)} mL` },
          { label: "Dilution factor", value: `${trim(n.c1 / n.c2, 5)} ×` },
          { label: "Final volume", value: `${trim(n.v2 * 1000, 5)} mL` },
        ],
      };
    }
    if (n.v1 > 0) {
      const v2 = (n.c1 * n.v1) / n.c2;
      return {
        name: "Final volume",
        value: `${trim(v2 * 1000, 5)} mL`,
        rows: [{ label: "Solvent to add", value: `${trim((v2 - n.v1) * 1000, 5)} mL` }],
      };
    }
    return null;
  },
  Article: () => (
    <>
      <p>Diluting a solution adds solvent without adding solute. The number of moles present does not change; only the volume they are spread through does. That single fact gives the dilution equation.</p>
      <Formula>C₁V₁ = C₂V₂</Formula>
      <p>The units of concentration cancel, so molarity, percent or grams per litre all work — as long as you use the same unit on both sides. The same is true of volume.</p>
      <h2>Making it up correctly</h2>
      <p>Measure the stock volume accurately with a pipette, transfer it to a volumetric flask, then add solvent up to the graduation mark. Do not measure out the solvent separately and add it to the stock: volumes are not always additive, and the error compounds with the concentrated solutions where accuracy matters most.</p>
      <h2>Serial dilution</h2>
      <p>To reach a very low concentration, dilute in stages. Ten successive 1:10 dilutions give a factor of 10¹⁰, which no single step could achieve accurately. Each stage carries its own error, so mix thoroughly between steps and use a fresh pipette tip each time.</p>
      <h2>Safety with concentrated acids</h2>
      <p>Always add acid to water, never water to acid. Dilution releases a large amount of heat, and adding water to concentrated sulfuric acid can flash it to steam and eject acid from the container.</p>
    </>
  ),
});

export const halfLife = makeTool({
  slug: "half-life",
  category: "chemistry", group: "Reactions",
  title: "Half-life and radioactive decay calculator",
  label: "Half-life",
  description: "Find the remaining quantity after a given time, the decay constant, and the time to reach any fraction of the original amount.",
  keywords: ["half life", "radioactive decay", "decay constant", "carbon dating", "exponential decay"],
  columns: 3,
  inputs: [
    { key: "n0", label: "Initial quantity", initial: "100" },
    { key: "th", label: "Half-life", unit: "same units as time", initial: "5730" },
    { key: "t", label: "Elapsed time", initial: "10000" },
  ],
  compute: ({ n }) => {
    if (!(n.n0 > 0) || !(n.th > 0) || !Number.isFinite(n.t)) return null;
    const lambda = Math.LN2 / n.th;
    const remaining = n.n0 * Math.exp(-lambda * n.t);
    return {
      name: "Quantity remaining",
      value: `${trim(remaining, 6)} of ${trim(n.n0, 6)}`,
      rows: [
        { label: "Fraction remaining", value: `${trim((remaining / n.n0) * 100, 5)}%` },
        { label: "Half-lives elapsed", value: trim(n.t / n.th, 5) },
        { label: "Decay constant λ", value: trim(lambda, 6) },
        { label: "Mean lifetime", value: trim(1 / lambda, 6) },
        { label: "Time to 1% remaining", value: trim(Math.log(100) / lambda, 6) },
      ],
      note: "Quantities keep whatever unit you entered (grams, atoms, becquerels). Times keep the unit you used for the half-life.",
    };
  },
  Article: () => (
    <>
      <p>Radioactive decay is a random process at the level of individual atoms, but entirely predictable in bulk. The half-life is the time for half of any quantity to decay, and it is the same regardless of how much you started with.</p>
      <Formula>N(t) = N₀ · e^(−λt)&nbsp;&nbsp;&nbsp;λ = ln(2) / t½&nbsp;&nbsp;&nbsp;N(t) = N₀ · (½)^(t/t½)</Formula>
      <h2>Nothing ever fully decays</h2>
      <p>Each half-life removes half of what remains, so the quantity approaches zero without reaching it. After ten half-lives about 0.1% is left; after twenty, one part in a million. This is why waste storage timescales are usually quoted as ten or twenty half-lives rather than as a point of complete disappearance.</p>
      <h2>Half-life is unaffected by conditions</h2>
      <p>Temperature, pressure and chemical state have essentially no effect, because decay is a nuclear process and chemistry happens in the electron shells. This is what makes radiometric dating reliable and why a sample cannot be made to decay faster.</p>
      <h2>Dating</h2>
      <p>Carbon-14 has a half-life of 5730 years, which suits archaeological timescales up to roughly 50,000 years. Beyond that too little remains to measure and longer-lived isotopes are used: potassium-40 at 1.25 billion years and uranium-238 at 4.5 billion years are the standard tools for dating rocks.</p>
      <h2>The same maths elsewhere</h2>
      <p>Drug elimination from the bloodstream, capacitor discharge and the cooling of a hot object all follow the identical exponential form. Only the constant changes.</p>
    </>
  ),
});

/* ------------------------------------------------------------------ */
const ATOMIC_MASS: Record<string, number> = {
  H: 1.008, He: 4.0026, Li: 6.94, Be: 9.0122, B: 10.81, C: 12.011, N: 14.007,
  O: 15.999, F: 18.998, Ne: 20.180, Na: 22.990, Mg: 24.305, Al: 26.982,
  Si: 28.085, P: 30.974, S: 32.06, Cl: 35.45, Ar: 39.948, K: 39.098,
  Ca: 40.078, Sc: 44.956, Ti: 47.867, V: 50.942, Cr: 51.996, Mn: 54.938,
  Fe: 55.845, Co: 58.933, Ni: 58.693, Cu: 63.546, Zn: 65.38, Ga: 69.723,
  Ge: 72.630, As: 74.922, Se: 78.971, Br: 79.904, Kr: 83.798, Rb: 85.468,
  Sr: 87.62, Y: 88.906, Zr: 91.224, Nb: 92.906, Mo: 95.95, Tc: 98,
  Ru: 101.07, Rh: 102.91, Pd: 106.42, Ag: 107.87, Cd: 112.41, In: 114.82,
  Sn: 118.71, Sb: 121.76, Te: 127.60, I: 126.90, Xe: 131.29, Cs: 132.91,
  Ba: 137.33, La: 138.91, Ce: 140.12, Pr: 140.91, Nd: 144.24, Pm: 145,
  Sm: 150.36, Eu: 151.96, Gd: 157.25, Tb: 158.93, Dy: 162.50, Ho: 164.93,
  Er: 167.26, Tm: 168.93, Yb: 173.05, Lu: 174.97, Hf: 178.49, Ta: 180.95,
  W: 183.84, Re: 186.21, Os: 190.23, Ir: 192.22, Pt: 195.08, Au: 196.97,
  Hg: 200.59, Tl: 204.38, Pb: 207.2, Bi: 208.98, Po: 209, At: 210, Rn: 222,
  Fr: 223, Ra: 226, Ac: 227, Th: 232.04, Pa: 231.04, U: 238.03, Np: 237,
  Pu: 244, Am: 243, Cm: 247,
};

type ParseResult = { counts: Record<string, number>; unknown: string[] };

function parseFormula(formula: string): ParseResult | null {
  const s = formula.replace(/\s+/g, "");
  if (!s) return null;
  let i = 0;
  const unknown: string[] = [];

  function parseGroup(): Record<string, number> {
    const counts: Record<string, number> = {};
    while (i < s.length && s[i] !== ")") {
      if (s[i] === "(") {
        i++;
        const inner = parseGroup();
        if (s[i] !== ")") throw new Error("mismatched parentheses");
        i++;
        let numStr = "";
        while (i < s.length && /[0-9]/.test(s[i])) { numStr += s[i]; i++; }
        const mult = numStr ? Number(numStr) : 1;
        for (const [el, n] of Object.entries(inner)) {
          counts[el] = (counts[el] ?? 0) + n * mult;
        }
      } else if (/[A-Z]/.test(s[i])) {
        let sym = s[i]; i++;
        if (i < s.length && /[a-z]/.test(s[i])) { sym += s[i]; i++; }
        let numStr = "";
        while (i < s.length && /[0-9]/.test(s[i])) { numStr += s[i]; i++; }
        const count = numStr ? Number(numStr) : 1;
        if (!ATOMIC_MASS[sym]) unknown.push(sym);
        counts[sym] = (counts[sym] ?? 0) + count;
      } else {
        throw new Error("unexpected character: " + s[i]);
      }
    }
    return counts;
  }

  try {
    const counts = parseGroup();
    if (i !== s.length) return null;
    return { counts, unknown };
  } catch {
    return null;
  }
}

export const molarMass = makeTool({
  slug: "molar-mass",
  category: "chemistry",
  group: "Reactions",
  title: "Molar mass calculator",
  label: "Molar mass",
  description:
    "Find the molar mass of a chemical compound from its formula, with the percentage composition of every element shown.",
  keywords: ["molar mass", "molecular weight", "molecular mass", "formula weight", "chemical formula calculator"],
  related: ["molarity", "dilution"],
  columns: 2,
  inputs: [
    { key: "formula", label: "Chemical formula", initial: "Ca(OH)2",
      hint: "Case matters — CO is carbon monoxide, Co is cobalt" },
    { key: "mass", label: "Sample mass", unit: "g", initial: "", optional: true },
  ],
  compute: ({ n, s }) => {
    const parsed = parseFormula(String(s.formula ?? ""));
    if (!parsed) return null;
    const { counts, unknown } = parsed;
    if (unknown.length > 0) {
      return {
        name: "Unrecognised element symbol",
        value: unknown.join(", "),
        rows: [{ label: "Check capitalisation", value: "Element symbols are one capital letter, optionally followed by one lowercase letter" }],
      };
    }
    const entries = Object.entries(counts);
    if (entries.length === 0) return null;

    let totalMass = 0;
    for (const [el, count] of entries) totalMass += ATOMIC_MASS[el] * count;

    const rows = entries
      .sort((a, b) => ATOMIC_MASS[b[0]] * b[1] - ATOMIC_MASS[a[0]] * a[1])
      .map(([el, count]) => {
        const elMass = ATOMIC_MASS[el] * count;
        return {
          label: `${el} × ${count}`,
          value: `${trim(elMass, 6)} g/mol (${trim((elMass / totalMass) * 100, 4)}%)`,
        };
      });

    if (Number.isFinite(n.mass) && n.mass > 0) {
      rows.push({ label: "Moles in sample", value: `${trim(n.mass / totalMass, 6)} mol` });
    }

    return {
      name: "Molar mass",
      value: `${trim(totalMass, 6)} g/mol`,
      rows,
      note: "Atomic masses are IUPAC standard values, averaged over natural isotopic abundance.",
    };
  },
  Article: () => (
    <>
      <p>
        Molar mass is the mass of one mole — 6.022 × 10²³ particles — of a substance,
        expressed in grams per mole. It is found by adding up the atomic mass of every atom
        in the formula, each multiplied by how many times it appears.
      </p>
      <Formula>M = Σ (atomic mass × count of each element)</Formula>

      <h2>Working through an example</h2>
      <p>
        Calcium hydroxide, Ca(OH)₂, contains one calcium, two oxygens and two hydrogens —
        the subscript outside the parentheses multiplies everything inside them.
      </p>
      <Formula>
        Ca: 1 × 40.078 = 40.078{"\n"}
        O:&nbsp;&nbsp;2 × 15.999 = 31.998{"\n"}
        H:&nbsp;&nbsp;2 × 1.008&nbsp;&nbsp;= 2.016{"\n"}
        Total = 74.09 g/mol
      </Formula>

      <h2>Reading formula notation</h2>
      <p>
        Element symbols are always one capital letter, optionally followed by one lowercase
        letter — this is why case matters enormously in chemistry. <code>CO</code> is
        carbon monoxide, one carbon and one oxygen. <code>Co</code> is a single cobalt atom.
        Typing the wrong case silently changes the entire compound.
      </p>
      <p>
        A number directly after an element applies only to that element:{" "}
        <code>H2O</code> is two hydrogens and one oxygen. Parentheses group atoms so a
        following number multiplies the whole group: <code>Mg(NO3)2</code> means one
        magnesium and two full nitrate groups, giving two nitrogens and six oxygens in
        total, not two nitrogens and three oxygens.
      </p>

      <h2>Why the values are averages, not exact numbers</h2>
      <p>
        Chlorine&rsquo;s atomic mass of 35.45 is not the mass of any single chlorine atom.
        Chlorine occurs naturally as a mixture of two isotopes, ³⁵Cl and ³⁷Cl, in a fixed
        ratio, and the tabulated atomic mass is the weighted average across that natural
        mixture. This is why atomic masses are decimals rather than whole numbers for most
        elements — an individual atom&rsquo;s mass is very close to a whole number of
        proton-and-neutron masses, but the tabulated figure reflects the isotopic blend
        found in nature.
      </p>

      <h2>Percentage composition</h2>
      <p>
        Dividing each element&rsquo;s contribution by the total gives the mass percentage —
        useful for checking a compound&rsquo;s purity, for working backward from a
        combustion analysis to an empirical formula, or simply for sanity-checking that a
        formula is what you think it is. Water is famously about 11% hydrogen and 89%
        oxygen by mass, despite having twice as many hydrogen atoms as oxygen atoms — mass
        percentage and atom count are very different things.
      </p>

      <h2>Molar mass versus molecular mass</h2>
      <p>
        The two numbers are identical, but molecular mass is technically a per-molecule
        figure in atomic mass units (u or Da), while molar mass is the same number scaled
        up to a per-mole quantity in grams. In practice chemists use the terms
        interchangeably, since the numerical value is the same either way — a consequence
        of how the mole and the atomic mass unit were originally defined relative to each
        other.
      </p>
    </>
  ),
});

/* ------------------------------------------------------------------ */
export const limitingReagent = makeTool({
  slug: "limiting-reagent",
  category: "chemistry",
  group: "Reactions",
  title: "Limiting reagent and percent yield calculator",
  label: "Limiting reagent",
  description:
    "Find which reactant runs out first in a reaction, the theoretical yield of product, and the percent yield from an actual result.",
  keywords: ["limiting reagent", "limiting reactant", "percent yield", "theoretical yield", "excess reagent"],
  related: ["molar-mass", "molarity"],
  columns: 4,
  inputs: [
    { key: "molA", label: "Moles of reactant A available", initial: "2" },
    { key: "coeffA", label: "Stoichiometric coefficient of A", initial: "2" },
    { key: "molB", label: "Moles of reactant B available", initial: "3" },
    { key: "coeffB", label: "Stoichiometric coefficient of B", initial: "1" },
    { key: "coeffP", label: "Stoichiometric coefficient of product", initial: "2" },
    { key: "mwP", label: "Molar mass of product", unit: "g/mol", initial: "18.02" },
    { key: "actual", label: "Actual mass obtained", unit: "g", initial: "", optional: true },
  ],
  compute: ({ n }) => {
    if (![n.molA, n.coeffA, n.molB, n.coeffB, n.coeffP, n.mwP].every((v) => Number.isFinite(v) && v > 0)) {
      return null;
    }
    const ratioA = n.molA / n.coeffA;
    const ratioB = n.molB / n.coeffB;
    const limiting = ratioA <= ratioB ? "A" : "B";
    const extentOfReaction = Math.min(ratioA, ratioB);
    const productMoles = extentOfReaction * n.coeffP;
    const theoreticalMass = productMoles * n.mwP;

    const excessLabel = limiting === "A" ? "B" : "A";
    const excessMolUsed = limiting === "A" ? extentOfReaction * n.coeffB : extentOfReaction * n.coeffA;
    const excessMolAvail = limiting === "A" ? n.molB : n.molA;
    const excessRemaining = excessMolAvail - excessMolUsed;

    const rows = [
      { label: "Limiting reagent", value: `Reactant ${limiting}` },
      { label: "Excess reagent remaining", value: `${trim(excessRemaining, 6)} mol of ${excessLabel}` },
      { label: "Moles of product formed", value: `${trim(productMoles, 6)} mol` },
      { label: "Theoretical yield", value: `${trim(theoreticalMass, 6)} g` },
    ];

    if (Number.isFinite(n.actual) && n.actual > 0) {
      const pctYield = (n.actual / theoreticalMass) * 100;
      rows.push({ label: "Percent yield", value: `${trim(pctYield, 5)}%` });
    }

    return {
      name: "Theoretical yield",
      value: `${trim(theoreticalMass, 6)} g`,
      rows,
      note: "Enter the balanced equation's stoichiometric coefficients, not the molecular formulas themselves.",
    };
  },
  Article: () => (
    <>
      <p>
        Reactions run until one reactant is fully consumed, and after that point no more
        product can form no matter how much of the other reactant remains. The reactant
        that runs out first is the limiting reagent, and it alone determines how much
        product the reaction can theoretically produce.
      </p>

      <h2>Finding the limiting reagent</h2>
      <p>
        Divide the moles available of each reactant by its coefficient in the balanced
        equation. The smaller result identifies the limiting reagent — it is the one
        closer, proportionally, to running out.
      </p>
      <Formula>
        For a A + b B → c C{"\n"}
        Compare (moles of A) / a&nbsp;&nbsp;vs&nbsp;&nbsp;(moles of B) / b{"\n"}
        The smaller ratio identifies the limiting reagent
      </Formula>
      <p>
        For example, in 2H₂ + O₂ → 2H₂O with 4 mol H₂ and 1 mol O₂ available: H₂&rsquo;s
        ratio is 4/2 = 2, O₂&rsquo;s ratio is 1/1 = 1. Oxygen&rsquo;s ratio is smaller, so
        oxygen is limiting — despite there being far fewer moles of it in absolute terms.
        Comparing raw mole counts without dividing by the coefficients is the single most
        common mistake in this topic.
      </p>

      <h2>Theoretical yield</h2>
      <p>
        Once the limiting reagent is known, its available moles (divided by its own
        coefficient) set the &ldquo;extent of reaction&rdquo; — how far the reaction can
        proceed. Multiplying that extent by the product&rsquo;s coefficient gives moles of
        product, and multiplying by the product&rsquo;s molar mass converts that to a mass.
        This is the absolute maximum the reaction could produce under ideal conditions.
      </p>

      <h2>Why actual yield is always lower</h2>
      <p>
        Real reactions rarely hit their theoretical yield. Side reactions consume some
        reactant into unwanted products. Reactions may not go to completion, especially
        reversible ones that reach equilibrium before all the limiting reagent is used.
        Purification steps — filtering, recrystallising, distilling — lose some product at
        every stage. And simple mechanical loss, product left behind on glassware or lost
        during transfer, chips away at the total.
      </p>
      <Formula>Percent yield = (actual yield / theoretical yield) × 100%</Formula>
      <p>
        A percent yield above 100% is a red flag, not a triumph — it almost always means
        the product still contains impurities such as residual solvent or an unreacted
        starting material, adding mass that is not the pure product being weighed.
      </p>

      <h2>The excess reagent</h2>
      <p>
        Whatever is not the limiting reagent is in excess, and some of it is left over once
        the reaction stops. The amount consumed follows the same stoichiometric ratio as
        the product; subtracting that from what was originally available gives the leftover
        quantity — useful for working out how much of an expensive reactant to buy, or how
        much unreacted material needs to be separated from the product afterward.
      </p>
    </>
  ),
});
