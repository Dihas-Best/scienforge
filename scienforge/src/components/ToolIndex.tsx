import Link from "next/link";
import { toolHref } from "@/lib/nav";
import type { Category, ToolMeta } from "@/lib/types";

/** Dense, grouped list of tools — the handbook-index layout. */
export default function ToolIndex({
  category, tools,
}: { category: Category; tools: ToolMeta[] }) {
  const groups = category.groups.filter((g) => tools.some((t) => t.group === g));
  const ungrouped = tools.filter((t) => !category.groups.includes(t.group));
  const sections = [...groups, ...(ungrouped.length ? ["Other"] : [])];

  return (
    <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
      {sections.map((g) => {
        const items = g === "Other" ? ungrouped : tools.filter((t) => t.group === g);
        return (
          <section key={g}>
            <h3 className="mb-2 border-b border-rule pb-1 text-sm font-semibold">{g}</h3>
            <ul className="space-y-1.5">
              {items.map((t) => (
                <li key={t.slug}>
                  <Link href={toolHref(t)} className="text-[0.95rem]">{t.label}</Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
