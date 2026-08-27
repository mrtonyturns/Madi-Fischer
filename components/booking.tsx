"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import * as React from "react";

/**
 * Cal.com booking. The Cal link (e.g. "fischer-tropitel/stay") comes from
 * NEXT_PUBLIC_CAL_LINK — a BUILD-time variable under static export. When it's
 * not set, the page falls back to the contact form and neither of these
 * components is rendered, so nothing here needs a null guard beyond the check
 * in the page.
 */
export const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK;

function useCalInit() {
  React.useEffect(() => {
    (async () => {
      const cal = await getCalApi();
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);
}

/** Inline month-view calendar for the booking section. */
export function BookingCalendar() {
  useCalInit();
  if (!CAL_LINK) return null;
  return (
    <Cal
      calLink={CAL_LINK}
      style={{ width: "100%", minHeight: "620px" }}
      config={{ layout: "month_view" }}
    />
  );
}

/** Opens the Cal.com booking popup; `notes` pre-fills which casa was clicked. */
export function BookButton({
  children,
  notes,
  className,
}: {
  children: React.ReactNode;
  notes?: string;
  className?: string;
}) {
  useCalInit();
  if (!CAL_LINK) return null;
  return (
    // A plain button, not the shadcn <Button>: the caller passes the site's
    // own .btn classes and the two systems' radii and shadows would fight.
    <button
      type="button"
      className={className}
      data-cal-link={CAL_LINK}
      data-cal-config={JSON.stringify({
        layout: "month_view",
        ...(notes ? { notes } : {}),
      })}
    >
      {children}
    </button>
  );
}
