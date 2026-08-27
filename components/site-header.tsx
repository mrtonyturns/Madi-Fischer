"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import * as React from "react";

import { Logo } from "@/components/brand";
import { Btn } from "@/components/ui/btn";

export interface NavLink {
  href: string;
  label: string;
}

/**
 * The header rides on top of the hero rather than sitting in a solid band:
 * transparent while the hero is on screen, then settling into a blurred
 * canopy bar once you scroll past it. That is the pattern boutique hotel
 * sites converge on, and it keeps the hero's full height intact.
 */
export function SiteHeader({
  links,
  cta,
  ctaHref,
  switchLabel,
  switchHref,
  menuLabel,
  closeLabel,
}: {
  links: NavLink[];
  cta: string;
  ctaHref: string;
  switchLabel: string;
  switchHref: string;
  menuLabel: string;
  closeLabel: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [settled, setSettled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setSettled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes the panel; without this the only way out is the trigger.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = settled || open;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-[background-color,backdrop-filter,box-shadow] duration-500 ${
          solid
            ? "bg-canopy-deep/92 shadow-[0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[84px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <a
            href="#top"
            className="text-cream transition-opacity hover:opacity-80"
            aria-label="Fischer Tropitel — home"
          >
            <Logo compact />
          </a>

          <div className="flex items-center gap-3 sm:gap-5">
            <a
              href={switchHref}
              className="hidden text-[0.8125rem] font-semibold tracking-[0.14em] text-cream/70 uppercase transition-colors hover:text-cream md:block"
            >
              {switchLabel}
            </a>
            <Btn
              href={ctaHref}
              variant="stone"
              size="sm"
              arrow={false}
              className="hidden sm:inline-flex"
            >
              {cta}
            </Btn>
            <MenuTrigger
              open={open}
              onToggle={() => setOpen((v) => !v)}
              label={open ? closeLabel : menuLabel}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <MenuPanel
            links={links}
            switchLabel={switchLabel}
            switchHref={switchHref}
            cta={cta}
            ctaHref={ctaHref}
            onClose={() => setOpen(false)}
          />
        ) : null}
      </AnimatePresence>
    </header>
  );
}

/**
 * The menu trigger, redesigned as a stone rather than a coloured square: a
 * circle with a hairline rim, and three rules of deliberately unequal length
 * that fold into an X. The uneven lengths are what stop it reading as a
 * default hamburger icon.
 */
function MenuTrigger({
  open,
  onToggle,
  label,
}: {
  open: boolean;
  onToggle: () => void;
  label: string;
}) {
  const reduce = useReducedMotion();
  const spring = reduce
    ? { duration: 0.001 }
    : ({ type: "spring", stiffness: 420, damping: 30 } as const);

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-label={label}
      className="group relative flex h-13 w-13 shrink-0 items-center justify-center rounded-full border border-cream/30 bg-cream/8 backdrop-blur-md transition-colors duration-300 hover:border-sun hover:bg-sun focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-sun"
    >
      {/* Widths are fixed in CSS and only transforms animate. Animating width
          itself made the bars stall mid-flight and cost a layout pass per
          frame; the two outer bars share a width and a left edge so the open
          state crosses into a true X. The middle bar is short and inset from
          the left — that offset is what keeps this from reading as the default
          hamburger glyph. */}
      <span className="relative block h-[18px] w-[22px]">
        <motion.span
          className="absolute top-px left-0 block h-[2px] w-[22px] rounded-full bg-cream group-hover:bg-canopy-deep"
          animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
          transition={spring}
        />
        <motion.span
          className="absolute top-[8px] left-[6px] block h-[2px] w-[16px] rounded-full bg-cream group-hover:bg-canopy-deep"
          animate={open ? { opacity: 0, x: 10 } : { opacity: 1, x: 0 }}
          transition={spring}
        />
        <motion.span
          className="absolute top-[15px] left-0 block h-[2px] w-[22px] rounded-full bg-cream group-hover:bg-canopy-deep"
          animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
          transition={spring}
        />
      </span>
    </button>
  );
}

/** The dropdown panel — the one part of the old header worth keeping. */
function MenuPanel({
  links,
  switchLabel,
  switchHref,
  cta,
  ctaHref,
  onClose,
}: {
  links: NavLink[];
  switchLabel: string;
  switchHref: string;
  cta: string;
  ctaHref: string;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: reduce ? 0.001 : 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="topo relative border-t border-cream/10 bg-canopy-deep/97 shadow-2xl backdrop-blur-xl"
    >
      <ul className="relative z-10 mx-auto grid max-w-7xl gap-1 px-5 py-8 sm:px-8 sm:py-10">
        {links.map((link, i) => (
          <motion.li
            key={link.href}
            initial={{ opacity: 0, x: -14 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: {
                delay: reduce ? 0 : 0.04 * i,
                duration: reduce ? 0.001 : 0.3,
              },
            }}
          >
            <a
              href={link.href}
              onClick={onClose}
              className="group flex items-baseline gap-4 rounded-2xl px-4 py-3 transition-colors hover:bg-cream/8"
            >
              <span className="font-mono text-xs text-sun/70 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-3xl font-normal text-cream transition-colors group-hover:text-sun sm:text-4xl">
                {link.label}
              </span>
            </a>
          </motion.li>
        ))}
        <li className="mt-5 flex flex-wrap items-center gap-4 border-t border-cream/12 px-4 pt-6">
          <Btn href={ctaHref} variant="stone" size="sm" onClick={onClose}>
            {cta}
          </Btn>
          <a
            href={switchHref}
            className="text-[0.8125rem] font-semibold tracking-[0.14em] text-cream/70 uppercase transition-colors hover:text-sun"
          >
            {switchLabel}
          </a>
        </li>
      </ul>
    </motion.nav>
  );
}
