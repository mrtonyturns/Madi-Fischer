import type { Metadata } from "next";

import "../globals.css";
import { SITE_URL, htmlClass } from "../site";
import { dict, locales, type Locale } from "@/lib/i18n";

/**
 * This is a ROOT layout: it renders <html> and <body> itself.
 *
 * That is the whole point of the [locale] segment sitting above it. A single
 * root layout at app/layout.tsx cannot see this segment's params, so it had to
 * hard-code lang="en" and patch it with an inline script after the fact —
 * which meant the exported /es/index.html shipped `<html lang="en">` to every
 * crawler, and React reported a hydration mismatch on every Spanish load.
 * Rendering <html> here fixes both at the source.
 *
 * The bare "/" locale chooser has its own root layout in app/(redirect)/.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = dict[locale as Locale].meta;
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t.title,
      template: "%s | Fischer Tropitel",
    },
    description: t.description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: `/${locale}/`,
      languages: {
        en: "/en/",
        es: "/es/",
        "x-default": "/en/",
      },
    },
    openGraph: {
      type: "website",
      locale: t.ogLocale,
      siteName: "Fischer Tropitel",
      title: t.ogTitle,
      description: t.ogDescription,
    },
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "Fischer Tropitel",
  url: SITE_URL,
  telephone: "+1-715-348-4887",
  email: "madilyn.fischer1991@gmail.com",
  description:
    "Three private jungle casa rentals above a waterfall in the mountains near Quepos, Costa Rica, close to Manuel Antonio National Park and world-class sportfishing.",
  address: {
    "@type": "PostalAddress",
    // Costa Rica has no street addresses up here; locations are given by
    // landmark, which is what Google's own listing shows.
    streetAddress: "200 m past the Hot Springs Lodge",
    addressLocality: "Quepos",
    addressRegion: "Puntarenas",
    addressCountry: "CR",
  },
  // Ties the site to the Google Business Profile. Swap for the canonical
  // listing URL once someone grabs the share link from the profile.
  hasMap: "https://www.google.com/maps/search/?api=1&query=Fischer+Tropitel",
  sameAs: ["https://www.google.com/maps/search/?api=1&query=Fischer+Tropitel"],
  // TODO: add `geo` with the property's real lat/lng. Deliberately omitted
  // rather than guessed — wrong coordinates on a LodgingBusiness send guests
  // up the wrong mountain road.
  numberOfRooms: 3,
  amenityFeature: [
    {
      "@type": "LocationFeatureSpecification",
      name: "Private pool",
      value: true,
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Full kitchen",
      value: true,
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Solar power",
      value: true,
    },
  ],
};

export default async function LocaleRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <html lang={locale} className={htmlClass}>
      <body className="font-sans">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
