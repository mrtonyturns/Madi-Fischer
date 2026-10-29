/**
 * ANALYTICS — Microsoft Clarity + the KickLick dashboard's Pulse tag.
 *
 * Both are the vendors' own snippets, rendered verbatim into the exported HTML
 * rather than loaded through `next/script`. That is a deliberate choice for
 * this site rather than a shortcut:
 *
 *   - It is a static export, and every locale is its own document reached by a
 *     full page load (the nav is in-page anchors only). So next/script's
 *     de-duplication across client-side route changes has nothing to do here.
 *   - next/script's default `afterInteractive` strategy holds a tag back until
 *     React has hydrated — on this page that is after the hero video and
 *     MapLibre have started work. Clarity records sessions, so those first
 *     seconds are the ones worth having.
 *
 * Rendered as the first children of <body>, so the browser runs them while it
 * is still parsing the document, ahead of any content. The JSON-LD block in
 * app/[locale]/layout.tsx uses the same raw-<script> idiom.
 *
 * Clarity's bootstrap injects its own async <script> once it runs — that is
 * how the tag is designed to work, and why there is no `src` here for it.
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
