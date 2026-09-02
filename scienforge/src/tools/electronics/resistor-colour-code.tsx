"use client";

import { useState } from "react";
import Readout from "@/components/Readout";
import { si } from "@/lib/format";
import type { Tool } from "@/lib/types";

type Band = { name: string; hex: string; digit?: number; mult?: number; tol?: number };

const BANDS: Band[] = [
  { name: "Black",  hex: "#1a1a1a", digit: 0, mult: 1 },
  { name: "Brown",  hex: "#7b4a2d", digit: 1, mult: 1e1, tol: 1 },
  { name: "Red",    hex: "#c62828", digit: 2, mult: 1e2, tol: 2 },
  { name: "Orange", hex: "#e07b1f", digit: 3, mult: 1e3 },
  { name: "Yellow", hex: "#e8c53a", digit: 4, mult: 1e4 },
  { name: "Green",  hex: "#2e7d4f", digit: 5, mult: 1e5, tol: 0.5 },
  { name: "Blue",   hex: "#1f5fa8", digit: 6, mult: 1e6, tol: 0.25 },
  { name: "Violet", hex: "#6a3d9a", digit: 7, mult: 1e7, tol: 0.1 },
  { name: "Grey",   hex: "#8a8f8c", digit: 8, mult: 1e8, tol: 0.05 },
  { name: "White",  hex: "#f2f2f2", digit: 9, mult: 1e9 },
  { name: "Gold",   hex: "#c9a227", mult: 0.1, tol: 5 },
  { name: "Silver", hex: "#b9c0bd", mult: 0.01, tol: 10 },
];

const digits = BANDS.filter((b) => b.digit !== undefined);
const mults = BANDS.filter((b) => b.mult !== undefined);
const tols = BANDS.filter((b) => b.tol !== undefined);

function Select({
  label, options, value, onChange,
}: { label: string; options: Band[]; value: string; onChange: (v: string) => void }) {
  const current = BANDS.find((b) => b.name === value);
  return (
    <div>
      <span className="field-label">{label}</span>
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="h-8 w-4 shrink-0 rounded-[1px] border border-rule"
          style={{ background: current?.hex }}
        />
        <select
          className="field-input"
          aria-label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((b) => (
            <option key={b.name} value={b.name}>{b.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function Calculator() {
  const [count, setCount] = useState<4 | 5>(4);
  const [b1, setB1] = useState("Yellow");
  const [b2, setB2] = useState("Violet");
  const [b3, setB3] = useState("Black");
  const [mult, setMult] = useState("Red");
  const [tol, setTol] = useState("Gold");

  const d1 = BANDS.find((b) => b.name === b1)?.digit ?? 0;
  const d2 = BANDS.find((b) => b.name === b2)?.digit ?? 0;
  const d3 = BANDS.find((b) => b.name === b3)?.digit ?? 0;
  const m = BANDS.find((b) => b.name === mult)?.mult ?? 1;
  const t = BANDS.find((b) => b.name === tol)?.tol ?? 5;

  const base = count === 4 ? d1 * 10 + d2 : d1 * 100 + d2 * 10 + d3;
  const value = base * m;
  const spread = (value * t) / 100;

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {[4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setCount(n as 4 | 5)}
            className={`rounded-[2px] border px-3 py-1.5 text-sm ${
              count === n
                ? "border-plotter bg-plotter text-white"
                : "border-rule bg-panel text-ink-soft"
            }`}
          >
            {n} bands
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Select label="Band 1" options={digits} value={b1} onChange={setB1} />
        <Select label="Band 2" options={digits} value={b2} onChange={setB2} />
        {count === 5 && (
          <Select label="Band 3" options={digits} value={b3} onChange={setB3} />
        )}
        <Select label="Multiplier" options={mults} value={mult} onChange={setMult} />
        <Select label="Tolerance" options={tols} value={tol} onChange={setTol} />
      </div>

      <div className="mt-5">
        <Readout
          name="Resistance"
          value={si(value, "Ω")}
          rows={[
            { label: "Tolerance", value: `±${t}%` },
            { label: "Minimum", value: si(value - spread, "Ω") },
            { label: "Maximum", value: si(value + spread, "Ω") },
          ]}
        />
      </div>
    </div>
  );
}

function Article() {
  return (
    <>
      <p>
        Through-hole resistors carry their value as coloured bands because printing
        legible digits on a 2 mm body is not practical. The code is positional: the first
        bands are significant digits, the next is a power-of-ten multiplier, and the last
        is the manufacturing tolerance.
      </p>

      <h2>Reading the bands in the right order</h2>
      <p>
        Orientation is the part people get wrong. The tolerance band is separated by a
        slightly wider gap and is usually gold or silver, so put that on the right and
        read left to right. If both ends look identical, check for a gold or silver band —
        neither colour is ever used as a first digit.
      </p>

      <h3>Four-band resistors</h3>
      <p>
        Two digits, a multiplier, a tolerance. Yellow-violet-red-gold is 4, 7, ×100, ±5%,
        so 4700 Ω, which everyone writes as 4.7 kΩ or 4k7. These are the standard 5% parts
        in every hobby kit.
      </p>

      <h3>Five-band resistors</h3>
      <p>
        Three digits, a multiplier, a tolerance. The extra digit gives finer values, which
        is why precision 1% resistors use this format. Brown-black-black-brown-brown is 1,
        0, 0, ×10, ±1%, so 1000 Ω at 1%.
      </p>

      <h2>Colour values</h2>
      <table>
        <thead>
          <tr><th>Colour</th><th>Digit</th><th>Multiplier</th><th>Tolerance</th></tr>
        </thead>
        <tbody>
          <tr><td>Black</td><td>0</td><td>×1</td><td>—</td></tr>
          <tr><td>Brown</td><td>1</td><td>×10</td><td>±1%</td></tr>
          <tr><td>Red</td><td>2</td><td>×100</td><td>±2%</td></tr>
          <tr><td>Orange</td><td>3</td><td>×1k</td><td>—</td></tr>
          <tr><td>Yellow</td><td>4</td><td>×10k</td><td>—</td></tr>
          <tr><td>Green</td><td>5</td><td>×100k</td><td>±0.5%</td></tr>
          <tr><td>Blue</td><td>6</td><td>×1M</td><td>±0.25%</td></tr>
          <tr><td>Violet</td><td>7</td><td>×10M</td><td>±0.1%</td></tr>
          <tr><td>Grey</td><td>8</td><td>×100M</td><td>±0.05%</td></tr>
          <tr><td>White</td><td>9</td><td>×1G</td><td>—</td></tr>
          <tr><td>Gold</td><td>—</td><td>×0.1</td><td>±5%</td></tr>
          <tr><td>Silver</td><td>—</td><td>×0.01</td><td>±10%</td></tr>
        </tbody>
      </table>

      <h2>What tolerance actually buys you</h2>
      <p>
        A 5% 10 kΩ resistor is guaranteed to sit between 9.5 kΩ and 10.5 kΩ. In a voltage
        divider built from two such parts, the worst-case output error is roughly the sum
        of the two tolerances, so a divider designed for 2.50 V can legitimately deliver
        anywhere from about 2.38 V to 2.62 V. If that matters — an ADC reference, a
        precision bias point — use 1% parts, or measure and trim.
      </p>

      <h2>Surface-mount parts</h2>
      <p>
        SMD resistors do not use colours. They use printed numeric codes: three digits
        where the last is the number of zeros (472 is 4700 Ω), four digits for 1% parts
        (4701 is 4700 Ω), or the EIA-96 system of two digits plus a letter on very small
        packages. A part marked <span className="font-mono">0</span> or
        <span className="font-mono"> 000</span> is a zero-ohm jumper, not a missing value.
      </p>
    </>
  );
}

const tool: Tool = {
  slug: "resistor-colour-code",
  category: "electronics",
  group: "Passive components",
  title: "Resistor colour code calculator",
  label: "Resistor colour code",
  description:
    "Decode 4-band and 5-band resistor colour codes into resistance and tolerance, with the minimum and maximum values shown.",
  keywords: ["resistor", "colour code", "color code", "bands", "tolerance", "ohms"],
  related: ["ohms-law", "voltage-divider"],
  Calculator,
  Article,
};

export default tool;
