"use client";

import { useState } from "react";
import Field from "@/components/Field";
import Readout from "@/components/Readout";
import Formula from "@/components/Formula";
import { parseEng, si } from "@/lib/format";
import type { Tool } from "@/lib/types";

function Calculator() {
  const [v, setV] = useState("12");
  const [i, setI] = useState("");
  const [r, setR] = useState("470");

  const V = parseEng(v), I = parseEng(i), R = parseEng(r);
  const known = [V, I, R].filter(Number.isFinite).length;

  let out = { V: NaN, I: NaN, R: NaN };
  if (Number.isFinite(V) && Number.isFinite(I)) out = { V, I, R: V / I };
  else if (Number.isFinite(V) && Number.isFinite(R)) out = { V, I: V / R, R };
  else if (Number.isFinite(I) && Number.isFinite(R)) out = { V: I * R, I, R };

  const P = out.V * out.I;
  const solved = Number.isFinite(out.V) && Number.isFinite(out.I);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Voltage" unit="V" value={v} onChange={setV} placeholder="e.g. 12" />
        <Field label="Current" unit="A" value={i} onChange={setI} placeholder="e.g. 20m" />
        <Field label="Resistance" unit="Ω" value={r} onChange={setR} placeholder="e.g. 4k7" />
      </div>
      <p className="mt-2 text-xs text-ink-soft">
        Fill in any two. Engineering shorthand works: 4k7 means 4700, 20m means 0.02.
      </p>

      <div className="mt-5">
        {solved ? (
          <Readout
            name="Solved circuit"
            value={`${si(out.V, "V")}  ·  ${si(out.I, "A")}  ·  ${si(out.R, "Ω")}`}
            rows={[
              { label: "Power dissipated", value: si(P, "W") },
              { label: "Conductance", value: si(1 / out.R, "S") },
              { label: "Energy in 1 hour", value: si(P * 3600, "J") },
            ]}
          />
        ) : (
          <Readout
            name="Waiting for input"
            value={known >= 2 ? "Check the values" : "Enter two of the three"}
          />
        )}
      </div>
    </div>
  );
}

function Article() {
  return (
    <>
      <p>
        Ohm&rsquo;s law ties the three quantities you can actually measure on a bench
        into one relationship. Give it any two and the third is fixed.
      </p>
      <Formula>V = I × R&nbsp;&nbsp;&nbsp;I = V / R&nbsp;&nbsp;&nbsp;R = V / I</Formula>
      <p>
        Voltage is in volts, current in amperes and resistance in ohms. Mixing units is
        where most errors come from: a 4.7 kΩ resistor is 4700 Ω, and 20 mA is 0.02 A. If
        you enter 20 instead of 0.02 you get an answer that is off by a factor of a
        thousand and still looks plausible.
      </p>

      <h2>Working through an example</h2>
      <p>
        Suppose you have a 9 V battery and a 330 Ω resistor and you want the current.
        Rearranged, I = V / R = 9 / 330 = 0.0273 A, or 27.3 mA. The power the resistor
        turns into heat is P = V × I = 9 × 0.0273 = 0.246 W. A common quarter-watt
        resistor is rated for 0.25 W, so this part is running right at its limit and will
        get hot. Use a half-watt part instead, or raise the resistance.
      </p>

      <h2>Power, and why it matters more than people expect</h2>
      <p>
        Power has three equivalent forms, and which one you reach for depends on what you
        already know:
      </p>
      <Formula>P = V × I&nbsp;&nbsp;&nbsp;P = I² × R&nbsp;&nbsp;&nbsp;P = V² / R</Formula>
      <p>
        The squared terms are the reason small changes in current matter so much. Double
        the current through a fixed resistor and you get four times the heat. This is why
        a resistor that is fine at 5 V can fail at 12 V in the same circuit.
      </p>

      <h2>Where the law does not apply</h2>
      <p>
        Ohm&rsquo;s law describes ohmic components — resistors, and wire at ordinary
        temperatures. It does not describe:
      </p>
      <ul>
        <li>
          <strong>Diodes and LEDs.</strong> Current rises exponentially with voltage past
          the forward drop. You size a series resistor instead of solving for the LED
          itself.
        </li>
        <li>
          <strong>Transistors.</strong> The channel or junction resistance depends on the
          control terminal, not just the voltage across it.
        </li>
        <li>
          <strong>Filaments and thermistors.</strong> Resistance moves with temperature,
          so the cold value and the hot value differ, sometimes by an order of magnitude.
        </li>
        <li>
          <strong>Anything at AC with reactance.</strong> Capacitors and inductors need
          impedance, which has a phase term Ohm&rsquo;s law does not carry.
        </li>
      </ul>

      <h2>Quick reference</h2>
      <table>
        <thead>
          <tr><th>Known</th><th>Solve for</th><th>Expression</th></tr>
        </thead>
        <tbody>
          <tr><td>V, R</td><td>Current</td><td>I = V / R</td></tr>
          <tr><td>V, I</td><td>Resistance</td><td>R = V / I</td></tr>
          <tr><td>I, R</td><td>Voltage</td><td>V = I × R</td></tr>
          <tr><td>V, I</td><td>Power</td><td>P = V × I</td></tr>
          <tr><td>I, R</td><td>Power</td><td>P = I² R</td></tr>
          <tr><td>V, R</td><td>Power</td><td>P = V² / R</td></tr>
        </tbody>
      </table>
    </>
  );
}

const tool: Tool = {
  slug: "ohms-law",
  category: "electronics",
  group: "Circuit basics",
  title: "Ohm's law calculator",
  label: "Ohm's law",
  description:
    "Solve for voltage, current or resistance from any two values, with power dissipation included. Accepts engineering shorthand like 4k7.",
  keywords: ["ohms law", "voltage", "current", "resistance", "power", "V=IR"],
  related: ["voltage-divider", "led-resistor"],
  Calculator,
  Article,
};

export default tool;
