import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

import { Item, Lift, Reveal, Stagger } from "@/components/animate";
import { AreaMap } from "@/components/area-map";
import { BookButton, BookingCalendar } from "@/components/booking";
import { CasaSlides } from "@/components/casa-slides";
import { ContactForm } from "@/components/contact-form";
import { Hero } from "@/components/hero";
import { Highlights } from "@/components/highlights";
import { KnowNotes } from "@/components/know";
import { Reviews } from "@/components/reviews";
import { SiteHeader } from "@/components/site-header";
import { Btn } from "@/components/ui/btn";
import { Eyebrow } from "@/components/ui/eyebrow";
import { dict, type Locale } from "@/lib/i18n";

const PHONES = [
  { label: "+1 (715) 348-4887", href: "tel:+17153484887" },
  { label: "+1 (715) 573-5576", href: "tel:+17155735576" },
  { label: "+1 (715) 581-7713", href: "tel:+17155817713" },
];
const EMAIL = "madi@fischertropitel.com";

// Set NEXT_PUBLIC_CAL_LINK (build variable) to switch on Cal.com booking:
// the inline calendar section appears and casa buttons open the booking popup.
const CAL_CONFIGURED = Boolean(process.env.NEXT_PUBLIC_CAL_LINK);

// PLACEHOLDER LINKS — these point at Airbnb's homepage, not at the casas.
// Madi had one combined listing and needs to split it into three; drop each
// listing URL in here, in the same order as t.casas.list (Casa Cascada, Loads
// of Toads, Casa Verde) and the buttons start working. Setting an entry to
// null falls the button back to the contact form.
const AIRBNB_URLS: (string | null)[] = [
  "https://www.airbnb.com",
  "https://www.airbnb.com",
  "https://www.airbnb.com",
];

// Search link rather than the canonical listing URL, because the profile
// resolves by name today and this needs no maintenance. Replace it with the
// share link from the Google Business Profile when someone has it to hand.
const GOOGLE_LISTING_URL =
  "https://www.google.com/maps/search/?api=1&query=Fischer+Tropitel";

/*
 * One photo array per casa, in t.casas.list order — each card is a slideshow
 * and grows controls automatically once its array has more than one entry.
 * Madi wants more photos of every house here; drop them in as they arrive.
 *
 * The portrait shots (900x1200) sit in a wide card, so `object-cover` throws
 * most of the frame away; `position` biases the crop onto the house.
 *
 * The two porch-deck shots are the full-resolution originals of the porch
 * photo Madi embedded in her revisions doc. That deck is shared by Casa
 * Cascada and Loads of Toads, so both slideshows include it.
 */
const CASA_IMAGES: {
  src: string;
  alt: string;
  position?: string;
}[][] = [
  [
    {
      src: "/images/porch-deck-1.jpg",
      alt: "The covered porch shared by Casa Cascada and Loads of Toads, with wooden chairs facing the jungle",
    },
    {
      src: "/images/porch-deck-2.jpg",
      alt: "Looking down the shared porch toward the outdoor bar and the jungle",
    },
    {
      src: "/images/casa-cascada-door.jpg",
      alt: "Casa Cascada's entrance, its name painted over the door",
      position: "object-[center_40%]",
    },
    {
      src: "/images/casa-cascada.jpg",
      alt: "The front of Casa Cascada from the shared deck",
      position: "object-[center_62%]",
    },
    // TODO: confirm with Madi which casa this bedroom belongs to — the two
    // interior shots arrived unlabelled, so the alts stay property-generic.
    {
      src: "/images/bedroom-1.jpg",
      alt: "A bedroom at the casas, its window filled with jungle",
    },
  ],
  [
    {
      src: "/images/loads-of-toads.jpg",
      alt: "The front door and windows of Loads of Toads",
      position: "object-[center_64%]",
    },
    // TODO: as above — confirm which casa this bedroom is in.
    {
      src: "/images/bedroom-2.jpg",
      alt: "A bedroom at the casas, with the jungle outside the window",
    },
    {
      src: "/images/porch-deck-2.jpg",
      alt: "Looking down the shared porch toward the outdoor bar and the jungle",
    },
  ],
  [
    {
      src: "/images/casa-verde.jpg",
      alt: "Casa Verde against the jungle",
    },
    {
      src: "/images/property-3.jpg",
      alt: "Casa Verde's back corner against the jungle",
    },
  ],
];

const HIGHLIGHT_IMAGES = [
  // The porch photo from Madi's revisions doc, replacing the old front-of-house
  // shot on the first carousel card.
  {
    src: "/images/porch-deck-1.jpg",
    alt: "The shared porch's outdoor bar, rocking chairs and hammock swing",
  },
  { src: "/images/property-2.jpg", alt: "The gated entrance to the property" },
  // property-3 moved into Casa Verde's slideshow; this wide driveway shot
  // keeps the carousel from repeating it.
  {
    src: "/images/property-4.jpg",
    alt: "The casas from the property's gravel driveway",
  },
];

/** The fixed header is 84px, so anchored sections need to clear it. */
const ANCHOR = "scroll-mt-[84px]";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = dict[locale as Locale];

  const slides = t.highlights.items.map((item, i) => ({
    ...HIGHLIGHT_IMAGES[i],
    ...item,
  }));

  const navLinks = [
    { href: "#casas", label: t.nav.casas },
    { href: "#area", label: t.nav.area },
    { href: "#know", label: t.nav.know },
    { href: "#contact", label: t.nav.contact },
  ];

  const ctaHref = CAL_CONFIGURED ? "#book" : "#contact";

  return (
    <>
      <SiteHeader
        links={navLinks}
        cta={t.nav.cta}
        ctaHref={ctaHref}
        switchLabel={t.nav.switchLabel}
        switchHref={t.nav.switchHref}
        menuLabel={t.nav.menu}
        closeLabel={t.nav.close}
      />

      <main>
        <Hero
          eyebrow={t.hero.eyebrow}
          title={t.hero.title}
          sub={t.hero.sub}
          ctaPrimary={t.hero.ctaPrimary}
          ctaPrimaryHref="#casas"
          ctaSecondary={t.hero.ctaSecondary}
          ctaSecondaryHref={ctaHref}
          scrollCue={t.hero.scrollCue}
          imageAlt={t.hero.imageAlt}
        />

        {/*
          Everything below the hero is pulled up over the pinned stage, led by
          the ridge. This IS the "ground rising to meet you" — the hero used to
          fake it with an empty cream panel, which meant a full screen of blank
          had to scroll past before any content appeared.

          The two numbers are a pair: the hero is 170svh, this pulls back 55svh,
          so the first content sits 115svh down the document and starts rising
          the moment you scroll. Change one and change the other.
        */}
        <div className="relative z-10 -mt-[55svh]">
          {/* Stats band — the first thing the rising ground reveals. */}
          <section className="bg-background">
            <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
              <Reveal>
                <Eyebrow>{t.stats.eyebrow}</Eyebrow>
              </Reveal>
              <Stagger className="mt-12 grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
                {t.stats.items.map(({ value, caption }) => (
                  <Item key={caption}>
                    <p className="font-display text-4xl font-normal text-forest sm:text-5xl">
                      {value}
                    </p>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
                      {caption}
                    </p>
                  </Item>
                ))}
              </Stagger>
            </div>
          </section>

          {/* Image carousel with a content card and numeric pagination. */}
          <section aria-label={t.highlights.eyebrow}>
            <Highlights slides={slides} />
          </section>

          {/* The casas — stacked full-width image cards. */}
          <section id="casas" className={`${ANCHOR} bg-background`}>
            <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
              <Reveal>
                <div className="max-w-3xl">
                  <Eyebrow>{t.casas.eyebrow}</Eyebrow>
                  <h2 className="mt-6 font-display text-[2rem] leading-[1.1] font-normal text-canopy sm:text-[2.75rem]">
                    {t.casas.title}
                  </h2>
                  <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                    {t.casas.intro}
                  </p>
                </div>
              </Reveal>

              <div className="mt-14 grid gap-7">
                {t.casas.list.map((casa, i) => (
                  <Reveal key={casa.name}>
                    <Lift>
                      <article className="relative min-h-[480px] overflow-hidden rounded-[28px] bg-canopy-deep">
                        <CasaSlides
                          slides={CASA_IMAGES[i]}
                          prevLabel={t.casas.prevPhoto}
                          nextLabel={t.casas.nextPhoto}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-canopy-deep via-canopy-deep/45 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 p-7 text-cream sm:p-10">
                          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                            <h3 className="font-display text-2xl leading-tight font-normal sm:text-4xl">
                              {casa.name}
                            </h3>
                            <p className="font-display text-xl text-sun sm:text-2xl">
                              {casa.price}
                              <span className="ml-1 font-sans text-sm text-cream/70">
                                {t.casas.perNight}
                              </span>
                            </p>
                          </div>
                          <p className="max-w-xl text-lg text-cream/85">
                            {casa.tagline}
                          </p>
                          <p className="max-w-xl text-[0.8125rem] text-cream/60">
                            {t.casas.beds} · {t.casas.bath} · {t.casas.kitchen}{" "}
                            · {casa.water} · {casa.deck}
                          </p>
                          {/* Casa Verde's cold-water note. Deliberately quiet:
                            the fact is already stated plainly in the spec line
                            above, so this only adds the reason. */}
                          {casa.highlight ? (
                            <p className="max-w-xl border-l border-cream/25 pl-4 text-sm leading-relaxed text-cream/55">
                              {casa.highlight}
                            </p>
                          ) : null}
                          <div className="mt-3">
                            {AIRBNB_URLS[i] ? (
                              <Btn
                                href={AIRBNB_URLS[i] as string}
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="stone"
                              >
                                {t.casas.bookNowCta}
                              </Btn>
                            ) : CAL_CONFIGURED ? (
                              <BookButton
                                className="btn btn-stone"
                                notes={casa.name}
                              >
                                {t.casas.bookCta} {casa.name}
                              </BookButton>
                            ) : (
                              <Btn href="#contact" variant="stone">
                                {t.casas.askCta}
                              </Btn>
                            )}
                          </div>
                        </div>
                      </article>
                    </Lift>
                  </Reveal>
                ))}
              </div>

              <Reveal>
                <p className="mt-9 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {t.casas.note}
                </p>
              </Reveal>
            </div>
          </section>

          {/* Fishing & adventure — the interactive area map. */}
          <section id="area" className={`${ANCHOR} bg-secondary`}>
            <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
              <Reveal>
                <div className="max-w-3xl">
                  <Eyebrow>{t.area.eyebrow}</Eyebrow>
                  <h2 className="mt-6 font-display text-[2rem] leading-[1.1] font-normal text-canopy sm:text-[2.75rem]">
                    {t.area.title}
                  </h2>
                  <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                    {t.area.sub}
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <div className="mt-12">
                  <AreaMap
                    places={t.area.places}
                    labels={{
                      fishing: t.area.catFishing,
                      nature: t.area.catNature,
                      adventure: t.area.catAdventure,
                      town: t.area.catTown,
                      baseName: t.area.baseName,
                      baseNote: t.area.baseNote,
                      note: t.area.note,
                      hint: t.area.hint,
                      directionsCta: t.area.directionsCta,
                      mapsCta: t.area.mapsCta,
                      listingUrl: GOOGLE_LISTING_URL,
                      listingCta: t.area.listingCta,
                    }}
                  />
                </div>
              </Reveal>
            </div>
          </section>

          {/* Know before you go — field notes on the brand ground. */}
          <section
            id="know"
            className={`${ANCHOR} topo relative overflow-hidden bg-canopy-deep`}
          >
            <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
              <KnowNotes
                eyebrow={t.know.eyebrow}
                title={t.know.title}
                sub={t.know.sub}
                items={t.know.items}
              />
            </div>
          </section>

          {/* Google reviews. Renders nothing until the Worker has its Places
            secrets — see components/reviews.tsx. */}
          <Reviews
            labels={t.reviews}
            locale={locale}
            fallbackUrl={GOOGLE_LISTING_URL}
          />

          {/* Booking — renders only once NEXT_PUBLIC_CAL_LINK is set at build. */}
          {CAL_CONFIGURED ? (
            <section id="book" className={`${ANCHOR} bg-background`}>
              <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
                <Reveal>
                  <div className="max-w-3xl">
                    <Eyebrow>{t.book.eyebrow}</Eyebrow>
                    <h2 className="mt-6 font-display text-[2rem] leading-[1.1] font-normal text-canopy sm:text-[2.75rem]">
                      {t.book.title}
                    </h2>
                    <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                      {t.book.sub}
                    </p>
                  </div>
                </Reveal>
                <Reveal delay={0.1}>
                  <div className="mt-10 rounded-[28px] border bg-card p-2 sm:p-4">
                    <BookingCalendar />
                  </div>
                </Reveal>
              </div>
            </section>
          ) : null}

          {/* Contact */}
          <section id="contact" className={`${ANCHOR} bg-background`}>
            <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-2">
              <Reveal>
                <Eyebrow>{t.contact.eyebrow}</Eyebrow>
                <h2 className="mt-6 font-display text-[2rem] leading-[1.1] font-normal text-canopy sm:text-[2.75rem]">
                  {t.contact.title}
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                  {t.contact.sub}
                </p>
                <ul className="mt-9 grid gap-4">
                  {PHONES.map((phone) => (
                    <li key={phone.href} className="flex items-center gap-3">
                      <Phone
                        className="h-4.5 w-4.5 text-forest"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                      <a
                        href={phone.href}
                        className="-my-2 inline-block py-2 font-medium hover:underline"
                      >
                        {phone.label}
                      </a>
                    </li>
                  ))}
                  <li className="flex items-center gap-3">
                    <Mail
                      className="h-4.5 w-4.5 text-forest"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    <a
                      href={`mailto:${EMAIL}`}
                      className="-my-2 inline-block py-2 font-medium break-all hover:underline"
                    >
                      {EMAIL}
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin
                      className="mt-0.5 h-4.5 w-4.5 shrink-0 text-forest"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    <span className="font-medium">{t.contact.location}</span>
                  </li>
                </ul>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="rounded-[28px] border bg-card p-6 shadow-[0_24px_60px_-40px_rgba(11,46,34,0.5)] sm:p-8">
                  <ContactForm labels={t.form} />
                </div>
              </Reveal>
            </div>
          </section>
        </div>
      </main>

      <footer className="topo relative bg-canopy-deep pt-16 text-cream/70">
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 md:grid-cols-3">
          <div>
            {/* The client's own badge (blue background keyed out); the compact
                Logo lockup stays in the header, where this art would collapse. */}
            <Image
              src="/images/logo-badge.png"
              alt="Fischer Tropitel Retreat — choose your adventure"
              width={200}
              height={200}
              className="-mt-4 -ml-3"
            />
            <p className="mt-1 max-w-xs leading-relaxed">{t.footer.tagline}</p>
          </div>
          <nav aria-label="Footer">
            <ul className="grid gap-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="-mx-2 inline-block px-2 py-2 transition-colors hover:text-cream"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={t.nav.switchHref}
                  className="-mx-2 inline-block px-2 py-2 font-semibold text-sun transition-opacity hover:opacity-80"
                >
                  {t.nav.switchLabel}
                </a>
              </li>
            </ul>
          </nav>
          <div className="md:text-right">
            {PHONES.map((phone) => (
              <p key={phone.href}>
                <a
                  href={phone.href}
                  className="-my-1.5 inline-block py-1.5 hover:text-cream"
                >
                  {phone.label}
                </a>
              </p>
            ))}
            <p className="mt-1">
              <a
                href={`mailto:${EMAIL}`}
                className="-my-1.5 inline-block py-1.5 break-all hover:text-cream"
              >
                {EMAIL}
              </a>
            </p>
            <p className="mt-4 text-sm text-cream/45">{t.contact.location}</p>
          </div>
        </div>
        <div className="relative z-10 mx-auto mt-12 max-w-7xl px-5 sm:px-8">
          <div className="border-t border-cream/12 py-7 text-sm text-cream/45">
            © {new Date().getFullYear()} Fischer Tropitel. {t.footer.rights}
          </div>
        </div>
      </footer>
    </>
  );
}
