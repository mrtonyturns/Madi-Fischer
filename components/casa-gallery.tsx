"use client";

import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

export interface CasaImage {
  src: string;
  alt: string;
  position?: string;
}

/**
 * Per-casa photo slideshow, dropped in where a single static <Image> used to
 * sit. Most casas still only have the one front-of-house photo, so the
 * pager only renders once there is more than one to page through — a casa
 * with a single image looks exactly like it did before this existed.
 */
export function CasaGallery({
  images,
  priority,
}: {
  images: CasaImage[];
  priority?: boolean;
}) {
  const [index, setIndex] = React.useState(0);
  const go = (d: number) =>
    setIndex((i) => (i + d + images.length) % images.length);
  const img = images[index];

  return (
    <>
      <AnimatePresence initial={false}>
        <motion.div
          key={img.src}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="(min-width: 1280px) 1248px, 100vw"
            className={`object-cover ${img.position ?? "object-center"}`}
            priority={priority}
          />
        </motion.div>
      </AnimatePresence>

      {images.length > 1 ? (
        <div className="absolute top-5 right-5 z-10 flex items-center gap-1.5 rounded-full bg-canopy-deep/45 py-1.5 pr-2 pl-1.5 text-cream backdrop-blur-md sm:top-7 sm:right-7">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-200 hover:bg-cream/25"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          </button>
          <p className="font-mono text-xs tracking-widest tabular-nums">
            {String(index + 1).padStart(2, "0")}
            <span className="mx-1 text-cream/50">/</span>
            {String(images.length).padStart(2, "0")}
          </p>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photo"
            className="flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-200 hover:bg-cream/25"
          >
            <ArrowLeft className="h-3.5 w-3.5 rotate-180" aria-hidden />
          </button>
        </div>
      ) : null}
    </>
  );
}
