# Visual Asset Specification List — Production Checklist

**Status:** Specification only — **nothing generated, edited, or wired.** Awaiting Owner approval before any implementation.
**Date:** 2026-07-31
**Scope:** Every asset flagged in `docs/VISUAL_ASSET_MASTER_PLAN.md`'s production queue, specified in enough detail to hand to a photographer/designer or an image-generation tool without further judgment calls.
**Note on capability:** no image-generation tool is available in this environment. This document specifies *what* to produce; producing the actual files requires either real photography/design work commissioned by the Owner, or an image-generation tool connected in a future session. Nothing below is implemented by writing this list.

---

## Global brand rules (apply to every asset in this document)

| Rule | Detail |
|---|---|
| **Brand colors** | Primary blue `#0f4c81`, success/cleaning green `#16a34a` — used only as: uniform accents, badge backgrounds, UI overlays applied in code (gradients, icon badges). **Never** mixed into the photo/illustration itself as a color-graded filter. |
| **Subject** | A real-looking AFAQ AL HAYAT technician (or small team, 2–4 people, mixed gender where natural) actively performing the specific service — not posed/stock-generic. |
| **Uniform** | Navy top with grey/light accent panel, "AFAQ AL HAYAT" logo patch on chest and/or cap — same uniform already established in the existing approved cleaning/pest-control photos (`villa-palace-cleaning`, `office-commercial-cleaning`, `sofa-upholstery-cleaning`). New assets must match this uniform exactly, not introduce a new one. |
| **Logo placement** | Logo appears **only** on the uniform (chest patch, cap) and/or branded equipment (vacuum canister, cart, toolbox) — never as a watermark, never on the setting itself (no logo on walls, vehicles unless it's the technician's own branded gear). |
| **No text in image** | Zero baked-in text of any kind — no captions, taglines, slogans, ratings, review counts, "10+ years," certifications, or any legible sign/label beyond the logo itself. This is the exact defect that disqualified the previous Waterproofing and two Pest Control hero candidates — the single most important rule to enforce before accepting any delivered asset. |
| **No fake badges** | No graphic badge/seal/stamp overlays implying certification, award, guarantee, or rating. |
| **No random icons** | Icon system (Priority 3) must be one consistent, purpose-drawn style — no mixed-source stock icon packs, no visually inconsistent line weights/corner radii across icons. |
| **Setting** | Real-feeling UAE residential/commercial interiors or exteriors (as appropriate) — marble floors, UAE villa/office architecture, visible UAE urban skyline where outdoors — consistent with the existing approved photo set's environment. |
| **Format** | `.webp`, optimized for web (matches all existing assets). |
| **Alt text pattern** | `AFAQ AL HAYAT [technician/team] [doing specific action] in/at [setting] in the UAE` (EN), mirrored in Arabic — matches the pattern already used for every existing approved `alt` field in `SERVICE_DATABASE.json`. |

---

## Priority 1 — Hero images (9)

All heroes: **21:9 aspect ratio**, single image serves all breakpoints (`object-cover`, no separate mobile crop needed — confirmed this is how the existing homepage/pest-control heroes already work; a distinct mobile-only asset is not required unless the Owner wants one).

### 1.1 Maintenance hub hero

| Field | Spec |
|---|---|
| Filename | `afaq-alhayat-maintenance-service-hero-banner-uae-21x9.webp` |
| Folder | `public/brand/images/` (matches homepage hero's root placement) |
| Scene | A technician (navy uniform) mid-task on a general maintenance job — e.g., adjusting an AC unit or checking an electrical panel — in a well-lit UAE home or villa. Golden-hour lighting per the existing brief. |
| Composition | Subject positioned right third of frame; left two-thirds negative space for the H1/subtitle text overlay (matches homepage hero's `object-[80%_center]` crop logic). |
| Wires into | `src/app/[locale]/services/maintenance/page.tsx` — currently has **no hero markup at all**; a hero `<section>` needs to be added to that page (code change, out of scope for this spec-only document, tracked separately once assets exist). |
| Reference doc | `docs/MAINTENANCE_HERO_GENERATION_BRIEF.md` — ready to use as-is. |

### 1.2 Cleaning hub hero

| Field | Spec |
|---|---|
| Filename | `afaq-alhayat-cleaning-service-hero-banner-uae-21x9.webp` |
| Folder | `public/brand/images/` |
| Scene | Cleaning team (navy/light-grey uniform) mid-task — e.g., polishing marble floors or wiping surfaces — bright, airy daylight (deliberately distinct mood from Maintenance's golden-hour, per the existing brief). |
| Composition | Same right-third-subject / left-negative-space rule. |
| Action before producing new asset | **Review the existing unwired candidate first**: `public/brand/images/services/cleaning/cleaning-services-hero-banner-afaq-branded-21x9-v1.webp` against `docs/CLEANING_HERO_GENERATION_BRIEF.md`'s checklist (especially the no-text/no-badge rule) — if it passes, it needs wiring, not re-shooting. |
| Wires into | `src/app/[locale]/services/cleaning/page.tsx` — same gap as Maintenance, no hero markup exists yet. |

### 1.3–1.9 Emirates hero (× 7)

**Dependency note, flagged transparently:** per `docs/EMIRATES_LOCATION_HERO_GENERATION_BRIEF.md`'s own gating rule, and confirmed in the Visual Asset Master Plan, only **Dubai** currently has a real page (`src/lib/catalog/locations.ts`'s `LOCATIONS` registry contains only Dubai; the other 6 slugs 404 today). The Owner has explicitly requested specs for all 7, so all 7 are specified below — but the 6 non-Dubai assets would be produced/stored ahead of their pages existing, not wired to anything live until each emirate's page is built and approved. Flagging this so it's a visible, deliberate decision rather than a silent scope change.

| Field | Spec (applies to all 7, filename/emirate-cue column varies) |
|---|---|
| Folder | `public/brand/images/locations/` (does not exist yet — would be created) |
| Composition | One shared template/mood across all 7 for visual consistency; subject (technician or team) right-third, generic (non-trademarked) landmark cue for that emirate in the background, left two-thirds negative space. |
| Reference doc | `docs/EMIRATES_LOCATION_HERO_GENERATION_BRIEF.md` — ready to use as-is for all 7. |

| # | Emirate | Filename | Generic landmark cue (non-trademarked) |
|---|---|---|---|
| 1.3 | Dubai | `afaq-alhayat-dubai-location-hero-banner-uae-21x9.webp` | Generic modern skyline silhouette |
| 1.4 | Abu Dhabi | `afaq-alhayat-abu-dhabi-location-hero-banner-uae-21x9.webp` | Generic waterfront/corniche cue |
| 1.5 | Sharjah | `afaq-alhayat-sharjah-location-hero-banner-uae-21x9.webp` | Generic heritage-arch architectural cue |
| 1.6 | Ajman | `afaq-alhayat-ajman-location-hero-banner-uae-21x9.webp` | Generic marina/corniche cue |
| 1.7 | Ras Al Khaimah | `afaq-alhayat-ras-al-khaimah-location-hero-banner-uae-21x9.webp` | Generic mountain backdrop cue |
| 1.8 | Fujairah | `afaq-alhayat-fujairah-location-hero-banner-uae-21x9.webp` | Generic coast + mountain cue |
| 1.9 | Umm Al Quwain | `afaq-alhayat-umm-al-quwain-location-hero-banner-uae-21x9.webp` | Generic coastal/lagoon, low-rise cue |

Wires into: `src/app/[locale]/locations/[slug]/page.tsx` for Dubai today; for the other 6, wiring depends on each emirate's page being built first (separate, larger workstream — routing, copy, SEO — not just an asset drop-in).

---

## Priority 2 — Missing service images (3)

| Field | Handyman | Waterproofing (replacement) | Bed Bug Control |
|---|---|---|---|
| Filename | `handyman-general-maintenance-service-card-afaq-v1.webp` | `waterproofing-membrane-application-service-card-afaq-v2.webp` (v2 — distinct from the rejected v1) | `011-bed-bug-control-service-card.webp` (continues the existing `00N-` numbering used by the other 10 pest cards) |
| Folder | `public/brand/images/services/maintenance/` | `public/brand/images/services/maintenance/` | `public/brand/images/services/pest-control/` |
| Scene | Technician fixing/adjusting a small household item — e.g., a cabinet hinge, a mounted shelf, or assembling furniture — in a UAE home | Technician applying/rolling a waterproofing membrane on a UAE villa rooftop or terrace (same setting as the rejected v1, re-shot clean) | Technician inspecting a mattress seam or bed frame with a flashlight/inspection tool in a UAE bedroom |
| Aspect ratio | 4:3 (matches every other maintenance/cleaning card) | 4:3 | 1:1 square (matches the other 10 pest sub-service cards) |
| Critical check before approval | — | **Must have zero legible text anywhere on uniform/equipment** — this exact defect ("FOR MAINTTNANCE ANDD CLEANLINESS") is why v1 was pulled; re-verify by close visual inspection, not just a glance | — |
| Wires into | `SERVICE_DATABASE.json` → `handyman.cardImage` (currently absent) | `SERVICE_DATABASE.json` → `waterproofing.cardImage` (currently absent, removed 2026-07-31) | `pest-control-pages.ts` → `bed-bug-control.image`/`.imageAlt` (currently `null`) |

---

## Priority 3 — Complete icon system

### Style guide (applies to every icon)

| Rule | Detail |
|---|---|
| Format | SVG, React components (matches existing `src/components/icons.tsx` pattern — `stroke="currentColor"`, consistent `stroke-width` across the set) |
| Line weight | Match existing set's stroke width exactly (the 7 emirate icons and trust icons already establish this — new icons must not introduce a different weight) |
| Style | Line-art / outline icons only (no filled/solid icons mixed in — matches every existing icon in the file) |
| Color | Applied via CSS (`text-(--color-primary)` or `text-(--color-success)` depending on category badge), never baked into the SVG itself |
| Corner radius / geometric consistency | Match the rounded, friendly geometry of the existing 7 emirate icons (the most recently and consistently drawn set in the codebase) |

### 3.1 Services (16) — replace shared/generic icons with distinct ones

| Service | Current icon | Action needed |
|---|---|---|
| AC Maintenance | `AcUnitIcon` | ✅ Already distinct — no change |
| Pest Control | `ShieldCheckIcon`/`PestIcon` | ✅ Already distinct — no change |
| Plumbing | `WrenchIcon` (shared) | **New distinct icon** — e.g., a pipe/tap motif |
| Electrical Maintenance | `WrenchIcon` (shared) | **New distinct icon** — e.g., a lightning bolt/panel motif |
| Painting | `WrenchIcon` (shared) | **New distinct icon** — e.g., a paint roller motif |
| Handyman | `WrenchIcon` (shared) | Keep `WrenchIcon` as its dedicated icon (a wrench is a genuinely fitting motif for general handyman work — the other 3 should move off it instead) |
| General Cleaning | `CleaningIcon` (shared) | Keep as its dedicated icon (most generic/foundational cleaning service) |
| Deep Cleaning | `CleaningIcon` (shared) | **New distinct icon** — e.g., a scrub-brush/sparkle motif |
| Water Tank Cleaning | `DropletIcon` (shared) | Keep — droplet is a strong fit |
| Villa Cleaning | `CleaningIcon` (shared) | **New distinct icon** — e.g., a house/villa motif |
| Office Cleaning | `CleaningIcon` (shared) | **No new icon needed** — `BuildingIcon` already exists, unused; wire it in |
| Post-Construction Cleaning | `CleaningIcon` (shared) | **New distinct icon** — e.g., a broom/dustpan motif |
| Carpet & Upholstery Cleaning | `CleaningIcon` (shared) | **No new icon needed** — `SofaIcon` already exists, unused; wire it in |
| Drain Unblocking | `DropletIcon` (shared) | **New distinct icon** — e.g., a drain-swirl motif |
| Waterproofing | `DropletIcon` (shared) | **New distinct icon** — e.g., a shield-over-droplet motif |
| Water Leak Detection | `DropletIcon` (shared) | **New distinct icon** — e.g., a magnifier-over-droplet motif |

**Net: 7 new icons to design (Plumbing, Electrical, Painting, Deep Cleaning, Villa Cleaning, Post-Construction Cleaning, Drain Unblocking, Waterproofing, Water Leak Detection — 9 total; 2 of the 16 services need zero new work since `BuildingIcon`/`SofaIcon` already exist unused).**

### 3.2 Sub-services (Pest Control's 11)

**Scope question to resolve before producing anything here:** today, `/services/pest-control`'s sub-service grid identity comes entirely from each sub-service's real photo (square card), not from an icon — there is no icon slot in that UI at all. Producing 11 pest-type icons would require a new UI element to actually use them (e.g., a compact mobile menu, a filter chip row, or a footer sitemap). Recommend confirming *where* these icons would appear before designing them, rather than producing 11 icons with no defined placement. If the Owner confirms a use case, the icons themselves (rodent, ant, termite, cockroach, snake, bird, gecko, wasp, mosquito, fly, bed bug) would follow the same style guide above.

### 3.3 Emirates (7)

✅ **Already complete, distinct, no action needed**: `MosqueDomeIcon` (Abu Dhabi), `SkylineIcon` (Dubai), `HeritageArchIcon` (Sharjah), `AnchorIcon` (Ajman), `LeafIcon` (Umm Al Quwain), `MountainIcon` (Ras Al Khaimah), `CoastMountainIcon` (Fujairah).

### 3.4 Trust sections

✅ **Already complete, distinct, no action needed**: `UserIcon`, `PhoneIcon`, `CheckCircleIcon`, `MapPinIcon` — each already matched 1:1 to its trust-copy item.

---

## Summary — what actually needs production

| Category | Count | Status |
|---|---|---|
| Hero images | 9 requested | 2 ready-to-produce with existing briefs (Maintenance, Cleaning — Cleaning may already have a usable candidate); 7 Emirates specified, but 6 depend on pages not yet built |
| Service images | 3 | All 3 fully specified, no dependencies |
| New icons | 9 | Fully specified; 2 more services need only wiring (no new art) |
| Icons already complete | 11 | Emirates (7) + Trust (4) — zero work needed |
| Open scope question | 1 | Pest sub-service icons — needs a defined UI placement before designing |

**Nothing in this document has been generated, edited, or wired. Awaiting explicit Owner approval before any production or implementation begins**, per your instruction.
