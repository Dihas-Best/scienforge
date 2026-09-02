"use client";

import { useState } from "react";
import Field from "@/components/Field";
import Readout from "@/components/Readout";
import Formula from "@/components/Formula";
import { parseEng, si, trim } from "@/lib/format";
import type { Tool } from "@/lib/types";

const E24 = [1, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2, 2.2, 2.4, 2.7, 3, 3.3, 3.6,
  3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1];

function nextE24(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return NaN;
  const decade = Math.floor(Math.log10(value));
  for (let d = decade; d <= decade + 1; d++) {
    for (const m of E24) {
      const candidate = m * 10 ** d;
      if (candidate >= value - 1e-9) return Number(candidate.toPrecision(3));
    }
  }
  return NaN;
}

function Calculator() {
  const [vs, setVs] = useState("5");
  const [vf, setVf] = useState("2.0");
  const [i, setI] = useState("20m");
  const [n, setN] = useState("1");

  const Vs = parseEng(vs), Vf = parseEng(vf), I = parseEng(i);
  const N = Math.max(1, Math.round(parseEng(n) || 1));

  const headroom = Vs - Vf * N;
  const ok = [Vs, Vf, I].every(Number.isFinite) && I > 0;
  const enough = ok && headroom > 0;

  const R = enough ? headroom / I : NaN;
  const std = nextE24(R);
  const actualI = enough && Number.isFinite(std) ? headroom / std : NaN;
  const pR = enough && Number.isFinite(std) ? actualI * actualI * std : NaN;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Supply voltage" unit="V" value={vs} onChange={setVs} />
        <Field label="LED forward voltage" unit="V" value={vf} onChange={setVf} hint="Red ≈ 2.0, blue/white ≈ 3.2" />
        <Field label="Target current" unit="A" value={i} onChange={setI} placeholder="20m" />
        <Field label="LEDs in series" value={n} onChange={setN} />
      </div>

      <div className="mt-5">
        {enough ? (
          <Readout
            name="Series resistor"
            value={si(R, "Ω")}
            rows={[
              { label: "Nearest E24 value", value: si(std, "Ω") },
              { label: "Current with that part", value: si(actualI, "A") },
              { label: "Resistor power", value: si(pR, "W") },
              { label: "Voltage across resistor", value: si(headroom, "V") },
              { label: "Suggested rating", value: pR > 0.25 ? "0.5 W or higher" : "0.25 W is fine" },
            ]}
          />
        ) : (
          <Readout
            name={ok ? "Not enough supply voltage" : "Waiting for input"}
            value={
              ok
                ? `Need more than ${trim(Vf * N)} V for ${N} LED${N > 1 ? "s" : ""} in series`
                : "Fill in supply, forward voltage and current"
            }
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
        An LED is a diode, not a resistor. Past its forward voltage the current climbs
        almost vertically, so a small change in supply voltage produces a large change in
        current. Connect one straight across a supply and it will draw whatever the source
        can deliver until something fails. The series resistor is what turns an
        uncontrolled voltage source into a controlled current.
      </p>
      <Formula>R = (V_supply − V_forward) / I_target</Formula>

      <h2>Working it through</h2>
      <p>
        A red LED on a 5 V rail, driven at 20 mA. Red LEDs drop about 2.0 V, so the
        resistor has to absorb 5 − 2 = 3 V. R = 3 / 0.02 = 150 Ω, which happens to be a
        standard value. The resistor dissipates P = I²R = 0.02² × 150 = 0.06 W, well
        inside a quarter-watt part.
      </p>
      <p>
        Change the LED to blue, which drops around 3.2 V, and the resistor sees only 1.8 V.
        R = 1.8 / 0.02 = 90 Ω, so you would fit 91 Ω or 100 Ω. Note how much more sensitive
        this circuit is: the same 0.2 V variation in forward voltage between two blue LEDs
        from the same reel shifts the current by over 10%.
      </p>

      <h2>Typical forward voltages</h2>
      <table>
        <thead>
          <tr><th>Colour</th><th>Forward voltage</th><th>Typical current</th></tr>
        </thead>
        <tbody>
          <tr><td>Infrared</td><td>1.2 – 1.6 V</td><td>20 – 100 mA</td></tr>
          <tr><td>Red</td><td>1.8 – 2.2 V</td><td>20 mA</td></tr>
          <tr><td>Amber / yellow</td><td>2.0 – 2.2 V</td><td>20 mA</td></tr>
          <tr><td>Green</td><td>2.0 – 3.2 V</td><td>20 mA</td></tr>
          <tr><td>Blue</td><td>3.0 – 3.4 V</td><td>20 mA</td></tr>
          <tr><td>White</td><td>3.0 – 3.4 V</td><td>20 mA</td></tr>
        </tbody>
      </table>
      <p>
        These are starting points. The datasheet for the part you actually have is the
        real answer, and forward voltage drifts down as the junction heats up.
      </p>

      <h2>Series or parallel</h2>
      <p>
        Multiple LEDs in series share one current, so their brightness matches and you need
        one resistor. The supply has to exceed the sum of the forward voltages with enough
        headroom left for the resistor to do its job — aim for at least 20% of the supply
        across the resistor, or the circuit becomes sensitive to every variation.
      </p>
      <p>
        LEDs in parallel on a single shared resistor is a common mistake. Forward voltages
        never match exactly, so the LED with the lowest drop takes most of the current, runs
        hottest, drops further, and takes even more. Give each parallel branch its own
        resistor.
      </p>

      <h2>Driving from a microcontroller pin</h2>
      <p>
        An ESP32 or Arduino pin is usually rated for 12 – 40 mA, with a much lower total
        across the whole chip. Running several LEDs at 20 mA directly from GPIO pins can
        exceed the package limit even when each individual pin is inside spec. For more
        than two or three, switch them with a transistor or use a dedicated LED driver.
      </p>

      <h2>When a resistor is the wrong tool</h2>
      <p>
        The resistor wastes the headroom voltage as heat. For a single indicator that is
        irrelevant. For power LEDs — anything over about 350 mA — the loss becomes the
        dominant term and the current still moves with supply voltage and temperature. Use
        a constant-current driver instead.
      </p>
    </>
  );
}

const tool: Tool = {
  slug: "led-resistor",
  category: "electronics",
  group: "Circuit basics",
  title: "LED series resistor calculator",
  label: "LED resistor",
  description:
    "Size the current-limiting resistor for an LED from supply voltage, forward voltage and target current, with the nearest E24 value and power rating.",
  keywords: ["led resistor", "current limiting resistor", "forward voltage", "e24"],
  related: ["ohms-law", "voltage-divider"],
  Calculator,
  Article,
};

export default tool;
