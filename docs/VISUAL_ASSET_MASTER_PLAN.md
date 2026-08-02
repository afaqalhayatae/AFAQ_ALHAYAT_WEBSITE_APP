# Visual Asset Master Plan

**Status:** Inventory / production plan only — no image generated, redesigned, or wired in producing this document
**Date:** 2026-07-31 (updated — asset storage pass §5, then Service Expansion Phase §6, mapping 10 of those 11 assets to new active catalog services)
**Purpose:** Complete, verified inventory of every hero image, service image, and icon the site uses or should use, before any visual redesign work begins. Every row below was checked against the actual file system (`find`) and actual code (`grep`) — nothing here is assumed from memory or from stale docs.

---

## 5. Asset storage pass — 2026-07-31 (Owner-approved: "File only, don't map yet")

A batch of 24 candidate images was delivered by the Owner (found in `~/Downloads`, not the repo). Per Owner decision, these were inspected against the brand rules (no baked-in text, no fake badges, single card image only) and, where approved, **copied into `public/brand/images/services/maintenance/` under their original filenames — not mapped to any service, not renamed, no catalog/SEO/i18n/architecture change made.**

### Assets stored (11) — approved quality, original filenames preserved, unmapped

| Stored filename | Likely service (unconfirmed — no catalog entry exists) |
|---|---|
| `service-handyman-maintenance.webp` | Handyman *(catalog service exists — this fills that service's real image gap, but is intentionally left unmapped per Owner instruction)* |
| `service-smart-home-installation.webp` | No catalog service — CCTV/Smart Home was requested but never onboarded |
| `service-swimming-pool-maintenance.webp` | No catalog service |
| `service-kitchen-installation.webp` | No catalog service |
| `service-interior-decoration.webp` | No catalog service |
| `service-interlock-installation.webp` | No catalog service |
| `service-lighting-maintenance.webp` | No catalog service |
| `service-wood-alternative-installation.webp` | No catalog service |
| `service-wallpaper-installation.webp` | No catalog service |
| `service-thermal-insulation-installation.webp` | No catalog service (distinct from Waterproofing, which is water-ingress only per `DECISION_LOG.md` #19) |
| `service-rooftop-space-utilization.webp` | No catalog service |

Note: several of these topics already had a differently-named, differently-sized (confirmed via byte comparison, not identical files) pre-staged image sitting in the same folder from an earlier delivery (e.g. `smart-home-system-installation-maintenance-service-card-afaq-v1.webp`). Both are now stored side by side — nothing was overwritten or replaced.

### Assets rejected — failed brand-rule inspection, NOT stored

| File | Defect |
|---|---|
| `service-ac-maintenance.webp` | Baked-in tagline text "FOR MAINTENANCE AND CLEANING" on uniform/bag |
| `service-electrical-maintenance.webp` | Same defect |
| `service-plumbing-maintenance.webp` | Same defect |
| `service-drain-unblocking.webp` | Same defect (×4 instances in-frame: van, uniform, equipment, bag) |
| `service-water-leak-detection.webp` | Same defect |
| `service-painting-maintenance.webp` | Same defect |
| `service-waterproofing.webp` | Same defect, plus "WATERPROOFING / العزل المائي" product-label text on the paint bucket — this is the **second** rejected Waterproofing candidate this phase; the service's image gap remains open |
| `service-marble-facade-installation.webp` | **Severe** — not a card photo at all, a full bilingual marketing infographic (headline, 8 icon+text bullet points, repeated "THERMAL INSULATION" text baked into the material) — also mislabeled: its actual content is Thermal Insulation, not Marble Facade |

None of these 8 were copied anywhere; they remain only in the Owner's `~/Downloads` folder, unmodified.

### Requested but not found anywhere (still missing)

`service-pest-control.webp`, `service-cctv-installation.webp`, `service-doors-windows-maintenance.webp`, `service-villa-palace-doors.webp`, `service-exterior-lighting-installation.webp` — no file under these names exists in the repo, in `~/Downloads`, or under any obviously-corresponding alternate name.

**No mappings changed in this §5 pass. No catalog, SEO, i18n, or page/architecture files were touched.** (Superseded by §6 below, same day.)

---

## 6. Service Expansion Phase — 2026-07-31 (Owner-approved: onboard as new official services)

The Owner approved moving 10 of the 11 §5-stored assets from storage-only into **active, mapped catalog services** (`DECISION_LOG.md` #39). Handyman's stored image was **not** touched here — it already belongs to an existing catalog service and was intentionally left for a separate decision.

| New service | Slug | `SVC-` ID | Card image | SEO | Content |
|---|---|---|---|---|---|
| CCTV Installation | `cctv-installation` | `SVC-CCTV-INSTALLATION` | ❌ none (never located) | ✓ title/meta/keywords authored | ✗ structure only, `content: null` |
| Smart Home Installation | `smart-home-installation` | `SVC-SMART-HOME-INSTALLATION` | ✓ `service-smart-home-installation.webp` | ✓ | ✗ structure only |
| Swimming Pool Maintenance | `swimming-pool-maintenance` | `SVC-SWIMMING-POOL-MAINTENANCE` | ✓ `service-swimming-pool-maintenance.webp` | ✓ | ✗ structure only |
| Kitchen Installation | `kitchen-installation` | `SVC-KITCHEN-INSTALLATION` | ✓ `service-kitchen-installation.webp` | ✓ | ✗ structure only |
| Interior Decoration | `interior-decoration` | `SVC-INTERIOR-DECORATION` | ✓ `service-interior-decoration.webp` | ✓ | ✗ structure only |
| Interlock Installation | `interlock-installation` | `SVC-INTERLOCK-INSTALLATION` | ✓ `service-interlock-installation.webp` | ✓ | ✗ structure only |
| Lighting Maintenance | `lighting-maintenance` | `SVC-LIGHTING-MAINTENANCE` | ✓ `service-lighting-maintenance.webp` | ✓ | ✗ structure only |
| Wood Alternative Installation | `wood-alternative-installation` | `SVC-WOOD-ALTERNATIVE-INSTALLATION` | ✓ `service-wood-alternative-installation.webp` | ✓ | ✗ structure only |
| Wallpaper Installation | `wallpaper-installation` | `SVC-WALLPAPER-INSTALLATION` | ✓ `service-wallpaper-installation.webp` | ✓ | ✗ structure only |
| Thermal Insulation | `thermal-insulation` | `SVC-THERMAL-INSULATION` | ✓ `service-thermal-insulation-installation.webp` | ✓ | ✗ structure only |
| Rooftop Space Utilization | `rooftop-space-utilization` | `SVC-ROOFTOP-SPACE-UTILIZATION` | ✓ `service-rooftop-space-utilization.webp` | ✓ | ✗ structure only |

All 11 are `category: "general-maintenance"` — they automatically appear under `/services/maintenance/<slug>` (the existing dynamic route already reads `getServicesBySection("maintenance")`; no new route files were created). None is in `APPROVED_SERVICE_CONTENT_SLUGS`, so all 11 render with the generic shared sections (no service-specific overview/benefits/process/FAQ yet) and stay `robots: NOINDEX_FOLLOW` automatically, matching every other not-yet-content-complete service. CCTV Installation additionally has no `cardImage`, so it's correctly excluded from the `/services/maintenance` grid and every related-services block until a real photo exists — same treatment as Handyman/Waterproofing/Bed Bug Control.

**Filenames were kept exactly as delivered** (`service-<name>.webp`) per the Owner's explicit "do not rename" instruction — this is why they look different from the `*-service-card-afaq-v1.webp` convention used by the other 26 services; no functional difference, `getServiceCardImage()` reads whatever `fileName` is in the JSON.

Remaining content needed for all 11 (a future, separate phase): overview, common problems, scope (included/excluded), professional workflow steps, benefits, safety considerations, and FAQ — same 7-point structure already delivered for the 15 Maintenance/Cleaning services in the Service Completion Phase.

---

## 1. Hero images

| Surface | Status | File | Wired? | Mobile variant |
|---|---|---|---|---|
| **Homepage** | ✅ Live | `public/brand/images/afaq-alhayat-home-services-hero-banner-uae-21x9.webp` | Yes — `src/lib/media/homepage-hero.ts` → `src/app/[locale]/page.tsx` | No separate file; one 21:9 image handles all breakpoints via `object-cover object-[80%_center]` |
| **Maintenance hub** (`/services/maintenance`) | ❌ Missing | — no file exists | No hero markup in `maintenance/page.tsx` at all | — |
| **Cleaning hub** (`/services/cleaning`) | ⚠ Candidate exists, unwired | `public/brand/images/services/cleaning/cleaning-services-hero-banner-afaq-branded-21x9-v1.webp` | **No** — zero references anywhere in code; `cleaning/page.tsx` has no hero markup | — |
| **Pest Control hub** (`/services/pest-control`) | ✅ Live (separate from 2 rejected candidates) | `public/brand/images/services/pest-control/pest-control-hero-banner-afaq-branded-21x9-v2.webp` — Approved V1 2026-07-30 | Yes — `getServiceHero()` in `service-content.ts` | No separate file |
| **Emirates — Dubai** (`/locations/dubai`) | ❌ Missing | — falls back to decorative line-art illustration (`HeroScene`), not a photo | `BrandPanel` rendered with no `src`/`alt` | — |
| **Emirates — other 6** (Abu Dhabi, Sharjah, Ajman, Umm Al Quwain, RAK, Fujairah) | ❌ Pages don't exist yet | — | `LOCATIONS` registry only contains Dubai; other 6 slugs 404 | — |

**Rejected/superseded hero candidates (do not reuse as-is):**
| File | Why rejected |
|---|---|
| `public/brand/images/pest-control-homepage-hero-v1.webp` | Baked-in AI-rendering text artifacts (van livery/uniform/spray-tank text); flagged "Do not wire into any page" |
| `public/brand/images/pest-control/HERO_PEST_CONTROL_21x9.webp` | Baked-in stat/rating/"guarantee" badge text |

**Existing generation briefs (`docs/`) — already specify style/dimensions, ready to guide production, but partly stale:**
| Doc | Spec'd file | Ratio | Status vs. reality |
|---|---|---|---|
| `HOMEPAGE_HERO_GENERATION_BRIEF.md` | `homepage-hero-luxury-v1.webp` | 21:9 | **Stale** — homepage already uses a different, already-produced file; this brief's filename was never produced |
| `MAINTENANCE_HERO_GENERATION_BRIEF.md` | `afaq-alhayat-maintenance-service-hero-banner-uae-21x9.webp` | 21:9 | Accurate — no file exists yet, brief is ready to use as-is |
| `CLEANING_HERO_GENERATION_BRIEF.md` | `afaq-alhayat-cleaning-service-hero-banner-uae-21x9.webp` | 21:9 | **Incomplete** — doesn't account for the orphaned candidate already sitting unreferenced; that file should be reviewed against this brief's checklist before commissioning a new one |
| `EMIRATES_LOCATION_HERO_GENERATION_BRIEF.md` | `afaq-alhayat-{emirate-slug}-location-hero-banner-uae-21x9.webp` × 7 | 21:9 | Accurate — explicitly gates production to only emirates with approved page copy (today: Dubai only) |

---

## 2. Service images — all 16 catalog services + 11 pest sub-services

| # | Service | Image status | Missing? | Required style (if missing/replacing) |
|---|---|---|---|---|
| 1 | AC Maintenance | ✅ Live | No | — |
| 2 | Plumbing | ✅ Live | No | — |
| 3 | Electrical Maintenance | ✅ Live | No | — |
| 4 | Painting | ✅ Live | No | — |
| 5 | **Handyman** | ❌ Never had one | **Yes** | Technician performing a small general repair/install (door hinge, shelf mount, furniture fix) in a UAE home; navy uniform, logo-only branding, matches `MAINTENANCE_HERO_GENERATION_BRIEF.md`'s mood |
| 6 | General/Home Cleaning | ✅ Live | No | — |
| 7 | Deep Cleaning | ✅ Live | No | — |
| 8 | Water Tank Cleaning | ✅ Live | No | — |
| 9 | Villa Cleaning | ✅ Live | No | — |
| 10 | Office Cleaning | ✅ Live | No | — |
| 11 | Post-Construction Cleaning | ✅ Live | No | — |
| 12 | Carpet & Upholstery Cleaning | ✅ Live (uses "sofa-upholstery" asset) | No | — |
| 13 | Pest Control (parent) | ✅ Live (hero, not card) | No | — |
| 14 | Drain Unblocking | ✅ Live | No | — |
| 15 | **Waterproofing** | ❌ Pulled 2026-07-31 | **Yes** | Technician torch-applying/rolling a waterproofing membrane on a UAE roof/terrace; must have **zero baked-in text** on uniform/equipment (previous asset's defect) |
| 16 | Water Leak Detection | ✅ Live | No | — |
| — | **Bed Bug Control** (pest sub-service) | ❌ Never had one | **Yes** | Technician inspecting a mattress seam/bed frame with a flashlight or inspection tool; matches the other 10 pest sub-service cards' square-crop, branded-uniform style |
| — | 10 other pest sub-services | ✅ Live | No | — |

**Net: 3 real image gaps sitewide — Handyman, Waterproofing, Bed Bug Control.** Everything else is live and wired.

---

## 3. Custom icons

### Services (`src/lib/catalog/service-visuals.tsx` → `SERVICE_ICONS`)

| Icon | Used for | Distinct or shared? |
|---|---|---|
| `AcUnitIcon` | AC Maintenance | Distinct |
| `WrenchIcon` | Plumbing, Electrical Maintenance, Painting, Handyman | **Shared across 4 different trades** |
| `CleaningIcon` | General Cleaning, Deep Cleaning, Villa/Office/Post-Construction/Carpet & Upholstery Cleaning | **Shared across 6 different cleaning services** |
| `DropletIcon` | Water Tank Cleaning, Drain Unblocking, Waterproofing, Water Leak Detection | **Shared across 4 different services** |
| `ShieldCheckIcon` / `PestIcon` | Pest Control | Distinct |

**Only 5 of 16 services have a genuinely unique icon; 11 share 3 generic icons.** Two exported-but-unused icons already exist and are ready-made replacements without new production: `BuildingIcon` (natural fit for Office Cleaning), `SofaIcon` (natural fit for Carpet & Upholstery Cleaning).

### Sub-services (Pest Control's 11)

No per-pest-type icon exists — all 11 use the same parent `ShieldCheckIcon`/`PestIcon` at the section level; distinctiveness on `/services/pest-control` comes entirely from each sub-service's real photo, not an icon.

### Emirates (7 of 7 — already distinct, no gap)

| Emirate | Icon |
|---|---|
| Abu Dhabi | `MosqueDomeIcon` |
| Dubai | `SkylineIcon` |
| Sharjah | `HeritageArchIcon` |
| Ajman | `AnchorIcon` |
| Umm Al Quwain | `LeafIcon` |
| Ras Al Khaimah | `MountainIcon` |
| Fujairah | `CoastMountainIcon` |

### Trust section (site-wide, homepage)

`TRUST_ICONS = [UserIcon, PhoneIcon, CheckCircleIcon, MapPinIcon]` — 4 distinct icons, each matched to one trust-copy item. No gap.

### Full available icon set (`src/components/icons.tsx`, 36 exports)
Generic/UI (10): `WhatsAppIcon, PhoneIcon, MailIcon, MapPinIcon, UserIcon, ArrowRightIcon, ClockIcon, SparkleIcon, CheckCircleIcon, MenuIcon`
Service (11): `AcUnitIcon, DropletIcon, HomeIcon, BuildingIcon, SofaIcon, ShieldCheckIcon, WrenchIcon, CleaningIcon, ServiceRequestIcon, BadgeCheckIcon, PestIcon`
Emirate (7): listed above
Social (8): `FacebookIcon, InstagramIcon, TikTokIcon, LinkedInIcon, XIcon, PinterestIcon, ThreadsIcon, YouTubeIcon`

---

## 4. Complete asset-to-usage map

### Live, wired files

| File | Folder | Used by |
|---|---|---|
| `afaq-alhayat-home-services-hero-banner-uae-21x9.webp` | `images/` | Homepage hero |
| `ac-maintenance-service-card-afaq-v1.webp` | `services/maintenance/` | AC Maintenance card |
| `plumbing-maintenance-service-card-afaq-v1.webp` | `services/maintenance/` | Plumbing card |
| `electrical-maintenance-service-card-afaq-v1.webp` | `services/maintenance/` | Electrical Maintenance card |
| `painting-wall-painting-maintenance-service-card-afaq-v1.webp` | `services/maintenance/` | Painting card |
| `drain-unclogging-service-card-afaq-v1.webp` | `services/maintenance/` | Drain Unblocking card |
| `water-leak-detection-service-card-afaq-v1.webp` | `services/maintenance/` | Water Leak Detection card |
| `home-cleaning-service-card-afaq-v1.webp` | `services/cleaning/` | General Cleaning card + homepage cleaning card |
| `deep-cleaning-service-card-afaq-v1.webp` | `services/cleaning/` | Deep Cleaning card |
| `water-tank-cleaning-service-card-afaq-v1.webp` | `services/cleaning/` | Water Tank Cleaning card |
| `villa-palace-cleaning-service-card-afaq-v1.webp` | `services/cleaning/` | Villa Cleaning card |
| `office-commercial-cleaning-service-card-afaq-v1.webp` | `services/cleaning/` | Office Cleaning card |
| `post-construction-cleaning-service-card-afaq-v1.webp` | `services/cleaning/` | Post-Construction Cleaning card |
| `sofa-upholstery-cleaning-service-card-afaq-v1.webp` | `services/cleaning/` | Carpet & Upholstery Cleaning card |
| `pest-control-hero-banner-afaq-branded-21x9-v2.webp` | `services/pest-control/` | Pest Control hub hero + homepage pest-control card |
| `001…010-*-service-card.webp` (10 files) | `pest-control/` (also duplicated under `services/pest-control/`) | 10 of 11 pest sub-service cards |
| `demo-placeholder.svg` | `demo/` | Inert (`SHOW_DEMO_VISUALS = false`) |

### Orphaned / pre-staged, not referenced anywhere

**Cleaning (11 files):** `bathroom-cleaning`, `kitchen-deep-cleaning`, `curtain-cleaning`, `swimming-pool-cleaning`, `garden-cleaning`, `hood-exhaust-cleaning`, `sanitization-disinfection`, `ac-cleaning`, `apartment-cleaning`, plus **`carpet-rug-cleaning`** (rejected — mislabeled, shows floor polishing not carpet) and the unwired cleaning hub **hero candidate**.

**Maintenance (27 files):** `cctv-security-camera-installation`, `ceramic-tiles-installation`, `door-lock-repair`, `duct-central-ac`, `electrical-repair`, `exterior-marble-cladding-facade-installation`, `external-door-installation` (v2), `false-ceiling-installation`, `interlock-installation`, `kitchen-installation`, `landscape-garden-design` (v1 + v2), `marble-alternative-wall-panels-installation`, `marble-floor-installation`, `network-internet-installation`, `outdoor-lighting-installation`, `pergola-outdoor-shade-installation`, `plumbing-repair`, `smart-home-system-installation`, `swimming-pool-maintenance`, `toilet-unclogging`, `villa-palace-exterior-gate-door`, `wall-decoration-ornamentation`, `wallpaper-installation`, `window-installation`, `wood-alternative-decoration-installation`, plus **`waterproofing-roof-insulation-maintenance-service-card-afaq-v1.webp`** (this service's own pulled/defective image).

**Duplicate flat-root storage:** `public/brand/images/services/` (root, no subfolder) holds 33 byte-identical duplicates of files already organized under `services/maintenance/`/`services/pest-control/` — leftovers from the 2026-07-30 folder reorganization, not new candidates. Safe to delete once confirmed identical, out of scope for this inventory.

**Root-level rejected/superseded:**
| File | Status |
|---|---|
| `pest-control-homepage-hero-v1.webp` | Not approved, baked-in text |
| `cockroach-control-service-card-v2.webp` | Not approved, unsourced claims baked into pixels; superseded by the live `004-cockroach-control-service-card.webp` |
| `pest-control/HERO_PEST_CONTROL_21x9.webp` | Superseded, baked-in stat/badge text |

**No `public/brand/images/locations/` folder exists** — 0 files for any emirate.

---

## Net production queue (nothing generated yet — awaiting Owner go-ahead)

| Priority | Asset | Type | Ready-to-use brief? |
|---|---|---|---|
| 1 | Handyman card image | Service card | Follow `MAINTENANCE_HERO_GENERATION_BRIEF.md`'s mood/uniform rules |
| 2 | Waterproofing card image (replacement) | Service card | Same — must verify zero baked-in text before approval this time |
| 3 | Bed Bug Control card image | Pest sub-service card | Match existing 10 pest cards' square-crop style |
| 4 | Maintenance hub hero | Hero, 21:9 | `MAINTENANCE_HERO_GENERATION_BRIEF.md` — ready as-is |
| 5 | Cleaning hub hero | Hero, 21:9 | Review the existing orphaned candidate against `CLEANING_HERO_GENERATION_BRIEF.md` first — may not need a new shoot |
| 6 | Dubai location hero | Hero, 21:9 | `EMIRATES_LOCATION_HERO_GENERATION_BRIEF.md` — ready as-is |
| 7 | Other 6 emirate heroes | Hero, 21:9 × 6 | Gated — brief explicitly says wait until each emirate has an approved page |
| 8 (optional, no new asset needed) | Swap shared icons for distinct ones | Icon wiring only | `BuildingIcon` → Office Cleaning, `SofaIcon` → Carpet & Upholstery Cleaning already exist in code, unused |

This document is inventory and planning only. No image was generated, edited, or wired to any page in producing it.
