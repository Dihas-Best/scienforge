import type { MetadataRoute } from "next";
import { MANIFEST } from "@/lib/manifest";
import { CATEGORIES } from "@/lib/types";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE.url, lastModified: now, priority: 1 },
    { url: `${SITE.url}/tools`, lastModified: now, priority: 0.9 },
    { url: `${SITE.url}/about`, lastModified: now, priority: 0.3 },
    { url: `${SITE.url}/privacy`, lastModified: now, priority: 0.3 },
    ...CATEGORIES.map((c) => ({
      url: `${SITE.url}/tools/${c.id}`,
      lastModified: now,
      priority: 0.8,
    })),
    ...MANIFEST.map((t) => ({
      url: `${SITE.url}/tools/${t.category}/${t.slug}`,
      lastModified: now,
      priority: 0.7,
    })),
  ];
}
