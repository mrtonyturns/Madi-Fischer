"use client";

import { Star } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import * as React from "react";

import { Eyebrow } from "@/components/ui/eyebrow";

/**
 * GOOGLE REVIEWS
 *
 * Reviews are fetched at runtime from the Cloudflare Worker (/api/reviews),
 * never baked into the build: the site is a static export, so there is no
 * server to hold the Places API key, and a build-time fetch would freeze the
 * reviews until the next deploy.
 *
 * The section renders *nothing at all* until real reviews come back — no
 * skeleton, no placeholder, no sample copy. Invented reviews on a rental
 * listing are fraud, and an empty state that hints at reviews the property
 * doesn't have yet is the same lie in a quieter voice. Locally, and on any
 * deploy where the Worker secrets aren't set, this component is invisible.
 *
 * Attribution is Google's requirement, not decoration: every card carries the
 * reviewer's name and photo, and the section links back to the listing.
 */

interface Review {
  author: string;
  authorUrl: string | null;
  photo: string | null;
  rating: number | null;
  when: string;
  text: string;
}

interface Payload {
  configured: boolean;
  rating: number | null;
  total: number | null;
  url: string | null;
  reviews: Review[];
}

export interface ReviewLabels {
  eyebrow: string;
  title: string;
  source: string;
  readMore: string;
  ratingLabel: string;
}

export function Reviews({
  labels,
  locale,
  fallbackUrl,
}: {
  labels: ReviewLabels;
  locale: string;
  /** Used for "read all reviews" when Google doesn't return a maps URI. */
  fallbackUrl: string;
}) {
  const [data, setData] = React.useState<Payload | null>(null);
  const reduce = useReducedMotion();

  React.useEffect(() => {
    let live = true;
    fetch(`/api/reviews?lang=${locale}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json: Payload | null) => {
        if (live && json?.configured) setData(json);
      })
      // A dead endpoint means no section, not an error in the console for
      // every visitor. This is expected during local development.
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [locale]);

  if (!data || data.reviews.length === 0) return null;

  const href = data.url ?? fallbackUrl;

  return (
    <section id="reviews" className="scroll-mt-[84px] bg-secondary">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Eyebrow>{labels.eyebrow}</Eyebrow>
            <h2 className="mt-6 font-display text-[2rem] leading-[1.1] font-normal text-canopy sm:text-[2.75rem]">
              {labels.title}
            </h2>
          </div>

          {data.rating ? (
            <div className="flex items-center gap-3">
              <Stars value={Math.round(data.rating)} />
              <p className="text-sm text-muted-foreground">
                <span className="font-display text-xl text-canopy">
                  {data.rating.toFixed(1)}
                </span>{" "}
                {labels.ratingLabel}
                {data.total ? ` · ${data.total}` : ""}
              </p>
            </div>
          ) : null}
        </div>

        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {data.reviews.map((review, i) => (
            <motion.li
              key={`${review.author}-${i}`}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: reduce ? 0.001 : 0.5,
                delay: reduce ? 0 : i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col rounded-[24px] border border-canopy/8 bg-card p-6 shadow-[0_18px_44px_-32px_rgba(11,46,34,0.5)] sm:p-7"
            >
              {review.rating ? <Stars value={review.rating} /> : null}
              <p className="mt-4 flex-1 leading-relaxed text-muted-foreground">
                {review.text}
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-canopy/8 pt-5">
                {review.photo ? (
                  /* A plain <img>: the photo comes from Google's CDN and is
                     required for attribution. next/image buys nothing here —
                     this export runs unoptimized — and would need Google's
                     host allow-listed in next.config.ts on top. */
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={review.photo}
                    alt=""
                    width={36}
                    height={36}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="h-9 w-9 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest/12 font-display text-sm text-forest"
                    aria-hidden
                  >
                    {review.author.charAt(0)}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-canopy">
                    {review.author}
                  </p>
                  {review.when ? (
                    <p className="text-xs text-muted-foreground">
                      {review.when}
                    </p>
                  ) : null}
                </div>
              </div>
            </motion.li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-trail"
          >
            {labels.readMore}
          </a>
          <p className="text-xs text-muted-foreground">{labels.source}</p>
        </div>
      </div>
    </section>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${value} / 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden
          className={`h-4 w-4 ${
            n <= value ? "fill-sun text-sun" : "text-canopy/20"
          }`}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}
