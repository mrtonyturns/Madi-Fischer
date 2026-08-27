"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import * as React from "react";

import { MonsteraLeaf, PalmFrond } from "@/components/canopy";
import { Btn } from "@/components/ui/btn";
import { Eyebrow } from "@/components/ui/eyebrow";

/**
 * THE HERO — "parting the canopy"
 *
 * The section is 165svh tall and pins a full-height stage to the top, so the
 * first ~0.65 of a screen of scrolling drives a choreography instead of just
 * moving the page. Five layers move at five different rates:
 *
 *   photo       drifts down and pushes in           (the world recedes)
 *   grade       deepens                             (light drops)
 *   copy        lifts and fades out first           (it hands over early)
 *   fronds      swing outward and grow              (the canopy is parted)
 *
 * The fifth layer — the ground rising to meet you — is not in this file. It is
 * the rest of the page: app/[locale]/page.tsx pulls everything after the hero
 * up over this pinned stage with a negative margin, led by a ridge edge. An
 * earlier version faked it with an empty panel here, which left a full screen
 * of blank between the end of the animation and the first real content.
 *
 * Everything else is driven by one scroll progress value on the compositor —
 * no scroll listeners, no layout reads per frame.
 *
 * With `prefers-reduced-motion` the whole choreography collapses to a static
 * composition; nothing moves and nothing is lost.
 */
export function Hero({
  eyebrow,
  title,
  sub,
  ctaPrimary,
  ctaPrimaryHref,
  ctaSecondary,
  ctaSecondaryHref,
  scrollCue,
  imageAlt,
}: {
  eyebrow: string;
  title: string;
  sub: string;
  ctaPrimary: string;
  ctaPrimaryHref: string;
  ctaSecondary: string;
  ctaSecondaryHref: string;
  scrollCue: string;
  imageAlt: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={ref}
      id="top"
      className="relative z-0 h-[170svh] bg-canopy-deep"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <Stage p={scrollYProgress} reduce={!!reduce} imageAlt={imageAlt} />

        {/* ---- Copy ---- */}
        <Copy
          p={scrollYProgress}
          reduce={!!reduce}
          eyebrow={eyebrow}
          title={title}
          sub={sub}
          ctaPrimary={ctaPrimary}
          ctaPrimaryHref={ctaPrimaryHref}
          ctaSecondary={ctaSecondary}
          ctaSecondaryHref={ctaSecondaryHref}
          scrollCue={scrollCue}
        />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Stage({
  p,
  reduce,
  imageAlt,
}: {
  p: MotionValue<number>;
  reduce: boolean;
  imageAlt: string;
}) {
  const photoScale = useTransform(p, [0, 1], [1.06, 1.24]);
  const photoY = useTransform(p, [0, 1], ["0%", "9%"]);
  // Dusk falls as you descend through the canopy — a separate layer, because
  // an opacity above 1 on the grade itself would simply clamp.
  const duskOpacity = useTransform(p, [0, 0.8, 1], [0, 0.6, 0.6]);

  // Foreground fronds swing apart. The left group also drifts up a little, so
  // the pair doesn't read as a symmetrical curtain.
  const leftX = useTransform(p, [0, 0.75, 1], ["0%", "-46%", "-46%"]);
  const leftY = useTransform(p, [0, 0.75, 1], ["0%", "-14%", "-14%"]);
  const leftRotate = useTransform(p, [0, 0.75, 1], [0, -16, -16]);
  const rightX = useTransform(p, [0, 0.75, 1], ["0%", "46%", "46%"]);
  const rightY = useTransform(p, [0, 0.75, 1], ["0%", "6%", "6%"]);
  const rightRotate = useTransform(p, [0, 0.75, 1], [0, 15, 15]);
  const nearScale = useTransform(p, [0, 0.75, 1], [1, 1.32, 1.32]);

  // The far canopy moves the other way — that opposition is what sells depth.
  const farY = useTransform(p, [0, 1], ["0%", "-16%"]);

  const still = reduce ? {} : undefined;

  return (
    <>
      {/* Photograph */}
      <motion.div
        className="absolute inset-0"
        style={reduce ? still : { scale: photoScale, y: photoY }}
      >
        <Image
          src="/images/property-2.jpg"
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[64%_36%]"
        />
      </motion.div>

      {/* Colour grade. The photography has a flat white sky; this turns it into
          light coming through cloud instead of a blown-out highlight. */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-canopy-deep/62" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 70% at 50% -8%, color-mix(in oklch, var(--sun) 42%, transparent) 0%, transparent 62%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, color-mix(in oklch, var(--canopy-deep) 72%, transparent) 0%, transparent 26%, color-mix(in oklch, var(--canopy-deep) 40%, transparent) 62%, var(--canopy-deep) 100%)",
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 75% at 50% 45%, transparent 40%, color-mix(in oklch, var(--canopy-deep) 68%, transparent) 100%)",
          }}
        />
      </div>

      <motion.div
        className="absolute inset-0 bg-canopy-deep"
        style={reduce ? still : { opacity: duskOpacity }}
        aria-hidden
      />

      {/* Far canopy — a soft silhouette band across the top */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-[46%]"
        style={reduce ? still : { y: farY }}
        aria-hidden
      >
        <svg
          viewBox="0 0 1440 500"
          preserveAspectRatio="xMidYMin slice"
          className="h-full w-full text-canopy-deep/55"
          /* The fronds are deliberately drawn past the edges of their own
             viewBox so they read as branches continuing off-frame. An SVG root
             clips to its viewport by default, which turned that into a hard
             straight cut mid-blade. Let it spill — the sticky stage above
             still clips everything at the edge of the screen, which is the
             only place a frond should end. */
          style={{ overflow: "visible" }}
        >
          <g transform="translate(-40, 30) rotate(28)">
            <PalmFrond length={430} arch={140} bladeLength={120} blades={26} />
          </g>
          <g transform="translate(430, -30) rotate(58)">
            <PalmFrond length={360} arch={110} bladeLength={98} blades={24} />
          </g>
          <g transform="translate(1490, 40) rotate(152)">
            <PalmFrond length={440} arch={150} bladeLength={124} blades={26} />
          </g>
          <g transform="translate(1080, -40) rotate(120)">
            <PalmFrond length={350} arch={100} bladeLength={96} blades={22} />
          </g>
        </svg>
      </motion.div>

      {/* Near fronds, left. Blurred a touch: a real foreground is out of focus,
          and the blur is also what keeps them from competing with the type. */}
      <motion.div
        className="pointer-events-none absolute -top-16 -left-24 h-[78%] w-[62%] origin-top-left sm:-left-16"
        style={
          reduce
            ? still
            : { x: leftX, y: leftY, rotate: leftRotate, scale: nearScale }
        }
        aria-hidden
      >
        <div className="sway h-full w-full [--sway:1.6deg] [--sway-origin:0%_0%]">
          <svg
            viewBox="0 0 700 620"
            preserveAspectRatio="xMinYMin meet"
            className="h-full w-full text-canopy-deep/85 blur-[2px] drop-shadow-[0_18px_36px_rgba(0,0,0,0.35)]"
            style={{ overflow: "visible" }}
          >
            <g transform="translate(-20, 40) rotate(34)">
              <PalmFrond
                length={520}
                arch={175}
                bladeLength={150}
                blades={30}
              />
            </g>
            <g transform="translate(60, -60) rotate(62)">
              <PalmFrond
                length={430}
                arch={130}
                bladeLength={124}
                blades={26}
              />
            </g>
            <g transform="translate(-30, 250) rotate(8)" opacity={0.9}>
              <MonsteraLeaf id="hero-l1" size={230} splits={5} />
            </g>
          </svg>
        </div>
      </motion.div>

      {/* Near fronds, right */}
      <motion.div
        className="pointer-events-none absolute -top-24 -right-28 h-[74%] w-[58%] origin-top-right sm:-right-16"
        style={
          reduce
            ? still
            : { x: rightX, y: rightY, rotate: rightRotate, scale: nearScale }
        }
        aria-hidden
      >
        <div className="sway h-full w-full [--sway:-1.9deg] [--sway-origin:100%_0%] [animation-delay:-3.4s]">
          <svg
            viewBox="0 0 700 620"
            preserveAspectRatio="xMaxYMin meet"
            className="h-full w-full text-canopy-deep/85 blur-[2px] drop-shadow-[0_18px_36px_rgba(0,0,0,0.35)]"
            style={{ overflow: "visible" }}
          >
            <g transform="translate(720, 30) rotate(146)">
              <PalmFrond
                length={520}
                arch={175}
                bladeLength={150}
                blades={30}
              />
            </g>
            <g transform="translate(650, -70) rotate(118)">
              <PalmFrond
                length={420}
                arch={125}
                bladeLength={120}
                blades={26}
              />
            </g>
            <g transform="translate(470, 230) rotate(-10)" opacity={0.9}>
              <MonsteraLeaf id="hero-r1" size={220} splits={5} />
            </g>
          </svg>
        </div>
      </motion.div>
    </>
  );
}

/* ------------------------------------------------------------------ */

function Copy({
  p,
  reduce,
  eyebrow,
  title,
  sub,
  ctaPrimary,
  ctaPrimaryHref,
  ctaSecondary,
  ctaSecondaryHref,
  scrollCue,
}: {
  p: MotionValue<number>;
  reduce: boolean;
  eyebrow: string;
  title: string;
  sub: string;
  ctaPrimary: string;
  ctaPrimaryHref: string;
  ctaSecondary: string;
  ctaSecondaryHref: string;
  scrollCue: string;
}) {
  /*
   * Every range below spans the full 0 → 1 of scroll progress, including the
   * flat tails. That is deliberate: a range that stops early (…[0, 0.46]) does
   * not reliably hold its final value once progress runs past the end, and the
   * symptom is nasty — the hero copy faded out on the way down and then faded
   * back IN over the section below it. Always land the last keyframe on 1.
   */
  const y = useTransform(p, [0, 0.5, 1], [0, -110, -110]);
  const opacity = useTransform(p, [0, 0.28, 0.46, 1], [1, 1, 0, 0]);
  const cueOpacity = useTransform(p, [0, 0.12, 1], [1, 0, 0]);

  /** Lands exactly where the rising ridge meets the top of the screen. */
  const scrollOn = () =>
    window.scrollTo({
      top: window.innerHeight * 1.15,
      behavior: reduce ? "auto" : "smooth",
    });

  const ease = [0.22, 1, 0.36, 1] as const;
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.001 : 0.85, delay, ease },
  });

  return (
    <motion.div
      className="absolute inset-0 z-20 flex flex-col justify-center"
      style={reduce ? {} : { y, opacity }}
    >
      <div className="mx-auto w-full max-w-7xl px-5 pt-20 sm:px-8">
        <div className="max-w-3xl">
          <motion.div {...rise(0.1)}>
            <Eyebrow onDark>{eyebrow}</Eyebrow>
          </motion.div>

          <motion.h1
            {...rise(0.2)}
            className="mt-6 font-display text-[2.6rem] leading-[1.04] font-normal text-cream sm:text-6xl lg:text-[4.25rem]"
            style={{ fontVariationSettings: '"SOFT" 40, "WONK" 1' }}
          >
            {title}
          </motion.h1>

          <motion.p
            {...rise(0.32)}
            className="mt-7 max-w-xl text-lg leading-relaxed text-cream/80"
          >
            {sub}
          </motion.p>

          <motion.div {...rise(0.44)} className="mt-10 flex flex-wrap gap-3">
            <Btn href={ctaPrimaryHref} variant="stone" size="lg">
              {ctaPrimary}
            </Btn>
            <Btn href={ctaSecondaryHref} variant="mist" size="lg" arrow={false}>
              {ctaSecondary}
            </Btn>
          </motion.div>

        </div>
      </div>

      <motion.div
        className="absolute inset-x-0 bottom-8 hidden justify-center sm:flex"
        style={reduce ? {} : { opacity: cueOpacity }}
      >
        {/*
          Was a label over a hairline with a gold bead running down it. Now a
          stone, matching the menu trigger in the header — same circle, same
          hairline rim, same fill-on-hover. It is also a real control: the old
          one was decoration you couldn't press.
        */}
        <button
          type="button"
          onClick={scrollOn}
          aria-label={scrollCue}
          className="group flex h-12 w-12 items-center justify-center rounded-full border border-cream/30 bg-cream/8 backdrop-blur-md transition-colors duration-300 hover:border-cream hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden
            className="nudge h-4 w-4 text-cream transition-colors duration-300 group-hover:text-canopy-deep"
          >
            <path
              d="M8 2.5v11m0 0L3.75 9.25M8 13.5l4.25-4.25"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
}
