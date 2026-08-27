import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * The site's button system — "leaf". Shape, colour and motion all live in the
 * `.btn-*` classes in app/globals.css; this file only picks a variant.
 *
 * The arrow is bare — the riverstone version sat it in a filled disc, which
 * the leaf has no room for. Pass `arrow={false}` on anything that isn't going
 * somewhere (a form submit, a CTA sitting beside another one).
 *
 * Variants:
 *   stone    — primary on dark grounds (flat bone)
 *   canopy   — primary on light grounds (flat forest green)
 *   mist     — secondary on dark grounds (ring, fills on hover)
 *   mistDark — secondary on light grounds
 *   trail    — a text link with a rule that draws itself
 */
export type BtnVariant = "stone" | "canopy" | "mist" | "mistDark" | "trail";
export type BtnSize = "sm" | "md" | "lg";

const VARIANT: Record<BtnVariant, string> = {
  stone: "btn btn-stone",
  canopy: "btn btn-canopy",
  mist: "btn btn-mist",
  mistDark: "btn btn-mist-dark",
  trail: "btn-trail",
};

const SIZE: Record<BtnSize, string> = {
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
};

/** Slightly softened arrow — the geometric lucide one read too technical. */
function Arrow() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden focusable="false">
      <path
        d="M2.5 8h11m0 0L9.25 3.75M13.5 8 9.25 12.25"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface BtnOwnProps {
  variant?: BtnVariant;
  size?: BtnSize;
  /** Draw the trailing arrow. */
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
}

type AnchorProps = BtnOwnProps &
  Omit<React.ComponentPropsWithoutRef<"a">, keyof BtnOwnProps> & { href: string };
type ButtonProps = BtnOwnProps &
  Omit<React.ComponentPropsWithoutRef<"button">, keyof BtnOwnProps> & {
    href?: undefined;
  };

export function Btn(props: AnchorProps): React.ReactElement;
export function Btn(props: ButtonProps): React.ReactElement;
export function Btn({
  variant = "canopy",
  size = "md",
  arrow = true,
  className,
  children,
  ...rest
}: AnchorProps | ButtonProps) {
  const classes = cn(
    VARIANT[variant],
    variant !== "trail" && SIZE[size],
    className,
  );

  const body = (
    <>
      {children}
      {arrow ? <Arrow /> : null}
    </>
  );

  if ("href" in rest && rest.href !== undefined) {
    const anchorProps = rest as Omit<AnchorProps, keyof BtnOwnProps>;
    return (
      <a {...anchorProps} className={classes}>
        {body}
      </a>
    );
  }

  const buttonProps = rest as Omit<ButtonProps, keyof BtnOwnProps>;
  return (
    <button type="button" {...buttonProps} className={classes}>
      {body}
    </button>
  );
}
