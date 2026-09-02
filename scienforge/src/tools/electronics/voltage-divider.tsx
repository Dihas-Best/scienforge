"use client";

import { useState } from "react";
import Field from "@/components/Field";
import Readout from "@/components/Readout";
import Formula from "@/components/Formula";
import { parseEng, si } from "@/lib/format";
import type { Tool } from "@/lib/types";

function Calculator() {
  const [vin, setVin] = useState("5");
  const [r1, setR1] = useState("10k");
  const [r2, setR2] = useState("10k");
  const [rl, setRl] = useState("");

  const Vin = parseEng(vin), R1 = parseEng(r1), R2 = parseEng(r2), RL = parseEng(rl);
  const ok = [Vin, R1, R2].every(Number.isFinite) && R1 + R2 > 0;

  const vout = ok ? (Vin * R2) / (R1 + R2) : NaN;
  const current = ok ? Vin / (R1 + R2) : NaN;
  const power = ok ? Vin * current : NaN;
  const zout = ok ? (R1 * R2) / (R1 + R2) : NaN;

  const r2eff = Number.isFinite(RL) && RL > 0 ? (R2 * RL) / (R2 + RL) : NaN;
  const voutLoaded = Number.isFinite(r2eff) ? (Vin * r2eff) / (R1 + r2eff) : NaN;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Input voltage" unit="V" value={vin} onChange={setVin} />
        <Field label="R1 (top)" unit="Ω" value={r1} onChange={setR1} placeholder="10k" />
        <Field label="R2 (bottom)" unit="Ω" value={r2} onChange={setR2} placeholder="10k" />
        <Field
          label="Load"
          unit="Ω"
          value={rl}
          onChange={setRl}
          placeholder="optional"
          hint="Leave blank for an unloaded divider."
        />
      </div>

      <div className="mt-5">
        <Readout
          name="Output voltage"
          value={ok ? si(vout, "V") : "Enter Vin, R1 and R2"}
          rows={
            ok
              ? [
                  { label: "Divider ratio", value: (vout / Vin).toFixed(4) },
                  { label: "Current through chain", value: si(current, "A") },
                  { label: "Total power", value: si(power, "W") },
                  { label: "Output impedance", value: si(zout, "Ω") },
                  ...(Number.isFinite(voutLoaded)
                    ? [{ label: "Output with load", value: si(voutLoaded, "V") }]
                    : []),
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
        Two resistors in series across a supply split the voltage in proportion to their
        resistances. The point between them sits at a predictable fraction of the input,
        which makes the divider the cheapest way to scale a signal down.
      </p>
      <Formula>V_out = V_in × R2 / (R1 + R2)</Formula>
      <p>
        R1 is the resistor between the input and the tap; R2 is between the tap and
        ground. Only the ratio sets the output voltage — 10 kΩ / 10 kΩ and 100 Ω / 100 Ω
        both give half the input. What the absolute values change is current draw and how
        much the divider sags under load.
      </p>

      <h2>Choosing the resistor values</h2>
      <p>
        The whole chain draws I = V_in / (R1 + R2) continuously, whether anything is
        reading the output or not. On a 5 V rail, two 100 Ω resistors burn 25 mA and 125
        mW forever. Two 100 kΩ resistors draw 25 µA. For battery-powered work, higher
        values are almost always right.
      </p>
      <p>
        The counter-pressure is noise and loading. High-value dividers have high output
        impedance, which makes them slow to settle and easy to disturb. A practical band
        for most microcontroller work is 1 kΩ to 100 kΩ, with 10 kΩ as the default guess.
      </p>

      <h2>The loading problem</h2>
      <p>
        The formula above assumes nothing is drawing current from the tap. Connect a load
        and it sits in parallel with R2, pulling the effective bottom resistance down and
        the output voltage with it.
      </p>
      <Formula>R2_eff = (R2 × R_load) / (R2 + R_load)</Formula>
      <p>
        A 10 kΩ / 10 kΩ divider on 5 V should give 2.50 V. Hang a 10 kΩ load on it and the
        bottom leg becomes 5 kΩ, so the output drops to 1.67 V — a third off. The rule of
        thumb is to make the load at least ten times the divider impedance, which caps the
        error at roughly a few percent.
      </p>

      <h2>Where dividers work and where they do not</h2>
      <p>They are the right answer for:</p>
      <ul>
        <li>Scaling a 12 V battery voltage down into a 3.3 V ADC range.</li>
        <li>Setting a fixed bias point at a high-impedance input like an op-amp or a MOSFET gate.</li>
        <li>Level-shifting a 5 V logic output down to 3.3 V on a slow signal.</li>
      </ul>
      <p>They are the wrong answer for:</p>
      <ul>
        <li>
          <strong>Powering anything.</strong> A divider is not a regulator. Its output
          moves with load and with the input rail. Use an LDO or a buck converter.
        </li>
        <li>
          <strong>Fast digital signals.</strong> The output impedance and the stray
          capacitance of the target form a low-pass filter that rounds off edges. Above a
          few hundred kilohertz, use a proper level shifter.
        </li>
        <li>
          <strong>Anything with varying current draw.</strong> The output voltage will move
          with it.
        </li>
      </ul>

      <h2>Common ratios</h2>
      <table>
        <thead>
          <tr><th>R1</th><th>R2</th><th>Ratio</th><th>5 V in</th><th>12 V in</th></tr>
        </thead>
        <tbody>
          <tr><td>10k</td><td>10k</td><td>0.500</td><td>2.50 V</td><td>6.00 V</td></tr>
          <tr><td>10k</td><td>20k</td><td>0.667</td><td>3.33 V</td><td>8.00 V</td></tr>
          <tr><td>20k</td><td>10k</td><td>0.333</td><td>1.67 V</td><td>4.00 V</td></tr>
          <tr><td>10k</td><td>4.7k</td><td>0.320</td><td>1.60 V</td><td>3.84 V</td></tr>
          <tr><td>100k</td><td>10k</td><td>0.091</td><td>0.45 V</td><td>1.09 V</td></tr>
        </tbody>
      </table>
    </>
  );
}

const tool: Tool = {
  slug: "voltage-divider",
  category: "electronics",
  group: "Circuit basics",
  title: "Voltage divider calculator",
  label: "Voltage divider",
  description:
    "Find the output voltage of a two-resistor divider, including current draw, output impedance and the drop caused by a load.",
  keywords: ["voltage divider", "resistor divider", "potential divider", "adc scaling"],
  related: ["ohms-law", "resistor-colour-code"],
  Calculator,
  Article,
};

export default tool;
