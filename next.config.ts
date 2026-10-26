import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare serves this as static assets. Everything downstream of this
  // setting follows from it: no API routes, no Server Actions, no middleware.
  output: "export",

  // The default image loader needs a server. Without this the build fails.
  images: { unoptimized: true },

  // Must stay in sync with `html_handling` in wrangler.jsonc, or nested routes
  // bounce between trailing-slash variants and 404.
  trailingSlash: true,

  experimental: {
    // Serves app/global-not-found.tsx for unmatched URLs. The plain
    // `not-found` convention needs a single root layout to render inside;
    // this app has two (app/[locale] and app/(redirect)), so it would have
    // fallen back to Next's own black error page — see that file's comment.
    globalNotFound: true,
  },
};

export default nextConfig;
