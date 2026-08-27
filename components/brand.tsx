import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * FISCHER TROPITEL identity.
 *
 * The mark is an open arch — the casas are open-air, and every one of them
 * frames a view of the jungle — with a monstera leaf growing up through it.
 * Arch in `currentColor` so it inherits from whatever ground it sits on; leaf
 * in the brand gold so the lockup always carries one warm note.
 *
 * Drawn on a 48×48 grid with 4px of optical padding. The leaf's splits are cut
 * with a mask rather than drawn as separate shapes, which keeps the silhouette
 * readable down to about 20px.
 */
export function LogoMark({
  className,
  leafColor = "var(--sun)",
  id = "ft",
}: {
  className?: string;
  /** Override when the gold does not have enough contrast on a given ground. */
  leafColor?: string;
  /** Must be unique per instance on the page — SVG ids are global. */
  id?: string;
}) {
  const maskId = `${id}-leaf-mask`;
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="Fischer Tropitel"
      fill="none"
    >
      <defs>
        {/* Two splits a side, not six. At header size anything finer collapses
            into a feather; this keeps a monstera silhouette down to ~20px. */}
        <mask id={maskId}>
          <path
            d="M24 13.5c-7.2 6-10.6 12.9-9.8 18.8.8 5.1 4.7 8.6 9.8 8.6s9-3.5 9.8-8.6C34.6 26.4 31.2 19.5 24 13.5Z"
            fill="white"
          />
          <g stroke="black" strokeWidth="2.6" strokeLinecap="round" fill="none">
            <path d="M22.4 21c-2.4 1.7-4.6 4-6.5 6.8" />
            <path d="M22.4 30c-2.4 1.7-4.5 3.9-6.3 6.6" />
            <path d="M25.6 21c2.4 1.7 4.6 4 6.5 6.8" />
            <path d="M25.6 30c2.4 1.7 4.5 3.9 6.3 6.6" />
          </g>
        </mask>
      </defs>

      {/* The arch: open at the bottom, so it reads as a doorway, not a badge. */}
      <path
        d="M6.5 43V23.5a17.5 17.5 0 0 1 35 0V43"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <g mask={`url(#${maskId})`}>
        <rect x="0" y="0" width="48" height="48" fill={leafColor} />
      </g>
    </svg>
  );
}

/**
 * The full horizontal lockup: mark, name, and a place line.
 * `compact` drops the place line for tight spots (mobile header, footer bar).
 */
export function Logo({
  className,
  markClassName,
  compact = false,
  id = "ft",
  place = "Quepos · Costa Rica",
}: {
  className?: string;
  markClassName?: string;
  compact?: boolean;
  id?: string;
  place?: string;
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <LogoMark id={id} className={cn("h-9 w-9 shrink-0", markClassName)} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.0625rem] font-semibold tracking-[0.2em] uppercase">
          Fischer
        </span>
        <span className="mt-[3px] font-display text-[1.0625rem] font-normal tracking-[0.2em] uppercase opacity-80">
          Tropitel
        </span>
        {compact ? null : (
          <span className="mt-[7px] text-[0.5625rem] font-medium tracking-[0.26em] uppercase opacity-55">
            {place}
          </span>
        )}
      </span>
    </span>
  );
}
