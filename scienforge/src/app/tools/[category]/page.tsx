import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, categoryById } from "@/lib/types";
import { metaByCategory } from "@/lib/manifest";
import ToolIndex from "@/components/ToolIndex";
import AdSlot from "@/components/AdSlot";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const c = categoryById(category);
  if (!c) return {};
  return {
    title: `${c.name} calculators`,
    description: c.blurb,
    alternates: { canonical: `/tools/${c.id}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const c = categoryById(category);
  if (!c) notFound();

  const tools = metaByCategory(c.id);
  const others = CATEGORIES.filter((x) => x.id !== c.id);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <nav className="mb-4 font-mono text-xs text-ink-soft">
        <Link href="/tools" className="no-underline hover:text-plotter">tools</Link>
        <span className="px-1.5">/</span>
        <span>{c.id}</span>
      </nav>

      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {c.name} calculators
      </h1>
      <p className="mt-2 max-w-2xl text-ink-soft">{c.blurb}</p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="min-w-0">
          <ToolIndex category={c} tools={tools} />
          <AdSlot slot="0000000012" />
        </div>

        <aside>
          <h2 className="mb-2 border-b border-rule pb-1 text-sm font-semibold">
            Other subjects
          </h2>
          <ul className="space-y-1.5">
            {others.map((o) => (
              <li key={o.id}>
                <Link href={`/tools/${o.id}`} className="text-[0.95rem]">
                  {o.name}
                </Link>
              </li>
            ))}
          </ul>
          <AdSlot slot="0000000013" />
        </aside>
      </div>
    </div>
  );
}
