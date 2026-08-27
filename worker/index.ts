/**
 * Static export means Next.js has no server, so form submissions land here.
 * Everything that is not /api/* falls through to the static assets.
 *
 * Secrets below are RUNTIME secrets on the Worker (wrangler secret put ...),
 * never NEXT_PUBLIC_ build variables.
 */

interface Env {
  ASSETS: Fetcher;

  /* ---- Where enquiries go ----
   * Two routes, checked in this order. The first one configured wins.
   *
   * 1. Email via Resend — the normal path.
   *      npx wrangler secret put RESEND_API_KEY
   *    CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL are plain vars in
   *    wrangler.jsonc; only the key is a secret.
   *
   * 2. A webhook — a Zapier catch hook, a CRM, anything that takes JSON.
   *      npx wrangler secret put CONTACT_WEBHOOK_URL
   *
   * With neither set the endpoint fails loudly. A dropped lead that looked
   * like a success is the worst outcome available here.
   */
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
  CONTACT_WEBHOOK_URL?: string;
  // Google reviews. Both are required before /api/reviews returns anything.
  //   npx wrangler secret put GOOGLE_PLACES_API_KEY
  //   npx wrangler secret put GOOGLE_PLACE_ID
  // The key must have the Places API (New) enabled and should be restricted to
  // this Worker's IPs — it is never exposed to the browser.
  GOOGLE_PLACES_API_KEY?: string;
  GOOGLE_PLACE_ID?: string;
}

interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

function bad(message: string, status = 400): Response {
  return Response.json({ ok: false, error: message }, { status });
}

async function handleContact(request: Request, env: Env): Promise<Response> {
  let payload: ContactPayload;

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    payload = (await request.json()) as ContactPayload;
  } else {
    const form = await request.formData();
    payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      message: String(form.get("message") ?? ""),
    };
    // Honeypot: real users leave this empty, bots fill it in.
    if (String(form.get("company") ?? "")) {
      return Response.json({ ok: true });
    }
  }

  if (!payload.name || !payload.email || !payload.message) {
    return bad("Please fill in your name, email, and message.");
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payload.email)) {
    return bad("That email address doesn't look right.");
  }

  const source = new URL(request.url).hostname;

  if (env.RESEND_API_KEY) {
    return sendEmail(payload, env, source);
  }

  if (env.CONTACT_WEBHOOK_URL) {
    const forwarded = await fetch(env.CONTACT_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        submittedAt: new Date().toISOString(),
        source,
      }),
    });

    if (!forwarded.ok) {
      console.error("Webhook rejected submission", forwarded.status);
      return bad("We couldn't send that just now. Please try again.", 502);
    }

    return Response.json({ ok: true });
  }

  // Fail loudly rather than telling the visitor it worked.
  console.error("No RESEND_API_KEY or CONTACT_WEBHOOK_URL — submission dropped");
  return bad("The contact form isn't configured yet.", 500);
}

/** Escape anything a visitor typed before it lands in an HTML email. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendEmail(
  payload: ContactPayload,
  env: Env,
  source: string,
): Promise<Response> {
  const to = env.CONTACT_TO_EMAIL ?? "tony@kicklick.com";
  // resend.dev is Resend's shared sending domain — it works with no DNS setup
  // at all, which is why it is the default. Swap it for an address on a
  // verified domain when there is one; shared domains land in spam more often.
  const from = env.CONTACT_FROM_EMAIL ?? "Fischer Tropitel <onboarding@resend.dev>";

  const lines = [
    `Name:    ${payload.name}`,
    `Email:   ${payload.email}`,
    `Phone:   ${payload.phone || "—"}`,
    "",
    payload.message,
    "",
    `— sent from ${source}`,
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      // Hitting reply goes straight back to the guest, not to the Worker.
      reply_to: payload.email,
      subject: `Fischer Tropitel enquiry — ${payload.name}`,
      text: lines,
      html: `
        <div style="font-family:system-ui,-apple-system,sans-serif;line-height:1.6;color:#05261a">
          <h2 style="margin:0 0 16px;font-size:18px">New enquiry from ${esc(payload.name)}</h2>
          <table style="border-collapse:collapse;font-size:14px">
            <tr><td style="padding:4px 16px 4px 0;color:#5a6b62">Email</td><td><a href="mailto:${esc(payload.email)}">${esc(payload.email)}</a></td></tr>
            <tr><td style="padding:4px 16px 4px 0;color:#5a6b62">Phone</td><td>${esc(payload.phone || "—")}</td></tr>
          </table>
          <p style="margin:20px 0 0;white-space:pre-wrap">${esc(payload.message)}</p>
          <p style="margin:24px 0 0;font-size:12px;color:#8a978f">Sent from ${esc(source)}</p>
        </div>`,
    }),
  });

  if (!res.ok) {
    // The provider's reason goes to the log, never to the visitor.
    console.error("Resend rejected the message", res.status, await res.text());
    return bad("We couldn't send that just now. Please try again.", 502);
  }

  return Response.json({ ok: true });
}

/* ------------------------------------------------------------------ */

/**
 * Google reviews, proxied so the API key stays server-side.
 *
 * The response is deliberately reshaped rather than passed through: the page
 * only needs five fields per review, and Google's payload changes shape more
 * often than our markup should.
 *
 * `configured: false` is a normal 200, not an error — the reviews section
 * simply doesn't render until the secrets are set, the same way the booking
 * section waits on NEXT_PUBLIC_CAL_LINK.
 */
interface PlacesReview {
  rating?: number;
  relativePublishTimeDescription?: string;
  text?: { text?: string };
  originalText?: { text?: string };
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
}

interface PlacesResponse {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: PlacesReview[];
}

async function handleReviews(request: Request, env: Env): Promise<Response> {
  if (!env.GOOGLE_PLACES_API_KEY || !env.GOOGLE_PLACE_ID) {
    return Response.json({ configured: false, reviews: [] });
  }

  // Spanish visitors get Spanish review translations where Google has them.
  const lang = new URL(request.url).searchParams.get("lang") === "es" ? "es" : "en";

  const res = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(
      env.GOOGLE_PLACE_ID,
    )}?languageCode=${lang}`,
    {
      headers: {
        "X-Goog-Api-Key": env.GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask":
          "rating,userRatingCount,googleMapsUri,reviews",
      },
    },
  );

  if (!res.ok) {
    console.error("Places API error", res.status, await res.text());
    return Response.json({ configured: false, reviews: [] });
  }

  const data = (await res.json()) as PlacesResponse;

  const reviews = (data.reviews ?? [])
    .map((r) => ({
      author: r.authorAttribution?.displayName ?? "",
      authorUrl: r.authorAttribution?.uri ?? null,
      photo: r.authorAttribution?.photoUri ?? null,
      rating: r.rating ?? null,
      when: r.relativePublishTimeDescription ?? "",
      text: (r.text?.text ?? r.originalText?.text ?? "").trim(),
    }))
    // A star rating with no words is not worth a card.
    .filter((r) => r.author && r.text);

  return Response.json(
    {
      configured: true,
      rating: data.rating ?? null,
      total: data.userRatingCount ?? null,
      url: data.googleMapsUri ?? null,
      reviews,
    },
    {
      // Short enough to stay well inside Google's caching terms, long enough
      // that a busy day doesn't burn through the Places quota.
      headers: { "Cache-Control": "public, max-age=1800" },
    },
  );
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, "");

    if (path === "/api/contact") {
      if (request.method !== "POST") {
        return bad("Method not allowed", 405);
      }
      return handleContact(request, env);
    }

    if (path === "/api/reviews") {
      if (request.method !== "GET") {
        return bad("Method not allowed", 405);
      }
      return handleReviews(request, env);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
