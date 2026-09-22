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

import { Btn } from "@/components/ui/btn";
import { Eyebrow } from "@/components/ui/eyebrow";

/**
 * THE HERO
 *
 * The section is 170svh tall and pins a full-height stage to the top, so the
 * first ~0.7 of a screen of scrolling drives a choreography instead of just
 * moving the page:
 *
 *   footage     drifts down and pushes in           (the world recedes)
 *   copy        lifts and fades out first           (it hands over early)
 *
 * There used to be a layer of drawn palm fronds over the footage that swung
 * apart as you scrolled, and a green colour grade (tint, vignette and a
 * darkening "dusk" layer on scroll). Both came out once the waterfall video
 * went in, so nothing sits between the viewer and the footage.
 *
 * The last layer — the ground rising to meet you — is not in this file. It is
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
  // The footage is 720p, so every bit of zoom costs sharpness. It rests at
  // 1:1 — the frame people actually look at — and only pushes in once the
  // copy is already lifting away. The drift stays under the 6% per side the
  // end scale adds, so no edge ever shows.
  const photoScale = useTransform(p, [0, 1], [1, 1.12]);
  const photoY = useTransform(p, [0, 1], ["0%", "5%"]);

  const still = reduce ? {} : undefined;

  /*
   * React never writes `muted` into server-rendered HTML — it only sets the
   * property after hydration — so browsers can refuse the `autoPlay` in the
   * markup, and they pause muted background video while the tab is hidden
   * without always resuming it. Set the property and ask for playback
   * ourselves, on mount and whenever the tab comes back.
   */
  const videoRef = React.useRef<HTMLVideoElement>(null);
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    const play = () => {
      if (document.visibilityState === "visible") {
        video.play().catch(() => {
          // Autoplay refused (e.g. Low Power Mode). The poster stays up.
        });
      }
    };
    play();
    document.addEventListener("visibilitychange", play);
    return () => document.removeEventListener("visibilitychange", play);
  }, [reduce]);

  return (
    <>
      {/* Background footage — the waterfall the casas sit above. A viewer who
          has asked for reduced motion gets the poster frame as a still photo
          instead: the choreography above is allowed to collapse, but an
          autoplaying loop is motion too, so it collapses with it. */}
      <motion.div
        className="absolute inset-0"
        style={reduce ? still : { scale: photoScale, y: photoY }}
      >
        {reduce ? (
          <Image
            src="/images/hero-waterfall-poster.jpg"
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src="/videos/hero-waterfall.mp4"
            poster="/images/hero-waterfall-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label={imageAlt}
          />
        )}
      </motion.div>

      {/* A plain black scrim, not a colour grade: enough to lift the white
          type off bright water and sunlit canopy without tinting the
          footage. */}
      <div className="absolute inset-0 bg-black/45" aria-hidden />
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
