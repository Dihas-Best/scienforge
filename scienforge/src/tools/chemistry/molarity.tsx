"use client";

import { useState } from "react";
import Field from "@/components/Field";
import Readout from "@/components/Readout";
import Formula from "@/components/Formula";
import { parseEng, trim } from "@/lib/format";
import type { Tool } from "@/lib/types";

function Calculator() {
  const [mass, setMass] = useState("");
  const [mw, setMw] = useState("58.44");
  const [vol, setVol] = useState("0.5");
  const [conc, setConc] = useState("0.1");

  const M = parseEng(mass), MW = parseEng(mw), V = parseEng(vol), C = parseEng(conc);

  // Solve for whichever is missing, preferring mass.
  let outMass = M, outConc = C;
  if (!Number.isFinite(M) && [MW, V, C].every(Number.isFinite)) outMass = C * V * MW;
  else if (Number.isFinite(M) && [MW, V].every(Number.isFinite) && V > 0)
    outConc = M / MW / V;

  const moles = Number.isFinite(outMass) && MW > 0 ? outMass / MW : NaN;
  const ok = Number.isFinite(outMass) && Number.isFinite(outConc);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Mass of solute" unit="g" value={mass} onChange={setMass} placeholder="leave blank to solve" />
        <Field label="Molar mass" unit="g/mol" value={mw} onChange={setMw} hint="NaCl = 58.44" />
        <Field label="Solution volume" unit="L" value={vol} onChange={setVol} />
        <Field label="Concentration" unit="mol/L" value={conc} onChange={setConc} />
      </div>
      <p className="mt-2 text-xs text-ink-soft">
        Leave mass blank to find how much to weigh out. Enter mass to find the resulting
        concentration.
      </p>

      <div className="mt-5">
        <Readout
          name={Number.isFinite(M) ? "Concentration" : "Mass to weigh out"}
          value={
            ok
              ? Number.isFinite(M)
                ? `${trim(outConc)} mol/L`
                : `${trim(outMass)} g`
              : "Fill in the known values"
          }
          rows={
            ok
              ? [
                  { label: "Moles of solute", value: `${trim(moles)} mol` },
                  { label: "Millimoles", value: `${trim(moles * 1000)} mmol` },
                  { label: "Mass concentration", value: `${trim(outConc * MW)} g/L` },
                  { label: "Volume", value: `${trim(V * 1000)} mL` },
                ]
              : undefined
          }
        />
      </div>
    </div>
  );
}

function Article() {
  return (
    <>
      <p>
        Molarity is the number of moles of solute per litre of finished solution. It is the
        working unit of solution chemistry because reactions consume particles in whole-number
        ratios, and moles count particles.
      </p>
      <Formula>c = n / V&nbsp;&nbsp;&nbsp;n = m / M&nbsp;&nbsp;&nbsp;m = c × V × M</Formula>
      <p>
        Here c is concentration in mol/L, n is moles, V is volume in litres, m is mass in
        grams and M is molar mass in g/mol.
      </p>

      <h2>Preparing a solution</h2>
      <p>
        To make 500 mL of 0.100 M sodium chloride: you need 0.100 × 0.500 = 0.0500 mol.
        NaCl has a molar mass of 58.44 g/mol, so weigh out 0.0500 × 58.44 = 2.92 g.
      </p>
      <p>
        The step people get wrong is the last one. Dissolve the salt in less water than the
        target volume, then top up to the 500 mL mark in a volumetric flask. Do not add
        500 mL of water to the salt — the solute takes up volume of its own, so you would end
        up with more than 500 mL of solution and a concentration below what you wanted.
      </p>

      <h2>Molarity, molality and normality</h2>
      <ul>
        <li>
          <strong>Molarity (M, mol/L)</strong> is per litre of solution. It changes with
          temperature because the solution expands.
        </li>
        <li>
          <strong>Molality (m, mol/kg)</strong> is per kilogram of solvent. Temperature has no
          effect on mass, so molality is what you use for colligative properties like boiling
          point elevation.
        </li>
        <li>
          <strong>Normality (N)</strong> is molarity multiplied by the number of reactive
          equivalents. For 1 M sulfuric acid, which supplies two protons, the normality is 2 N.
          It survives mainly in titration work.
        </li>
      </ul>

      <h2>Dilution</h2>
      <p>
        Diluting a stock solution does not change the number of moles present, only the volume
        they occupy. That gives the dilution equation:
      </p>
      <Formula>c₁V₁ = c₂V₂</Formula>
      <p>
        To make 250 mL of 0.10 M from a 2.0 M stock: V₁ = (0.10 × 0.250) / 2.0 = 0.0125 L, so
        take 12.5 mL of stock and dilute to 250 mL. With concentrated acids, add the acid to
        the water and never the reverse — the dilution is strongly exothermic and adding water
        to acid can boil it out of the container.
      </p>

      <h2>Molar masses worth memorising</h2>
      <table>
        <thead><tr><th>Compound</th><th>Formula</th><th>Molar mass (g/mol)</th></tr></thead>
        <tbody>
          <tr><td>Water</td><td>H₂O</td><td>18.02</td></tr>
          <tr><td>Sodium chloride</td><td>NaCl</td><td>58.44</td></tr>
          <tr><td>Sodium hydroxide</td><td>NaOH</td><td>40.00</td></tr>
          <tr><td>Hydrochloric acid</td><td>HCl</td><td>36.46</td></tr>
          <tr><td>Sulfuric acid</td><td>H₂SO₄</td><td>98.08</td></tr>
          <tr><td>Glucose</td><td>C₆H₁₂O₆</td><td>180.16</td></tr>
          <tr><td>Calcium carbonate</td><td>CaCO₃</td><td>100.09</td></tr>
        </tbody>
      </table>
    </>
  );
}

const tool: Tool = {
  slug: "molarity",
  category: "chemistry",
  group: "Solutions",
  title: "Molarity and solution concentration calculator",
  label: "Molarity",
  description:
    "Convert between mass, moles, volume and concentration for a solution. Find how much solute to weigh out, or what concentration you made.",
  keywords: ["molarity", "concentration", "moles", "solution", "mol/L", "dilution"],
  Calculator,
  Article,
};

export default tool;
