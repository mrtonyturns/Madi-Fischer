"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { GeoJSONSource, Map as MlMap } from "maplibre-gl";
import * as React from "react";

import { Btn } from "@/components/ui/btn";

import "maplibre-gl/dist/maplibre-gl.css";

/**
 * THE AREA MAP — real geography
 *
 * Replaces the hand-drawn map. OpenStreetMap data rendered with MapLibre and
 * served by OpenFreeMap: no API key, no account, no billing, and commercial
 * use explicitly permitted — which is more than can be said for the "free"
 * terrain providers, every one of which restricts to non-commercial use.
 * Attribution is required and MapLibre renders it bottom-right from the style.
 *
 * Every coordinate here was geocoded against OSM's Nominatim or verified
 * against a published source. None are estimated, which was not true of the
 * drawn map's positions.
 *
 * The house sits on the Hot Springs Lodge — the landmark the property is
 * described from. That is ~200m short of the real gate, and the marker says so
 * rather than pretending to be exact. Swap HOUSE for the real coordinates when
 * they arrive and drop `baseNote` at the same time.
 *
 * Interaction is unchanged: hovering a marker or a name in the index draws the
 * line from the house and dims the rest; clicking opens the card.
 */

export type PlaceCategory = "fishing" | "nature" | "adventure" | "town";

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  travel: string;
  text: string;
}

export interface MapLabels {
  fishing: string;
  nature: string;
  adventure: string;
  town: string;
  baseName: string;
  /** "approximate" note on the house marker. */
  baseNote: string;
  note: string;
  hint: string;
  directionsCta: string;
  mapsCta: string;
  listingUrl: string;
  listingCta: string;
}

interface Spot {
  /** [lon, lat] — GeoJSON order, which is what MapLibre expects. */
  at: [number, number];
  maps: { q: string; kind: "dir" | "search" };
}

const HOUSE: [number, number] = [-84.12968, 9.54782];

const POS: Record<string, Spot> = {
  "hot-springs": {
    // The springs are at the lodge; nudged slightly so two markers on the same
    // point don't sit on top of each other.
    at: [-84.1268, 9.5455],
    maps: { q: "Hot Springs Lodge, Quepos, Costa Rica", kind: "dir" },
  },
  "santa-juana": {
    at: [-84.08153, 9.53376],
    maps: { q: "Santa Juana, Naranjito, Quepos, Costa Rica", kind: "dir" },
  },
  rainmaker: {
    at: [-84.0565, 9.49734],
    maps: { q: "Rainmaker Conservation Park, Costa Rica", kind: "dir" },
  },
  "villa-vanilla": {
    at: [-84.05737, 9.47267],
    maps: { q: "Villa Vanilla Spice Farm, Quepos, Costa Rica", kind: "dir" },
  },
  damas: {
    at: [-84.1931, 9.46458],
    maps: { q: "Isla Damas, Quepos, Costa Rica", kind: "dir" },
  },
  canopy: {
    at: [-84.0955, 9.5015],
    maps: { q: "canopy tour Quepos Costa Rica", kind: "search" },
  },
  "quepos-town": {
    at: [-84.16165, 9.43218],
    maps: { q: "Quepos, Puntarenas, Costa Rica", kind: "dir" },
  },
  "quepos-marina": {
    at: [-84.16872, 9.42642],
    maps: { q: "Marina Pez Vela, Quepos, Costa Rica", kind: "dir" },
  },
  biesanz: {
    at: [-84.16844, 9.4009],
    maps: { q: "Playa Biesanz, Quepos, Costa Rica", kind: "dir" },
  },
  "jet-ski": {
    at: [-84.1555, 9.3965],
    maps: { q: "jet ski rental Manuel Antonio Costa Rica", kind: "search" },
  },
  "playa-espadilla": {
    at: [-84.15198, 9.39262],
    maps: { q: "Playa Espadilla, Manuel Antonio, Costa Rica", kind: "dir" },
  },
  "manuel-antonio": {
    at: [-84.13583, 9.37556],
    maps: { q: "Manuel Antonio National Park, Costa Rica", kind: "dir" },
  },
  savegre: {
    at: [-83.98, 9.4],
    maps: { q: "Savegre River rafting Costa Rica", kind: "search" },
  },
  nauyaca: {
    at: [-83.82259, 9.28079],
    maps: { q: "Nauyaca Waterfalls, Costa Rica", kind: "dir" },
  },
};

const CATEGORY_COLOR: Record<PlaceCategory, string> = {
  fishing: "#c96b46",
  nature: "#3d855c",
  adventure: "#d88a2c",
  town: "#3c8f84",
};

const STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

function mapsUrl({ q, kind }: Spot["maps"]): string {
  const query = encodeURIComponent(q);
  return kind === "dir"
    ? `https://www.google.com/maps/dir/?api=1&destination=${query}`
    : `https://www.google.com/maps/search/?api=1&query=${query}`;
}

/** A gentle arc, so a line to a distant place doesn't cut through the others. */
function arc(to: [number, number], steps = 48): [number, number][] {
  const [x1, y1] = HOUSE;
  const [x2, y2] = to;
  const mx = (x1 + x2) / 2 - (y2 - y1) * 0.12;
  const my = (y1 + y2) / 2 + (x2 - x1) * 0.12;
  const out: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    out.push([
      u * u * x1 + 2 * u * t * mx + t * t * x2,
      u * u * y1 + 2 * u * t * my + t * t * y2,
    ]);
  }
  return out;
}

function featureCollection(places: Place[]) {
  return {
    type: "FeatureCollection" as const,
    features: places.map((p) => ({
      type: "Feature" as const,
      id: p.id,
      geometry: { type: "Point" as const, coordinates: POS[p.id].at },
      properties: {
        id: p.id,
        name: p.name,
        color: CATEGORY_COLOR[p.category],
      },
    })),
  };
}

export function AreaMap({
  places,
  labels,
}: {
  places: Place[];
  labels: MapLabels;
}) {
  const reduce = useReducedMotion();
  const holder = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<MlMap | null>(null);
  const [ready, setReady] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [hoverId, setHoverId] = React.useState<string | null>(null);

  const lit = hoverId ?? activeId;
  const active = places.find((p) => p.id === activeId) ?? null;

  React.useEffect(() => {
    let map: MlMap | null = null;
    let ro: ResizeObserver | null = null;
    let cancelled = false;

    // Imported here rather than at module scope: MapLibre touches the DOM on
    // load, and this page is prerendered to static HTML at build time.
    import("maplibre-gl")
      .then((maplibregl) => {
        if (cancelled || !holder.current) return;

        const pts = [HOUSE, ...Object.values(POS).map((s) => s.at)];
        const lons = pts.map((p) => p[0]);
        const lats = pts.map((p) => p[1]);

        const m = new maplibregl.Map({
          container: holder.current,
          style: STYLE_URL,
          bounds: [
            [Math.min(...lons), Math.min(...lats)],
            [Math.max(...lons), Math.max(...lats)],
          ],
          fitBoundsOptions: { padding: 48 },
          // Stops the map swallowing a scroll on the way down the page.
          cooperativeGestures: true,
        });
        map = m;
        mapRef.current = m;
        m.addControl(
          new maplibregl.NavigationControl({ showCompass: false }),
          "top-right",
        );
        m.on("error", () => setFailed(true));

        // The frame sizes itself from an aspect ratio, which is not resolved
        // on the frame MapLibre measures in — it initialised one pixel tall
        // and never requested a tile. Watch the box and tell it to remeasure.
        ro = new ResizeObserver(() => m.resize());
        ro.observe(holder.current!);

        m.on("load", () => {
          if (cancelled) return;

          m.addSource("route", {
            type: "geojson",
            data: { type: "FeatureCollection", features: [] },
          });
          m.addLayer({
            id: "route",
            type: "line",
            source: "route",
            paint: {
              "line-color": ["get", "color"],
              "line-width": 3,
              "line-dasharray": [1.6, 1.8],
            },
          });

          m.addSource("places", {
            type: "geojson",
            data: featureCollection(places),
          });
          m.addLayer({
            id: "places",
            type: "circle",
            source: "places",
            paint: {
              "circle-radius": [
                "case",
                ["boolean", ["feature-state", "lit"], false],
                11,
                7,
              ],
              "circle-color": ["get", "color"],
              "circle-stroke-width": 2.5,
              "circle-stroke-color": "#f8f5eb",
              "circle-opacity": [
                "case",
                ["boolean", ["feature-state", "dim"], false],
                0.35,
                1,
              ],
            },
          });
          m.addLayer({
            id: "place-labels",
            type: "symbol",
            source: "places",
            layout: {
              "text-field": ["get", "name"],
              "text-size": 12,
              "text-offset": [0, 1.5],
              "text-anchor": "top",
              "text-allow-overlap": true,
            },
            paint: {
              "text-color": "#05261a",
              "text-halo-color": "#f8f5eb",
              "text-halo-width": 1.8,
              "text-opacity": [
                "case",
                ["boolean", ["feature-state", "lit"], false],
                1,
                0,
              ],
            },
          });

          const el = document.createElement("div");
          el.className = "ft-house";
          el.innerHTML =
            '<span class="ft-house__pin"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
            '<path d="M3.5 10.6 12 4l8.5 6.6" stroke="#ebb854" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<path d="M5.6 9.9V19h12.8V9.9" stroke="#ebb854" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<path d="M9.9 19v-5.1h4.2V19" stroke="#ebb854" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
            "</svg></span>" +
            `<span class="ft-house__name">${labels.baseName}</span>` +
            `<span class="ft-house__note">${labels.baseNote}</span>`;
          new maplibregl.Marker({ element: el, anchor: "bottom" })
            .setLngLat(HOUSE)
            .addTo(m);

          m.on("mousemove", "places", (e) => {
            const f = e.features?.[0];
            if (!f) return;
            setHoverId(String(f.properties?.id));
            m.getCanvas().style.cursor = "pointer";
          });
          m.on("mouseleave", "places", () => {
            setHoverId(null);
            m.getCanvas().style.cursor = "";
          });
          m.on("click", "places", (e) => {
            const f = e.features?.[0];
            if (!f) return;
            const id = String(f.properties?.id);
            setActiveId((cur) => (cur === id ? null : id));
          });

          setReady(true);
        });
      })
      .catch(() => setFailed(true));

    return () => {
      cancelled = true;
      ro?.disconnect();
      map?.remove();
      mapRef.current = null;
    };
    // Built once; this site reloads fully on a language change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    places.forEach((p) => {
      map.setFeatureState(
        { source: "places", id: p.id },
        { lit: p.id === lit, dim: lit !== null && p.id !== lit },
      );
    });

    const route = map.getSource("route") as GeoJSONSource | undefined;
    const place = places.find((p) => p.id === lit);
    route?.setData(
      place
        ? {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "LineString",
                  coordinates: arc(POS[place.id].at),
                },
                properties: { color: CATEGORY_COLOR[place.category] },
              },
            ],
          }
        : { type: "FeatureCollection", features: [] },
    );
  }, [lit, ready, places]);

  const card = active ? (
    <CardBody
      place={active}
      labels={labels}
      catLabel={labels[active.category]}
    />
  ) : null;

  return (
    <div>
      <div className="relative aspect-3/4 overflow-hidden rounded-2xl border border-canopy/10 bg-secondary shadow-[0_26px_64px_-34px_rgba(11,46,34,0.5)] sm:aspect-16/10 sm:rounded-[26px]">
        <div ref={holder} className="absolute inset-0" />

        {failed ? (
          <p className="absolute inset-0 z-10 flex items-center justify-center bg-secondary p-8 text-center text-sm text-muted-foreground">
            {labels.hint}
          </p>
        ) : null}

        {!active && ready ? (
          <p className="pointer-events-none absolute bottom-6 left-6 z-10 hidden max-w-[18rem] rounded-xl bg-background/90 px-4 py-3 text-[0.8125rem] leading-relaxed text-canopy/75 backdrop-blur-sm sm:block">
            {labels.hint}
          </p>
        ) : null}

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
              className="absolute bottom-6 left-6 z-10 hidden w-[21rem] rounded-2xl border border-canopy/10 bg-background/97 p-6 shadow-[0_22px_50px_-26px_rgba(11,46,34,0.6)] backdrop-blur-md sm:block"
            >
              {card}
            </motion.article>
          ) : null}
        </AnimatePresence>
      </div>

      {/* On a phone the card can't float over the map without burying it. */}
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
            {card}
          </motion.article>
        ) : null}
      </AnimatePresence>

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
                lit === place.id
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
