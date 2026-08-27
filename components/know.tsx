"use client";

import { Car, CloudRain, Leaf, Zap } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import * as React from "react";

import { MonsteraLeaf } from "@/components/canopy";
import { Eyebrow } from "@/components/ui/eyebrow";

/**
 * KNOW BEFORE YOU GO — field notes, not tiles.
 *
 * The old version put four equal cards in a 2×2 grid, which read as feature
 * marketing. This copy is the opposite of marketing: it is the honest list of
 * reasons the property might not suit you. So it is set as a field notebook —
 * numbered entries, hairline rules, no boxes — with the heading parked in a
 * sticky column beside it. Nothing is boxed, so nothing looks like a sales
 * point.
 *
 * Each rule draws itself across as its entry arrives; it is the only motion in
 * the section, and it is what makes the list feel written rather than laid out.
 */

const ICONS = [Car, Zap, Leaf, CloudRain];

export function KnowNotes({
  eyebrow,
  title,
  sub,
  items,
}: {
  eyebrow: string;
  title: string;
  sub: string;
  items: { title: string; text: string }[];
}) {
  const reduce = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <div className="relative">
      {/* Oversized watermark leaf — gives the flat green band something to be. */}
      <svg
        viewBox="0 0 520 520"
        className="pointer-events-none absolute -top-24 -right-16 hidden h-[520px] w-[520px] text-cream/4 lg:block"
        aria-hidden
      >
        <g transform="rotate(18 260 260)">
          <MonsteraLeaf id="know-watermark" size={520} splits={7} />
        </g>
      </svg>

      <div className="relative grid gap-12 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Eyebrow onDark>{eyebrow}</Eyebrow>
          <h2 className="mt-6 font-display text-[2rem] leading-[1.1] font-normal text-cream sm:text-[2.75rem]">
            {title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-cream/70">{sub}</p>
        </div>

        <ol className="grid">
          {items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <motion.li
                key={item.title}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: reduce ? 0.001 : 0.6, ease }}
                className="relative pt-8 pb-9 first:pt-0"
              >
                {/* The rule belongs to the entry below it, and draws in with it. */}
                {i > 0 ? (
                  <motion.span
                    className="absolute inset-x-0 top-0 block h-px origin-left bg-cream/18"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{
                      duration: reduce ? 0.001 : 0.9,
                      ease,
                      delay: reduce ? 0 : 0.08,
                    }}
                    aria-hidden
                  />
                ) : null}

                <div className="flex gap-5 sm:gap-8">
                  <span
                    className="mt-1 shrink-0 font-display text-2xl leading-none font-normal text-sun/70 tabular-nums sm:text-3xl"
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-xl leading-snug font-normal text-cream sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-2xl leading-relaxed text-cream/70">
                      {item.text}
                    </p>
                  </div>

                  <span
                    className="mt-1 hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-sun/30 text-sun/80 sm:flex"
                    aria-hidden
                  >
                    <Icon className="h-4.5 w-4.5" strokeWidth={1.5} />
                  </span>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
