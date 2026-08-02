# Missing Service Images Report

**Date:** 2026-07-30
**Trigger:** Owner instruction — "final version, not a prototype" rule: every
rendered service card must be backed by a real, already-linked image inside
`public/brand/images/services/`. No demo cards, no placeholder images, no
empty images, and no icon substituted for a missing real photo. A service
with no real image must not get an incomplete card — it must be excluded
from its grid and reported here instead, pending an Owner decision.

This report lists every service found without a real linked image after a
full audit of `SERVICE_DATABASE.json` and `pest-control-pages.ts`. It is the
one and only place these two gaps are documented; no card, icon, or
placeholder was created for either.

## What changed as a result (code side)

- `src/app/[locale]/services/maintenance/page.tsx` — grid now filters to only
  services with a `cardImage`; services without one are silently excluded
  from the grid entirely (no partial/icon card).
- `src/app/[locale]/services/cleaning/page.tsx` — same filter applied
  (currently a no-op since all 3 cleaning services have images, kept for
  consistency and future safety).
- `src/components/service-content-sections.tsx` (`ServicePestTypesSection`)
  — the pest-type card grid on `/services/pest-control` now filters to only
  sub-services with both `image` and `imageAlt` set.
- `src/app/[locale]/page.tsx` — homepage's 3 section cards (Maintenance /
  Cleaning / Pest Control) are fixed, always-real-image services; the
  previous defensive icon-fallback branch was removed and replaced with a
  `requireCardImage()` helper that throws at build time if one of those 3
  ever loses its image, instead of silently rendering an icon.

No icon-fallback path remains in any service-card rendering surface.

## Missing images — 2 services

### 1. Handyman Services (`handyman`)

- **Category:** General Maintenance (`general-maintenance`)
- **Name (EN):** Handyman Services
- **Name (AR):** خدمات الصيانة العامة (هاندي مان)
- **Where it would appear:** `/{locale}/services/maintenance` hub grid
- **Status in `SERVICE_DATABASE.json`:** no `cardImage` block present at all
  (every other of the 7 maintenance services has one).
- **Current behavior:** excluded from the Maintenance hub grid. The service's
  own detail page at `/{locale}/services/maintenance/handyman` still exists
  and still resolves (via the legacy-slug redirect and its own route), but no
  card links to it from the hub until a real image is supplied.

### 2. Bed Bug Control (`bed-bug-control`)

- **Section:** Pest Control
- **Name (EN):** Bed Bug Control
- **Name (AR):** مكافحة بق الفراش
- **Where it would appear:** the pest-type card grid on
  `/{locale}/services/pest-control`
- **Status in `pest-control-pages.ts`:** `image: null, imageAlt: null` — the
  only one of the 11 pest-control sub-services without a real asset (all
  other 10 have a real filename).
- **Current behavior:** excluded from the pest-type grid. Its own detail
  page at `/{locale}/services/pest-control/bed-bug-control` still exists and
  still resolves, but no card links to it from the grid until a real image
  is supplied.

## Everything else audited — no gaps

- All 7 remaining Maintenance services: have a real `cardImage`.
- All 3 Cleaning services: have a real `cardImage`.
- 10 of 11 Pest Control sub-services: have a real `image`.
- Homepage's 3 section cards (Maintenance / Cleaning / Pest Control): each
  resolves to a real image (`ac-maintenance` card, `general-cleaning` card,
  and the pest-control hero respectively).

## Waiting on Owner decision

Per instruction, no card, icon, or placeholder has been created for either
Handyman or Bed Bug Control. Once a real, approved image is supplied and
placed in the correct folder under `public/brand/images/services/` and
linked in `SERVICE_DATABASE.json` (`handyman.cardImage`) or
`pest-control-pages.ts` (`bed-bug-control.image` / `.imageAlt`), each will
automatically reappear in its grid — no further code change needed beyond
adding that data.
