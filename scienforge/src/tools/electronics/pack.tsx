"use client";

import { makeTool } from "@/lib/makeTool";
import Formula from "@/components/Formula";
import { si, trim } from "@/lib/format";

const PI = Math.PI;

/* ------------------------------------------------------------------ */
export const seriesParallel = makeTool({
  slug: "series-parallel-resistance",
  category: "electronics",
  group: "Circuit basics",
  title: "Series and parallel resistance calculator",
  label: "Series / parallel resistance",
  description:
    "Combine up to four resistors in series or in parallel and get the equivalent resistance, plus the current split through each branch.",
  keywords: ["series resistance", "parallel resistance", "equivalent resistance"],
  related: ["ohms-law", "voltage-divider"],
  columns: 3,
  inputs: [
    { kind: "select", key: "mode", label: "Connection", initial: "parallel",
      options: [{ value: "series", label: "Series" }, { value: "parallel", label: "Parallel" }] },
    { key: "r1", label: "R1", unit: "Ω", initial: "1k" },
    { key: "r2", label: "R2", unit: "Ω", initial: "2k2" },
    { key: "r3", label: "R3", unit: "Ω", initial: "", optional: true },
    { key: "r4", label: "R4", unit: "Ω", initial: "", optional: true },
    { key: "v", label: "Applied voltage", unit: "V", initial: "5", optional: true },
  ],
  compute: ({ n, s }) => {
    const rs = [n.r1, n.r2, n.r3, n.r4].filter((x) => Number.isFinite(x) && x > 0);
    if (rs.length < 2) return null;
    const series = s.mode === "series";
    const req = series
      ? rs.reduce((a, b) => a + b, 0)
      : 1 / rs.reduce((a, b) => a + 1 / b, 0);
    const rows = [{ label: "Resistors combined", value: String(rs.length) }];
    if (Number.isFinite(n.v)) {
      const total = n.v / req;
      rows.push({ label: "Total current", value: si(total, "A") });
      rs.forEach((r, i) => {
        const branch = series ? total : n.v / r;
        const drop = series ? total * r : n.v;
        rows.push({
          label: `R${i + 1}: ${si(r, "Ω")}`,
          value: `${si(branch, "A")} · ${si(drop, "V")}`,
        });
      });
    }
    return { name: series ? "Series total" : "Parallel equivalent", value: si(req, "Ω"), rows };
  },
  Article: () => (
    <>
      <p>
        Resistors in series pass the same current and share the voltage, so their
        resistances add. Resistors in parallel see the same voltage and share the current,
        so their conductances add — which means you sum the reciprocals.
      </p>
      <Formula>R_series = R1 + R2 + …&nbsp;&nbsp;&nbsp;1/R_parallel = 1/R1 + 1/R2 + …</Formula>
      <p>
        Two useful shortcuts. For exactly two resistors in parallel, R = (R1 × R2) / (R1 + R2),
        the &ldquo;product over sum&rdquo; form. For N identical resistors in parallel, R = R_one / N.
      </p>
      <h2>Sanity checks</h2>
      <p>
        A series total is always larger than the largest resistor in the chain. A parallel
        equivalent is always smaller than the smallest one. If your answer breaks either
        rule you have inverted something. A parallel combination of 1 kΩ and 1 MΩ is about
        999 Ω — the big resistor barely participates, which is why a high-value pull-up
        beside a low-value path is effectively invisible.
      </p>
      <h2>Getting values you cannot buy</h2>
      <p>
        Standard E24 parts jump in steps of roughly 10%, so exact values often do not
        exist. Two 10 kΩ resistors in parallel give 5 kΩ; in series they give 20 kΩ. Adding
        a large resistor in parallel with a smaller one trims it down slightly, which is a
        common way to hit a precise divider ratio without buying 0.1% parts.
      </p>
      <h2>Power still has to be checked</h2>
      <p>
        Combining resistors does not combine their power ratings usefully. In a series
        chain the largest resistor dissipates the most, because it drops the most voltage
        at a shared current. In parallel the smallest one dissipates the most. Check the
        worst-case part, not the average.
      </p>
    </>
  ),
});

/* ------------------------------------------------------------------ */
export const capacitorNetwork = makeTool({
  slug: "capacitor-series-parallel",
  category: "electronics",
  group: "Passive components",
  title: "Capacitors in series and parallel calculator",
  label: "Capacitor networks",
  description:
    "Find the equivalent capacitance of capacitors in series or parallel, with stored energy and charge at a given voltage.",
  keywords: ["capacitor series", "capacitor parallel", "equivalent capacitance", "farad"],
  related: ["rc-time-constant", "lc-resonance"],
  columns: 3,
  inputs: [
    { kind: "select", key: "mode", label: "Connection", initial: "series",
      options: [{ value: "series", label: "Series" }, { value: "parallel", label: "Parallel" }] },
    { key: "c1", label: "C1", unit: "F", initial: "100u" },
    { key: "c2", label: "C2", unit: "F", initial: "220u" },
    { key: "c3", label: "C3", unit: "F", initial: "", optional: true },
    { key: "v", label: "Applied voltage", unit: "V", initial: "12", optional: true },
  ],
  compute: ({ n, s }) => {
    const cs = [n.c1, n.c2, n.c3].filter((x) => Number.isFinite(x) && x > 0);
    if (cs.length < 2) return null;
    const parallel = s.mode === "parallel";
    const ceq = parallel
      ? cs.reduce((a, b) => a + b, 0)
      : 1 / cs.reduce((a, b) => a + 1 / b, 0);
    const rows: { label: string; value: string }[] = [];
    if (Number.isFinite(n.v)) {
      rows.push({ label: "Stored charge", value: si(ceq * n.v, "C") });
      rows.push({ label: "Stored energy", value: si(0.5 * ceq * n.v * n.v, "J") });
    }
    return {
      name: parallel ? "Parallel equivalent" : "Series equivalent",
      value: si(ceq, "F"),
      rows,
      note: "Capacitors behave the opposite way to resistors: parallel adds, series divides.",
    };
  },
  Article: () => (
    <>
      <p>
        Capacitance combines the other way round from resistance. Capacitors in parallel
        share the same voltage and their plate areas effectively add, so the capacitances
        add. In series the charge has to pass through every capacitor in turn, so the
        reciprocals add and the total is smaller than the smallest part.
      </p>
      <Formula>C_parallel = C1 + C2 + …&nbsp;&nbsp;&nbsp;1/C_series = 1/C1 + 1/C2 + …</Formula>
      <h2>Why you would put capacitors in series</h2>
      <p>
        Almost always for voltage rating rather than for capacitance. Two 400 V capacitors
        in series withstand 800 V but give you half the capacitance. In practice you also
        need balancing resistors across each one, because leakage currents differ and the
        voltage will not divide evenly on its own.
      </p>
      <h2>Energy and charge</h2>
      <p>
        A charged capacitor holds Q = CV coulombs and stores E = ½CV² joules. The square
        matters: doubling the voltage quadruples the stored energy. A 470 µF capacitor at
        400 V holds about 38 J, which is enough to be dangerous long after the power is
        off. Discharge large capacitors through a resistor before touching a board.
      </p>
      <h2>Real capacitors are not ideal</h2>
      <p>
        Ceramic capacitors lose a large fraction of their nominal value under DC bias — a
        10 µF X5R part can fall below 3 µF at its rated voltage. Electrolytics have
        tolerances as wide as −20/+80% and series resistance that matters in switching
        supplies. Use the calculated figure as a design target, not a guarantee.
      </p>
    </>
  ),
});

/* ------------------------------------------------------------------ */
export const rcTimeConstant = makeTool({
  slug: "rc-time-constant",
  category: "electronics",
  group: "Passive components",
  title: "RC time constant calculator",
  label: "RC time constant",
  description:
    "Compute the time constant of a resistor-capacitor pair, plus the charge and discharge times to reach any percentage of the supply.",
  keywords: ["rc time constant", "tau", "charging", "discharge", "capacitor"],
  related: ["rc-filter-cutoff", "capacitor-series-parallel"],
  columns: 3,
  inputs: [
    { key: "r", label: "Resistance", unit: "Ω", initial: "10k" },
    { key: "c", label: "Capacitance", unit: "F", initial: "100u" },
    { key: "v", label: "Supply voltage", unit: "V", initial: "5", optional: true },
  ],
  compute: ({ n }) => {
    if (!Number.isFinite(n.r) || !Number.isFinite(n.c) || n.r <= 0 || n.c <= 0) return null;
    const tau = n.r * n.c;
    const rows = [
      { label: "63.2% charged (1τ)", value: si(tau, "s") },
      { label: "86.5% charged (2τ)", value: si(2 * tau, "s") },
      { label: "95.0% charged (3τ)", value: si(3 * tau, "s") },
      { label: "99.3% charged (5τ)", value: si(5 * tau, "s") },
      { label: "Half of supply", value: si(tau * Math.LN2, "s") },
    ];
    if (Number.isFinite(n.v)) {
      rows.push({ label: "Voltage after 1τ", value: si(n.v * 0.632, "V") });
    }
    return { name: "Time constant τ", value: si(tau, "s"), rows };
  },
  Article: () => (
    <>
      <p>
        Charge a capacitor through a resistor and the voltage does not rise linearly. It
        approaches the supply asymptotically, fast at first and then ever more slowly, with
        the whole shape set by a single number: the time constant.
      </p>
      <Formula>τ = R × C&nbsp;&nbsp;&nbsp;V(t) = V_supply · (1 − e^(−t/τ))</Formula>
      <p>
        Ohms times farads gives seconds. 10 kΩ with 100 µF is 1 second. After one time
        constant the capacitor has reached 63.2% of the supply; after five it is at 99.3%,
        which is close enough that most engineering treats 5τ as fully charged.
      </p>
      <h2>Discharge is the same curve mirrored</h2>
      <p>
        Discharging follows V(t) = V₀ · e^(−t/τ) with the same τ, provided the discharge
        path has the same resistance. It often does not — a capacitor charged through a
        large resistor and discharged through a transistor empties far faster than it
        filled. That asymmetry is exactly how a 555 timer produces a duty cycle other than
        50%.
      </p>
      <h2>Where you use it</h2>
      <ul>
        <li>Debouncing a mechanical switch, where a few milliseconds of τ smooths the contact bounce.</li>
        <li>Power-on reset circuits that hold a line low until the rail has stabilised.</li>
        <li>Setting the blink rate of a 555 or the ramp time of a simple oscillator.</li>
        <li>Choosing decoupling capacitors, where you want τ short enough to respond to load steps.</li>
      </ul>
      <h2>Percentage to time constants</h2>
      <table>
        <thead><tr><th>Charged to</th><th>Time</th></tr></thead>
        <tbody>
          <tr><td>50%</td><td>0.69 τ</td></tr>
          <tr><td>63.2%</td><td>1 τ</td></tr>
          <tr><td>90%</td><td>2.30 τ</td></tr>
          <tr><td>95%</td><td>3.00 τ</td></tr>
          <tr><td>99%</td><td>4.61 τ</td></tr>
          <tr><td>99.9%</td><td>6.91 τ</td></tr>
        </tbody>
      </table>
    </>
  ),
});

/* ------------------------------------------------------------------ */
export const rcFilter = makeTool({
  slug: "rc-filter-cutoff",
  category: "electronics",
  group: "Passive components",
  title: "RC low-pass and high-pass filter calculator",
  label: "RC filter cutoff",
  description:
    "Find the −3 dB cutoff frequency of a first-order RC filter, with the phase shift and the attenuation at any frequency you choose.",
  keywords: ["rc filter", "cutoff frequency", "low pass", "high pass", "-3db"],
  related: ["rc-time-constant", "lc-resonance"],
  columns: 4,
  inputs: [
    { key: "r", label: "Resistance", unit: "Ω", initial: "1k" },
    { key: "c", label: "Capacitance", unit: "F", initial: "100n" },
    { key: "f", label: "Test frequency", unit: "Hz", initial: "1k", optional: true },
    { kind: "select", key: "type", label: "Filter type", initial: "lowpass",
      options: [{ value: "lowpass", label: "Low pass" }, { value: "highpass", label: "High pass" }] },
  ],
  compute: ({ n, s }) => {
    if (!(n.r > 0) || !(n.c > 0)) return null;
    const fc = 1 / (2 * PI * n.r * n.c);
    const rows = [
      { label: "Time constant", value: si(n.r * n.c, "s") },
      { label: "Roll-off", value: "20 dB per decade" },
      { label: "Phase at cutoff", value: s.type === "lowpass" ? "−45°" : "+45°" },
    ];
    if (n.f > 0) {
      const ratio = n.f / fc;
      const gain = s.type === "lowpass"
        ? 1 / Math.sqrt(1 + ratio * ratio)
        : ratio / Math.sqrt(1 + ratio * ratio);
      rows.push({ label: `Gain at ${si(n.f, "Hz")}`, value: `${trim(gain, 4)} (${trim(20 * Math.log10(gain), 3)} dB)` });
    }
    return { name: "Cutoff frequency", value: si(fc, "Hz"), rows };
  },
  Article: () => (
    <>
      <p>
        A resistor and a capacitor form the simplest useful filter. Which output you tap
        decides its character: take the signal across the capacitor and you get a low-pass
        response, take it across the resistor and you get a high-pass one. Both share the
        same corner frequency.
      </p>
      <Formula>f_c = 1 / (2π R C)</Formula>
      <p>
        At f_c the output amplitude has fallen to 1/√2 of the input, which is −3 dB, and
        exactly half the input power. This is why the cutoff is often called the half-power
        point rather than the point where the filter &ldquo;stops&rdquo; — it does not stop,
        it rolls off gradually at 20 dB per decade.
      </p>
      <h2>A first-order filter is gentle</h2>
      <p>
        One decade above the cutoff a low-pass filter attenuates by only a factor of ten.
        If you need a sharp transition — an anti-aliasing filter ahead of an ADC, for
        instance — cascade stages or move to an active Sallen-Key or Butterworth design.
        Cascading two RC stages naively does not simply double the slope, because the second
        stage loads the first; buffer between them with an op-amp.
      </p>
      <h2>Choosing R and C</h2>
      <p>
        Only the product sets the frequency, so 1 kΩ with 160 nF and 10 kΩ with 16 nF give
        the same corner. The split matters for impedance: a low R loads the source hard, a
        high R makes the filter noisy and sensitive to the input bias current of whatever
        follows it. For general signal work, keep R between roughly 1 kΩ and 100 kΩ.
      </p>
      <h2>Phase, which is easy to forget</h2>
      <p>
        The filter shifts phase as well as amplitude — 45° at the cutoff, approaching 90°
        far past it. Inside a feedback loop that shift eats phase margin and can turn a
        stable amplifier into an oscillator.
      </p>
    </>
  ),
});

/* ------------------------------------------------------------------ */
export const lcResonance = makeTool({
  slug: "lc-resonance",
  category: "electronics",
  group: "Passive components",
  title: "LC resonant frequency calculator",
  label: "LC resonance",
  description:
    "Find the resonant frequency of an inductor and capacitor, with characteristic impedance, Q factor and bandwidth.",
  keywords: ["lc resonance", "resonant frequency", "tank circuit", "q factor"],
  related: ["rc-filter-cutoff", "reactance"],
  columns: 3,
  inputs: [
    { key: "l", label: "Inductance", unit: "H", initial: "100u" },
    { key: "c", label: "Capacitance", unit: "F", initial: "1n" },
    { key: "r", label: "Series resistance", unit: "Ω", initial: "", optional: true },
  ],
  compute: ({ n }) => {
    if (!(n.l > 0) || !(n.c > 0)) return null;
    const f0 = 1 / (2 * PI * Math.sqrt(n.l * n.c));
    const z0 = Math.sqrt(n.l / n.c);
    const rows = [
      { label: "Angular frequency ω₀", value: si(2 * PI * f0, "rad/s") },
      { label: "Characteristic impedance", value: si(z0, "Ω") },
      { label: "Period", value: si(1 / f0, "s") },
    ];
    if (n.r > 0) {
      const q = z0 / n.r;
      rows.push({ label: "Q factor", value: trim(q, 4) });
      rows.push({ label: "Bandwidth (−3 dB)", value: si(f0 / q, "Hz") });
    }
    return { name: "Resonant frequency", value: si(f0, "Hz"), rows };
  },
  Article: () => (
    <>
      <p>
        An inductor and a capacitor exchange energy back and forth — the capacitor storing
        it in an electric field, the inductor in a magnetic one. At one particular frequency
        their reactances are equal and opposite and cancel completely. That is resonance.
      </p>
      <Formula>f₀ = 1 / (2π √(LC))</Formula>
      <p>
        The square root has a practical consequence: to double the frequency you must
        reduce L or C by a factor of four. Tuning across a wide band therefore needs a large
        capacitance range, which is why variable capacitors in old radios were physically
        enormous.
      </p>
      <h2>Series and parallel behave oppositely</h2>
      <p>
        A series LC becomes a short circuit at resonance, limited only by the parasitic
        resistance — useful as a notch filter that swallows one frequency. A parallel LC, or
        tank, becomes a very high impedance at resonance, which is what makes it the
        frequency-selecting element in an oscillator or the load in an RF amplifier.
      </p>
      <h2>Q factor and bandwidth</h2>
      <p>
        Q measures how sharply the circuit selects. It is the ratio of the characteristic
        impedance √(L/C) to the loss resistance. High Q means a narrow bandwidth and a
        long ringing time; low Q means a broad response that settles quickly.
      </p>
      <Formula>Q = (1/R)·√(L/C)&nbsp;&nbsp;&nbsp;BW = f₀ / Q</Formula>
      <p>
        A tuned circuit with Q of 100 at 1 MHz passes a 10 kHz band. Real inductors rarely
        exceed Q of 200 because of winding resistance and core loss, and the loading of the
        stage that follows usually dominates anyway.
      </p>
    </>
  ),
});

/* ------------------------------------------------------------------ */
export const reactance = makeTool({
  slug: "reactance",
  category: "electronics",
  group: "Passive components",
  title: "Capacitive and inductive reactance calculator",
  label: "Reactance",
  description:
    "Compute the reactance of a capacitor or inductor at any frequency, and the current it passes at a given AC voltage.",
  keywords: ["reactance", "capacitive reactance", "inductive reactance", "impedance", "xc", "xl"],
  related: ["lc-resonance", "rc-filter-cutoff"],
  columns: 4,
  inputs: [
    { kind: "select", key: "type", label: "Component", initial: "capacitor",
      options: [{ value: "capacitor", label: "Capacitor" }, { value: "inductor", label: "Inductor" }] },
    { key: "val", label: "Value", unit: "F or H", initial: "1u" },
    { key: "f", label: "Frequency", unit: "Hz", initial: "50" },
    { key: "v", label: "AC voltage", unit: "V rms", initial: "", optional: true },
  ],
  compute: ({ n, s }) => {
    if (!(n.val > 0) || !(n.f > 0)) return null;
    const cap = s.type === "capacitor";
    const x = cap ? 1 / (2 * PI * n.f * n.val) : 2 * PI * n.f * n.val;
    const rows = [
      { label: "Phase of current", value: cap ? "90° leading the voltage" : "90° lagging the voltage" },
      { label: "At ten times the frequency", value: si(cap ? x / 10 : x * 10, "Ω") },
    ];
    if (n.v > 0) {
      rows.push({ label: "Current", value: si(n.v / x, "A") });
      rows.push({ label: "Reactive power", value: si((n.v * n.v) / x, "VAR") });
    }
    return {
      name: cap ? "Capacitive reactance Xc" : "Inductive reactance Xl",
      value: si(x, "Ω"),
      rows,
    };
  },
  Article: () => (
    <>
      <p>
        Reactance is the opposition a capacitor or inductor presents to alternating current.
        It is measured in ohms like resistance, but it does not dissipate energy — it stores
        it and hands it back, a quarter cycle later.
      </p>
      <Formula>Xc = 1 / (2π f C)&nbsp;&nbsp;&nbsp;Xl = 2π f L</Formula>
      <p>
        The two behave in opposite directions with frequency. Capacitive reactance falls as
        frequency rises, so a capacitor blocks DC and passes high frequencies — which is the
        entire basis of coupling and decoupling. Inductive reactance rises with frequency,
        so an inductor passes DC and chokes off high frequencies.
      </p>
      <h2>Reactance is not resistance</h2>
      <p>
        Current through a resistor is in phase with the voltage across it, and the product
        is real power turned into heat. Current through a pure reactance is 90° out of
        phase, so the average power is zero. That is why a large filter capacitor across the
        mains draws current without consuming energy, and why power factor correction
        works.
      </p>
      <h2>Combining into impedance</h2>
      <p>
        Resistance and reactance do not add arithmetically. They combine as vectors:
      </p>
      <Formula>Z = √(R² + X²)&nbsp;&nbsp;&nbsp;φ = arctan(X / R)</Formula>
      <p>
        A 100 Ω resistor in series with 100 Ω of reactance gives 141 Ω of impedance at 45°,
        not 200 Ω. Where both a capacitor and an inductor are present, their reactances
        subtract before this step, because they are 180° apart from each other.
      </p>
      <h2>Real parts have parasitics</h2>
      <p>
        Every capacitor has some series inductance from its leads, so above a
        self-resonant frequency it behaves as an inductor. Every inductor has winding
        capacitance and does the reverse. This is why a single large decoupling capacitor
        does not work at high frequency, and why boards use several values in parallel.
      </p>
    </>
  ),
});

/* ------------------------------------------------------------------ */
export const opAmpGain = makeTool({
  slug: "op-amp-gain",
  category: "electronics",
  group: "Circuit basics",
  title: "Op-amp gain calculator",
  label: "Op-amp gain",
  description:
    "Find the gain of an inverting or non-inverting op-amp stage from its feedback resistors, with the output voltage and required bandwidth.",
  keywords: ["op amp gain", "inverting amplifier", "non-inverting", "feedback resistor"],
  related: ["voltage-divider", "ohms-law"],
  columns: 4,
  inputs: [
    { kind: "select", key: "topology", label: "Topology", initial: "noninverting",
      options: [
        { value: "noninverting", label: "Non-inverting" },
        { value: "inverting", label: "Inverting" },
      ] },
    { key: "rf", label: "Feedback resistor Rf", unit: "Ω", initial: "100k" },
    { key: "rin", label: "Input resistor Rin", unit: "Ω", initial: "10k" },
    { key: "vin", label: "Input voltage", unit: "V", initial: "0.1", optional: true },
  ],
  compute: ({ n, s }) => {
    if (!(n.rf > 0) || !(n.rin > 0)) return null;
    const inv = s.topology === "inverting";
    const gain = inv ? -(n.rf / n.rin) : 1 + n.rf / n.rin;
    const rows = [
      { label: "Gain in dB", value: `${trim(20 * Math.log10(Math.abs(gain)), 4)} dB` },
      { label: "Input impedance", value: inv ? si(n.rin, "Ω") : "very high (≈ op-amp input)" },
      { label: "Phase", value: inv ? "inverted (180°)" : "in phase" },
    ];
    if (Number.isFinite(n.vin)) {
      rows.push({ label: "Output voltage", value: si(gain * n.vin, "V") });
    }
    return { name: "Voltage gain", value: `${trim(gain, 5)} ×`, rows };
  },
  Article: () => (
    <>
      <p>
        An op-amp on its own has a gain of a hundred thousand or more, which is useless
        directly. Wrapping feedback around it throws almost all of that away in exchange for
        a gain you set precisely with two resistors, plus better linearity and a flatter
        response.
      </p>
      <Formula>
        Non-inverting: A = 1 + Rf/Rin{"\n"}
        Inverting:&nbsp;&nbsp;&nbsp;&nbsp; A = −Rf/Rin
      </Formula>
      <h2>Choosing between the two</h2>
      <p>
        The non-inverting configuration has very high input impedance, because the signal
        goes straight to the op-amp&rsquo;s own input pin. It cannot produce gain below 1.
        The inverting configuration can attenuate as well as amplify and makes summing
        several inputs trivial, but its input impedance is just Rin, which loads the source.
      </p>
      <h2>Gain-bandwidth product</h2>
      <p>
        The one specification that catches people out. An op-amp with a 1 MHz
        gain-bandwidth product gives a gain of 100 only up to 10 kHz, and a gain of 1000 only
        up to 1 kHz. If a stage sounds or measures dull at high frequency, check this before
        anything else. Splitting a gain of 1000 into two stages of about 32 each gives far
        more usable bandwidth.
      </p>
      <h2>Practical resistor choice</h2>
      <p>
        Only the ratio sets the gain, so pick the absolute values for other reasons. Keep Rf
        under roughly 1 MΩ, because input bias current flowing through a large feedback
        resistor creates an offset voltage, and large resistors are noisy. Keep Rin above a
        few hundred ohms so the previous stage is not asked to drive a near-short. Values in
        the 1 kΩ to 100 kΩ band suit most audio and sensor work.
      </p>
      <h2>Single supply operation</h2>
      <p>
        These formulas assume the op-amp can swing either side of zero. Running from a
        single rail, you must bias the input at mid-supply with a divider and couple the
        signal in through a capacitor, or the negative half of the waveform will simply be
        clipped off.
      </p>
    </>
  ),
});

/* ------------------------------------------------------------------ */
export const timer555 = makeTool({
  slug: "555-timer-astable",
  category: "electronics",
  group: "Circuit basics",
  title: "555 timer astable calculator",
  label: "555 astable",
  description:
    "Compute the frequency, duty cycle and high and low times of a 555 timer in astable mode from R1, R2 and C.",
  keywords: ["555 timer", "astable", "duty cycle", "oscillator", "ne555"],
  related: ["rc-time-constant"],
  columns: 3,
  inputs: [
    { key: "r1", label: "R1", unit: "Ω", initial: "1k" },
    { key: "r2", label: "R2", unit: "Ω", initial: "10k" },
    { key: "c", label: "C", unit: "F", initial: "100n" },
  ],
  compute: ({ n }) => {
    if (!(n.r1 > 0) || !(n.r2 > 0) || !(n.c > 0)) return null;
    const th = Math.LN2 * (n.r1 + n.r2) * n.c;
    const tl = Math.LN2 * n.r2 * n.c;
    const t = th + tl;
    const f = 1 / t;
    return {
      name: "Output frequency",
      value: si(f, "Hz"),
      rows: [
        { label: "Period", value: si(t, "s") },
        { label: "Output high time", value: si(th, "s") },
        { label: "Output low time", value: si(tl, "s") },
        { label: "Duty cycle", value: `${trim((th / t) * 100, 4)}%` },
      ],
      note: "Standard astable duty cycle can never reach 50% because R1 is in the charge path only.",
    };
  },
  Article: () => (
    <>
      <p>
        In astable mode the 555 charges a capacitor through R1 and R2 in series, then
        discharges it through R2 alone, oscillating between one third and two thirds of the
        supply voltage. The asymmetry between the two paths is what sets the duty cycle.
      </p>
      <Formula>
        t_high = 0.693 × (R1 + R2) × C{"\n"}
        t_low&nbsp;&nbsp;= 0.693 × R2 × C{"\n"}
        f = 1.44 / ((R1 + 2·R2) × C)
      </Formula>
      <p>
        The 0.693 is ln(2), which comes from the capacitor crossing between the one-third
        and two-thirds thresholds. Those thresholds are set by an internal resistor divider,
        which is why the frequency does not depend on supply voltage.
      </p>
      <h2>The duty cycle problem</h2>
      <p>
        Because R1 appears in the charging path but not the discharging one, the high time
        is always longer than the low time. The duty cycle is therefore always above 50% and
        can only approach it by making R2 very large compared with R1. To go below 50%, add
        a diode across R2 so charging bypasses it entirely — then t_high ≈ 0.693·R1·C and
        the two halves become independent.
      </p>
      <h2>Practical limits</h2>
      <ul>
        <li>Keep R1 above about 1 kΩ. The discharge pin sinks the capacitor current directly and can be damaged.</li>
        <li>Total resistance above roughly 10 MΩ makes the timing drift with leakage and humidity.</li>
        <li>The bipolar NE555 draws several milliamps and injects a large current spike on every transition. Use a 100 nF decoupling capacitor right at the chip.</li>
        <li>For low-power or 3.3 V work, use a CMOS version such as the TLC555 or LMC555 instead.</li>
      </ul>
      <h2>Component tolerance dominates</h2>
      <p>
        The formula is exact; your parts are not. An electrolytic timing capacitor with a
        −20/+80% tolerance makes the calculated frequency little more than an estimate. For
        anything that needs to be accurate, use a film capacitor, or use a microcontroller
        timer instead.
      </p>
    </>
  ),
});

/* ------------------------------------------------------------------ */
export const batteryLife = makeTool({
  slug: "battery-life",
  category: "electronics",
  group: "Power and thermal",
  title: "Battery life calculator",
  label: "Battery life",
  description:
    "Estimate how long a battery will run a circuit from its capacity in mAh and the average current draw, with a derating factor applied.",
  keywords: ["battery life", "mah", "runtime", "current draw", "capacity"],
  related: ["ohms-law"],
  columns: 4,
  inputs: [
    { key: "cap", label: "Battery capacity", unit: "mAh", initial: "2000" },
    { key: "draw", label: "Average current", unit: "mA", initial: "80" },
    { key: "eff", label: "Usable fraction", unit: "0–1", initial: "0.8",
      hint: "0.7–0.85 is realistic for most chemistries." },
    { key: "v", label: "Nominal voltage", unit: "V", initial: "3.7", optional: true },
  ],
  compute: ({ n }) => {
    if (!(n.cap > 0) || !(n.draw > 0)) return null;
    const eff = n.eff > 0 && n.eff <= 1 ? n.eff : 1;
    const hours = (n.cap * eff) / n.draw;
    const rows = [
      { label: "Hours", value: trim(hours, 4) },
      { label: "Days", value: trim(hours / 24, 4) },
      { label: "Discharge rate", value: `${trim(n.draw / n.cap, 3)} C` },
    ];
    if (n.v > 0) {
      rows.push({ label: "Energy stored", value: `${trim((n.cap / 1000) * n.v, 4)} Wh` });
      rows.push({ label: "Average power", value: `${trim((n.draw / 1000) * n.v, 4)} W` });
    }
    return {
      name: "Estimated runtime",
      value: hours >= 48 ? `${trim(hours / 24, 3)} days` : `${trim(hours, 4)} hours`,
      rows,
    };
  },
  Article: () => (
    <>
      <p>
        The arithmetic is simple. Capacity in milliamp-hours divided by average draw in
        milliamps gives hours. A 2000 mAh cell powering an 80 mA load lasts 25 hours on
        paper.
      </p>
      <Formula>runtime (h) = capacity (mAh) × usable fraction / current (mA)</Formula>
      <p>
        In practice you will not get that. The derating factor in the calculator accounts
        for the gap, and 0.7 to 0.85 is a fair starting range.
      </p>
      <h2>Why the paper number is optimistic</h2>
      <ul>
        <li>
          <strong>Cutoff voltage.</strong> Your circuit stops working before the cell is
          empty. A regulator that drops out at 3.0 V leaves real energy in a lithium cell
          that discharges to 2.5 V.
        </li>
        <li>
          <strong>Rated versus actual capacity.</strong> The printed figure is measured at a
          low, steady discharge rate. Pull harder and you get less, because internal
          resistance wastes some of it as heat.
        </li>
        <li>
          <strong>Self-discharge.</strong> Alkaline cells lose a few percent a year; NiMH
          can lose that much a month unless they are low-self-discharge types. For a device
          that sleeps for a year, this can dominate everything else.
        </li>
        <li>
          <strong>Temperature.</strong> Capacity falls sharply below freezing. A cell rated
          2000 mAh at 20 °C may deliver 1200 mAh at −10 °C.
        </li>
        <li>
          <strong>Ageing.</strong> Lithium-ion cells lose roughly 20% of capacity over a few
          hundred full cycles.
        </li>
      </ul>
      <h2>Averaging a duty-cycled load</h2>
      <p>
        Most battery-powered designs are not constant loads. If a sensor node draws 120 mA
        for 200 ms every 30 seconds and 15 µA the rest of the time, the average is
        (0.2/30)×120 + (29.8/30)×0.015 ≈ 0.81 mA. That is the number to divide into the
        capacity. The sleep current usually matters more than the active current, which is
        why cutting sleep draw from 100 µA to 10 µA can multiply battery life several times
        over.
      </p>
    </>
  ),
});

/* ------------------------------------------------------------------ */
export const transformerTurns = makeTool({
  slug: "transformer-turns-ratio",
  category: "electronics",
  group: "Power and thermal",
  title: "Transformer turns ratio calculator",
  label: "Transformer turns ratio",
  description:
    "Relate primary and secondary turns, voltages and currents in an ideal transformer, including the impedance transformation ratio.",
  keywords: ["transformer", "turns ratio", "primary", "secondary", "step down"],
  columns: 4,
  inputs: [
    { key: "np", label: "Primary turns", initial: "1000" },
    { key: "ns", label: "Secondary turns", initial: "50" },
    { key: "vp", label: "Primary voltage", unit: "V", initial: "230" },
    { key: "ip", label: "Primary current", unit: "A", initial: "", optional: true },
  ],
  compute: ({ n }) => {
    if (!(n.np > 0) || !(n.ns > 0)) return null;
    const ratio = n.np / n.ns;
    const rows = [
      { label: "Turns ratio (Np:Ns)", value: `${trim(ratio, 5)} : 1` },
      { label: "Impedance ratio", value: `${trim(ratio * ratio, 5)} : 1` },
      { label: "Type", value: ratio > 1 ? "step down" : ratio < 1 ? "step up" : "isolation" },
    ];
    let headline = `${trim(ratio, 5)} : 1`;
    if (n.vp > 0) {
      const vs = n.vp / ratio;
      headline = si(vs, "V");
      rows.unshift({ label: "Secondary voltage", value: si(vs, "V") });
      if (n.ip > 0) {
        rows.push({ label: "Secondary current", value: si(n.ip * ratio, "A") });
        rows.push({ label: "Apparent power", value: si(n.vp * n.ip, "VA") });
      }
    }
    return { name: n.vp > 0 ? "Secondary voltage" : "Turns ratio", value: headline, rows,
      note: "Ideal model: no core loss, no leakage inductance, 100% coupling." };
  },
  Article: () => (
    <>
      <p>
        A transformer trades voltage for current at constant power. The exchange rate is
        the ratio of the turns on each winding, because both windings share the same
        changing magnetic flux and each turn develops the same induced voltage.
      </p>
      <Formula>Vs/Vp = Ns/Np&nbsp;&nbsp;&nbsp;Is/Ip = Np/Ns&nbsp;&nbsp;&nbsp;Zs/Zp = (Ns/Np)²</Formula>
      <p>
        Step the voltage down by ten and the available current goes up by ten. Power in
        equals power out, minus losses. Nothing is amplified.
      </p>
      <h2>The impedance ratio is the square</h2>
      <p>
        This is the part that surprises people and the reason transformers appear in audio
        and RF work at all. A 10:1 transformer transforms impedance by 100:1. That is how a
        valve amplifier with an 8 kΩ output impedance drives an 8 Ω speaker, and how an
        antenna is matched to a feedline.
      </p>
      <h2>Transformers only work on AC</h2>
      <p>
        The induced voltage depends on the <em>rate of change</em> of flux. Apply DC and the
        flux stops changing, the secondary voltage collapses to zero, and the primary
        becomes a low-resistance winding across your supply — which is how transformers get
        destroyed.
      </p>
      <h2>Where the ideal model breaks</h2>
      <ul>
        <li><strong>Core saturation.</strong> Past a certain flux density the core stops responding and primary current rises sharply. This sets the minimum operating frequency.</li>
        <li><strong>Copper and core losses.</strong> Winding resistance and hysteresis turn some power into heat. Small mains transformers are often only 70–90% efficient.</li>
        <li><strong>Leakage inductance.</strong> Flux that misses the other winding shows up as series inductance and causes the output to sag under load.</li>
        <li><strong>Regulation.</strong> A small transformer&rsquo;s no-load secondary voltage can be 10–20% above its rated full-load figure.</li>
      </ul>
    </>
  ),
});

/* ------------------------------------------------------------------ */
export const decibels = makeTool({
  slug: "decibel-converter",
  category: "electronics",
  group: "Digital and data",
  title: "Decibel converter",
  label: "Decibels",
  description:
    "Convert between decibels and power or voltage ratios, and between dBm and watts, in both directions.",
  keywords: ["decibel", "db", "dbm", "power ratio", "voltage ratio", "gain"],
  columns: 3,
  inputs: [
    { kind: "select", key: "dir", label: "Convert", initial: "toDb",
      options: [
        { value: "toDb", label: "Ratio → decibels" },
        { value: "fromDb", label: "Decibels → ratio" },
      ] },
    { key: "val", label: "Value", initial: "100", hint: "A ratio, or a figure in dB." },
    { key: "dbm", label: "Power for dBm", unit: "W", initial: "", optional: true },
  ],
  compute: ({ n, s }) => {
    if (!Number.isFinite(n.val)) return null;
    const rows: { label: string; value: string }[] = [];
    let name: string, value: string;
    if (s.dir === "toDb") {
      if (n.val <= 0) return null;
      const dbP = 10 * Math.log10(n.val);
      const dbV = 20 * Math.log10(n.val);
      name = "As a power ratio";
      value = `${trim(dbP, 5)} dB`;
      rows.push({ label: "As a voltage or amplitude ratio", value: `${trim(dbV, 5)} dB` });
    } else {
      const pr = 10 ** (n.val / 10);
      const vr = 10 ** (n.val / 20);
      name = "Power ratio";
      value = `${trim(pr, 5)} ×`;
      rows.push({ label: "Voltage or amplitude ratio", value: `${trim(vr, 5)} ×` });
    }
    if (n.dbm > 0) {
      rows.push({ label: `${si(n.dbm, "W")} in dBm`, value: `${trim(10 * Math.log10(n.dbm * 1000), 5)} dBm` });
    }
    return { name, value, rows };
  },
  Article: () => (
    <>
      <p>
        The decibel is a logarithmic ratio, not a unit of anything on its own. It exists
        because the quantities engineers care about span enormous ranges and because
        cascaded stages multiply — and logarithms turn multiplication into addition, so a
        chain of gains and losses becomes a sum.
      </p>
      <Formula>
        dB (power) = 10 · log₁₀(P₂/P₁){"\n"}
        dB (voltage) = 20 · log₁₀(V₂/V₁)
      </Formula>
      <h2>Why there are two formulas</h2>
      <p>
        There is only one definition — the power one. Voltage gets a factor of 20 because
        power goes as voltage squared into a fixed impedance, and the square comes out of
        the logarithm as a factor of two. Use 10 for power, watts and intensity; use 20 for
        voltage, current, pressure and amplitude. Mixing them up is the single most common
        decibel error.
      </p>
      <h2>Figures worth memorising</h2>
      <table>
        <thead><tr><th>dB</th><th>Power ratio</th><th>Voltage ratio</th></tr></thead>
        <tbody>
          <tr><td>3 dB</td><td>2×</td><td>1.41×</td></tr>
          <tr><td>6 dB</td><td>4×</td><td>2×</td></tr>
          <tr><td>10 dB</td><td>10×</td><td>3.16×</td></tr>
          <tr><td>20 dB</td><td>100×</td><td>10×</td></tr>
          <tr><td>−3 dB</td><td>0.5×</td><td>0.71×</td></tr>
        </tbody>
      </table>
      <p>
        The −3 dB point being half power is why filter cutoffs are defined there.
      </p>
      <h2>Suffixed decibels are absolute</h2>
      <p>
        Adding a suffix pins the reference and makes the figure a real measurement. dBm is
        referenced to one milliwatt, so 0 dBm is 1 mW and 30 dBm is 1 W. dBV references one
        volt; dBu references 0.7746 V; dB SPL references the threshold of hearing. A bare
        &ldquo;dB&rdquo; is always relative to something else in the same system.
      </p>
    </>
  ),
});
