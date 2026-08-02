# Emirates / Location Hero Banners — Image Generation Brief

## Document Information

- **Status:** Specification only. **No image has been generated.** Same limitation as
  `docs/HOMEPAGE_HERO_GENERATION_BRIEF.md`, `docs/MAINTENANCE_HERO_GENERATION_BRIEF.md`, and
  `docs/CLEANING_HERO_GENERATION_BRIEF.md` — this session has no image-generation tool, model,
  or API available.
- **Prepared:** 2026-07-31 (Complete Visual Asset Generation Phase)
- **Package:** `/[locale]/locations/[slug]` emirate hub pages (Canonical URL Architecture
  Finalization) — currently only Dubai has a real page (`hasPage: true` in
  `src/lib/catalog/locations.ts`); the other 6 emirates are structurally ready but have no
  approved copy or imagery yet, per that same file's own documentation.

## Why one shared brief covers all 7

Per `12_DESIGN_SYSTEM/LUXURY_DESIGN_DIRECTION.md` §6 ("Location pages... must not be
mass-produced copies with only the place name changed"), each emirate's eventual hero image
should show genuinely distinct, real environments — not the same photograph with a different
label. This brief specifies **one consistent visual template** so the 7 images read as one
coherent set once generated, while leaving the actual location/backdrop distinct per emirate.

## Asset Specification (template — repeat per emirate)

| Field | Value |
|---|---|
| SEO filename pattern | `afaq-alhayat-{emirate-slug}-location-hero-banner-uae-21x9.webp` |
| Example (Dubai) | `afaq-alhayat-dubai-location-hero-banner-uae-21x9.webp` |
| Recommended location once generated | `public/brand/images/locations/afaq-alhayat-{emirate-slug}-location-hero-banner-uae-21x9.webp` |
| Ratio | 21:9 (cinematic wide, matches every other hero on the site) |
| Alt text pattern (EN) | *Draft — finalize per emirate once generated:* "AFAQ AL HAYAT technician providing home services in {Emirate name}, UAE" |
| Alt text pattern (AR) | *Draft, same caveat:* "فني آفاق الحياة يقدّم خدمات منزلية في {اسم الإمارة}، الإمارات" |

### The 7 emirates this template applies to

`src/lib/catalog/locations.ts`'s `ALL_EMIRATES` registry order: Abu Dhabi, Dubai, Sharjah,
Ajman, Umm Al Quwain, Ras Al Khaimah, Fujairah.

## Generation Prompt (template)

*Wide-format 21:9 cinematic photograph, premium corporate photography style for a luxury UAE
home-services brand. A recognizable, real, generic {emirate} residential or urban environment
in the background — e.g. a coastal corniche view for a coastal emirate, a modern villa street
for an urban one — without reproducing any single specific trademarked landmark building. A
single professional AFAQ AL HAYAT technician (uniform consistent with the approved maintenance/
cleaning/pest-control hero batch) stands on the right third of the frame. Warm, natural
lighting, sharp detail, no artificial lens flares. The left two-thirds and center of the frame
stay deliberately open, low-detail negative space — sky, softly blurred street or coastline —
reserved for a headline naming the emirate and a CTA, added later in the website's own
typography, not baked into the image.*

**Hard constraints — every generated image must contain NONE of the following:**

- No text of any kind, in any language, anywhere in the frame.
- No specific trademarked landmark building rendered recognizably (e.g. do not reproduce
  Burj Khalifa's exact silhouette, the Sheikh Zayed Grand Mosque's exact architecture, etc.)
  — use generic, non-infringing environmental cues instead (skyline massing, coastline,
  desert/mountain backdrop, generic mosque silhouette), consistent with how
  `src/components/icons.tsx`'s new emirate icons (Complete Visual Asset Generation Phase)
  handle the same constraint for iconography.
- No numbers, badges, ratings, guarantees, or claim-style graphics.
- No AI-fabricated logo approximations — only the real AFAQ AL HAYAT logo, on uniform only.

## Acceptance checklist (per emirate, once generated)

- [ ] No text anywhere in the frame, including reflections and small background surfaces.
- [ ] Background reads as genuinely representative of that specific emirate, not a copy-pasted
      backdrop reused with only the headline text changed.
- [ ] No specific trademarked landmark reproduced recognizably.
- [ ] Left/center two-thirds low-detail enough for a real Arabic and English headline to sit
      on top of it with good contrast.
- [ ] Ratio is 21:9, file is `.webp`.
- [ ] Reads as real photography, not illustration or obvious AI artifact.

## Once generated

Only generate and wire in an emirate's hero once that emirate also has real, approved page
copy — per `locations.ts`'s own documented rule, a hero image alone does not make an emirate
page real. Today that means **Dubai only** is a candidate for actual wiring; the other 6
should stay unrendered per the existing `hasPage: false` / content-gate pattern
(`src/lib/catalog/locations.ts`, `src/app/[locale]/locations/[slug]/page.tsx`'s
`APPROVED_SERVICE_CONTENT_SLUGS`-style gating) rather than shipping a photo with no approved
copy behind it.

## Related Documents

- `docs/HOMEPAGE_HERO_GENERATION_BRIEF.md`, `docs/MAINTENANCE_HERO_GENERATION_BRIEF.md`,
  `docs/CLEANING_HERO_GENERATION_BRIEF.md` (format and constraint precedent)
- `docs/IMAGE_APPROVAL_REPORT.md`
- `12_DESIGN_SYSTEM/LUXURY_DESIGN_DIRECTION.md` §6 (Location Pages)
- `src/lib/catalog/locations.ts`, `src/app/[locale]/locations/[slug]/page.tsx`
