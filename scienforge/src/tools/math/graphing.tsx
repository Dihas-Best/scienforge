"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { compile, FUNCTION_NAMES } from "@/lib/expr";
import { trim } from "@/lib/format";
import type { Tool } from "@/lib/types";

const COLOURS = ["#1540c4", "#b3261e", "#1b7a3e", "#8a4bd3"];

function Calculator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [exprs, setExprs] = useState<string[]>(["sin(x)", "x^2/8", "", ""]);
  const [xMin, setXMin] = useState("-10");
  const [xMax, setXMax] = useState("10");
  const [yMin, setYMin] = useState("-5");
  const [yMax, setYMax] = useState("5");

  const compiled = useMemo(
    () =>
      exprs.map((src) => {
        if (!src.trim()) return { fn: null as null | ((x: number) => number), error: "" };
        try {
          return { fn: compile(src), error: "" };
        } catch (e) {
          return { fn: null, error: e instanceof Error ? e.message : "Invalid expression" };
        }
      }),
    [exprs]
  );

  const bounds = useMemo(() => {
    const x0 = Number(xMin), x1 = Number(xMax), y0 = Number(yMin), y1 = Number(yMax);
    if (![x0, x1, y0, y1].every(Number.isFinite) || x1 <= x0 || y1 <= y0) return null;
    return { x0, x1, y0, y1 };
  }, [xMin, xMax, yMin, yMax]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !bounds) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const { x0, x1, y0, y1 } = bounds;
    const px = (x: number) => ((x - x0) / (x1 - x0)) * w;
    const py = (y: number) => h - ((y - y0) / (y1 - y0)) * h;

    const step = (span: number) => {
      const raw = span / 10;
      const mag = 10 ** Math.floor(Math.log10(raw));
      const n = raw / mag;
      return (n < 1.5 ? 1 : n < 3.5 ? 2 : n < 7.5 ? 5 : 10) * mag;
    };

    // grid
    ctx.strokeStyle = "#e2e7e0";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#5a6960";
    ctx.font = "11px ui-monospace, monospace";
    const sx = step(x1 - x0), sy = step(y1 - y0);
    for (let x = Math.ceil(x0 / sx) * sx; x <= x1; x += sx) {
      ctx.beginPath(); ctx.moveTo(px(x), 0); ctx.lineTo(px(x), h); ctx.stroke();
      if (Math.abs(x) > sx / 2) ctx.fillText(trim(x, 4), px(x) + 3, py(0) + 13);
    }
    for (let y = Math.ceil(y0 / sy) * sy; y <= y1; y += sy) {
      ctx.beginPath(); ctx.moveTo(0, py(y)); ctx.lineTo(w, py(y)); ctx.stroke();
      if (Math.abs(y) > sy / 2) ctx.fillText(trim(y, 4), px(0) + 4, py(y) - 3);
    }

    // axes
    ctx.strokeStyle = "#16201c";
    ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(0, py(0)); ctx.lineTo(w, py(0));
    ctx.moveTo(px(0), 0); ctx.lineTo(px(0), h); ctx.stroke();

    // curves
    compiled.forEach((c, idx) => {
      if (!c.fn) return;
      ctx.strokeStyle = COLOURS[idx % COLOURS.length];
      ctx.lineWidth = 2;
      ctx.beginPath();
      let pen = false;
      for (let i = 0; i <= w; i++) {
        const x = x0 + ((x1 - x0) * i) / w;
        let y: number;
        try { y = c.fn(x); } catch { y = NaN; }
        if (!Number.isFinite(y) || y < y0 - (y1 - y0) * 4 || y > y1 + (y1 - y0) * 4) {
          pen = false;
          continue;
        }
        const Y = py(y);
        if (!pen) { ctx.moveTo(i, Y); pen = true; } else { ctx.lineTo(i, Y); }
      }
      ctx.stroke();
    });
  }, [compiled, bounds]);

  const zoom = (factor: number) => {
    if (!bounds) return;
    const cx = (bounds.x0 + bounds.x1) / 2, cy = (bounds.y0 + bounds.y1) / 2;
    const hw = ((bounds.x1 - bounds.x0) / 2) * factor;
    const hh = ((bounds.y1 - bounds.y0) / 2) * factor;
    setXMin(trim(cx - hw, 6)); setXMax(trim(cx + hw, 6));
    setYMin(trim(cy - hh, 6)); setYMax(trim(cy + hh, 6));
  };

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {exprs.map((e, i) => (
          <div key={i}>
            <label className="field-label" htmlFor={`gr-${i}`}>
              <span
                aria-hidden
                className="mr-2 inline-block h-2.5 w-2.5 rounded-full align-middle"
                style={{ background: COLOURS[i] }}
              />
              y{i + 1} =
            </label>
            <input
              id={`gr-${i}`}
              className="field-input"
              value={e}
              placeholder={i === 0 ? "sin(x)" : "leave blank to skip"}
              aria-invalid={Boolean(compiled[i].error) || undefined}
              onChange={(ev) =>
                setExprs((prev) => prev.map((p, j) => (j === i ? ev.target.value : p)))
              }
            />
            {compiled[i].error ? (
              <p className="mt-1 text-xs text-[#b3261e]">{compiled[i].error}</p>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-[2px] border border-rule bg-panel">
        <canvas ref={canvasRef} className="block h-[380px] w-full" />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-4">
        {([["x min", xMin, setXMin], ["x max", xMax, setXMax],
           ["y min", yMin, setYMin], ["y max", yMax, setYMax]] as const).map(([l, v, s]) => (
          <div key={l}>
            <label className="field-label" htmlFor={`b-${l}`}>{l}</label>
            <input id={`b-${l}`} className="field-input" inputMode="decimal"
              value={v} onChange={(ev) => s(ev.target.value)} />
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={() => zoom(0.5)} className="rounded-[2px] border border-rule bg-panel px-3 py-1.5 text-sm hover:border-plotter">Zoom in</button>
        <button onClick={() => zoom(2)} className="rounded-[2px] border border-rule bg-panel px-3 py-1.5 text-sm hover:border-plotter">Zoom out</button>
        <button
          onClick={() => { setXMin("-10"); setXMax("10"); setYMin("-5"); setYMax("5"); }}
          className="rounded-[2px] border border-rule bg-panel px-3 py-1.5 text-sm hover:border-plotter"
        >
          Reset view
        </button>
      </div>

      <p className="mt-3 text-xs text-ink-soft">
        Available functions: {FUNCTION_NAMES.join(", ")}. Constants: pi, e, tau. Implicit
        multiplication works, so <span className="font-mono">2x</span> and{" "}
        <span className="font-mono">3sin(x)</span> both parse.
      </p>
    </div>
  );
}

function Article() {
  return (
    <>
      <p>
        This plotter evaluates each expression at one point per horizontal pixel and joins
        the results. Expressions are parsed into reverse Polish notation and evaluated on a
        stack, so nothing is passed to the browser&rsquo;s JavaScript engine — a malformed
        entry produces an error message rather than executing anything.
      </p>
      <h2>Writing expressions</h2>
      <ul>
        <li>Operators: <span className="font-mono">+ − * / ^ %</span>, with <span className="font-mono">^</span> right-associative so <span className="font-mono">2^3^2</span> is 512.</li>
        <li>Implicit multiplication is supported: <span className="font-mono">2x</span>, <span className="font-mono">3(x+1)</span> and <span className="font-mono">x sin(x)</span> all work.</li>
        <li>Trigonometric functions take radians. For degrees, write <span className="font-mono">sin(x*pi/180)</span>.</li>
        <li>Unary minus is handled, so <span className="font-mono">-x^2</span> parses as −(x²).</li>
      </ul>
      <h2>Reading a graph critically</h2>
      <p>
        Sampling one point per pixel means fast-oscillating functions alias badly. Plot
        <span className="font-mono"> sin(100x)</span> across a wide range and the shape you see
        is an artefact of the sampling rate, not the function. Zoom in until the oscillation
        is resolved before trusting what is drawn.
      </p>
      <p>
        Vertical asymptotes are another trap. At a discontinuity like <span className="font-mono">1/x</span>
        or <span className="font-mono">tan(x)</span> the value jumps between large positive and
        large negative, and a naive plotter draws a near-vertical line joining them. This one
        lifts the pen when a value leaves the visible range by a large margin, which suppresses
        most of those false lines but not all of them.
      </p>
      <h2>What to look for</h2>
      <ul>
        <li><strong>Roots</strong> are where the curve crosses the x-axis.</li>
        <li><strong>Turning points</strong> are where it changes direction — the maxima and minima you would find by setting the derivative to zero.</li>
        <li><strong>Asymptotes</strong> are lines the curve approaches without reaching, revealing the behaviour at extremes.</li>
        <li><strong>Intersections</strong> between two plotted functions are the solutions to the equation formed by setting them equal.</li>
      </ul>
      <p>
        That last point is worth using deliberately. Plotting the left and right sides of a
        difficult equation separately and reading off where they cross often gives a usable
        answer faster than solving algebraically, and it always tells you how many solutions
        exist.
      </p>
    </>
  );
}

const tool: Tool = {
  slug: "graphing-calculator",
  category: "math",
  group: "Algebra",
  title: "Graphing calculator",
  label: "Graphing calculator",
  description:
    "Plot up to four functions of x on the same axes, with adjustable range, zoom, and support for trigonometric, logarithmic and exponential functions.",
  keywords: ["graphing calculator", "function plotter", "graph", "plot", "y=f(x)"],
  related: ["quadratic-equation", "logarithm"],
  Calculator,
  Article,
};

export default tool;
