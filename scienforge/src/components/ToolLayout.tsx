"use client";

import Link from "next/link";
import AdSlot from "./AdSlot";
import { categoryById } from "@/lib/types";
import type { ToolMeta } from "@/lib/types";
import { metaBySlug } from "@/lib/manifest";
import { componentsFor } from "@/lib/registry";
import { toolHref } from "@/lib/nav";

export default function ToolLayout({ meta }: { meta: ToolMeta }) {
  const category = categoryById(meta.category);
  const parts = componentsFor(meta.slug);
  const related = (meta.related ?? [])
    .map(metaBySlug)
    .filter(Boolean) as ToolMeta[];

  if (!parts) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16">
        <h1 className="text-xl font-semibold">This calculator is not wired up yet</h1>
        <p className="mt-2 text-ink-soft">
          Its entry exists in the manifest but it is missing from the registry. Add it to
          the TOOLS array in <span className="font-mono">src/lib/registry.ts</span>.
        </p>
      </div>
    );
  }

  const { Calculator, Article } = parts;

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <nav className="mb-5 font-mono text-xs text-ink-soft">
        <Link href="/tools" className="no-underline hover:text-plotter">tools</Link>
        <span className="px-1.5">/</span>
        <Link href={`/tools/${meta.category}`} className="no-underline hover:text-plotter">
          {meta.category}
        </Link>
      </nav>

      <h1 className="max-w-3xl text-2xl font-semibold tracking-tight sm:text-3xl">
        {meta.title}
      </h1>
      <p className="mt-2 max-w-2xl text-ink-soft">{meta.description}</p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <div className="panel p-5">
            <Calculator />
          </div>

          <AdSlot slot="0000000001" />

          <article className="prose-sf mt-8">
            <Article />
          </article>

          <AdSlot slot="0000000002" />

          {related.length > 0 && (
            <section className="mt-10 border-t border-rule pt-5">
              <h2 className="mb-3 text-base font-semibold">Related calculators</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={toolHref(r)} className="text-sm">{r.title}</Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-6">
            <p className="mb-2 text-sm text-ink-soft">{category?.blurb}</p>
            <Link href={`/tools/${meta.category}`} className="text-sm">
              All {category?.name.toLowerCase()} tools
            </Link>
            <AdSlot slot="0000000003" />
          </div>
        </aside>
      </div>
    </div>
  );
}
