import { ImageResponse } from "next/og";

import { dict, locales, type Locale } from "@/lib/i18n";

export const dynamic = "force-static";

// Metadata routes don't inherit the layout's generateStaticParams — under
// `output: export` each one has to enumerate its own params.
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Share card. Satori (what next/og renders with) supports a useful subset of
 * SVG but not `mask`, so the arch mark is drawn here as strokes and a solid
 * leaf rather than reusing <LogoMark>. Colours are the hex equivalents of the
 * OKLCH brand tokens in app/globals.css — keep them in step by hand.
 */
const CANOPY_DEEP = "#00170E";
const FOREST = "#084F33";
const SUN = "#EBB854";
const CREAM = "#F8F5EB";

/**
 * Lives under [locale], not at the app root. The root layout moved into
 * app/[locale]/ so <html lang> could be per-locale, which left a root-level
 * opengraph-image.tsx outside the site's layout tree entirely — the pages
 * silently lost their og:image. Here it also gets to speak the right language.
 */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = dict[locale as Locale].meta;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 88,
          background: `linear-gradient(150deg, ${CANOPY_DEEP} 0%, #06301F 55%, ${FOREST} 100%)`,
          color: CREAM,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <svg width="66" height="66" viewBox="0 0 48 48" fill="none">
            <path
              d="M6.5 43V23.5a17.5 17.5 0 0 1 35 0V43"
              stroke={CREAM}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M24 13.5c-7.2 6-10.6 12.9-9.8 18.8.8 5.1 4.7 8.6 9.8 8.6s9-3.5 9.8-8.6C34.6 26.4 31.2 19.5 24 13.5Z"
              fill={SUN}
            />
          </svg>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: 9,
              textTransform: "uppercase",
              color: SUN,
            }}
          >
            Quepos · Costa Rica
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 82,
            fontWeight: 700,
            marginTop: 34,
            letterSpacing: -1,
          }}
        >
          Fischer Tropitel
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 36,
            marginTop: 22,
            lineHeight: 1.35,
            color: "rgba(248,245,235,0.78)",
            maxWidth: 880,
          }}
        >
          {t.ogDescription}
        </div>
      </div>
    ),
    size,
  );
}
