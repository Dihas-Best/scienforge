"use client";

import { useState } from "react";
import Field from "@/components/Field";
import Readout from "@/components/Readout";
import Formula from "@/components/Formula";
import { parseEng, trim } from "@/lib/format";
import type { Tool } from "@/lib/types";

function Calculator() {
  const [v0, setV0] = useState("20");
  const [angle, setAngle] = useState("45");
  const [h0, setH0] = useState("0");
  const [g, setG] = useState("9.81");

  const V = parseEng(v0), A = parseEng(angle), H = parseEng(h0), G = parseEng(g);
  const ok = [V, A, H, G].every(Number.isFinite) && G > 0 && V >= 0;

  const rad = (A * Math.PI) / 180;
  const vx = V * Math.cos(rad);
  const vy = V * Math.sin(rad);

  // t when y = 0, from h0 + vy t - g t^2 / 2 = 0
  const disc = vy * vy + 2 * G * H;
  const t = ok && disc >= 0 ? (vy + Math.sqrt(disc)) / G : NaN;
  const range = vx * t;
  const apexT = vy / G;
  const apex = H + (vy * vy) / (2 * G);
  const vImpactY = vy - G * t;
  const vImpact = Math.hypot(vx, vImpactY);
  const impactAngle = (Math.atan2(-vImpactY, vx) * 180) / Math.PI;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Launch speed" unit="m/s" value={v0} onChange={setV0} />
        <Field label="Launch angle" unit="degrees" value={angle} onChange={setAngle} />
        <Field label="Launch height" unit="m" value={h0} onChange={setH0} />
        <Field label="Gravity" unit="m/s²" value={g} onChange={setG} hint="Earth 9.81, Moon 1.62, Mars 3.72" />
      </div>

      <div className="mt-5">
        <Readout
          name="Horizontal range"
          value={ok ? `${trim(range)} m` : "Enter launch conditions"}
          rows={
            ok
              ? [
                  { label: "Time of flight", value: `${trim(t)} s` },
                  { label: "Maximum height", value: `${trim(apex)} m` },
                  { label: "Time to apex", value: `${trim(apexT)} s` },
                  { label: "Horizontal velocity", value: `${trim(vx)} m/s` },
                  { label: "Initial vertical velocity", value: `${trim(vy)} m/s` },
                  { label: "Impact speed", value: `${trim(vImpact)} m/s` },
                  { label: "Impact angle below horizontal", value: `${trim(impactAngle)}°` },
                ]
              : undefined
          }
        />
      </div>
      <p className="mt-2 text-xs text-ink-soft">
        Vacuum model. Air resistance is ignored, which is a good approximation for dense,
        slow objects and a poor one for light or fast ones.
      </p>
    </div>
  );
}

function Article() {
  return (
    <>
      <p>
        Projectile motion is two independent one-dimensional problems that share a clock.
        Horizontally nothing accelerates, so the velocity is constant. Vertically gravity
        pulls down at a constant rate. Once you separate them, everything else falls out of
        the kinematic equations.
      </p>
      <Formula>
        x = v₀ cos(θ) · t{"\n"}
        y = h₀ + v₀ sin(θ) · t − ½ g t²
      </Formula>

      <h2>The four results people usually want</h2>
      <p>
        <strong>Time of flight.</strong> Set y = 0 and solve the quadratic. Launching from
        ground level it simplifies to t = 2 v₀ sin(θ) / g. From a height it does not, which
        is why the calculator above solves the full form.
      </p>
      <p>
        <strong>Maximum height.</strong> The vertical velocity is zero at the apex, so
        h_max = h₀ + (v₀ sin θ)² / (2g).
      </p>
      <p>
        <strong>Range.</strong> Multiply the horizontal velocity by the total time. From
        ground level this gives the familiar R = v₀² sin(2θ) / g.
      </p>
      <p>
        <strong>Impact velocity.</strong> The horizontal component never changed. The
        vertical one is v_y − g t. Combine them with Pythagoras.
      </p>

      <h2>Why 45 degrees is the optimum, and when it is not</h2>
      <p>
        From flat ground and ignoring air, the range term sin(2θ) peaks when 2θ = 90°, so
        θ = 45°. Two useful consequences: complementary angles give the same range — 30°
        and 60° land in the same place — and the shallow one arrives sooner and flatter.
      </p>
      <p>
        Launch from a height and the symmetry breaks. The projectile spends extra time
        falling past the launch level, and that extra time is worth more if it is being
        spent moving horizontally. The optimum drops below 45°, approaching zero as the
        launch height dominates. Throwing a ball off a cliff, you want a flat throw.
      </p>

      <h2>What this model leaves out</h2>
      <ul>
        <li>
          <strong>Air resistance.</strong> Drag scales roughly with the square of speed. For
          a golf ball or a bullet the real range is a fraction of the vacuum prediction, and
          the trajectory becomes asymmetric — steeper on the way down than on the way up.
        </li>
        <li>
          <strong>Lift and spin.</strong> A spinning ball generates sideways force through
          the Magnus effect, which is the entire basis of a curveball.
        </li>
        <li>
          <strong>Variation in g.</strong> Constant gravity is fine over a few kilometres and
          wrong for ballistic missiles or orbits.
        </li>
        <li>
          <strong>Earth&rsquo;s rotation.</strong> The Coriolis deflection is negligible for a
          thrown object and significant for long-range artillery.
        </li>
      </ul>

      <h2>Gravity elsewhere</h2>
      <table>
        <thead><tr><th>Body</th><th>g (m/s²)</th><th>Range of a 20 m/s, 45° throw</th></tr></thead>
        <tbody>
          <tr><td>Earth</td><td>9.81</td><td>40.8 m</td></tr>
          <tr><td>Moon</td><td>1.62</td><td>246.9 m</td></tr>
          <tr><td>Mars</td><td>3.72</td><td>107.5 m</td></tr>
          <tr><td>Jupiter</td><td>24.79</td><td>16.1 m</td></tr>
        </tbody>
      </table>
    </>
  );
}

const tool: Tool = {
  slug: "projectile-motion",
  category: "physics",
  group: "Mechanics",
  title: "Projectile motion calculator",
  label: "Projectile motion",
  description:
    "Compute range, time of flight, apex height and impact velocity for a projectile launched at any angle, from any height, under any gravity.",
  keywords: ["projectile motion", "range", "trajectory", "kinematics", "launch angle"],
  Calculator,
  Article,
};

export default tool;
