"use client";

import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Btn } from "@/components/ui/btn";
import * as React from "react";

export interface Slide {
  src: string;
  alt: string;
  title: string;
  text: string;
  href: string;
  cta: string;
}

/**
 * Full-bleed image carousel with a white content card anchored bottom-left and
 * numeric "01 / 03" pagination — the signature pattern of the art direction
 * this site follows. Manual navigation only; slides crossfade via Motion.
 */
export function Highlights({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = React.useState(0);
  const go = (d: number) =>
    setIndex((i) => (i + d + slides.length) % slides.length);
  const s = slides[index];

  return (
    <div className="relative min-h-[560px] overflow-hidden sm:min-h-[640px]">
      <AnimatePresence initial={false}>
        <motion.div
          key={s.src}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Image
            src={s.src}
            alt={s.alt}
            fill
            sizes="100vw"
            className="object-cover"
            priority={index === 0}
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-canopy-deep/70 via-canopy-deep/10 to-canopy-deep/25" />

      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto max-w-7xl px-4 pb-10">
          <motion.div
            key={`card-${index}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
            className="max-w-xl rounded-[28px] bg-cream p-7 shadow-[0_30px_70px_-30px_rgba(11,46,34,0.7)] sm:p-9"
          >
            <h2 className="font-display text-2xl leading-tight font-normal text-canopy sm:text-3xl">
              {s.title}
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">{s.text}</p>
            <Btn href={s.href} variant="trail" className="mt-6">
              {s.cta}
            </Btn>
          </motion.div>

          <div className="mt-7 flex items-center gap-4 text-cream">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous slide"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/45 transition-all duration-300 hover:border-cream hover:bg-cream hover:text-canopy"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden />
            </button>
            <p className="font-mono text-sm tracking-widest tabular-nums">
              {String(index + 1).padStart(2, "0")}
              <span className="mx-2 text-cream/50">/</span>
              {String(slides.length).padStart(2, "0")}
            </p>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next slide"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/45 transition-all duration-300 hover:border-cream hover:bg-cream hover:text-canopy"
            >
              <ArrowLeft className="h-5 w-5 rotate-180" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
