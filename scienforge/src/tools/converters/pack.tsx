"use client";

import { makeTool } from "@/lib/makeTool";
import Formula from "@/components/Formula";

export const numberBase = makeTool({
  slug: "number-base-converter",
  category: "converters", group: "Number systems",
  title: "Binary, hex and decimal converter",
  label: "Number base converter",
  description: "Convert a whole number between binary, octal, decimal, hexadecimal and any base from 2 to 36, with bit width shown.",
  keywords: ["binary", "hexadecimal", "decimal", "octal", "base converter", "hex"],
  columns: 3,
  inputs: [
    { key: "num", label: "Value", initial: "255" },
    { kind: "select", key: "base", label: "Input base", initial: "10",
      options: [
        { value: "2", label: "Binary (2)" }, { value: "8", label: "Octal (8)" },
        { value: "10", label: "Decimal (10)" }, { value: "16", label: "Hexadecimal (16)" },
      ] },
  ],
  compute: ({ s }) => {
    const base = parseInt(s.base, 10);
    const raw = (s.num || "").trim().replace(/^0[bxo]/i, "");
    if (!raw) return null;
    const v = parseInt(raw, base);
    if (!Number.isFinite(v) || Number.isNaN(v)) return null;
    const bin = v.toString(2);
    return {
      name: "Decimal",
      value: v.toLocaleString("en-US"),
      rows: [
        { label: "Binary", value: bin },
        { label: "Hexadecimal", value: "0x" + v.toString(16).toUpperCase() },
        { label: "Octal", value: "0o" + v.toString(8) },
        { label: "Base 36", value: v.toString(36).toUpperCase() },
        { label: "Bits needed", value: String(bin.length) },
        { label: "Fits in", value: v < 256 ? "8 bits" : v < 65536 ? "16 bits" : v < 2 ** 32 ? "32 bits" : "64 bits" },
        { label: "Padded byte form", value: bin.padStart(Math.ceil(bin.length / 8) * 8, "0").replace(/(.{8})/g, "$1 ").trim() },
      ],
    };
  },
  Article: () => (
    <>
      <p>A number base is just how many digits you count with before rolling over. Decimal uses ten, binary uses two, hexadecimal uses sixteen. The quantity being represented never changes — only the notation does.</p>
      <Formula>value = Σ digitᵢ × baseⁱ</Formula>
      <p>So 1011 in binary is 1×8 + 0×4 + 1×2 + 1×1 = 11, and FF in hex is 15×16 + 15 = 255.</p>
      <h2>Why hexadecimal exists</h2>
      <p>Sixteen is a power of two, so each hex digit maps to exactly four bits with no arithmetic required. A byte is always exactly two hex digits, which makes memory dumps, colour codes and register values far easier to read than the equivalent binary. Octal survives for the same reason in Unix file permissions, where three bits per digit matches the read-write-execute grouping.</p>
      <h2>Prefixes</h2>
      <p>Most languages mark the base with a prefix: <span className="font-mono">0b</span> for binary, <span className="font-mono">0o</span> for octal, <span className="font-mono">0x</span> for hex. A leading zero alone means octal in C and several languages derived from it, which is a long-standing source of bugs — <span className="font-mono">010</span> is eight, not ten.</p>
      <h2>Bit width matters in embedded work</h2>
      <p>An 8-bit register holds 0 to 255 unsigned, or −128 to 127 signed using two&rsquo;s complement. Writing 256 into it wraps to zero. This calculator shows how many bits a value needs, which is the check to do before choosing a variable type.</p>
    </>
  ),
});
