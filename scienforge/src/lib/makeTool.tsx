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
};

export type SelectInput = {
  kind: "select";
  key: string;
  label: string;
  initial: string;
  options: { value: string; label: string }[];
  hint?: string;
};

export type ToolInput = NumberInput | SelectInput;

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

    const set = (key: string) => (v: string) =>
      setValues((prev) => ({ ...prev, [key]: v }));

    const result = useMemo(() => {
      const n: Record<string, number> = {};
      const s: Record<string, string> = {};
      for (const i of inputs) {
        s[i.key] = values[i.key] ?? "";
        if (i.kind !== "select") n[i.key] = parseEng(values[i.key] ?? "");
      }
      try {
        return compute({ n, s });
      } catch {
        return null;
      }
    }, [values]);

    const colClass =
      columns === 2 ? "lg:grid-cols-2" : columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4";

    return (
      <div>
        <div className={`grid gap-4 sm:grid-cols-2 ${colClass}`}>
          {inputs.map((input) =>
            input.kind === "select" ? (
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
