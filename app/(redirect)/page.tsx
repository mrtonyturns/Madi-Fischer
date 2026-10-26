import type { Metadata } from "next";
import Link from "next/link";

import { Logo } from "@/components/brand";

/**
 * The fallback for "/". In production nobody sees this: the Worker 302s "/"
 * to /en/ or /es/ before anything is painted (worker/index.ts). It still
 * ships because the export has to answer "/" on its own if it is ever served
 * without the Worker — a preview deploy, someone opening out/index.html.
 *
 * So it is built to be invisible rather than informative: the site's own dark
 * ground, no white page, no headline, and the meta refresh fires immediately.
 * It used to be black text on white — which flashed "English · Español" on
 * every first visit, because a meta refresh cannot act until the browser has
 * painted the document carrying it.
 *
 * The two links stay for anyone the refresh fails: a text browser, a reader
 * that ignores it.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function RootRedirect() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/en/" />
      <main className="flex min-h-svh flex-col items-center justify-center gap-8 bg-canopy-deep px-6 text-center">
        <Logo className="text-cream" />
        <p className="text-sm text-cream/60">
          <Link href="/en/" className="underline underline-offset-4">
            English
          </Link>
          <span className="mx-2.5 text-cream/30">·</span>
          <Link href="/es/" className="underline underline-offset-4">
            Español
          </Link>
        </p>
      </main>
    </>
  );
}
