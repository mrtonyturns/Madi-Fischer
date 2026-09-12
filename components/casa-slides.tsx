"use client";

import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

export interface CasaSlide {
  src: string;
  alt: string;
  /** object-position class biasing the crop, e.g. "object-[center_62%]". */
  position?: string;
}

/**
 * Photo slideshow inside a casa card. Fills its (relative) parent; the card's
 * gradient scrim and copy render on top of it. With a single photo it is just
 * that photo — the controls only exist when there is somewhere to go, so cards
 * gain a slideshow automatically as more photos land in the arrays.
 */
export function CasaSlides({
  slides,
  prevLabel,
  nextLabel,
}: {
  slides: CasaSlide[];
  prevLabel: string;
  nextLabel: string;
}) {
  const [index, setIndex] = React.useState(0);
  const go = (d: number) =>
    setIndex((i) => (i + d + slides.length) % slides.length);
  const s = slides[index];

  return (
    <>
      <AnimatePresence initial={false}>
        <motion.div
          key={s.src}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <Image
            src={s.src}
            alt={s.alt}
            fill
            sizes="(min-width: 1280px) 1248px, 100vw"
            className={`object-cover ${s.position ?? "object-center"}`}
          />
        </motion.div>
      </AnimatePresence>

      {slides.length > 1 ? (
        <div className="absolute top-5 right-5 z-10 flex items-center gap-2.5 sm:top-7 sm:right-7">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={prevLabel}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/45 text-cream transition-all duration-300 hover:border-cream hover:bg-cream hover:text-canopy"
          >
            <ArrowLeft className="h-4.5 w-4.5" aria-hidden />
          </button>
          <p className="font-mono text-xs tracking-widest text-cream/80 tabular-nums">
            {index + 1}/{slides.length}
          </p>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={nextLabel}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/45 text-cream transition-all duration-300 hover:border-cream hover:bg-cream hover:text-canopy"
          >
            <ArrowLeft className="h-4.5 w-4.5 rotate-180" aria-hidden />
          </button>
        </div>
      ) : null}
    </>
  );
}
