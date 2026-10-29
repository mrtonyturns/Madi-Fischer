/**
 * ANALYTICS — Microsoft Clarity + the KickLick dashboard's Pulse tag.
 *
 * Rendered inside <head> by every root layout in the app, which is where both
 * vendors expect their tag and where their verification checks look for it:
 *
 *   app/[locale]/layout.tsx    /en/ and /es/ — the real site
 *   app/(redirect)/layout.tsx  the bare "/" shim
 *   app/global-not-found.tsx   the 404
 *
 * There are three because this app has three root layouts (a locale segment
 * sits above the real one so <html lang> can be per-locale). A tag added to
 * only one of them covers only part of the site, so all three import this.
 *
 * Both are the vendors' snippets rendered verbatim into the exported HTML,
 * not loaded through `next/script`. That is deliberate:
 *
 *   - The site is a static export with no client-side route changes (the nav
 *     is in-page anchors and each locale is its own document), so
 *     next/script's de-duplication across navigations has nothing to do.
 *   - next/script's default `afterInteractive` strategy holds a tag back
 *     until React has hydrated — here that is after the hero video and
 *     MapLibre have started work. Clarity records sessions, so those first
 *     seconds are the ones worth having.
 *
 * Clarity's bootstrap injects its own async <script> once it runs; that is how
 * the tag is designed to work, and why there is no `src` for it here. Pulse
 * keeps its `defer`, so it downloads alongside the HTML and runs once parsing
 * is done.
 *
 * To re-point either tag, edit the two ids below and nothing else.
 */

/** Microsoft Clarity project id. */
const CLARITY_ID = "z5d971mxkt";

/** Site key for dashboard.kicklick.com. */
const PULSE_KEY = "kl_d4ffe4912bbeedd91af700eb";

const CLARITY_SNIPPET = `(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${CLARITY_ID}");`;

export function Analytics() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: CLARITY_SNIPPET }} />
      <script
        src="https://dashboard.kicklick.com/pulse.js"
        data-kl={PULSE_KEY}
        defer
      />
    </>
  );
}
