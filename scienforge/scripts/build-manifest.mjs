/**
 * Generates src/lib/manifest.ts from the tool source files.
 *
 * Next.js does not let a server component read plain values out of a module
 * marked "use client" — every export becomes an opaque client reference. The
 * calculators need hooks, so their modules must be client modules; but routing,
 * <title>, sitemap and search all need the metadata on the server. This script
 * lifts that metadata into a plain server-safe file.
 *
 * Run `npm run manifest` after adding or renaming a tool.
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = "src/tools";

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".tsx") ? [p] : [];
  });
}

const FIELDS = ["category", "group", "title", "label", "description"];

function extract(src, file) {
  const out = [];
  const slugRe = /^\s*slug:\s*"([^"]+)",/gm;
  let m;
  while ((m = slugRe.exec(src))) {
    const slug = m[1];
    const rest = src.slice(m.index);
    const rec = { slug, file };
    for (const f of FIELDS) {
      const fm = new RegExp(`[\\s,{]${f}:\\s*"((?:[^"\\\\]|\\\\.)*)",`).exec(rest);
      if (!fm) throw new Error(`${file}: tool "${slug}" is missing "${f}"`);
      rec[f] = fm[1];
    }
    const kw = /[\s,{]keywords:\s*\[([^\]]*)\],/.exec(rest);
    if (!kw) throw new Error(`${file}: tool "${slug}" is missing "keywords"`);
    rec.keywords = kw[1].split(",").map((s) => s.trim().replace(/^"|"$/g, "")).filter(Boolean);
    const rel = /[\s,{]related:\s*\[([^\]]*)\],/.exec(rest);
    rec.related = rel
      ? rel[1].split(",").map((s) => s.trim().replace(/^"|"$/g, "")).filter(Boolean)
      : [];
    out.push(rec);
  }
  return out;
}

const records = walk(ROOT).flatMap((f) => extract(readFileSync(f, "utf8"), f));

const seen = new Set();
for (const r of records) {
  const key = `${r.category}/${r.slug}`;
  if (seen.has(key)) throw new Error(`Duplicate tool route: ${key}`);
  seen.add(key);
}

const body = `// GENERATED FILE — do not edit by hand.
// Run \`npm run manifest\` to regenerate from src/tools.
import type { ToolMeta } from "./types";

export const MANIFEST: ToolMeta[] = ${JSON.stringify(
  records.map(({ file, ...r }) => r),
  null,
  2
)};

export function metaFor(category: string, slug: string): ToolMeta | undefined {
  return MANIFEST.find((t) => t.category === category && t.slug === slug);
}

export function metaBySlug(slug: string): ToolMeta | undefined {
  return MANIFEST.find((t) => t.slug === slug);
}

export function metaByCategory(category: string): ToolMeta[] {
  return MANIFEST.filter((t) => t.category === category);
}

export const SEARCH_INDEX = MANIFEST.map((t) => ({
  slug: t.slug,
  category: t.category,
  title: t.title,
  label: t.label,
  terms: [t.title, t.label, t.group, ...t.keywords].join(" ").toLowerCase(),
}));
`;

writeFileSync("src/lib/manifest.ts", body);
console.log(`manifest: ${records.length} tools written to src/lib/manifest.ts`);
