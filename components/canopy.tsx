import * as React from "react";

/**
 * The foliage the hero is built from.
 *
 * The photography for this property is documentary — flat skies, gravel, real
 * estate framing — so the tropical feeling has to come from art direction
 * rather than from the pictures. These are the layers that supply it.
 *
 * Every shape here is generated from a few numbers instead of hand-authored
 * path data: one frond is ~30 blades, and drawing those by hand would be both
 * unreadable and impossible to tune. The maths is pure and deterministic, so
 * server and client render byte-identical markup and hydration stays quiet.
 */

/* --- small vector helpers, kept local so this file stays self-contained --- */

type Pt = readonly [number, number];

/** Point on a quadratic Bézier at t. */
function quadAt(p0: Pt, p1: Pt, p2: Pt, t: number): Pt {
  const u = 1 - t;
  return [
    u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
    u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1],
  ];
}

/** Unit tangent of a quadratic Bézier at t. */
function quadTangent(p0: Pt, p1: Pt, p2: Pt, t: number): Pt {
  const u = 1 - t;
  const x = 2 * u * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]);
  const y = 2 * u * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
  const m = Math.hypot(x, y) || 1;
  return [x / m, y / m];
}

const round = (n: number) => Math.round(n * 100) / 100;

/**
 * One pinnate frond, drawn as a rachis plus tapered blades down both sides.
 *
 * The frond always grows from (0, 0) toward +x, curving upward; position and
 * rotation are the caller's job. `length` is in the local user units that the
 * caller's transform scales.
 */
export function PalmFrond({
  length = 320,
  /** How far the rachis lifts over its run. Higher = more arch. */
  arch = 90,
  blades = 30,
  /** Longest blade, at the middle of the frond. */
  bladeLength = 96,
  /** Blade sweep toward the tip, in degrees, at the base. */
  sweep = 62,
  className,
  fill = "currentColor",
  opacity = 1,
}: {
  length?: number;
  arch?: number;
  blades?: number;
  bladeLength?: number;
  sweep?: number;
  className?: string;
  fill?: string;
  opacity?: number;
}) {
  const p0: Pt = [0, 0];
  const p1: Pt = [length * 0.45, -arch * 0.2];
  const p2: Pt = [length, -arch];

  const paths: string[] = [];

  for (let i = 0; i < blades; i++) {
    // Start a little way up the rachis: real fronds are bare at the base.
    const t = 0.12 + (i / (blades - 1)) * 0.88;
    const base = quadAt(p0, p1, p2, t);
    const tan = quadTangent(p0, p1, p2, t);

    // Longest in the middle, tapering hard into the tip.
    const taper = Math.sin(Math.PI * Math.min(1, t * 1.06)) ** 0.75;
    const len = bladeLength * (0.34 + 0.66 * taper);

    // Blades lie back toward the tip more and more as you travel out.
    const angle = ((sweep - 26 * t) * Math.PI) / 180;

    for (const side of [1, -1] as const) {
      const cos = Math.cos(angle * side);
      const sin = Math.sin(angle * side);
      // Rotate the tangent by ±angle to get the blade's direction.
      const dx = tan[0] * cos - tan[1] * sin;
      const dy = tan[0] * sin + tan[1] * cos;

      const tipX = base[0] + dx * len;
      const tipY = base[1] + dy * len;

      // Normal to the blade, for its width.
      const nx = -dy;
      const ny = dx;
      const w = len * 0.115;

      const midX = base[0] + dx * len * 0.45;
      const midY = base[1] + dy * len * 0.45;

      paths.push(
        `M${round(base[0])} ${round(base[1])}` +
          `Q${round(midX + nx * w)} ${round(midY + ny * w)} ${round(tipX)} ${round(tipY)}` +
          `Q${round(midX - nx * w)} ${round(midY - ny * w)} ${round(base[0])} ${round(base[1])}Z`,
      );
    }
  }

  // The rachis itself, so the blades read as attached rather than floating.
  const spine =
    `M${round(p0[0])} ${round(p0[1])}` +
    `Q${round(p1[0])} ${round(p1[1] - 3)} ${round(p2[0])} ${round(p2[1])}` +
    `Q${round(p1[0])} ${round(p1[1] + 3)} ${round(p0[0])} ${round(p0[1])}Z`;

  return (
    <g className={className} fill={fill} opacity={opacity}>
      <path d={spine} />
      <path d={paths.join("")} />
    </g>
  );
}

/**
 * A broad split leaf in the monstera family — the counterweight to the fronds.
 * Splits are cut with a mask so the silhouette holds at any size.
 */
export function MonsteraLeaf({
  size = 260,
  splits = 5,
  className,
  fill = "currentColor",
  opacity = 1,
  id,
}: {
  size?: number;
  splits?: number;
  className?: string;
  fill?: string;
  opacity?: number;
  /** Unique per instance — SVG ids share one namespace across the document. */
  id: string;
}) {
  const s = size / 100;
  const maskId = `${id}-mask`;

  // Slots run from just off the midrib out past the leaf edge, angled down.
  const slots: string[] = [];
  for (let i = 0; i < splits; i++) {
    const t = (i + 1) / (splits + 1);
    const y = 18 + t * 62;
    const drop = 6 + t * 10;
    const reach = 46 * Math.sin(Math.PI * (0.28 + 0.72 * (1 - t * 0.55)));
    slots.push(
      `M${round(50 - 3)} ${round(y)}C${round(50 - reach * 0.5)} ${round(y + drop * 0.4)} ${round(50 - reach * 0.8)} ${round(y + drop * 0.8)} ${round(50 - reach)} ${round(y + drop)}`,
    );
    slots.push(
      `M${round(50 + 3)} ${round(y)}C${round(50 + reach * 0.5)} ${round(y + drop * 0.4)} ${round(50 + reach * 0.8)} ${round(y + drop * 0.8)} ${round(50 + reach)} ${round(y + drop)}`,
    );
  }

  return (
    <g className={className} opacity={opacity}>
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x={0} y={0} width={size} height={size}>
          <g transform={`scale(${s})`}>
            <path
              d="M50 4C28 22 16 46 19 68c2.5 18 15 28 31 28s28.5-10 31-28c3-22-9-46-31-64Z"
              fill="white"
            />
            <g
              stroke="black"
              strokeWidth={4.4}
              strokeLinecap="round"
              fill="none"
            >
              {slots.map((d, i) => (
                <path key={i} d={d} />
              ))}
            </g>
          </g>
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        <rect x={0} y={0} width={size} height={size} fill={fill} />
      </g>
    </g>
  );
}

/**
 * The organic edge that separates the hero from the page below — a soft,
 * uneven ridge rather than a straight seam or a symmetrical "wave divider",
 * which is where these usually turn corny.
 */
export function RidgeEdge({
  className,
  fill = "var(--background)",
  flip = false,
}: {
  className?: string;
  fill?: string;
  /** Point the ridge downward, for the bottom of a light section. */
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className={className}
      aria-hidden
      style={flip ? { transform: "scaleY(-1)" } : undefined}
    >
      <path
        d="M0 120V74c118-26 216-9 331 16 96 21 178 27 268 6 104-24 175-64 292-72 112-8 210 22 320 44 82 16 155 18 229 4v48Z"
        fill={fill}
      />
    </svg>
  );
}
