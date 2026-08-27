"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import * as React from "react";

import { Btn } from "@/components/ui/btn";

/**
 * THE AREA MAP
 *
 * This replaces the grid of image cards that used to describe the area. A grid
 * tells you a place exists; a map tells you where it is relative to your bed,
 * which is the actual question a guest is asking.
 *
 * Design notes:
 * — The terrain is hand-drawn SVG rather than a tile provider. Google/Mapbox
 *   tiles would drag in an API key, a per-load bill, and a grey-and-white
 *   aesthetic that fights everything else on the page. A stylised map is also
 *   honest about what it is: an orientation sketch, not a navigation tool.
 * — Terrain is SVG; pins are HTML positioned in percentages on top of it. That
 *   split means pins get real focus rings, real hover states and real
 *   keyboard behaviour for free.
 * — Selecting a place draws the route from the property out to it. That single
 *   line is what makes the section feel like a map instead of an illustration.
 *
 * COORDINATES are percentages of the frame, and they are deliberately
 * schematic: the coast, the ridge and the relative bearings are right, the
 * scale is not. `travel` copy carries the real numbers.
 */

export type PlaceCategory = "fishing" | "nature" | "adventure";

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  /** e.g. "25 min by car" — the real distance, since the map is not to scale. */
  travel: string;
  text: string;
}

export interface MapLabels {
  all: string;
  fishing: string;
  nature: string;
  adventure: string;
  /** Name shown on the property marker. */
  baseName: string;
  baseMeta: string;
  /** Small print under the frame. */
  note: string;
  cta: string;
  ctaHref: string;
  pacific: string;
  hint: string;
  directionsCta: string;
  mapsCta: string;
  /** The property's own Google listing, linked under the frame. */
  listingUrl: string;
  listingCta: string;
}

interface Spot {
  /** Position in the frame, as % of width / height. */
  x: number;
  y: number;
  /**
   * What to hand Google Maps. `dir` builds a directions link to a named
   * landmark; `search` is for the entries that are an activity rather than a
   * single address (canopy tours, jet ski rentals, a whole river), where
   * routing to one arbitrary operator would be misleading.
   */
  maps: { q: string; kind: "dir" | "search" };
}

const POS: Record<string, Spot> = {
  "hot-springs": {
    x: 62,
    y: 32.5,
    maps: { q: "Hot Springs Lodge, Quepos, Costa Rica", kind: "dir" },
  },
  "quepos-marina": {
    x: 30,
    y: 56.5,
    maps: { q: "Marina Pez Vela, Quepos, Costa Rica", kind: "dir" },
  },
  "manuel-antonio": {
    x: 39.5,
    y: 71.5,
    maps: { q: "Manuel Antonio National Park, Costa Rica", kind: "dir" },
  },
  "playa-espadilla": {
    x: 33.5,
    y: 78,
    maps: { q: "Playa Espadilla, Manuel Antonio, Costa Rica", kind: "dir" },
  },
  rainmaker: {
    x: 66,
    y: 19,
    maps: { q: "Rainmaker Conservation Park, Costa Rica", kind: "dir" },
  },
  savegre: {
    x: 74.5,
    y: 62,
    maps: { q: "Savegre River rafting Costa Rica", kind: "search" },
  },
  nauyaca: {
    x: 85,
    y: 82,
    maps: { q: "Nauyaca Waterfalls, Costa Rica", kind: "dir" },
  },
  canopy: {
    x: 46,
    y: 45.5,
    maps: { q: "canopy tour Quepos Costa Rica", kind: "search" },
  },
  "jet-ski": {
    x: 35.5,
    y: 65.5,
    maps: { q: "jet ski rental Manuel Antonio Costa Rica", kind: "search" },
  },
};

/** Google Maps universal URLs — no API key, works on desktop and in the app. */
function mapsUrl({ q, kind }: Spot["maps"]): string {
  const query = encodeURIComponent(q);
  return kind === "dir"
    ? `https://www.google.com/maps/dir/?api=1&destination=${query}`
    : `https://www.google.com/maps/search/?api=1&query=${query}`;
}

/** The property. Everything else is measured from here. */
const BASE = { x: 54.5, y: 39.5 };

const CATEGORY_COLOR: Record<PlaceCategory, string> = {
  fishing: "var(--clay)",
  nature: "var(--moss)",
  adventure: "var(--sun-deep)",
};

export function AreaMap({
  places,
  labels,
}: {
  places: Place[];
  labels: MapLabels;
}) {
  const reduce = useReducedMotion();
  const [filter, setFilter] = React.useState<PlaceCategory | "all">("all");
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [hoverId, setHoverId] = React.useState<string | null>(null);

  const visible = places.filter(
    (p) => filter === "all" || p.category === filter,
  );

  /**
   * Selecting a place and then filtering it away would leave a route drawn to
   * a pin that is no longer on the map, so the selection is dropped in the
   * same event that changes the filter — an effect would only fix it a render
   * later, after the orphaned route had already painted.
   */
  function changeFilter(next: PlaceCategory | "all") {
    setFilter(next);
    const selected = places.find((p) => p.id === activeId);
    if (selected && next !== "all" && selected.category !== next) {
      setActiveId(null);
    }
  }

  const active = places.find((p) => p.id === activeId) ?? null;
  const lit = hoverId ?? activeId;

  const filters: { key: PlaceCategory | "all"; label: string }[] = [
    { key: "all", label: labels.all },
    { key: "fishing", label: labels.fishing },
    { key: "nature", label: labels.nature },
    { key: "adventure", label: labels.adventure },
  ];

  return (
    <div>
      {/* ---- Filters ---- */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const on = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => changeFilter(f.key)}
              aria-pressed={on}
              className={`rounded-full border px-4 py-2 text-[0.8125rem] font-semibold transition-all duration-300 ${
                on
                  ? "border-canopy bg-canopy text-cream shadow-[0_6px_16px_-6px_rgba(0,0,0,0.4)]"
                  : "border-canopy/18 text-canopy/70 hover:border-canopy/45 hover:text-canopy"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.45fr_1fr] lg:gap-8">
        {/* ---- The map ---- */}
        <div>
          <div className="relative aspect-square overflow-hidden sm:aspect-4/3 rounded-2xl border border-canopy/10 bg-[oklch(0.95_0.02_100)] shadow-[0_24px_60px_-30px_rgba(11,46,34,0.45)] sm:rounded-[28px]">
            <Terrain />

            {/* The ocean label is HTML, not SVG <text>: the terrain viewBox is
                stretched to the frame (preserveAspectRatio="none"), which would
                squash any type drawn inside it. */}
            <span
              className="pointer-events-none absolute top-[62%] left-[8%] origin-left rotate-[56deg] text-[0.625rem] font-semibold tracking-[0.42em] text-[oklch(0.45_0.06_220)]/60 uppercase sm:text-xs"
              aria-hidden
            >
              {labels.pacific}
            </span>

            {/* Route from the property to the selected place */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 h-full w-full"
              aria-hidden
            >
              <AnimatePresence>
                {active ? (
                  <motion.path
                    key={active.id}
                    d={routePath(BASE, POS[active.id])}
                    fill="none"
                    stroke={CATEGORY_COLOR[active.category]}
                    /* The frame is not square, so the viewBox is stretched.
                       A non-scaling stroke keeps the dashes round and even
                       instead of squashing them along one axis. */
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeDasharray="4 7"
                    vectorEffect="non-scaling-stroke"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: reduce ? 0.001 : 0.75,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                ) : null}
              </AnimatePresence>
            </svg>

            {/* The property */}
            <BaseMarker name={labels.baseName} meta={labels.baseMeta} />

            {/* Places */}
            {visible.map((place) => (
              <Pin
                key={place.id}
                place={place}
                pos={POS[place.id]}
                active={activeId === place.id}
                lit={lit === place.id}
                dimmed={lit !== null && lit !== place.id}
                onSelect={() =>
                  setActiveId((id) => (id === place.id ? null : place.id))
                }
                onHover={(on) => setHoverId(on ? place.id : null)}
              />
            ))}

            {/* Compass */}
            <svg
              viewBox="0 0 40 40"
              className="absolute top-4 right-4 h-9 w-9 text-canopy/35 sm:top-5 sm:right-5 sm:h-10 sm:w-10"
              aria-hidden
            >
              <circle
                cx="20"
                cy="20"
                r="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
              <path d="M20 7 23 20 20 17 17 20Z" fill="currentColor" />
              <text
                x="20"
                y="35"
                textAnchor="middle"
                fontSize="8"
                fill="currentColor"
                fontWeight="700"
              >
                N
              </text>
            </svg>
          </div>

          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <p className="max-w-xl text-xs text-muted-foreground">
              {labels.note}
            </p>
            <a
              href={labels.listingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-xs font-semibold text-forest underline-offset-4 hover:underline"
            >
              {labels.listingCta}
            </a>
          </div>
        </div>

        {/* ---- The list / detail rail ---- */}
        <div className="flex flex-col">
          <AnimatePresence mode="wait">
            {active ? (
              <motion.article
                key={active.id}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
                transition={{ duration: reduce ? 0.001 : 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-canopy/10 bg-card p-6 shadow-[0_18px_44px_-28px_rgba(11,46,34,0.5)] sm:p-7"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLOR[active.category] }}
                    aria-hidden
                  />
                  <span className="text-[0.6875rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                    {labels[active.category]}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-2xl leading-tight font-normal text-canopy">
                  {active.name}
                </h3>
                <p className="mt-2 text-sm font-semibold text-forest">
                  {active.travel}
                </p>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {active.text}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <Btn href={labels.ctaHref} variant="canopy" size="sm">
                    {labels.cta}
                  </Btn>
                  <Btn
                    href={mapsUrl(POS[active.id].maps)}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="trail"
                  >
                    {POS[active.id].maps.kind === "dir"
                      ? labels.directionsCta
                      : labels.mapsCta}
                  </Btn>
                </div>
              </motion.article>
            ) : (
              <motion.p
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0.001 : 0.25 }}
                className="rounded-2xl border border-dashed border-canopy/20 bg-secondary/50 p-6 text-[0.9375rem] leading-relaxed text-muted-foreground sm:p-7"
              >
                {labels.hint}
              </motion.p>
            )}
          </AnimatePresence>

          <ul className="mt-4 grid gap-1.5">
            {visible.map((place) => {
              const on = activeId === place.id;
              return (
                <li key={place.id}>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveId((id) => (id === place.id ? null : place.id))
                    }
                    onMouseEnter={() => setHoverId(place.id)}
                    onMouseLeave={() => setHoverId(null)}
                    onFocus={() => setHoverId(place.id)}
                    onBlur={() => setHoverId(null)}
                    aria-pressed={on}
                    className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left transition-colors duration-200 ${
                      on ? "bg-canopy/6" : "hover:bg-canopy/4"
                    }`}
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full transition-transform duration-300"
                      style={{
                        backgroundColor: CATEGORY_COLOR[place.category],
                        transform: on ? "scale(1.6)" : "scale(1)",
                      }}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1 truncate text-[0.9375rem] font-medium text-canopy">
                      {place.name}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {place.travel}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

/**
 * A gentle arc from the property to a place. The control point is pushed off
 * the straight line by a fixed fraction of its perpendicular, so every route
 * bows the same way and none of them run straight through a pin.
 */
function routePath(
  from: { x: number; y: number },
  to: { x: number; y: number },
): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const mx = from.x + dx / 2;
  const my = from.y + dy / 2;
  const cx = mx - dy * 0.16;
  const cy = my + dx * 0.16;
  return `M${from.x} ${from.y} Q${cx} ${cy} ${to.x} ${to.y}`;
}

function BaseMarker({ name, meta }: { name: string; meta: string }) {
  return (
    <div
      className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${BASE.x}%`, top: `${BASE.y}%` }}
    >
      <div className="flex flex-col items-center">
        <span className="relative flex h-9 w-9 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-canopy/25 [animation-duration:3s]" />
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-canopy shadow-[0_6px_18px_-6px_rgba(11,46,34,0.9)] ring-3 ring-cream">
            {/* The arch from the logo, at marker scale. */}
            <svg viewBox="0 0 48 48" className="h-5 w-5" fill="none" aria-hidden>
              <path
                d="M9 42V24.5a15 15 0 0 1 30 0V42"
                stroke="var(--sun)"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </span>
        <span className="mt-1.5 rounded-full bg-canopy px-2.5 py-1 text-[0.625rem] font-bold tracking-[0.1em] whitespace-nowrap text-cream uppercase shadow-md">
          {name}
        </span>
        <span className="mt-1 hidden rounded-full bg-cream/90 px-2 py-0.5 text-[0.5625rem] font-medium whitespace-nowrap text-canopy/75 sm:block">
          {meta}
        </span>
      </div>
    </div>
  );
}

function Pin({
  place,
  pos,
  active,
  lit,
  dimmed,
  onSelect,
  onHover,
}: {
  place: Place;
  pos: { x: number; y: number };
  active: boolean;
  lit: boolean;
  dimmed: boolean;
  onSelect: () => void;
  onHover: (on: boolean) => void;
}) {
  const color = CATEGORY_COLOR[place.category];
  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      aria-pressed={active}
      aria-label={`${place.name} — ${place.travel}`}
      className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-canopy"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        opacity: dimmed ? 0.45 : 1,
        transition: "opacity 260ms ease",
      }}
    >
      <span className="flex flex-col items-center">
        <span
          className="block rounded-full ring-2 ring-cream transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            backgroundColor: color,
            width: lit ? 20 : 14,
            height: lit ? 20 : 14,
            boxShadow: lit
              ? `0 0 0 6px color-mix(in oklch, ${color} 22%, transparent), 0 8px 18px -6px rgba(11,46,34,0.7)`
              : "0 4px 10px -4px rgba(11,46,34,0.6)",
          }}
        />
        <span
          className="pointer-events-none mt-1.5 max-w-[9rem] rounded-full bg-cream/95 px-2 py-0.5 text-[0.625rem] leading-tight font-semibold whitespace-nowrap text-canopy shadow-sm transition-all duration-300"
          style={{
            opacity: lit ? 1 : 0,
            transform: lit ? "translateY(0)" : "translateY(-4px)",
          }}
        >
          {place.name}
        </span>
      </span>
    </button>
  );
}

/**
 * The terrain. Bands run parallel to the coast and get darker inland, which is
 * how a relief map reads elevation — here it also happens to be true: the
 * property sits well above the town.
 */
function Terrain() {
  return (
    <svg
      viewBox="0 0 1000 750"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      {/* Lowland */}
      <rect width="1000" height="750" fill="oklch(0.93 0.03 106)" />

      {/* Elevation terraces, coast-parallel and increasingly inland */}
      <path
        d="M0 195 C140 255 250 325 350 410 C445 490 530 595 610 715 L640 750 L1000 750 L1000 0 L0 0 Z"
        fill="oklch(0.88 0.055 128)"
      />
      <path
        d="M175 0 C255 120 355 240 455 350 C555 460 645 590 725 750 L1000 750 L1000 0 Z"
        fill="oklch(0.8 0.075 140)"
      />
      <path
        d="M400 0 C470 130 560 260 650 380 C740 500 820 640 880 750 L1000 750 L1000 0 Z"
        fill="oklch(0.7 0.085 150)"
      />
      <path
        d="M640 0 C690 140 760 270 830 390 C900 510 950 640 985 750 L1000 750 L1000 0 Z"
        fill="oklch(0.6 0.09 155)"
      />

      {/* Contour hairlines */}
      <g
        fill="none"
        stroke="oklch(0.42 0.06 155)"
        strokeWidth="1.4"
        opacity="0.22"
      >
        <path d="M85 100 C205 175 315 255 415 345 C515 435 600 555 675 690" />
        <path d="M290 0 C370 130 465 250 565 360 C665 470 750 605 815 750" />
        <path d="M520 0 C585 140 665 265 750 385 C830 500 895 630 940 750" />
      </g>

      {/* Rivers */}
      <g
        fill="none"
        stroke="oklch(0.82 0.055 220)"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.85"
      >
        <path d="M760 60 C700 190 630 285 545 350 C455 420 380 428 300 432" />
        <path d="M960 300 C880 375 800 450 715 500 C635 548 585 620 548 700" />
      </g>

      {/* The coast road, dashed the way a route is drawn on a paper map */}
      <path
        d="M40 175 C165 245 275 320 370 405 C465 490 545 600 615 720"
        fill="none"
        stroke="oklch(0.98 0.01 90)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="16 12"
        opacity="0.9"
      />

      {/* Ocean */}
      <path
        d="M0 250 C120 300 210 360 300 430 C390 500 470 590 540 700 C562 745 578 750 590 750 L0 750 Z"
        fill="oklch(0.79 0.075 218)"
      />
      {/* Surf line */}
      <path
        d="M0 250 C120 300 210 360 300 430 C390 500 470 590 540 700 C562 745 578 750 590 750"
        fill="none"
        stroke="oklch(0.95 0.03 210)"
        strokeWidth="5"
      />
      {/* Swell */}
      <g
        fill="none"
        stroke="oklch(0.9 0.04 215)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.75"
      >
        <path d="M0 350 C90 395 165 450 235 520 C300 585 355 665 395 750" />
        <path d="M0 460 C70 500 130 550 185 615 C230 668 268 710 292 750" />
      </g>
    </svg>
  );
}
