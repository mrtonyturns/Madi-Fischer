import type { Metadata } from "next";

import "../globals.css";
import { SITE_URL, htmlClass } from "../site";

/**
 * Root layout for "/" only. The site's real pages live under /en/ and /es/ and
 * have their own root layout in app/[locale]/ — this one exists so the locale
 * chooser has an <html> of its own without forcing every locale page to
 * inherit a hard-coded lang.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Fischer Tropitel",
};

export default function RedirectRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={htmlClass}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
