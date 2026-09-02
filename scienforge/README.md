# ScienForge

A calculator hub in the spirit of Calculator.net: many small, focused tools, each on
its own indexable page with a written explanation underneath.

Built with Next.js 16 (App Router), TypeScript and Tailwind v4. Every tool page is
pre-rendered to static HTML at build time, which is what makes the site fast and what
makes it visible to search engines.

Currently **46 calculators** across seven categories.

---

## Deploying

1. Create an empty repository on GitHub.
2. Push this folder to it:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOURNAME/scienforge.git
   git push -u origin main
   ```
3. Go to vercel.com, "Add New Project", import the repository. Vercel detects Next.js
   on its own — leave every build setting at its default and deploy.
4. In the Vercel project, open **Settings → Domains** and add your domain. Vercel shows
   you the DNS records to create at your registrar: usually an `A` record for the apex
   pointing at `76.76.21.21`, and a `CNAME` for `www` pointing at `cname.vercel-dns.com`.
   Follow whatever Vercel actually shows you rather than these values, since they change.
5. DNS takes anywhere from ten minutes to a few hours. Vercel issues the HTTPS
   certificate automatically once it resolves.

Every `git push` to `main` redeploys. Pull requests get their own preview URLs.

---

## Adding a calculator

Most tools are declarative. Open the relevant `src/tools/<category>/pack.tsx` and add:

```tsx
export const myTool = makeTool({
  slug: "my-tool",              // becomes /tools/<category>/my-tool
  category: "electronics",
  group: "Circuit basics",      // must match a group in src/lib/types.ts
  title: "My tool calculator",  // the <h1> and <title>
  label: "My tool",             // short name for index lists
  description: "One sentence, 140-160 characters, used as the meta description.",
  keywords: ["search", "terms"],
  columns: 3,
  inputs: [
    { key: "a", label: "First value", unit: "V", initial: "5" },
    { kind: "select", key: "mode", label: "Mode", initial: "x",
      options: [{ value: "x", label: "X" }, { value: "y", label: "Y" }] },
  ],
  compute: ({ n, s }) => {
    if (!(n.a > 0)) return null;         // null means "not enough input yet"
    return {
      name: "Headline result",
      value: `${n.a * 2} V`,
      rows: [{ label: "Something else", value: "..." }],
    };
  },
  Article: () => (<><p>Explain the method here.</p></>),
});
```

Then:

1. Import it in `src/lib/registry.ts` and add it to the `TOOLS` array.
2. Run `npm run manifest`.

That is the whole process. Routing, the sitemap, the category index and site search all
read from the manifest, so nothing else needs touching.

For a tool that needs custom UI (the graphing calculator, the unit converter), write it
as its own file exporting a `Tool` object instead — `src/tools/math/graphing.tsx` is the
example to copy.

### Why there is a manifest step

Calculators use React hooks, so their modules are marked `"use client"`. Next.js does
not let a server component read plain values out of a client module — it only sees
opaque component references. But `generateStaticParams`, `<title>`, the sitemap and the
search index all need that metadata on the server. `scripts/build-manifest.mjs` scans the
tool sources and writes `src/lib/manifest.ts`, a plain data file the server can read. It
runs automatically before every build via the `prebuild` script; run it by hand with
`npm run manifest` while developing.

---

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build; catches type errors
```

---

## Advertising

`src/components/AdSlot.tsx` renders **nothing at all** until the environment variable
`NEXT_PUBLIC_ADSENSE_CLIENT` is set. That is deliberate: empty ad containers and
placeholder scripts are a common reason for AdSense rejection, and the site should be
clean while it is under review.

When you have an approved account:

1. In Vercel, **Settings → Environment Variables**, add
   `NEXT_PUBLIC_ADSENSE_CLIENT` = `ca-pub-XXXXXXXXXXXXXXXX`.
2. Create ad units in the AdSense dashboard and replace the placeholder `slot="00000000.."`
   values in `ToolLayout.tsx` and `tools/[category]/page.tsx` with the real slot IDs.
3. Redeploy.

### Before you apply

AdSense rejects thin sites. Three things matter more than anything else:

- **Word count per page.** The hand-written tools (Ohm's law, resistor colour code,
  voltage divider, LED resistor, projectile motion, molarity, quadratic, unit converter,
  graphing) have 600–900 word articles. The pack tools have 250–400. Bring the short ones
  up before applying — 800+ words of genuinely useful explanation per page is the target.
- **The privacy policy.** `src/app/privacy/page.tsx` is a template with placeholders in
  it. Fill in the date, the contact address, and the analytics section. Leaving template
  text in place is an easy rejection.
- **Traffic and age.** A brand-new domain with no visitors is usually rejected. Get the
  content in place, submit the sitemap to Google Search Console, and wait for some organic
  traffic before applying.

### The account requirement

Google requires AdSense account holders to be at least 18. If you are under 18, the
account has to be held by a parent or guardian in their name, with payments going to
their bank account — that is Google's own stated arrangement, not a workaround. An
account that misstates the holder's age gets terminated and withheld earnings are
forfeited, so it is worth setting up correctly the first time.

---

## What is not here yet

**Accounts and login.** This is a static site with no backend, which is why it is free to
host and fast. Real authentication needs a database and a session layer — Supabase or
Clerk are the usual choices and both have Next.js guides and free tiers. Worth adding
only once you have a feature that needs it (saved calculations, history, custom unit
sets); for a calculator hub, ad revenue does not depend on it and it is the single
largest source of security risk you could add.

**More tools.** The categories in `src/lib/types.ts` have groups defined that are not yet
filled: digital and data, thermal and modern, number tools. Adding to those is the
cheapest way to grow the site.

---

## Structure

```
src/
  app/                    routes, sitemap, robots, metadata
  components/             Field, Readout, AdSlot, search, page shells
  lib/
    types.ts              categories and the Tool contract
    makeTool.tsx          declarative calculator factory
    manifest.ts           GENERATED — server-safe tool metadata
    registry.ts           client-side map of slug to components
    format.ts             SI formatting and engineering-notation parsing
    expr.ts               expression parser used by the graphing calculator
  tools/<category>/       the calculators themselves
scripts/build-manifest.mjs
```
