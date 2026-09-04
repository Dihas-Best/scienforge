import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `What ${SITE.name} is, who maintains it, and how the calculators are checked.`,
};

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">About {SITE.name}</h1>
      <div className="prose-sf mt-5">
        <p>
          {SITE.name} is a collection of calculators for electronics, physics, chemistry
          and mathematics. Most calculator sites give you a number and nothing else. Each
          tool here also shows the formula it used, a worked example, and the conditions
          under which the model stops being a good description of reality — because
          knowing that a projectile equation ignores air resistance matters more than
          getting four decimal places.
        </p>

        <h2>How the calculations are checked</h2>
        <p>
          Every tool is written as a self-contained module with the formula stated
          alongside the code, and results are compared against worked examples from
          standard textbooks before the tool is published. If you find a result that
          disagrees with a source you trust, that is a bug worth reporting.
        </p>

        <h2>What this site is not</h2>
        <p>
          It is a reference, not an authority. Do not use it as the sole basis for
          anything that has to be safe, certified or graded. Check anything important
          against a second source.
        </p>

        <h2>Cost</h2>
        <p>
          Everything is free and nothing requires an account. The running costs are
          covered by advertising.
        </p>
      </div>
    </div>
    
  );
}
