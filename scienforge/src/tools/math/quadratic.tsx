"use client";

import { useState } from "react";
import Field from "@/components/Field";
import Readout from "@/components/Readout";
import Formula from "@/components/Formula";
import { parseEng, trim } from "@/lib/format";
import type { Tool } from "@/lib/types";

function Calculator() {
  const [a, setA] = useState("1");
  const [b, setB] = useState("-3");
  const [c, setC] = useState("2");

  const A = parseEng(a), B = parseEng(b), C = parseEng(c);
  const valid = [A, B, C].every(Number.isFinite) && A !== 0;

  const disc = valid ? B * B - 4 * A * C : NaN;
  let roots = "";
  let nature = "";

  if (valid) {
    if (disc > 0) {
      const sq = Math.sqrt(disc);
      const r1 = (-B + sq) / (2 * A);
      const r2 = (-B - sq) / (2 * A);
      roots = `x = ${trim(r1, 6)}  and  x = ${trim(r2, 6)}`;
      nature = "Two distinct real roots";
    } else if (disc === 0) {
      roots = `x = ${trim(-B / (2 * A), 6)}`;
      nature = "One repeated real root";
    } else {
      const re = -B / (2 * A);
      const im = Math.sqrt(-disc) / (2 * A);
      roots = `x = ${trim(re, 6)} ± ${trim(Math.abs(im), 6)}i`;
      nature = "Two complex conjugate roots";
    }
  }

  const vx = valid ? -B / (2 * A) : NaN;
  const vy = valid ? A * vx * vx + B * vx + C : NaN;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="a (coefficient of x²)" value={a} onChange={setA} invalid={A === 0} />
        <Field label="b (coefficient of x)" value={b} onChange={setB} />
        <Field label="c (constant)" value={c} onChange={setC} />
      </div>
      <p className="mt-2 font-mono text-xs text-ink-soft">
        Solving {trim(A) || "a"}x² + {trim(B) || "b"}x + {trim(C) || "c"} = 0
      </p>

      <div className="mt-5">
        <Readout
          name={valid ? nature : "Waiting for input"}
          value={valid ? roots : A === 0 ? "a cannot be zero — that is a linear equation" : "Enter a, b and c"}
          rows={
            valid
              ? [
                  { label: "Discriminant b² − 4ac", value: trim(disc, 6) },
                  { label: "Vertex", value: `(${trim(vx, 5)}, ${trim(vy, 5)})` },
                  { label: "Axis of symmetry", value: `x = ${trim(vx, 5)}` },
                  { label: "Sum of roots", value: trim(-B / A, 6) },
                  { label: "Product of roots", value: trim(C / A, 6) },
                  { label: "Opens", value: A > 0 ? "upward" : "downward" },
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
        Any equation of the form ax² + bx + c = 0, with a ≠ 0, is solved by the quadratic
        formula. It is derived by completing the square on the general form, so it works
        for every case rather than only the ones that factorise cleanly.
      </p>
      <Formula>x = ( −b ± √(b² − 4ac) ) / 2a</Formula>

      <h2>The discriminant tells you the answer before you compute it</h2>
      <p>
        The expression under the square root, Δ = b² − 4ac, decides the character of the
        solution:
      </p>
      <ul>
        <li><strong>Δ &gt; 0</strong> — two distinct real roots. The parabola crosses the x-axis twice.</li>
        <li><strong>Δ = 0</strong> — one repeated root. The parabola touches the axis at its vertex.</li>
        <li><strong>Δ &lt; 0</strong> — two complex conjugate roots. The parabola never crosses the axis.</li>
      </ul>
      <p>
        If a, b and c are integers and Δ is a perfect square, the roots are rational and the
        expression factorises over the integers. That is a fast way to check whether
        factoring is worth attempting.
      </p>

      <h2>Vieta&rsquo;s relations</h2>
      <p>
        The roots are tied to the coefficients directly, without solving:
      </p>
      <Formula>x₁ + x₂ = −b / a&nbsp;&nbsp;&nbsp;x₁ · x₂ = c / a</Formula>
      <p>
        These are useful both as a check on your arithmetic and as a shortcut in
        competition problems where you need a symmetric function of the roots but not the
        roots themselves.
      </p>

      <h2>The vertex</h2>
      <p>
        The parabola is symmetric about x = −b / 2a, which is the average of the two roots.
        Substituting back gives the vertex height. If a is positive the parabola opens
        upward and the vertex is a minimum; if a is negative it opens downward and the
        vertex is a maximum. This is the standard route to optimisation problems in
        introductory calculus courses, before derivatives are available.
      </p>

      <h2>A numerical trap worth knowing</h2>
      <p>
        When b² is much larger than 4ac, one of the two roots is computed as the difference
        of two nearly equal numbers, and floating-point precision collapses. The stable
        approach is to compute the well-conditioned root first:
      </p>
      <Formula>q = −½ ( b + sign(b)·√(b² − 4ac) )&nbsp;&nbsp;then&nbsp;&nbsp;x₁ = q/a, x₂ = c/q</Formula>
      <p>
        This matters in physics simulations and ray tracers, where a quadratic is solved
        millions of times with wildly different coefficient magnitudes.
      </p>

      <h2>Where quadratics turn up</h2>
      <ul>
        <li>Projectile height as a function of time, which is why time of flight is a quadratic solve.</li>
        <li>Ray–sphere intersection in graphics: the discriminant tells you whether the ray hits.</li>
        <li>Equilibrium concentrations in chemistry, where an ICE table produces a quadratic in x.</li>
        <li>The characteristic equation of a second-order circuit or a mass–spring–damper system, where the discriminant separates overdamped, critically damped and underdamped behaviour.</li>
      </ul>
    </>
  );
}

const tool: Tool = {
  slug: "quadratic-equation",
  category: "math",
  group: "Algebra",
  title: "Quadratic equation solver",
  label: "Quadratic solver",
  description:
    "Solve ax² + bx + c = 0 with real or complex roots, and see the discriminant, vertex, axis of symmetry and Vieta's relations.",
  keywords: ["quadratic", "roots", "discriminant", "vertex", "parabola", "solver"],
  Calculator,
  Article,
};

export default tool;
