import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `How ${SITE.name} handles data, cookies and advertising.`,
};

export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Privacy policy</h1>
      <div className="prose-sf mt-5">
        <p>
          <strong>Last updated:</strong> 1st of September, 2026.
        </p>

        <h2>What we collect</h2>
        <p>
          {SITE.name} does not require an account and does not ask for personal
          information. Values you type into a calculator are processed in your browser and
          are never sent to our servers or stored.
        </p>

        <h2>Analytics</h2>
        <p>
          We may collect aggregate, anonymous usage statistics — which pages are visited
          and roughly where visitors are in the world — to understand which tools are
          useful. This does not identify individual visitors.
        </p>

        <h2>Advertising and cookies</h2>
        <p>
          This site displays advertising served by Google AdSense. Third-party vendors,
          including Google, use cookies to serve ads based on a visitor&rsquo;s prior
          visits to this and other websites.
        </p>
        <ul>
          <li>
            Google&rsquo;s use of advertising cookies enables it and its partners to serve
            ads based on your visits to this site and other sites on the internet.
          </li>
          <li>
            You can opt out of personalised advertising by visiting Google&rsquo;s Ads
            Settings page.
          </li>
          <li>
            You can opt out of third-party vendor cookies for personalised advertising at
            aboutads.info.
          </li>
        </ul>

        <h2>Children</h2>
        <p>
          This site is not directed at children under 13 and we do not knowingly collect
          information from them.
        </p>

        <h2>Contact</h2>
        <p>
          Please Contact +94 770625232 for any discrepancies.
        </p>
      </div>
    </div>
  );
}
