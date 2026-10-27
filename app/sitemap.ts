import type { MetadataRoute } from "next";

import { locales } from "@/lib/i18n";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://fischertropitelretreat.com";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${BASE}/${locale}/`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === "en" ? 1 : 0.9,
    alternates: {
      languages: {
        en: `${BASE}/en/`,
        es: `${BASE}/es/`,
      },
    },
  }));
}
