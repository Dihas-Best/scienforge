import Link from "next/link";
import { CATEGORIES } from "@/lib/types";

export default function SiteHeader() {
  return (
    <header className="border-b border-rule bg-panel">
      <div className="mx-auto flex max-w-6xl flex-wrap items-baseline gap-x-6 gap-y-2 px-5 py-3">
        <Link
          href="/"
          className="font-mono text-lg font-semibold tracking-tight text-ink no-underline hover:no-underline"
        >
          Scien<span className="text-plotter">Forge</span>
        </Link>
        <nav className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`/tools/${c.id}`}
              className="text-ink-soft no-underline hover:text-plotter"
            >
              {c.name}
            </Link>
          ))}
          <Link href="/tools" className="text-ink-soft no-underline hover:text-plotter">
            All tools
          </Link>
        </nav>
      </div>
    </header>
  );
}
