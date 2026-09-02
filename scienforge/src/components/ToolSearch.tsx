"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SEARCH_INDEX } from "@/lib/manifest";
import { CATEGORIES } from "@/lib/types";

export type SearchEntry = {
  slug: string;
  category: string;
  title: string;
  label: string;
  terms: string;
};

const DEFAULT_NAMES: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.name])
);

/**
 * Live filter over the tool manifest.
 *
 * `entries` and `categoryNames` are optional: left out, the component reads the
 * generated manifest itself. Passing them in is still supported so the component
 * can be reused for a filtered subset.
 */
export default function ToolSearch({
  entries = SEARCH_INDEX,
  categoryNames = DEFAULT_NAMES,
  placeholder = "resistor, projectile, molarity…",
  autoFocus = false,
}: {
  entries?: SearchEntry[];
  categoryNames?: Record<string, string>;
  placeholder?: string;
  autoFocus?: boolean;
} = {}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return entries;
    const words = term.split(/\s+/);
    return entries.filter((e) => words.every((w) => e.terms.includes(w)));
  }, [q, entries]);

  const grouped = useMemo(() => {
    const map = new Map<string, SearchEntry[]>();
    for (const e of filtered) {
      const list = map.get(e.category) ?? [];
      list.push(e);
      map.set(e.category, list);
    }
    for (const list of map.values()) list.sort((a, b) => a.label.localeCompare(b.label));
    return [...map.entries()].sort((a, b) =>
      (categoryNames[a[0]] ?? a[0]).localeCompare(categoryNames[b[0]] ?? b[0])
    );
  }, [filtered, categoryNames]);

  return (
    <div>
      <label className="field-label" htmlFor="tool-search">
        Search {entries.length} calculators
      </label>
      <input
        id="tool-search"
        type="search"
        className="field-input max-w-md"
        placeholder={placeholder}
        value={q}
        autoFocus={autoFocus}
        onChange={(e) => setQ(e.target.value)}
        autoComplete="off"
      />

      {filtered.length === 0 ? (
        <p className="mt-8 text-ink-soft">
          Nothing matches &ldquo;{q}&rdquo;. Try a shorter word, or browse by subject
          below.
        </p>
      ) : (
        <div className="mt-7 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {grouped.map(([cat, items]) => (
            <section key={cat}>
              <h2 className="mb-2 border-b border-rule pb-1 text-sm font-semibold">
                {categoryNames[cat] ?? cat}
                <span className="ml-2 font-mono font-normal text-ink-soft">
                  {items.length}
                </span>
              </h2>
              <ul className="space-y-1.5">
                {items.map((e) => (
                  <li key={`${e.category}/${e.slug}`}>
                    <Link
                      href={`/tools/${e.category}/${e.slug}`}
                      className="text-[0.95rem]"
                    >
                      {e.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
