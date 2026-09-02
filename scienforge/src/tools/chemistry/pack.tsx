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
