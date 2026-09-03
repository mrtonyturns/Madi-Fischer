# Fischer Tropitel — lineage

## 1. Lineage row

| Site (client, URL, what it's for) | Stack + hosting | Dark ground / light ground | Display / body / utility face | Signature element | Forms / integrations |
|---|---|---|---|---|---|
| Fischer Tropitel — Madilyn Fischer, `https://www.fischertropitel.com` (domain bought via Squarespace, not yet pointed). Landing page for three jungle casa rentals above Quepos, Costa Rica. Sets expectations honestly, then hands off to Airbnb. Not a booking engine. | Next.js 16.3 App Router, `output: "export"`, Tailwind v4 (CSS-first, no `tailwind.config.js`), Motion (`motion/react`), MapLibre GL 6.6. Cloudflare Worker serving static assets; Worker handles `/api/*` only. | Dark `--canopy-deep: oklch(0.18 0.038 168)` / light `--background: oklch(0.99 0.006 92)` | Fraunces (display, axes SOFT+WONK+opsz) / Fustat (body+UI) / `ui-monospace` stack (utility, numerals & micro-labels) | The area map: real OSM geography, house marker, a line that draws from the house to whatever you hover | Contact form → Cloudflare Worker → Resend email to `tony@kicklick.com`; Google Places reviews via Worker proxy (gated, unconfigured); Airbnb outbound links (placeholder); Cal.com scaffolding present but dormant |

## 2. Design system

### Token block verbatim (`app/globals.css`, `:root`)

```css
:root {
  /* Soft, organic radii. The art direction avoids hard chamfered corners. */
  --radius: 1.25rem;

  /* --font-sans / --font-display come from next/font via app/layout.tsx. */
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

  /* ---- BRAND PALETTE: edit these ----
     Named for the place rather than for Tailwind hues, so the art direction
     survives a palette change. "Canopy" is the darkest green and carries most
     dark sections; "sun" is the single warm accent. */
  --canopy: oklch(0.24 0.045 165);
  --canopy-deep: oklch(0.18 0.038 168);
  --forest: oklch(0.38 0.082 160);
  --moss: oklch(0.56 0.098 156);
  --fern: oklch(0.72 0.11 150);
  --sun: oklch(0.81 0.13 82);
  --sun-deep: oklch(0.7 0.14 66);
  --clay: oklch(0.63 0.13 42);
  --sea: oklch(0.63 0.075 190);
  --cream: oklch(0.97 0.014 92);
  --sand: oklch(0.93 0.022 90);

  /* The primary CTA's colour, kept separate from the rest of the palette so
     it can be re-hued without touching a single component. The gold accent
     (--sun) still carries eyebrows, numerals and the logo leaf; the button
     deliberately no longer shares it. */
  --stone-lit: oklch(0.99 0.006 92);
  --stone: oklch(0.955 0.016 92);
  --stone-deep: oklch(0.88 0.028 90);
  --stone-ink: var(--canopy-deep);

  --primary: var(--forest);
  --primary-foreground: var(--cream);
  --accent: var(--sand);
  --accent-foreground: var(--canopy);
  /* ---------------------------------- */

  --background: oklch(0.99 0.006 92);
  --foreground: oklch(0.22 0.03 165);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.22 0.03 165);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.22 0.03 165);
  --secondary: oklch(0.95 0.018 120);
  --secondary-foreground: var(--forest);
  --muted: oklch(0.95 0.014 110);
  --muted-foreground: oklch(0.48 0.028 160);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.985 0 0);
  --border: oklch(0.9 0.016 130);
  --input: oklch(0.9 0.016 130);
  --ring: var(--moss);
}
```

Token names are place-named, not hue-named: `canopy`, `canopy-deep`, `forest`, `moss`, `fern`, `sun`, `sun-deep`, `clay`, `sea`, `cream`, `sand`, plus a separate CTA ramp `stone-lit` / `stone` / `stone-deep` / `stone-ink`. Exposed to Tailwind via `@theme inline` as `--color-canopy` etc., so `bg-canopy`, `text-sun` work.

Hex equivalents (computed, for non-OKLCH contexts like the OG image): canopy `#05261A`, canopy-deep `#00170E`, forest `#084F33`, moss `#3D855C`, fern `#6FB880`, sun `#EBB854`, sun-deep `#D88A2C`, clay `#C96B46`, cream `#F8F5EB`, sand `#EDE8D8`, secondary `#EDF0E3`.

### Headline-highlight device

**None.** No italic em, no coloured span, no boxed word. Headlines are plain Fraunces at `font-weight: 400`. The hero H1 sets `font-variation-settings: "SOFT" 40, "WONK" 1`. Emphasis comes from face + size only.

### Button system

Shape family: **"leaf"** — `border-radius: 999px 8px 999px 8px`. At button aspect ratios the 999px corners stretch into long sweeping curves; the other two stay near-square.

- Label face is the **display serif** (Fraunces), not the UI sans. `font-size: 1.0625rem`, `font-weight: 500`, `padding: 0.9375rem 1.75rem`.
- Sizes: `.btn-sm` 0.9375rem / `0.75rem 1.375rem`; default 1.0625rem; `.btn-lg` 1.1875rem / `1.0625rem 2.125rem`. Arrow scales 14 / 16 / 18px.
- Flat matte fills. **No gradient, no shadow, no hover lift.**

Variants:

| Variant | Ground | Rest | Hover |
|---|---|---|---|
| `stone` | dark | `bg: --stone`, `color: --stone-ink` | `bg: --stone-lit` |
| `canopy` | light | `bg: --forest`, `color: --cream` | `bg: --moss` |
| `mist` | dark | transparent, `inset 0 0 0 1.5px cream/45%` | `color: --canopy-deep`, `bg: --cream` |
| `mist-dark` | light | transparent, `inset 0 0 0 1.5px canopy/30%` | `color: --sand`, `bg: --canopy` |
| `trail` | either | text link, UI sans, `padding-block: 0.5rem`, rule at `background-size: 0% 1.5px` | rule grows to `100% 1.5px`, arrow `translateX(4px)` |

Secondaries use an **inset ring, not a border** — a border notches the leaf corners where the curve meets the straight edge.

States:
- **hover** — radius flips to `8px 999px 8px 999px` over `520ms cubic-bezier(0.22,1,0.36,1)` (the leaf turns); bare arrow slides `translateX(3px)` over 320ms so the two gestures read in sequence, not simultaneously.
- **active** — `transform: scale(0.985)`, 180ms.
- **focus-visible** — `outline: 2px solid var(--moss)`, `outline-offset: 3px`.
- **disabled** — no variant styling; the one disabled case (form submit while sending) uses utility classes `disabled:cursor-not-allowed disabled:opacity-60`.
- **reduced-motion** — `@media (prefers-reduced-motion: reduce)` sets all `.btn`, `.btn > svg`, `.btn-trail` transitions to `1ms`, kills `:active` transform and both arrow translates. The leaf turn goes instant rather than half-speed, deliberately.

Arrow rule: rendered for every variant when `arrow` is true (default). `arrow={false}` on the form submit and on secondaries paired beside a primary.

### Header

Transparent over the hero, `fixed inset-x-0 top-0 z-50`, height 84px. On `scrollY > 40` it settles into `bg-canopy-deep/92` + `backdrop-blur-xl` + a 1px top-highlight shadow, over a 500ms transition. Left: logo lockup. Right: language switch (`md:` and up), primary CTA (`sm:` and up), menu trigger.

Menu type: **full-width dropdown panel** below the bar, not an overlay or drawer. Numbered entries (`01`–`04` in the mono face, gold), Fraunces link labels at `text-3xl`/`sm:text-4xl`, gold on hover. Closes on Escape and on link click.

Menu trigger: a 52px circle with a hairline `cream/30` rim, `bg-cream/8`, backdrop-blur. Three bars where the **outer two share a width (22px) and left edge and the middle is short (16px) and inset 6px from the left** — the offset is what stops it reading as a default hamburger. Folds into an X on open via spring (`stiffness 420, damping 30`). Widths are fixed in CSS; only transforms animate.

### Hero

Shape: **pinned scroll choreography.** `<section>` is `h-[170svh]` with `position: relative; z-0`, containing a `sticky top-0 h-svh overflow-hidden` stage. `useScroll({ target, offset: ["start start", "end end"] })` gives one progress value driving five layers at five rates:

| Layer | Motion |
|---|---|
| photograph | `scale 1.06 → 1.24`, `y 0% → 9%` |
| dusk overlay | `opacity 0 → 0.6` |
| far canopy band | `y 0% → -16%` (opposes the photo; that opposition is what sells depth) |
| near fronds L/R | swing outward `x ±46%`, rotate `∓16°`, `scale 1 → 1.32` |
| copy | `y 0 → -110`, `opacity 1 → 0` by progress 0.46 |

The "ground rising to meet you" is **not** in the hero — it's the real page content. `app/[locale]/page.tsx` wraps everything after the hero in `relative z-10 -mt-[55svh]`. Those two numbers are a pair: hero 170svh minus 55svh means content sits 115svh down the document and starts rising on the first pixel of scroll.

Scroll cue: a 48px circle matching the menu trigger, with a down arrow drifting 3px on a 2.4s loop. It is a real control — clicking scrolls to `innerHeight * 1.15`, which lands the content edge exactly at the top of the viewport. Hidden below `sm`.

### Section rhythm (home page, in order)

1. Hero — **dark** (`bg-canopy-deep`, photo + grade)
2. Stats band — **light** (`bg-background`), 2-col mobile / 4-col `lg`
3. Highlights carousel — **dark** (full-bleed photo, cream content card)
4. The casas — **light** (`bg-background`), three stacked dark image cards
5. Fishing & Adventure / area map — **light** (`bg-secondary`)
6. Know before you go — **dark** (`bg-canopy-deep` + `.topo` texture)
7. Reviews — **light** (`bg-secondary`) — renders nothing until configured
8. Booking — **light** — renders only if `NEXT_PUBLIC_CAL_LINK` set (currently never)
9. Contact — **light** (`bg-background`), 2-col `lg`
10. Footer — **dark** (`bg-canopy-deep` + `.topo`)

### Motion

- Everything scroll-linked runs off one compositor-driven progress value. No scroll listeners, no per-frame layout reads.
- `Reveal` / `Stagger` / `Item` primitives: opacity + `y: 24` rise, `duration 0.55`, ease `[0.21, 0.47, 0.32, 0.98]`, `viewport={{ once: true, margin: "-64px" }}`. **Once, never looping.**
- Know-before-you-go: each hairline rule draws itself with `scaleX 0 → 1` over 0.9s as its entry arrives. Only motion in that section.
- Map: route line animates `pathLength 0 → 1` over 0.7s (drawn version) / GeoJSON swap (MapLibre version).
- Looping: only two — `.sway` on hero fronds (11s ease-in-out, per-side origin and a −3.4s delay on one side) and the scroll-cue arrow `nudge` (2.4s).
- **Gated behind `prefers-reduced-motion`:** all `.btn` transitions → 1ms; `.sway` and `.nudge` → `animation: none`; every Motion component swaps its variants to opacity-only and durations to 0.001; the hero's whole choreography collapses to a static composition (`style={reduce ? {} : {...}}`).

**Hard-won rule:** every `useTransform` range must land its last keyframe on progress `1`, including flat tails — `useTransform(p, [0, 0.28, 0.46, 1], [1, 1, 0, 0])`, not `[0, 0.28, 0.46] → [1, 1, 0]`. A range that stops early does not reliably hold its final value; the hero copy faded out and then faded back **in** over the section below.

### Textures / decorative devices on dark bands

- `.topo` — a pure-CSS topographic wash: two `repeating-radial-gradient` rings at 38px/52px spacing in `fern` at 12%/9%, `opacity: 0.5`, masked with a radial `black 20% → transparent 78%`. No image request. Used on the Know section, the menu panel and the footer.
- Oversized `MonsteraLeaf` watermark at `text-cream/4`, 520px, rotated 18°, `lg:` only, in the Know section.
- Hero foliage: `PalmFrond` and `MonsteraLeaf` generated procedurally from ~6 numbers each (one frond is ~30 tapered blades along a quadratic rachis). Deterministic maths so SSR and client render byte-identical.

### Breakpoints and container

Tailwind defaults, `sm: 640` is the workhorse (66 occurrences of `sm:` vs a handful of `md:`/`lg:`). Container is `mx-auto max-w-7xl px-5 sm:px-8`. Section padding `py-20 sm:py-24`. Anchor offset `scroll-mt-[84px]` to clear the fixed header.

## 3. Components used

| Component | How it's built |
|---|---|
| `components/hero.tsx` | Pinned 170svh scroll stage; photo + 4-layer colour grade + procedural SVG foliage at three depths; copy fades out first; scroll-cue button. |
| `components/canopy.tsx` | `PalmFrond` (rachis as quadratic Bézier, blades as tapered lens paths generated by loop) and `MonsteraLeaf` (silhouette path + splits cut with an SVG `<mask>`). Pure functions, no randomness. |
| `components/brand.tsx` | `LogoMark` — an open arch (stroke, `currentColor`) with a monstera leaf growing through it (gold, splits cut by mask, 2 per side so it holds at ~20px). `Logo` — mark + stacked FISCHER / TROPITEL wordmark, optional place line. |
| `components/site-header.tsx` | Transparent→solid on scroll; circular stone menu trigger with unequal bars; full-width dropdown panel with numbered Fraunces links. |
| `components/highlights.tsx` | Full-bleed image carousel, crossfade via `AnimatePresence`, cream content card bottom-left, `01 / 03` numeric pagination in the mono face, prev/next circles. Manual only, no autoplay. |
| Casa cards (inline in `page.tsx`) | Stacked full-width `min-h-[480px]` image cards with a `from-canopy-deep via-canopy-deep/45 to-transparent` scrim, content anchored bottom-left, `Lift` hover (`y: -6`, spring 300/24). Per-image `object-position` because two photos are portrait in a landscape box. |
| Stats band (inline) | 4 values in Fraunces at `text-4xl sm:text-5xl` in `--forest`, caption below. **No count-up** — static numbers. |
| `components/know.tsx` | Field-notes list, not tiles: sticky heading column + `<ol>` of numbered entries, hairline rules that draw themselves in, icons in gold hairline circles (`sm:` and up), monstera watermark. No boxes anywhere. |
| `components/area-map.tsx` | MapLibre GL + OpenFreeMap "liberty" style. GeoJSON circle layer for 14 places (colour by category, `feature-state` for lit/dim), symbol layer for the lit label, GeoJSON line layer for the route, HTML `Marker` for the house. Hover/click via `map.on('mousemove'|'click', 'places')`. Detail card floats bottom-left `sm:` and up, drops below the frame on mobile. Index list of all 14 below, doubling as hover control. |
| `components/reviews.tsx` | Google reviews fetched at runtime from the Worker. Renders **nothing at all** until real reviews return — no skeleton, no placeholder, no sample copy. Star row, cards with reviewer name + photo (Google attribution requirement), link back to the listing. |
| `components/contact-form.tsx` | Client component POSTing `FormData` to `/api/contact`. Honeypot field named `company`, hidden. Native `required` + `type="email"`. Only the Worker's own `error` string is ever shown to a visitor. |
| `components/ui/btn.tsx` | Variant picker only; all shape/colour/motion lives in `.btn-*` CSS. Overloaded to render `<a>` or `<button>` from the same props. |
| `components/ui/eyebrow.tsx` | Shared section label. `text-xs`, `tracking-[0.22em]`, uppercase, gold on dark / forest on light. |
| `components/animate.tsx` | `Reveal`, `Stagger`, `Item`, `Lift` — the shared Motion primitives. |
| `components/booking.tsx` | Cal.com embed, dormant. Renders `null` unless `NEXT_PUBLIC_CAL_LINK` is set. |

No dashboard patterns in this project — no tables, filters, KPI cards, charts, empty/loading states beyond the reviews section's silent-until-real behaviour, and no auth.

## 4. Stack and deploy details

**Repo layout**

```
app/[locale]/          ROOT layout — renders <html lang> per locale
  layout.tsx           metadata, generateStaticParams, JSON-LD
  page.tsx             the whole home page
  opengraph-image.tsx  per-locale OG card (next/og)
app/(redirect)/        "/" locale chooser, its own root layout
app/globals.css        tokens, button system, .topo, keyframes
app/site.ts            fonts + SITE_URL + htmlClass, shared by both root layouts
lib/i18n.ts            every string, both languages (~750 lines)
components/            see above
worker/index.ts        POST /api/contact, GET /api/reviews
```

**Two root layouts via route groups.** `app/layout.tsx` was deleted. `app/[locale]/layout.tsx` is a root layout so `<html lang>` is correct per locale in the static export. `app/(redirect)/` has its own. Fonts had to move to `app/site.ts` so both import one `next/font` instance.

**Configs that must agree**
- `next.config.ts`: `output: "export"`, `images: { unoptimized: true }`, `trailingSlash: true`.
- `wrangler.jsonc`: `assets.html_handling: "force-trailing-slash"` — must match `trailingSlash: true` or nested routes bounce between slash variants and 404. `run_worker_first: ["/api/*"]`.
- `wrangler.jsonc` `name` must match the Worker the secrets are on. There is a live Worker called **`madi-fischer`** on the KickLick Cloudflare account (`b1b6cab758c007f044de906439ead8a1`) with the Resend key on it, while the config says `fischer-tropitel`. **Unresolved mismatch** — deploying as-is would create a second, secret-less Worker.
- `app/[locale]/opengraph-image.tsx` must live under `[locale]`, and needs its own `generateStaticParams` under `output: "export"`. Moving the root layout orphaned it at `app/` and both pages silently lost `og:image`.

**Copy storage:** `lib/i18n.ts` — a single typed `Dictionary` with `en` and `es` blocks. Nothing hard-coded in components. Map geography (coordinates, Google Maps queries) deliberately lives in the component, not i18n; only names, descriptions and travel times are translated.

**Form handling:** static export has no server, so `components/contact-form.tsx` POSTs to a Cloudflare Worker. The Worker has two delivery paths, first configured wins: (1) **Resend** — `RESEND_API_KEY` secret, `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL` as plain vars in `wrangler.jsonc`, `reply_to` set to the guest so replying goes to them; (2) a generic `CONTACT_WEBHOOK_URL`. With neither set it fails loudly — a dropped lead that looked like a success is the worst outcome. Visitor input is HTML-escaped before it reaches the email body. No Dayframer, no Snipcart.

**SEO files:** `app/robots.ts`, `app/sitemap.ts`, `app/[locale]/opengraph-image.tsx`, JSON-LD `LodgingBusiness` in the locale layout (with `hasMap`, `sameAs`, landmark `streetAddress`, `numberOfRooms`, `amenityFeature`; `geo` deliberately omitted rather than guessed), canonical + three hreflang alternates (`en`, `es`, `x-default`).

**Fonts:** Google via `next/font/google` (Fraunces + Fustat), self-hosted at build time by Next. Chosen over self-hosting files because `next/font` already inlines and preloads them; the build environment must reach `fonts.googleapis.com`.

**Deployment/delivery:** **Not delivered.** Nothing deployed, nothing pushed. Twelve commits sit on local branch `redesign/site-refresh`. `git push` fails — the only credential on the machine is an SSH key authenticating as `mrtonyturns`, which lacks write access to `dmrmediateam/Madi-Fischer`. `origin` was switched from HTTPS to SSH during the attempt. Cloudflare deploy was started then cancelled by Tony; `wrangler` was never authenticated (`wrangler login` is an interactive browser OAuth flow).

## 5. Copy rules

**Voice:** first-person plural, plain, concrete, slightly wry. Short declaratives. Specifics over adjectives ("monkeys not guaranteed but very likely", "bring sandals you don't mind getting muddy", "the longest day on this map and the one people talk about afterwards"). The honesty section is the tonal anchor: *"This is the jungle, not a resort — and that's the point."* Footer sign-off is the client's own phrase, `rights: "Pura vida."`

**Claims removed or hedged:**
- Map caption said *"Travel times are real ones, measured from our gate."* Untrue — only one number was sourced. Rewritten to *"Driving times are approximate and assume dry-season roads; ask us before you plan a day around one."*
- `geo` coordinates omitted from JSON-LD rather than estimated: wrong coordinates on a lodging listing send guests up the wrong mountain road.
- House marker on the map carries an explicit "approximate" label because it sits on the Hot Springs Lodge, ~200m short of the real gate.
- Reviews section renders nothing rather than showing placeholder reviews — invented reviews on a rental listing are fraud.
- Casa Verde's cold-water disclosure was toned down on Tony's instruction (see §6), but kept in two places.

**How real numbers/quotes were sourced:**
- Prices, casa names, bed/bath counts, the shared-deck arrangement, the 20-minute hot-springs walk, the 4WD road, solar + generator, caretakers, wildlife, the two seasons, the neighbours disclosure — all lifted from the Otter.ai transcript of Tony's 29-minute call with Madi (2026-07-02).
- Five added map places (Damas Island mangroves, Villa Vanilla, Playa Biesanz, Santa Juana, Quepos Saturday feria) verified by web search before publishing.
- Map coordinates geocoded one-off against OSM Nominatim (rate-limited, identifying User-Agent), each result sanity-checked against a lat/lon bounding box. Three results were rejected as wrong or missing and replaced with web-verified values.
- **Travel times are the exception: all but one are estimates** and remain unconfirmed.

**Footer credit / legal entity:** `© {year} Fischer Tropitel. Pura vida.` No agency credit, no legal entity line, no privacy/terms links. Contact block carries `+1 (715) 348-4887`, `madilyn.fischer1991@gmail.com`, and the landmark address.

## 6. My corrections — verbatim

> "I hate the button style. I want the website to look of comfort, exotic, and tropical vibes without looking corny. Do deep research into button designs that will help reflect that and completely redesign the buttons, the tile grid sections of know before you go."

Chamfered "corporate pill" buttons and the 2×2 card grid were both discarded. Buttons became "riverstone"; Know-before-you-go became a numbered field-notes list with no boxes.

> "Instead of having tiles for the fishing and adventure section, I want an interactive map built that showcases the different local attractions that are on the map."

Four image cards replaced by a map.

> "Create a decent logo for Fischer Tropitel that can be used across the website instead of the text that you currently have. I also I hate the header design but love the hamburger menu dropdown. Basically redesign the menu icon in the upper right hand corner. Also completely redesign the hero section because I want it to look way better."

Arch + monstera logo built; header rebuilt transparent-over-hero; menu trigger became a circle with unequal bars; **dropdown panel kept** — explicitly liked.

> "Also I want to have a really cool and unique animation when scrolling from the hero section to the rest of the website. Do deep research into animation ideas that use JSON, java script, etc"

Pinned five-layer scroll choreography. Lottie (the "JSON") was declined — it needs an authored After Effects file and can't respond to layout.

> "check to make sure that we have all of the different things that she wanted on the website. If there's anything we missed, create a game plan with a numbered list of the items we need to add and don't start building until you get my approval on what path to go."

Full transcript audit produced a 17-item numbered gap list; **no code written until approval.**

> "Just use www.airbnb.com for now. Also rename the buttons to book now when going to airbnb"

`AIRBNB_URLS` filled with placeholder homepage links; label became "Book now" / "Reservar ahora".

> "there is no video file at the moment. Just do a picture on the hero section for now like you have"

Video section dropped entirely; hero photo kept.

> "There's a large white space directly under the header animation so it looks very disconjointed. Fix that"

The rising "ground" was an empty cream panel that covered the screen, forcing a full viewport of blank to scroll past. Deleted; the real page content now rises instead.

> "I'm not sure about the button design. I want you to build 4 more button designs and show me each of them and I'll pick my favorite"

Five designs (Riverstone, Leaf, Hairline, Field stamp, Horizon) built as a live artifact.

> "Show me a preview on a blank page of each of them so I can see them"

Rebuilt as a one-at-a-time viewer with A–E tabs and a Hero/Page ground toggle.

> "I actually like the riverstone so continue using that"

No change — riverstone was already live. Exploration scaffolding removed.

> "I don't like the yellow buttons at all. restyle them"

Primary re-hued gold → bone. Variant renamed `sun` → `stone` and driven by four `--stone-*` tokens. Secondary changed from a solid cream fill to a 22% wash so it stopped twinning the pale primary.

> "Remove the heads up portion. or make it far less noticeable"

Solid gold block + warning triangle + bold "HEADS UP ·" label replaced with 14px cream at 55% opacity behind a hairline rule; copy rewritten calmer. Noted at the time that Madi had asked for it "flashing."

> "I don't like the words with the long lines at the beginning of the phrases across the sections of the website"

The `—— EYEBROW` rule removed from all six section labels; four hand-rolled copies consolidated into `components/ui/eyebrow.tsx`; size 11px→12px and tracking 0.28em→0.22em so the label holds on its own.

> "check the ui for errors and the website for bugs"

Full audit. Four real bugs fixed (see §8).

> "Redesign the scroll tool because I don't like the look of it. Make the fix to the spanish page you mentioned"

Label + hairline + gold bead replaced with a 48px circle matching the menu trigger, now a working control. Spanish `<html lang>` fixed at the source by restructuring to two root layouts.

> "Cloudflare is connected, so I want you to deploy it to cloudflare so I can view"

Blocked — `wrangler` unauthenticated.

> "1. I'll change the links later 2. configure this for the email tony@kicklick.com for now so all submission get sent there 3. disregard this portion"

Worker gained real email delivery via Resend; `CONTACT_TO_EMAIL: "tony@kicklick.com"` in `wrangler.jsonc`.

> "Actually don't package this up for cloudflare. I want to push it to Github"

Cloudflare deploy abandoned; work committed to a branch.

> "added the resend api key secret variable to cloudflare as RESEND_API_KEY"

Flagged that it landed on Worker `madi-fischer` while the config says `fischer-tropitel`.

> "If all else fails, I can push it manually"

> "Look at the folder I originally attached and make sure it's ready for me to push it to github manually"

Fresh-clone build test; README rewritten from create-next-app boilerplate; last two lint errors fixed.

> "Remove this from the website." *(screenshot of the wave divider)*

`RidgeEdge` deleted from both usages and the component removed.

> "I love that when you hover over the different dots, they actually show you... or they actually draw a line. I think that's really cool. I like that. Keep that. I like to have the central houses that you are here. I wish... I need that to be a house icon instead, though. Um, I don't like the pillboxes above it. And I also want... instead of having it... giving it the option to ask about dates as the call to action, I want you to have get directions... and I want you to include more things on there than just that. And as far as the map goes, I love the map. I just don't like the pill boxes."

**Kept:** route-on-hover, centre house marker, the map itself. **Changed:** arch marker → house icon; filter pills removed entirely; "Ask about dates" → "Get directions" into Google Maps; 9 places → 14.

> "Also part of the leaf on the header is getting cut off as well" … "Hero section, not the header"

All three foliage SVGs were clipping their own content at the viewBox edge (right frond overflowed by 143 units). Fixed with `overflow: visible`.

> "I like A. Build out A. Then make the entire site mobile friendly"

Wall-map layout built; full mobile pass (see §8).

> "ensure that everything is organized and ready to push"

Dead export removed, README gained a map-marker guide.

> "I want you to use an actual google terrain map instead of the clip art map that's currently being used on the website"

> "Also reposition the pictures for casa cascada and loads of toads because they don't show the houses, they show mostly the roofs"

Per-image `object-position`: `center 62%` for Casa Cascada, `center 64%` for Loads of Toads. Casa Verde is landscape and stayed centred.

> "Show me a preview of the changes and what was just built"

> "I'm not seeing the updated map as well either."

Server was serving correctly; dev server restarted with `.next` cleared.

> "Also re pull the file that you created with the different button examples so I can review them again. Also remove the private pool, 20 minute walk to hot springs, and sleeps 6 per casa - 12... from the hero section"

Hero fact row and the `facts` i18n key deleted from both locales.

> "Not the colors, show me the different button designs"

The shapes artifact had been republished over with colourways. Rebuilt as a separate artifact.

> "Rebuild all of the buttons on the website so they are the Leaf style"

Whole button block rewritten. Riverstone's gradient, shadow, hover lift and arrow disc all removed.

> "do it"

Bare arrow (no disc) restored to leaf buttons.

> "also ensure that all of the travel times are accurate on the website map"

Caption corrected; two internally contradictory numbers changed.

> "Use a map from a different source"

Drawn SVG map replaced with MapLibre + OpenFreeMap.

**Specified values Tony gave directly:** `www.airbnb.com` (placeholder link), `tony@kicklick.com` (form destination), `RESEND_API_KEY` (secret name). No hex codes, font names or sizes were ever specified by Tony — every colour, face and size was proposed and then accepted or rejected by eye.

## 7. Forks and picks

| Fork | Options | Recommended | Picked | Against recommendation? |
|---|---|---|---|---|
| Transcript gap list — booking | (a) wire Airbnb now (b) build it, URLs later (c) contact form only | (a) | **Custom:** "Just use www.airbnb.com for now" + rename to "Book now" | Neither — a fourth option |
| Transcript gap list — video | (a) send it, then decide (b) plan for a video hero (c) own section, not the hero | (a) send it first | **(c)** own section — then reversed a message later ("there is no video file at the moment") | Yes, then moot |
| Transcript gap list — scope | multi-select: content gaps / fix contact form / reviews+GBP+directions / analytics | all four | **content gaps + reviews/GBP/directions** — declined the form fix and analytics | Partly |
| Button shapes | A Riverstone, B Leaf, C Hairline, D Field stamp, E Horizon | "B on the hero, C as its secondary" | **A Riverstone** | Yes |
| Button colourways | Bone, Terracotta, Fern, Sea, Gold | Bone (already shipped) | **Bone** (implicitly — moved on) | No |
| Map section design | A Wall map (map-dominant, floating card, index strip) / B Guide (sticky map + typographic index) | "A is a display piece, B is a reference… B is what someone actually planning a week would want" | **A** | Yes |
| Map provider — key/billing | (a) create a Google key (b) build it, key later (c) real terrain, no key or bill | (a) Google — "the only path that gives you real terrain without a licensing question" | **(c)** no key or bill | Yes — and the option turned out not to exist for a commercial site; every free terrain provider is non-commercial only. Resolved by switching to OpenFreeMap (real OSM geography, no terrain shading) |
| Map anchor coordinates | (a) get them from Madi (b) anchor on Hot Springs Lodge (c) no house pin | (a) real coordinates | **(b)** Hot Springs Lodge, labelled approximate | Yes |
| Button shape, second pass | A–E again | none offered | **B Leaf** — reversing the earlier Riverstone pick | n/a |

Pattern: Tony went against the recommendation on **5 of 8** forks, and reversed his own earlier pick once (Riverstone → Leaf).

## 8. What went wrong

**Shipped broken, found later**
- **Empty rising panel in the hero.** The "ground rising to meet you" was a blank cream sheet that covered the viewport at the end of the pin, forcing a full screen of nothing to scroll past. Found by Tony, not by testing.
- **Scroll transforms that reversed.** `useTransform` ranges ending before progress 1 did not hold their final value: hero copy faded out at 35% then faded back **in** to full opacity over the section below. Reproduced in the production build, so not a dev artifact. Fix: every range lands its last keyframe on 1.
- **Contact form printed raw JS errors to visitors.** A non-JSON response made `err.message` visitor-facing: `Unexpected token 'S', "Server act"... is not valid JSON`. Would have hit real people on any Worker hiccup.
- **Three map markers sat in the ocean**, including Manuel Antonio National Park. Positions had been eyeballed. Caught by testing each coordinate against the coastline path with `isPointInFill`.
- **Map caption asserted measured travel times** that were estimates.
- **Foliage SVGs clipped their own content** at the viewBox edge — a hard straight cut mid-blade, right frond overflowing by 143 units.
- **Heading order skipped a level** (H1 → H3 → H2): the carousel's `<h3>` preceded the page's first `<h2>`.
- **Hydration mismatch on every Spanish page load**, and `/es/index.html` shipped `lang="en"` to crawlers.
- **`og:image` silently disappeared from both pages** when the root layout moved — `opengraph-image.tsx` was orphaned outside the layout tree.
- **Map markers were untappable on mobile.** Each button's hit box was as wide as its own label (128px) because the invisible name sat in the flow; neighbouring pins overlapped each other's targets.
- **Form inputs were 36px tall**; nine text links were 16–32px.
- **`padding` on inline elements does nothing.** Bit twice — the collapsible row body in an artifact, and the contact/footer links, where the first fix appeared to do nothing until `inline-block` was added.
- **MapLibre's stylesheet sets `.maplibregl-map { position: relative }`**, overriding `absolute inset-0` and collapsing the map container to zero height.

**Diagnosis failures worth recording**
- Spent many turns debugging a 1px MapLibre canvas and missing tiles. Root cause: the Browser pane reported a **0×0 viewport**. Should have checked viewport dimensions first.
- Repeatedly reported "route not drawing" from synthetic `mouseenter` events, which never reach React's delegation (it synthesises `onMouseEnter` from `mouseover`). Verified properly by reading handlers off the React fiber.
- "Smooth scroll is a no-op" — the pane resizing mid-test.
- Corrected a travel time in the wrong direction: Rainmaker 25 → 45 min, before real coordinates showed it is 9.8 km from the house, closer than Quepos. Still wrong in the repo.

**Handoff problems**
- `git push` blocked on GitHub permissions for the whole session.
- Cloudflare Worker name mismatch (`fischer-tropitel` in config vs `madi-fischer` live with the secrets).
- macOS `" 2"` duplicate files in `.next` broke a `tsc` run.
- The Browser pane returned stale composites for most of the session, so almost all verification had to be DOM measurement and served-HTML greps rather than screenshots.

## 9. Lessons for the next build

- **Get the client's real coordinates before designing anything map-shaped.** Everything downstream — the marker, every route origin, `geo` in the structured data, every travel time — keys off one lat/lng that only the client has. Not having it blocked three separate deliverables across the session.
- **"Free map tiles" is a trap for commercial sites.** OpenTopoMap, Esri World Terrain, MapTiler free and Stadia free are all non-commercial-only. OpenFreeMap (no key, no account, commercial permitted) or a self-hosted Protomaps `.pmtiles` are the licensable options. Check terms before offering the option, not after the client picks it.
- **Any scroll-linked `useTransform` must end its input range at 1**, flat tail included. An early-terminating range silently reverses.
- **Test marker positions programmatically**, not by eye. `isPointInFill` against the coastline caught three markers in the sea that looked fine in a screenshot.
- **Never let an internal error string reach a visitor.** Only echo the server's own `error` field; everything else becomes the generic line.
- **Vertical padding on an inline element does nothing** — `inline-block` first. This wasted two rounds of "the fix didn't work."
- **Third-party CSS can beat your utility classes.** MapLibre's `.maplibregl-map { position: relative }` collapsed the container. Pair defensive CSS with a ResizeObserver for any map in an `aspect-ratio` box.
- **Never invent placeholder reviews or testimonials**, not even as an empty state that implies they exist. Render nothing until the data is real.
- **When a client says "make it flashing," build the loudest *static* treatment** — literal flashing is a seizure risk — and say why. Then flag it if a later instruction tones it down against the end client's stated wish.
- **Verify against the served HTML, not the preview pane.** `curl | grep` and DOM measurement were reliable all session; screenshots were not. Check `innerWidth/innerHeight` before trusting any visual diagnosis.
- **Client-supplied photography sets the ceiling.** Documentary real-estate shots (flat skies, no interiors, no lifestyle) forced the mood to come from art direction — colour grading and drawn foliage. Say early that real photos beat further design work.

## 10. Methodology observations

**What Tony gave to start:** a GitHub folder already containing a working Next.js site (not a blank brief), plus "I'm gonna attach some notes down the road." The notes arrived four exchanges later as an **Otter.ai link to a 29-minute recorded call with the end client** — the source of every fact on the site. He did not write a brief; he handed over a recording and expected it to be mined.

**Order of work:** compile and preview first → one large art-direction rejection → transcript audit against the build → then a long tail of single-issue corrections, each one message, each usually one sentence. Late-session he switched to infrastructure (deploy, push, readiness), then returned to design (buttons, map source). Not a linear brief-to-launch; a loop of look → react → correct.

**How he judged the work:** almost entirely by **looking**. Repeated demands to see things — "show me a preview," "display them for me so I can see both visually," "Show me a preview of the changes and what was just built," "I'm not seeing the updated map as well either." He sent **screenshots of defects** (the wave divider, the clipped frond) rather than describing them, twice, and corrected his own screenshot once ("Hero section, not the header"). He never asked to read code and never commented on implementation.

**How decisions were phrased:** blunt and short. Reactions lead with feeling — "I hate the button style," "I don't like the yellow buttons at all," "I love that when you hover… I think that's really cool." Instructions are imperative and unhedged — "do it," "Build out A," "Use a map from a different source." He states what he *likes* explicitly so it survives a redesign ("love the hamburger menu dropdown," "I love the map. I just don't like the pill boxes"). Voice-to-text is common and self-corrects mid-sentence ("not a three unit, but three separate rentals").

**What he asked to be researched:** he twice used the phrase "do deep research" — into button design, into interactive maps on other sites, and into scroll-animation techniques ("that use JSON, java script, etc"). Research was requested for *aesthetic direction*, never for technical implementation. He also asked for a verification pass twice: "check the ui for errors and the website for bugs" and "ensure that all of the travel times are accurate."

**Delegated fully vs. wanted options:**
- **Fully delegated:** copy (all of it, both languages), the logo, section architecture, the whole mobile pass, accessibility, SEO, the Worker, bug fixes, README, commit structure. He never reviewed or edited a line of copy.
- **Wanted options:** anything with a visible aesthetic identity — button shapes (asked for 4 more, then a blank-page viewer), the map section (explicitly "redesign the section two different ways… I will pick out my favorite"), and colourways. His instinct on a design he was unsure about was always *give me alternatives side by side, live, one at a time*, never *describe them to me*.
- **Overrode recommendations often** — 5 of 8 forks — and reversed himself once on buttons (Riverstone → Leaf). Recommendations were read but not deferred to.

**Process constraints he set:** "don't start building until you get my approval on what path to go" — after the transcript audit he wanted a numbered plan and a decision point before code. That was the only time he asked for a plan first; every other change was executed immediately.

**Delivery expectations:** he moved the target twice — Cloudflare deploy → "Actually don't package this up for cloudflare. I want to push it to Github" → "If all else fails, I can push it manually." He wanted the artifact in his own hands rather than a live URL, and asked twice for a readiness check before pushing.
