"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import * as React from "react";

import { Btn } from "@/components/ui/btn";

/**
 * THE AREA MAP — "wall map"
 *
 * The map carries the whole section. Nothing sits above it: the category
 * filters are gone, because filtering a fourteen-item map hides things people
 * came to see. Categories survive only as the colour of a marker and a label
 * on the detail card.
 *
 * Hovering anything — a marker or a name in the index below — draws the route
 * from the house and dims everything else. Clicking opens the detail card with
 * a link straight into Google Maps directions.
 *
 * The terrain is hand-drawn SVG rather than a tile provider: no API key, no
 * per-load bill, and no grey-and-white aesthetic fighting the rest of the page.
 * Terrain is SVG; markers are HTML positioned in percentages on top of it, so
 * they get real focus rings and keyboard behaviour for free.
 *
 * COORDINATES are percentages of the frame and deliberately schematic — the
 * coast, the ridge and the bearings are right, the scale is not. Every one was
 * checked against the coastline path so no marker sits in the sea; three of
 * them used to, including the national park.
 */

export type PlaceCategory = "fishing" | "nature" | "adventure" | "town";

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  /** e.g. "25 min by car" — the real number, since the map is not to scale. */
  travel: string;
  text: string;
}

export interface MapLabels {
  fishing: string;
  nature: string;
  adventure: string;
  town: string;
  baseName: string;
  note: string;
  hint: string;
  pacific: string;
  directionsCta: string;
  mapsCta: string;
  listingUrl: string;
  listingCta: string;
}

interface Spot {
  x: number;
  y: number;
  /**
   * `dir` builds a directions link to a named landmark. `search` is for the
   * entries that are an activity rather than one address — canopy tours, jet
   * ski rentals, a whole river — where routing to an arbitrary operator would
   * be misleading.
   */
  maps: { q: string; kind: "dir" | "search" };
}

const POS: Record<string, Spot> = {
  damas: {
    x: 20,
    y: 46,
    maps: { q: "Damas Island, Quepos, Costa Rica", kind: "dir" },
  },
  "quepos-town": {
    x: 26,
    y: 50.5,
    maps: { q: "Quepos, Puntarenas, Costa Rica", kind: "dir" },
  },
  "quepos-marina": {
    x: 31.5,
    y: 57,
    maps: { q: "Marina Pez Vela, Quepos, Costa Rica", kind: "dir" },
  },
  biesanz: {
    x: 35.5,
    y: 61,
    maps: { q: "Playa Biesanz, Manuel Antonio, Costa Rica", kind: "dir" },
  },
  "jet-ski": {
    x: 40,
    y: 67,
    maps: { q: "jet ski rental Manuel Antonio Costa Rica", kind: "search" },
  },
  "manuel-antonio": {
    x: 46.5,
    y: 72,
    maps: { q: "Manuel Antonio National Park, Costa Rica", kind: "dir" },
  },
  "playa-espadilla": {
    x: 50.5,
    y: 79,
    maps: { q: "Playa Espadilla, Manuel Antonio, Costa Rica", kind: "dir" },
  },
  canopy: {
    x: 46,
    y: 45.5,
    maps: { q: "canopy tour Quepos Costa Rica", kind: "search" },
  },
  "villa-vanilla": {
    x: 52,
    y: 58,
    maps: { q: "Villa Vanilla Spice Farm, Quepos, Costa Rica", kind: "dir" },
  },
  "hot-springs": {
    x: 62,
    y: 32.5,
    maps: { q: "Hot Springs Lodge, Quepos, Costa Rica", kind: "dir" },
  },
  "santa-juana": {
    x: 68,
    y: 46,
    maps: { q: "Santa Juana Mountain Tour Costa Rica", kind: "search" },
  },
  rainmaker: {
    x: 66,
    y: 19,
    maps: { q: "Rainmaker Conservation Park, Costa Rica", kind: "dir" },
  },
  savegre: {
    x: 76,
    y: 62,
    maps: { q: "Savegre River rafting Costa Rica", kind: "search" },
  },
  nauyaca: {
    x: 85,
    y: 82,
    maps: { q: "Nauyaca Waterfalls, Costa Rica", kind: "dir" },
  },
};

/** The property. Every route is measured from here. */
const BASE = { x: 54.5, y: 39.5 };

const CATEGORY_COLOR: Record<PlaceCategory, string> = {
  fishing: "var(--clay)",
  nature: "var(--moss)",
  adventure: "var(--sun-deep)",
  town: "var(--sea)",
};

/** Google Maps universal URLs — no API key, works on desktop and in the app. */
function mapsUrl({ q, kind }: Spot["maps"]): string {
  const query = encodeURIComponent(q);
  return kind === "dir"
    ? `https://www.google.com/maps/dir/?api=1&destination=${query}`
    : `https://www.google.com/maps/search/?api=1&query=${query}`;
}

/**
 * A gentle arc from the house out to a place. The control point is pushed off
 * the straight line by a fixed fraction of its perpendicular, so every route
 * bows the same way and none run straight through another marker.
 */
function routePath(to: { x: number; y: number }): string {
  const dx = to.x - BASE.x;
  const dy = to.y - BASE.y;
  const mx = BASE.x + dx / 2;
  const my = BASE.y + dy / 2;
  return `M${BASE.x} ${BASE.y} Q${mx - dy * 0.16} ${my + dx * 0.16} ${to.x} ${to.y}`;
}

export function AreaMap({
  places,
  labels,
}: {
  places: Place[];
  labels: MapLabels;
}) {
  const reduce = useReducedMotion();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [hoverId, setHoverId] = React.useState<string | null>(null);

  // Hover wins over selection, so sweeping the index previews each route
  // without losing the card you opened.
  const lit = hoverId ?? activeId;
  const litPlace = places.find((p) => p.id === lit) ?? null;
  const active = places.find((p) => p.id === activeId) ?? null;

  const catLabel = (c: PlaceCategory) => labels[c];

  return (
    <div>
      <div className="relative aspect-3/4 overflow-hidden rounded-2xl border border-canopy/10 bg-[oklch(0.95_0.02_100)] shadow-[0_26px_64px_-34px_rgba(11,46,34,0.5)] sm:aspect-16/10 sm:rounded-[26px]">
        <Terrain />

        <span
          className="pointer-events-none absolute top-[62%] left-[7%] origin-left rotate-[56deg] text-[0.5625rem] font-semibold tracking-[0.4em] text-[oklch(0.45_0.06_220)]/55 uppercase sm:text-[0.6875rem]"
          aria-hidden
        >
          {labels.pacific}
        </span>

        {/* Route from the house to whatever is lit */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden
        >
          <AnimatePresence>
            {litPlace ? (
              <motion.path
                key={litPlace.id}
                d={routePath(POS[litPlace.id])}
                fill="none"
                stroke={CATEGORY_COLOR[litPlace.category]}
                /* The frame is not square, so the viewBox is stretched. A
                   non-scaling stroke keeps the dashes round and even instead
                   of squashing them along one axis. */
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeDasharray="4 7"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: reduce ? 0.001 : 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            ) : null}
          </AnimatePresence>
        </svg>

        <HouseMarker name={labels.baseName} />

        {places.map((place) => (
          <Pin
            key={place.id}
            place={place}
            pos={POS[place.id]}
            lit={lit === place.id}
            dimmed={lit !== null && lit !== place.id}
            onSelect={() =>
              setActiveId((id) => (id === place.id ? null : place.id))
            }
            onHover={(on) => setHoverId(on ? place.id : null)}
          />
        ))}

        <svg
          viewBox="0 0 40 40"
          className="absolute top-4 right-4 h-8 w-8 text-canopy/30 sm:top-5 sm:right-5 sm:h-10 sm:w-10"
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

        {/* The prompt, until something is chosen. Desktop only — on a phone the
            card sits below the frame and there is nowhere to put this. */}
        {!active ? (
          <p className="pointer-events-none absolute bottom-6 left-6 hidden max-w-[19rem] text-[0.8125rem] leading-relaxed text-canopy/65 sm:block">
            {labels.hint}
          </p>
        ) : null}

        {/* Detail card — floats over the map from sm up. */}
        <AnimatePresence>
          {active ? (
            <motion.article
              key={active.id}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
              transition={{
                duration: reduce ? 0.001 : 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute inset-x-3 bottom-3 hidden rounded-2xl border border-canopy/10 bg-background/97 p-5 shadow-[0_22px_50px_-26px_rgba(11,46,34,0.6)] backdrop-blur-md sm:right-auto sm:bottom-6 sm:left-6 sm:block sm:w-[21rem] sm:p-6"
            >
              <CardBody
                place={active}
                labels={labels}
                catLabel={catLabel(active.category)}
              />
            </motion.article>
          ) : null}
        </AnimatePresence>
      </div>

      {/* On a phone the card can't float over a 335px map without burying it,
          so it drops below the frame instead. */}
      <AnimatePresence initial={false}>
        {active ? (
          <motion.article
            key={active.id}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.001 : 0.28 }}
            className="mt-4 rounded-2xl border border-canopy/10 bg-card p-5 shadow-[0_18px_40px_-28px_rgba(11,46,34,0.5)] sm:hidden"
          >
            <CardBody
              place={active}
              labels={labels}
              catLabel={catLabel(active.category)}
            />
          </motion.article>
        ) : null}
      </AnimatePresence>

      {/* The index. Every place, always visible, doubles as the hover control. */}
      <ul className="mt-5 flex flex-wrap gap-x-1 gap-y-1">
        {places.map((place) => (
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
              aria-pressed={activeId === place.id}
              className={`flex min-h-10 items-center gap-2 rounded-lg px-2 py-2 text-[0.8125rem] transition-colors duration-200 ${
                lit === place.id || activeId === place.id
                  ? "text-canopy"
                  : "text-muted-foreground hover:text-canopy"
              }`}
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: CATEGORY_COLOR[place.category] }}
                aria-hidden
              />
              {place.name}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <p className="max-w-xl text-xs text-muted-foreground">{labels.note}</p>
        <a
          href={labels.listingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="-my-2 inline-block shrink-0 py-2 text-xs font-semibold text-forest underline-offset-4 hover:underline"
        >
          {labels.listingCta}
        </a>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function CardBody({
  place,
  labels,
  catLabel,
}: {
  place: Place;
  labels: MapLabels;
  catLabel: string;
}) {
  const spot = POS[place.id];
  return (
    <>
      <div className="flex items-center gap-2.5">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: CATEGORY_COLOR[place.category] }}
          aria-hidden
        />
        <span className="text-[0.625rem] font-bold tracking-[0.17em] text-muted-foreground uppercase">
          {catLabel}
        </span>
      </div>
      <h3 className="mt-2.5 font-display text-xl leading-tight font-normal text-canopy">
        {place.name}
      </h3>
      <p className="mt-1 text-[0.8125rem] font-semibold text-forest">
        {place.travel}
      </p>
      <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
        {place.text}
      </p>
      <Btn
        href={mapsUrl(spot.maps)}
        target="_blank"
        rel="noopener noreferrer"
        variant="canopy"
        size="sm"
        className="mt-5"
      >
        {spot.maps.kind === "dir" ? labels.directionsCta : labels.mapsCta}
      </Btn>
    </>
  );
}

/** The property, as a house. Not interactive — every route already starts here. */
function HouseMarker({ name }: { name: string }) {
  return (
    <div
      className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${BASE.x}%`, top: `${BASE.y}%` }}
    >
      <div className="flex flex-col items-center">
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-canopy shadow-[0_8px_20px_-6px_rgba(11,46,34,0.85)] ring-3 ring-cream sm:h-11 sm:w-11">
          <span className="absolute inset-0 animate-ping rounded-full bg-canopy/25 [animation-duration:3s]" />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="relative h-4.5 w-4.5 sm:h-5.5 sm:w-5.5"
            aria-hidden
          >
            <path
              d="M3.5 10.6 12 4l8.5 6.6"
              stroke="var(--sun)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.6 9.9V19h12.8V9.9"
              stroke="var(--sun)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.9 19v-5.1h4.2V19"
              stroke="var(--sun)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="mt-1.5 rounded-full bg-canopy px-2.5 py-1 text-[0.5625rem] font-bold tracking-[0.09em] whitespace-nowrap text-cream uppercase shadow-md sm:text-[0.625rem]">
          {name}
        </span>
      </div>
    </div>
  );
}

function Pin({
  place,
  pos,
  lit,
  dimmed,
  onSelect,
  onHover,
}: {
  place: Place;
  pos: Spot;
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
      aria-label={`${place.name} — ${place.travel}`}
      /* Fixed 40px hit box with the dot centred in it. The label used to sit
         in the flow, which made every button as wide as its own name — on a
         phone that meant neighbouring pins overlapped each other's tap
         targets and you couldn't reliably hit the one you aimed at. */
      className="group absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canopy"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        opacity: dimmed ? 0.42 : 1,
        zIndex: lit ? 15 : 10,
        transition: "opacity 260ms ease",
      }}
    >
      <span
        className="block rounded-full ring-2 ring-cream transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          backgroundColor: color,
          width: lit ? 20 : 13,
          height: lit ? 20 : 13,
          boxShadow: lit
            ? `0 0 0 6px color-mix(in oklch, ${color} 22%, transparent), 0 8px 18px -6px rgba(11,46,34,0.7)`
            : "0 4px 10px -4px rgba(11,46,34,0.6)",
        }}
      />
      <span
        className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 rounded-full bg-cream/95 px-2 py-0.5 text-[0.625rem] leading-tight font-semibold whitespace-nowrap text-canopy shadow-sm transition-all duration-300"
        style={{
          opacity: lit ? 1 : 0,
          transform: lit ? "translate(-50%, 0)" : "translate(-50%, -4px)",
        }}
      >
        {place.name}
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
      <rect width="1000" height="750" fill="oklch(0.93 0.03 106)" />

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

      <path
        d="M40 175 C165 245 275 320 370 405 C465 490 545 600 615 720"
        fill="none"
        stroke="oklch(0.98 0.01 90)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="16 12"
        opacity="0.9"
      />

      <path
        d="M0 250 C120 300 210 360 300 430 C390 500 470 590 540 700 C562 745 578 750 590 750 L0 750 Z"
        fill="oklch(0.79 0.075 218)"
      />
      <path
        d="M0 250 C120 300 210 360 300 430 C390 500 470 590 540 700 C562 745 578 750 590 750"
        fill="none"
        stroke="oklch(0.95 0.03 210)"
        strokeWidth="5"
      />
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
