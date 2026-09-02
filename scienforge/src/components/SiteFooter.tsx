import Link from "next/link";
import { SITE } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-rule bg-panel">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-ink-soft sm:flex-row sm:justify-between">
        <p className="max-w-sm">
          {SITE.name} is a reference tool. Check any result that matters against a
          second source before you build or submit anything with it.
        </p>
        <nav className="flex gap-5">
          <Link href="/about" className="no-underline hover:text-plotter">About</Link>
          <Link href="/privacy" className="no-underline hover:text-plotter">Privacy</Link>
          <Link href="/tools" className="no-underline hover:text-plotter">All tools</Link>
        </nav>
      </div>
    </footer>
  );
}
