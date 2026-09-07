"use client";

import { useMemo, useState } from "react";
import Field from "@/components/Field";
import Readout from "@/components/Readout";
import type { Tool, ToolMeta } from "./types";
import { parseEng } from "./format";

export type NumberInput = {
  kind?: "number";
  key: string;
  label: string;
  unit?: string;
  initial: string;
  hint?: string;
  /** Blank is allowed and yields NaN. Used by tools that solve for a missing value. */
  optional?: boolean;
  /**
   * Optional list of alternate units the person can enter this value in — e.g.
   * centimetres, inches, feet. `toBase` is the multiplier that converts one unit of
   * that option into the tool's canonical unit (the one `compute` expects). The
   * compute function always receives the value already converted to the base unit,
   * so adding units here never requires changing compute logic.
   */
  units?: { value: string; label: string; toBase: number }[];
  /** Which `units` entry is selected by default. Defaults to the first one listed. */
  defaultUnit?: string;
};

export type SelectInput = {
  kind: "select";
  key: string;
  label: string;
  initial: string;
  options: { value: string; label: string }[];
  hint?: string;
};

export type DateInput = {
  kind: "date";
  key: string;
  label: string;
  initial: string;
  hint?: string;
  optional?: boolean;
};

export type TimeInput = {
  kind: "time";
  key: string;
  label: string;
  initial: string;
  hint?: string;
  optional?: boolean;
};

export type ToolInput = NumberInput | SelectInput | DateInput | TimeInput;

export type Result = {
  /** Big headline number, already formatted with its unit. */
  name: string;
  value: string;
  rows?: { label: string; value: string }[];
  /** Optional caveat printed under the readout. */
  note?: string;
};

export type ComputeArgs = {
  n: Record<string, number>;
  s: Record<string, string>;
};

type Spec = ToolMeta & {
  inputs: ToolInput[];
  /** Return null when the inputs are not yet usable. */
  compute: (args: ComputeArgs) => Result | null;
  Article: React.ComponentType;
  /** Grid columns on wide screens. Defaults to 4. */
  columns?: 2 | 3 | 4;
};

/**
 * Turns a declarative spec into a full Tool. Every formula-style calculator on the
 * site is built this way, so adding one means writing a compute function and some
 * prose — not another page component.
 */
export function makeTool(spec: Spec): Tool {
  const {
    inputs, compute, Article, columns = 4,
    ...meta
  } = spec;

  function Calculator() {
    const [values, setValues] = useState<Record<string, string>>(() =>
      Object.fromEntries(inputs.map((i) => [i.key, i.initial]))
    );
    const [unitChoice, setUnitChoice] = useState<Record<string, string>>(() =>
      Object.fromEntries(
        inputs
          .filter((i): i is NumberInput => i.kind !== "select" && i.kind !== "date" && i.kind !== "time" && !!(i as NumberInput).units?.length)
          .map((i) => [i.key, i.defaultUnit ?? i.units![0].value])
      )
    );

    const set = (key: string) => (v: string) =>
      setValues((prev) => ({ ...prev, [key]: v }));
    const setUnit = (key: string) => (v: string) =>
      setUnitChoice((prev) => ({ ...prev, [key]: v }));

    const result = useMemo(() => {
      const n: Record<string, number> = {};
      const s: Record<string, string> = {};
      for (const i of inputs) {
        s[i.key] = values[i.key] ?? "";
        if (i.kind !== "select" && i.kind !== "date" && i.kind !== "time") {
          const raw = parseEng(values[i.key] ?? "");
          const unitsList = (i as NumberInput).units;
          if (unitsList?.length) {
            const chosen = unitsList.find((u) => u.value === unitChoice[i.key]) ?? unitsList[0];
            n[i.key] = raw * chosen.toBase;
          } else {
            n[i.key] = raw;
          }
        }
      }
      try {
        return compute({ n, s });
      } catch {
        return null;
      }
    }, [values, unitChoice]);

    const colClass =
      columns === 2 ? "lg:grid-cols-2" : columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4";

    return (
      <div>
        <div className={`grid gap-4 sm:grid-cols-2 ${colClass}`}>
          {inputs.map((input) =>
            input.kind === "time" ? (
              <div key={input.key}>
                <label className="field-label" htmlFor={`f-${input.key}`}>
                  {input.label}
                </label>
                <input
                  id={`f-${input.key}`}
                  type="time"
                  className="field-input"
                  value={values[input.key]}
                  onChange={(e) => set(input.key)(e.target.value)}
                />
                {input.hint ? (
                  <p className="mt-1 text-xs text-ink-soft">{input.hint}</p>
                ) : null}
              </div>
            ) : input.kind === "date" ? (
              <div key={input.key}>
                <label className="field-label" htmlFor={`f-${input.key}`}>
                  {input.label}
                </label>
                <input
                  id={`f-${input.key}`}
                  type="date"
                  className="field-input"
                  value={values[input.key]}
                  onChange={(e) => set(input.key)(e.target.value)}
                />
                {input.hint ? (
                  <p className="mt-1 text-xs text-ink-soft">{input.hint}</p>
                ) : null}
              </div>
            ) : input.kind === "select" ? (
              <div key={input.key}>
                <label className="field-label" htmlFor={`f-${input.key}`}>
                  {input.label}
                </label>
                <select
                  id={`f-${input.key}`}
                  className="field-input"
                  value={values[input.key]}
                  onChange={(e) => set(input.key)(e.target.value)}
                >
                  {input.options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                {input.hint ? (
                  <p className="mt-1 text-xs text-ink-soft">{input.hint}</p>
                ) : null}
              </div>
            ) : input.units?.length ? (
              <div key={input.key}>
                <label className="field-label" htmlFor={`f-${input.key}`}>
                  {input.label}
                </label>
                <div className="flex gap-1.5">
                  <input
                    id={`f-${input.key}`}
                    className="field-input flex-1"
                    inputMode="decimal"
                    value={values[input.key]}
                    aria-invalid={
                      (!input.optional &&
                        values[input.key] !== "" &&
                        !Number.isFinite(parseEng(values[input.key]))) || undefined
                    }
                    onChange={(e) => set(input.key)(e.target.value)}
                  />
                  <select
                    className="field-input shrink-0"
                    style={{ width: "7.5rem" }}
                    aria-label={`Unit for ${input.label}`}
                    value={unitChoice[input.key] ?? input.units[0].value}
                    onChange={(e) => setUnit(input.key)(e.target.value)}
                  >
                    {input.units.map((u) => (
                      <option key={u.value} value={u.value}>{u.label}</option>
                    ))}
                  </select>
                </div>
                {input.hint ? (
                  <p className="mt-1 text-xs text-ink-soft">{input.hint}</p>
                ) : null}
              </div>
            ) : (
              <Field
                key={input.key}
                label={input.label}
                unit={input.unit}
                hint={input.hint}
                value={values[input.key]}
                onChange={set(input.key)}
                invalid={
                  !input.optional &&
                  values[input.key] !== "" &&
                  !Number.isFinite(parseEng(values[input.key]))
                }
              />
            )
          )}
        </div>

        <div className="mt-5">
          <Readout
            name={result?.name ?? "Waiting for input"}
            value={result?.value ?? "Fill in the fields above"}
            rows={result?.rows}
          />
          {result?.note ? (
            <p className="mt-2 text-xs text-ink-soft">{result.note}</p>
          ) : null}
        </div>
      </div>
    );
  }

  return { ...meta, Calculator, Article };
}
