"use client";

import { useId } from "react";

type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit?: string;
  placeholder?: string;
  invalid?: boolean;
  hint?: string;
};

export default function Field({
  label, value, onChange, unit, placeholder, invalid, hint,
}: Props) {
  const id = useId();
  return (
    <div>
      <label className="field-label" htmlFor={id}>
        {label}
        {unit ? <span className="text-ink-soft"> ({unit})</span> : null}
      </label>
      <input
        id={id}
        className="field-input"
        inputMode="decimal"
        value={value}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint ? <p className="mt-1 text-xs text-ink-soft">{hint}</p> : null}
    </div>
  );
}
