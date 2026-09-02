import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <h1 className="text-2xl font-semibold tracking-tight">
        That calculator does not exist
      </h1>
      <p className="mt-3 text-ink-soft">
        The address may have changed, or the tool has not been built yet.
      </p>
      <p className="mt-5">
        <Link href="/tools">Search the full index</Link>
      </p>
    </div>
  );
}
