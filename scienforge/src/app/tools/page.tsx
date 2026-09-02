import type { Metadata } from "next";
import { MANIFEST, SEARCH_INDEX } from "@/lib/manifest";
import { CATEGORIES } from "@/lib/types";
import ToolSearch from "@/components/ToolSearch";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "All calculators",
  description:
    "The complete index of ScienForge calculators across electronics, physics, chemistry, mathematics, converters, health and finance.",
  alternates: { canonical: "/tools" },
};

const categoryNames = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.name]));

export default function ToolsIndex() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        All calculators
      </h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        All {MANIFEST.length} tools. Type to filter by name, subject or the quantity you
        are solving for.
      </p>

      <div className="mt-7">
        <ToolSearch entries={SEARCH_INDEX} categoryNames={categoryNames} />
      </div>

      <AdSlot slot="0000000011" />
    </div>
  );
}
