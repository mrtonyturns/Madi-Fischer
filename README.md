# Fischer Tropitel

Marketing site for three jungle casa rentals on a private mountain property
above Quepos, Costa Rica. It is a landing page whose job is to set expectations
honestly and then hand visitors off to Airbnb to book — not a booking engine.

English and Spanish, served as static files from a Cloudflare Worker. The
Worker itself only handles `/api/*`; everything else is a static asset.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, `output: "export"`) |
| Styling | Tailwind v4 — CSS-first, **no `tailwind.config.js`**; tokens live in `app/globals.css` |
| Animation | Motion (`motion/react`) |
| Hosting | Cloudflare Workers + static assets |
| Fonts | Fraunces (display) + Fustat (UI), via `next/font` |

Because the site is a static export there is **no server**: no API routes, no
Server Actions, no middleware. Anything dynamic goes in `worker/index.ts`.

## Running it

```bash
npm ci
npm run dev
```

| Command | Does |
|---|---|
| `npm run dev` | Dev server on :3000 |
| `npm run build` | Static export into `out/` |
| `npm run lint` | ESLint |
| `npm run check:worker` | Typecheck the Worker separately |
| `npm run deploy` | Build, then `wrangler deploy` |

`/api/*` does not exist under `npm run dev` — there is no Worker locally, so the
contact form and the reviews endpoint return 404. That is expected. To exercise
them, deploy, or run `npx wrangler dev`.

## Where things live

```
app/[locale]/          the site. This is the ROOT layout — it renders <html lang>
                       per locale, which is why /es/ ships lang="es" to crawlers
app/(redirect)/        "/" locale chooser, its own root layout
app/globals.css        brand tokens + the button system
lib/i18n.ts            every string on the site, both languages
components/            hero, area map, know-notes, header, brand, buttons
worker/index.ts        POST /api/contact, GET /api/reviews
```

**All copy is in `lib/i18n.ts`.** Editing text means editing that file, in both
the `en` and `es` blocks. Nothing is hard-coded in components.

The map's geography (pin coordinates, Google Maps queries) is in
`components/area-map.tsx` — deliberately not translated. Only the names,
descriptions and travel times are.

**Adding a marker:** coordinates are percentages of the frame, and the ocean
occupies the lower left. Three markers once sat in the sea, including the
national park, so check any new one against the coastline rather than eyeballing
it. Paste this in the browser console with the map on screen — it reports
`OCEAN` or `land` for a given x/y:

```js
const svg = [...document.querySelectorAll('#area svg')]
  .find(s => s.getAttribute('viewBox') === '0 0 1000 750');
const sea = [...svg.querySelectorAll('path')]
  .find(p => p.getAttribute('d').startsWith('M0 250 C120 300'));
const pt = svg.createSVGPoint();
const test = (x, y) => (pt.x = x * 10, pt.y = y * 7.5,
  sea.isPointInFill(pt) ? 'OCEAN' : 'land');
test(45, 71); // -> 'OCEAN'
```

Markers also need roughly 6% of clear space between them, or their 40px tap
targets overlap on a phone.

## Configuration

**Build-time** (must be present when `npm run build` runs):

| Variable | Effect |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical/OG base. Defaults to `https://www.fischertropitel.com` |
| `NEXT_PUBLIC_CAL_LINK` | Optional. When set, switches on a Cal.com booking section |

**Worker vars** — plain config in `wrangler.jsonc`, not secrets:

- `CONTACT_TO_EMAIL` — where enquiries are emailed
- `CONTACT_FROM_EMAIL` — the sender

**Worker secrets** — `npx wrangler secret put NAME`:

| Secret | Needed for |
|---|---|
| `RESEND_API_KEY` | Emailing the contact form. Without it the form fails loudly |
| `CONTACT_WEBHOOK_URL` | Alternative to Resend — a Zapier hook or CRM that takes JSON |
| `GOOGLE_PLACES_API_KEY` | Google reviews section |
| `GOOGLE_PLACE_ID` | Google reviews section |

The reviews section renders **nothing at all** until both Google secrets are
set and real reviews come back. That is intentional — no placeholder reviews.

## Deploying

```bash
npm run deploy
```

Two things must line up first:

1. **`name` in `wrangler.jsonc` must match the Worker the secrets are on.**
   Deploying under a different name silently creates a second Worker with no
   secrets, and the contact form will look broken.
2. **`account_id`** — if your credentials reach more than one Cloudflare
   account, pin it in `wrangler.jsonc` or wrangler will stop and ask.

There is no custom domain or route in the config, so a deploy lands on
`<name>.<subdomain>.workers.dev`. Pointing the real domain at it is a separate
step.

## Before this goes live

- [ ] **Airbnb links are placeholders.** `AIRBNB_URLS` in `app/[locale]/page.tsx`
      points all three casas at `airbnb.com`'s homepage. Needs the three real
      listing URLs, in the order Casa Cascada / Loads of Toads / Casa Verde.
- [ ] **Resend sends from `onboarding@resend.dev`**, a shared domain that lands
      in spam more often. Move to a verified domain and update
      `CONTACT_FROM_EMAIL`.
- [ ] **No `geo` coordinates in the structured data** (`app/[locale]/layout.tsx`).
      Left out rather than guessed — wrong coordinates on a lodging listing send
      guests up the wrong mountain road.
- [ ] **`GOOGLE_LISTING_URL`** in `app/[locale]/page.tsx` is a Google Maps name
      search. Replace with the canonical Business Profile link.
- [ ] Photography is documentary real-estate work — flat skies, no interiors, no
      waterfall, no pool. The art direction compensates, but real lifestyle
      shots would do more than any further design work.
