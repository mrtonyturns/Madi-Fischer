import type { Metadata } from "next";

/**
 * Static export has no server-side redirects, so the root page forwards to the
 * default locale with a meta refresh (React hoists <meta> to <head>) and keeps
 * plain links as a fallback. Search engines index /en/ and /es/ directly via
 * the hreflang alternates.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function RootRedirect() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/en/" />
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-lg">
          <a href="/en/" className="font-semibold underline">
            English
          </a>
          <span className="mx-2 text-muted-foreground">·</span>
          <a href="/es/" className="font-semibold underline">
            Español
          </a>
        </p>
      </main>
    </>
  );
}
