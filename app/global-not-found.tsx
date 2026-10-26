import type { Metadata } from "next";

import "./globals.css";
import { SITE_URL, htmlClass } from "./site";
import { Logo } from "@/components/brand";
import { Btn } from "@/components/ui/btn";
import { Eyebrow } from "@/components/ui/eyebrow";

/**
 * THE 404 — one page for the whole site.
 *
 * `global-not-found` rather than `not-found`, because this app has no single
 * root layout to hang a 404 off: app/[locale]/layout.tsx and
 * app/(redirect)/layout.tsx are both root layouts, and the real one is chosen
 * by a top-level dynamic segment. So this file renders the whole document
 * itself — <html> down — and pulls in globals.css and the shared fonts the
 * way a root layout would. It needs `experimental.globalNotFound` in
 * next.config.ts, and the static export writes it to out/404.html, which is
 * what wrangler's `not_found_handling: "404-page"` serves.
 *
 * It is bilingual on purpose: a mistyped URL carries no locale, so the page
 * can't know which language the visitor reads, and guessing wrong on the only
 * page that is already a dead end is the one place worth spending two lines
 * on both.
 */

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Page not found | Fischer Tropitel",
  description:
    "That page isn't here. Find the three casas, the area map and the contact form on the Fischer Tropitel home page.",
  // A dead URL has nothing worth indexing, and letting it in would compete
  // with the two real pages.
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={htmlClass}>
      <body className="font-sans">
        <main className="topo relative flex min-h-svh flex-col bg-canopy-deep text-cream">
          <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 py-10 sm:px-8 sm:py-12">
            <a
              href="/en/"
              aria-label="Fischer Tropitel — home"
              className="inline-flex w-fit rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
            >
              <Logo className="text-cream" />
            </a>

            <div className="flex flex-1 items-center py-16">
              <div className="max-w-2xl">
                <Eyebrow onDark>404</Eyebrow>

                <h1
                  className="mt-6 font-display text-[2.6rem] leading-[1.04] font-normal text-cream sm:text-6xl"
                  style={{ fontVariationSettings: '"SOFT" 40, "WONK" 1' }}
                >
                  This trail doesn&rsquo;t lead anywhere.
                </h1>

                <p className="mt-7 max-w-xl text-lg leading-relaxed text-cream/80">
                  The page you were looking for isn&rsquo;t here. The three
                  casas, the map of everything within reach of the gate, and the
                  way to reach us are all one click away.
                </p>

                <p
                  className="mt-3 max-w-xl leading-relaxed text-cream/55"
                  lang="es"
                >
                  Esta p&aacute;gina no existe. Las tres casas, el mapa de la
                  zona y nuestros datos de contacto est&aacute;n a un clic.
                </p>

                <div className="mt-10 flex flex-wrap gap-3">
                  <Btn href="/en/" variant="stone" size="lg">
                    Back to the site
                  </Btn>
                  <Btn href="/es/" variant="mist" size="lg" arrow={false}>
                    Ver en espa&ntilde;ol
                  </Btn>
                </div>

                <ul className="mt-12 flex flex-wrap gap-x-7 gap-y-3 text-[0.9375rem] text-cream/70">
                  <li>
                    <a
                      href="/en/#casas"
                      className="-my-2 inline-block py-2 transition-colors hover:text-cream"
                    >
                      The Casas
                    </a>
                  </li>
                  <li>
                    <a
                      href="/en/#area"
                      className="-my-2 inline-block py-2 transition-colors hover:text-cream"
                    >
                      Fishing &amp; Adventure
                    </a>
                  </li>
                  <li>
                    <a
                      href="/en/#know"
                      className="-my-2 inline-block py-2 transition-colors hover:text-cream"
                    >
                      Know Before You Go
                    </a>
                  </li>
                  <li>
                    <a
                      href="/en/#contact"
                      className="-my-2 inline-block py-2 transition-colors hover:text-cream"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <p className="text-sm text-cream/45">
              &copy; {new Date().getFullYear()} Fischer Tropitel. Pura vida.
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
