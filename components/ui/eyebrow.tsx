import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * The small label that opens each section.
 *
 * It used to be preceded by a short horizontal rule. That rule was dropped —
 * the label carries itself, and four copies of the same hand-rolled markup had
 * started to drift apart. Everything that needs one imports this.
 *
 * Slightly larger and a little tighter than the ruled version was: without the
 * rule anchoring it, an 11px label at 0.28em tracking read as stranded.
 */
export function Eyebrow({
  children,
  onDark = false,
  className,
}: {
  children: React.ReactNode;
  /** Gold on the brand-green bands; forest green on light grounds. */
  onDark?: boolean;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-xs font-semibold tracking-[0.22em] uppercase",
        onDark ? "text-sun" : "text-forest",
        className,
      )}
    >
      {children}
    </p>
  );
}
