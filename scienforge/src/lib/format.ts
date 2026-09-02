const SI_PREFIXES: [number, string][] = [
  [1e12, "T"],
  [1e9, "G"],
  [1e6, "M"],
  [1e3, "k"],
  [1, ""],
  [1e-3, "m"],
  [1e-6, "µ"],
  [1e-9, "n"],
  [1e-12, "p"],
];

/** 0.0047 F -> "4.7 mF". Keeps engineering notation readable. */
export function si(value: number, unit = "", digits = 4): string {
  if (!Number.isFinite(value)) return "—";
  if (value === 0) return `0 ${unit}`.trim();
  const abs = Math.abs(value);
  const entry = SI_PREFIXES.find(([f]) => abs >= f) ?? SI_PREFIXES[SI_PREFIXES.length - 1];
  const [factor, prefix] = entry;
  const scaled = value / factor;
  return `${trim(scaled, digits)} ${prefix}${unit}`.trim();
}

export function trim(value: number, digits = 4): string {
  if (!Number.isFinite(value)) return "—";
  const rounded = Number(value.toPrecision(digits));
  if (Math.abs(rounded) >= 1e6 || (Math.abs(rounded) < 1e-4 && rounded !== 0)) {
    return rounded.toExponential(digits - 1);
  }
  return String(rounded);
}

/** Parses "4k7", "2.2M", "1n5" and plain numbers. Returns NaN if unparseable. */
export function parseEng(input: string): number {
  const s = input.trim().replace(/\s+/g, "");
  if (s === "") return NaN;
  const plain = Number(s);
  if (Number.isFinite(plain)) return plain;

  const mult: Record<string, number> = {
    p: 1e-12, n: 1e-9, u: 1e-6, µ: 1e-6, m: 1e-3,
    k: 1e3, K: 1e3, M: 1e6, G: 1e9, T: 1e12,
  };
  const m = s.match(/^(-?\d*\.?\d*)([pnuµmkKMGT])(\d*)$/);
  if (!m) return NaN;
  const [, head, sym, tail] = m;
  const composed = tail ? `${head}.${tail}` : head;
  const n = Number(composed);
  return Number.isFinite(n) ? n * mult[sym] : NaN;
}
