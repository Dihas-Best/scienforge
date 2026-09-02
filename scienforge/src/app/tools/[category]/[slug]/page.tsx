import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MANIFEST, metaFor } from "@/lib/manifest";
import ToolLayout from "@/components/ToolLayout";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return MANIFEST.map((t) => ({ category: t.category, slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const meta = metaFor(category, slug);
  if (!meta) return {};
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: { canonical: `/tools/${category}/${slug}` },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${SITE.url}/tools/${category}/${slug}`,
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const meta = metaFor(category, slug);
  if (!meta) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: meta.title,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    description: meta.description,
    url: `${SITE.url}/tools/${category}/${slug}`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolLayout meta={meta} />
    </>
  );
}
