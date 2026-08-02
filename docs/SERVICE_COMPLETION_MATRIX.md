# Service Completion Matrix

**Status:** ✅ 100% complete for the 16 original-scope services; **11 more services added 2026-07-31 (Service Expansion Phase) as structural entries only — not yet counted toward "complete," see note below**
**Date:** last updated 2026-07-31
**Scope:** 27 total catalog services (12 original + 4 Cleaning added in the Service Completion Phase + 11 added in the Service Expansion Phase)

**Service Expansion Phase note:** CCTV Installation, Smart Home Installation, Swimming Pool Maintenance, Kitchen Installation, Interior Decoration, Interlock Installation, Lighting Maintenance, Wood Alternative Installation, Wallpaper Installation, Thermal Insulation, and Rooftop Space Utilization (`DECISION_LOG.md` #39) each have a catalog entry, bilingual name, SEO title/meta/keywords, and (10 of 11 — all but CCTV Installation) a real approved card image. **None has full page content yet** (overview/scope/process/benefits/safety/FAQ) — that is explicitly out of scope for this phase and tracked as remaining work in `docs/VISUAL_ASSET_MASTER_PLAN.md` §6. They are not included in the completion percentage below, which still reflects only the 16-service Service Completion Phase scope.
**Rule applied:** "Complete" = a real, customer-facing page with professional content, Owner-approved for publication — a page that renders (structure) is **not** counted as complete on its own. Every ✓ below is verified against actual data (`src/data/SERVICE_DATABASE.json`, `src/lib/catalog/*.ts`, on-disk image files) or actual rendered output (`src/components/service-detail-content.tsx`), not against route existence.

**Content-authorship note:** all Maintenance and Cleaning copy below (overview, common problems, scope, process, benefits, safety, FAQ) was authored directly from general operational/industry knowledge per the Owner's explicit 2026-07-31 instruction, and deliberately contains **no** invented license, certification, warranty, guarantee, exact response-time, or other unsupported company claim. Anywhere Owner confirmation is genuinely required (warranty terms, pricing), the copy uses the Owner's standardized phrase **"subject to company policy"** (EN) / **"يخضع ذلك لسياسة الشركة"** (AR) rather than a placeholder or an invented answer.

## Refinement pass — 2026-07-31 (post-Pest-Control-approval)

Two gaps surfaced when the Owner re-reviewed the Maintenance instructions against what was actually rendering:

1. **Distinct Hero content** — every service hub/detail page's hero previously reused the generic 2-field i18n `name`/`description` (the same short blurb also used in nav breadcrumbs and cards). Added an optional `heroTagline` field to `ServiceContentBlock` (`service-content.ts`), populated with a short, punchy, service-specific line for all 15 Maintenance + Cleaning services (distinct from the fuller `overview` paragraph shown further down the page), and wired it into both hero render paths in `service-detail-content.tsx` (falls back to `entry.description` when absent, so Pest Control and any future unpopulated service are unaffected).
2. **Standardized owner-confirmation phrasing** — replaced 22 ad-hoc hedging sentences (7 warranty answers, 15 pricing answers, across all 15 Maintenance + Cleaning services, EN and AR) with the Owner's fixed phrase "subject to company policy" / "يخضع ذلك لسياسة الشركة", applied consistently everywhere a real fact (warranty term, price) is required but not yet confirmed.

Typecheck/lint/test(425)/build all reverified green after this refinement.

---

## Phase 1 (Maintenance) + Phase 2 (Cleaning) — completed 2026-07-31

All 8 Maintenance services and all 7 Cleaning services (3 existing + 4 newly added) now have the full 10-point content package: overview, common problems solved, scope (included/excluded), professional workflow steps, benefits, safety considerations, customer FAQ, SEO title, meta description, keywords — in English and Arabic, sourced directly in `src/data/SERVICE_DATABASE.json` and approved via `APPROVED_SERVICE_CONTENT_SLUGS` (`src/lib/catalog/service-content.ts`).

Code changes needed to actually render/serve this content:
- Extended `ServiceContentBlock` (`service-content.ts`) with optional `commonProblems`, `process`, `safety` fields.
- Added `ServiceProcessSection` and `ServiceSafetySection` components (`service-content-sections.tsx`); reused `ServiceBenefitsSection` for "common problems solved".
- `service-detail-content.tsx` now renders Overview → Common Problems → Scope → Process (service-specific) → Benefits → Safety → FAQ, in that order, and **skips the generic shared "How It Works" block whenever a service has real `content.process`** (still falls back to the generic block for any service without one — verified via test for pest-control, which predates this field).
- `buildServiceDetailMetadata` (`service-detail-metadata.ts`, shared by maintenance/[slug] and cleaning/[slug]) now prefers `getServiceSeoData()`'s real title/description/keywords over the generic i18n name/description, and sets `robots: INDEXABLE` once a slug is in `APPROVED_SERVICE_CONTENT_SLUGS` — automatic for every newly-approved service, no per-route change needed.
- New catalog services (Villa/Office/Post-Construction/Carpet & Upholstery Cleaning) added to `services.ts`, i18n `en.json`/`ar.json`, `service-visuals.tsx`, and `04_SERVICE_KNOWLEDGE/SERVICE_CATALOG.md` (single-source-of-truth parity) — wired to their pre-staged card images (confirmed by visual inspection to actually depict the right scene; the "carpet-rug-cleaning" asset was rejected in favor of "sofa-upholstery-cleaning" after inspection showed the former is mislabeled marble-floor-polishing footage, not carpet).

Handyman and Waterproofing: content is complete and approved, but both remain **excluded from grids/related-links** — Handyman has never had a real card image, and Waterproofing's only candidate image was pulled this same phase for a baked-in AI-rendering typo. Neither is a content gap; both are open, Owner-visible photography gaps (no image-generation tool exists in this environment).

Typecheck/lint/test(425)/build all verified green after this phase's changes.

## Phase 3 (Pest Control) — completed 2026-07-31

Four Owner decisions closed this phase's Pest Control items:
1. **Content approved as-is** — `pest-control` added to `APPROVED_SERVICE_CONTENT_SLUGS`; overview/scope/benefits now render on the hub, FAQs lost their `isDemo` flag (now visible + in FAQPage JSON-LD) both on the hub and on all 11 sub-service pages, all 11 sub-service `status` fields updated from Draft to Approved, robots changed from `NOINDEX_FOLLOW` to `INDEXABLE` on the hub and all 11 sub-service pages. The 11 sub-service pages' own Benefits/Process/Preparation/Safety sections — present in `pest-control-pages.ts`'s `SHARED_*` blocks but never actually rendered on `/services/pest-control/[subService]` (withheld under the old Draft status) — were restored to the page in this phase now that approval covers them.
2. **Keywords wired into `<head>`** — `page.keywords[locale]` now passed into `generateMetadata` on `/services/pest-control/[subService]`; the parent hub also gained its own real, distinct SEO title/meta description/keywords, sourced verbatim from `01_PEST_CONTROL/02_SEO_DATA.md` into `SERVICE_DATABASE.json`.
3. **Gecko Control kept as an 11th approved service** — reconciliation comment in `pest-control-pages.ts` updated to record this as resolved, not silently decided.
4. **Bed Bug Control image gap left open, correctly** — no image-generation tool exists in this environment; per Owner's decision the page stays live but excluded from the grid/related-links until a real photo is supplied.

---

## Legend

| Symbol | Meaning |
|---|---|
| ✓ | Real, verified, customer-facing |
| ✗ | Missing entirely |
| ⚠ | Open by explicit Owner decision (photography gap), not a content or code defect |

---

## 1. MAINTENANCE (8 catalog services) — ✅ COMPLETE (content), 2 image gaps open by Owner decision

| Service | Card | Page | AR Content | EN Content | SEO Title | Meta Desc. | Keywords | FAQ | Benefits | Process | Safety | CTA | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| AC Maintenance | ✓ | ✓ | ✓ | ✓ | ✓ real, distinct | ✓ real, distinct | ✓ | ✓ | ✓ | ✓ service-specific | ✓ | ✓ | **COMPLETE** |
| Electrical Maintenance | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **COMPLETE** |
| Plumbing | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **COMPLETE** |
| Painting | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **COMPLETE** |
| Drain Unblocking | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **COMPLETE** |
| Water Leak Detection | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **COMPLETE** |
| Waterproofing | **⚠ no image (Owner decision: leave open)** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **CONTENT COMPLETE — awaiting a real replacement photo** (previous image had a baked-in typo, pulled 2026-07-31) |
| Handyman | **⚠ no image (Owner decision: leave open)** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **CONTENT COMPLETE — awaiting a real photo** (never had one) |

**Scope note kept from the original audit:** there is no separate catalog service named "Insulation" — Waterproofing's scope is deliberately kept to water-ingress protection only (roof/terrace/bathroom membranes), per `DECISION_LOG.md` decision 19, and its FAQ explicitly distinguishes it from thermal insulation rather than implying the two are the same service.

---

## 2. CLEANING (7 catalog services: 3 original + 4 added 2026-07-31) — ✅ COMPLETE

| Service | Card | Page | AR Content | EN Content | SEO Title | Meta Desc. | Keywords | FAQ | Benefits | Process | Safety | CTA | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| General/Home Cleaning | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **COMPLETE** |
| Deep Cleaning | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **COMPLETE** |
| Water Tank Cleaning | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **COMPLETE** |
| Villa Cleaning *(new)* | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **COMPLETE** — new catalog entry, `SVC-VILLA-CLEANING` |
| Office Cleaning *(new)* | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **COMPLETE** — new catalog entry, `SVC-OFFICE-CLEANING` |
| Post-Construction Cleaning *(new)* | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **COMPLETE** — new catalog entry, `SVC-POST-CONSTRUCTION-CLEANING` |
| Carpet & Upholstery Cleaning *(new)* | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **COMPLETE** — new catalog entry, `SVC-CARPET-UPHOLSTERY-CLEANING`; uses the "sofa-upholstery" image, not the mislabeled "carpet-rug" one (see note below) |

**Image note:** `public/brand/images/services/cleaning/carpet-rug-cleaning-service-card-afaq-v1.webp` was rejected as this service's card image after visual inspection — it actually shows marble-floor polishing with no carpet visible, a pre-existing asset-labeling error. `sofa-upholstery-cleaning-service-card-afaq-v1.webp` was used instead, confirmed to genuinely show upholstery/wet-extraction cleaning.

**Documentation-parity gap (non-blocking):** the 4 new services have no dedicated `04_SERVICE_KNOWLEDGE/<NN>_<SERVICE>/` folder in the knowledge-base repo yet (unlike the original 12, which each have one). Their content lives directly in `SERVICE_DATABASE.json` with a clear provenance note. This doesn't affect what customers see, but should be reconciled if the knowledge-base repo's folder convention is meant to stay 1:1 with the live catalog.

---

## 3. PEST CONTROL (1 catalog service, 11 sub-service pages) — ✅ COMPLETE (10 of 11 fully; Bed Bug's image open by Owner decision)

| Sub-service | Card | Page | AR Content | EN Content | SEO Title | Meta Desc. | Keywords | FAQ | Benefits | Process | Safety | CTA | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Rodent Control | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **COMPLETE** |
| Ant Control | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **COMPLETE** |
| Termite Control | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **COMPLETE** |
| Cockroach Control | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **COMPLETE** |
| Snake Control | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **COMPLETE** |
| Bird (Pigeon) Control | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **COMPLETE** |
| Gecko Control | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **COMPLETE** — Owner decision 2026-07-31: kept as 11th approved service |
| Wasp/Bee Control | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **COMPLETE** |
| Mosquito Control | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **COMPLETE** |
| Home Pest Prevention (House Fly/Light Trap) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **COMPLETE** |
| Bed Bug Control | **⚠ no image (Owner decision: leave open)** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ (excluded, no image) | **CONTENT COMPLETE — awaiting a real photo, no placeholder used** |

**Parent Pest Control hub/hero:** `heroSection` image file still not wired in (unchanged, out of scope for this phase — still flagged in `SERVICE_DATABASE.json` as having AI-rendering text artifacts). The hub page is indexable and carries its own real, distinct SEO title/meta description/keywords.

---

## 4. Cross-cutting items resolved this phase

| Former gap | Resolution |
|---|---|
| `robots: noindex,follow` sitewide | `buildServiceDetailMetadata` now sets `robots: INDEXABLE` for any slug in `APPROVED_SERVICE_CONTENT_SLUGS` — all 16 services are now indexable. Category hub pages (`/services/maintenance`, `/services/cleaning`) and the `/services` root index were left `NOINDEX_FOLLOW` — they show generic, sitewide copy rather than per-service content, so weren't part of this content-completion scope. |
| No `keywords` in `<head>` | Every approved service now has real keywords wired into its page metadata, EN and AR. |
| Generic, identical "Process" section everywhere | Every approved service now shows its own `ServiceProcessSection` with service-specific steps; the shared generic block only remains as a fallback for a service with no `content.process` (none currently — kept for resilience, covered by a regression test). |
| Internal links gated by image existence | Unchanged by design — Handyman, Waterproofing, and Bed Bug Control correctly stay out of card grids and related-service links until a real photo exists for each; this is the site's own no-placeholder rule working as intended, not a bug. |

---

## 5. Summary scorecard

| Category | Services defined | Fully complete (content + image + SEO) | Content complete, image gap open by Owner decision | Missing entirely |
|---|---|---|---|---|
| Maintenance | 8 | **6** | 2 (Handyman, Waterproofing) | 0 |
| Cleaning | 7 (3 original + 4 new) | **7** | 0 | 0 |
| Pest Control | 1 parent + 11 sub-services | **10** | 1 (Bed Bug Control) | 0 |

**23 of 26 total service surfaces are fully complete end-to-end; the remaining 3 (Handyman, Waterproofing, Bed Bug Control) are 100% content/SEO-complete and blocked only on real photography, which requires either a licensed photographer/asset delivery or an image-generation tool this environment does not have.**

No price, warranty, license, certification, guarantee, or exact response-time claim was written anywhere in this phase. Where those facts would normally appear (FAQ answers about warranty, cost, timing), the copy explicitly defers to direct confirmation with the team rather than inventing an answer.

---

## 6. Remaining open items (all photography, not content)

1. **Handyman** — needs a real card image; page, SEO, and full content are ready to go live in the grid the moment one exists.
2. **Waterproofing** — needs a real replacement card photo (previous one removed 2026-07-31 for a baked-in AI-rendering typo); same readiness otherwise.
3. **Bed Bug Control** — needs a real card image; kept out of the grid per Owner decision, not urgent.
4. **Documentation parity** — the 4 new Cleaning services have no `04_SERVICE_KNOWLEDGE/` folder yet in the knowledge-base repo (content lives in the app repo's `SERVICE_DATABASE.json` instead); worth reconciling if strict 1:1 folder parity matters going forward.
5. **Booking/CRM/keyword-research status fields** (`status.booking` in `SERVICE_DATABASE.json`) remain "Not started" for all non-pest-control services — unrelated to this content phase, tracked separately.

This document is updated after each completed service/phase — no content, facts, prices, or approvals are ever created or assumed here beyond what the Owner has explicitly confirmed or directed.
