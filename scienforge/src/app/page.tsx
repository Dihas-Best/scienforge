import Link from "next/link";
import { MANIFEST, SEARCH_INDEX, metaByCategory } from "@/lib/manifest";
import { CATEGORIES } from "@/lib/types";
import ToolSearch from "@/components/ToolSearch";
import AdSlot from "@/components/AdSlot";

const categoryNames = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.name]));

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <section className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Work out the number, then understand it
        </h1>
        <p className="mt-3 text-lg text-ink-soft">
          {MANIFEST.length} calculators for electronics, physics, chemistry and
          mathematics. Every one shows the formula it used, a worked example, and where
          the model stops being a good description of reality.
        </p>
      </section>

      <div className="mt-8">
        <ToolSearch entries={SEARCH_INDEX} categoryNames={categoryNames} />
      </div>

      <AdSlot slot="0000000010" />

      <section className="mt-12 border-t border-rule pt-8">
        <h2 className="mb-5 text-lg font-semibold">Browse by subject</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => {
            const count = metaByCategory(c.id).length;
            return (
              <div key={c.id} className="panel p-5">
                <h3 className="text-base font-semibold">
                  <Link href={`/tools/${c.id}`} className="no-underline">
                    {c.name}
                  </Link>
                </h3>
                <p className="mt-1.5 text-sm text-ink-soft">{c.blurb}</p>
                <p className="mt-3 font-mono text-xs text-ink-soft">
                  {count} calculator{count === 1 ? "" : "s"}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
