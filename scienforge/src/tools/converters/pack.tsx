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
      <p>
        A number base — also called a radix — is simply how many distinct digits a
        counting system uses before it rolls over into an extra column. Decimal uses ten
        digits (0 through 9), binary uses two (0 and 1), hexadecimal uses sixteen (0
        through 9, then A through F to represent 10 through 15). The underlying quantity
        being represented never changes between bases — 255 in decimal, 11111111 in
        binary and FF in hexadecimal all describe the identical amount. Only the notation
        used to write that amount changes.
      </p>
      <Formula>value = Σ digitᵢ × base^i</Formula>
      <p>
        Applying this directly: the binary number 1011 equals 1×2³ + 0×2² + 1×2¹ + 1×2⁰ =
        8 + 0 + 2 + 1 = 11 in decimal. The hexadecimal number FF equals 15×16¹ + 15×16⁰ =
        240 + 15 = 255. Every positional number system, regardless of base, works by this
        same rule — each digit&rsquo;s value is multiplied by the base raised to the
        power of its position, counting from zero at the rightmost digit.
      </p>

      <h2>Why hexadecimal became the standard for representing binary data</h2>
      <p>
        Sixteen is a power of two (2⁴), which creates an extremely convenient exact
        relationship: each single hexadecimal digit corresponds to exactly four binary
        bits, with no rounding, remainder, or arithmetic conversion required. This means
        a full byte (8 bits) is always representable as exactly two hex digits — 11111111
        in binary is simply FF in hex, with each hex digit covering one nibble (half a
        byte) precisely. This clean correspondence is why memory addresses, colour codes
        in web design and graphics (#FF5733, for instance), MAC addresses, and CPU
        register values are almost universally displayed in hexadecimal rather than raw
        binary — hex is dramatically more compact and human-readable while still mapping
        losslessly and directly onto the underlying binary representation the hardware
        actually uses.
      </p>
      <p>
        Octal exists for a related but narrower reason: three binary bits map exactly
        onto one octal digit, and this happens to align neatly with the traditional
        three-bit read-write-execute permission grouping used in Unix and Linux file
        permissions — which is why a command like <span className="font-mono">chmod
        755</span> still uses octal notation today, decades after octal fell out of
        general use elsewhere in computing.
      </p>

      <h2>Prefixes that tell a computer which base you mean</h2>
      <p>
        Because a bare string of digits like &ldquo;10&rdquo; is ambiguous without
        context (it means completely different quantities in different bases), most
        programming languages use a standard prefix to disambiguate:
        <span className="font-mono"> 0b</span> for binary,
        <span className="font-mono"> 0o</span> for octal, and
        <span className="font-mono"> 0x</span> for hexadecimal. A genuinely tricky
        historical gotcha: in C and many languages derived from it, a plain leading zero
        with no letter — <span className="font-mono">010</span> — is interpreted as
        octal, not decimal, meaning it actually equals eight, not ten. This has been a
        long-running, well-documented source of subtle bugs whenever a programmer
        zero-pads a decimal number for formatting purposes without realising the leading
        zero changes its meaning entirely.
      </p>

      <h2>Bit width — the practical limit every embedded developer hits eventually</h2>
      <p>
        A register or variable with a fixed bit width can only hold a limited range of
        values before it wraps around. An unsigned 8-bit register holds values from 0 to
        255; a signed 8-bit register using the standard two&rsquo;s complement
        representation holds −128 to 127 instead, trading half the positive range for the
        ability to represent negative numbers. Writing a value of 256 into an 8-bit
        register does not produce an error in most low-level contexts — it silently wraps
        around to 0, since only the lowest 8 bits of the value are actually stored. This
        specific failure mode, called integer overflow, is a genuine and recurring source
        of bugs in embedded systems and older software, and checking how many bits a
        value actually needs — which is exactly what this calculator&rsquo;s bit-width
        row shows — is a routine early step before choosing an appropriately sized
        variable type in low-level programming.
      </p>
    </>
  ),
});
