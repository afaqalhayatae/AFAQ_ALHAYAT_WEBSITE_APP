# Cleaning Service Hero — Image Generation Brief

## Document Information

- **Status:** Specification only. **No image has been generated.** Same limitation as
  `docs/HOMEPAGE_HERO_GENERATION_BRIEF.md` and `docs/MAINTENANCE_HERO_GENERATION_BRIEF.md` —
  this session has no image-generation tool, model, or API available.
- **Prepared:** 2026-07-31 (Complete Visual Asset Generation Phase)
- **Package:** cleaning-pest-control category hero (General Cleaning, Deep Cleaning, Water
  Tank Cleaning all share this section per `service-sections.ts`; Pest Control has its own
  separately-approved hero, see `PEST_CONTROL_ASSET_MANIFEST.md`)

## Asset Specification

| Field | Value |
|---|---|
| SEO filename | `afaq-alhayat-cleaning-service-hero-banner-uae-21x9.webp` |
| Recommended location once generated | `public/brand/images/afaq-alhayat-cleaning-service-hero-banner-uae-21x9.webp` |
| Ratio | 21:9 (cinematic wide, matches the homepage/maintenance hero precedent) |
| Alt text (EN) | *Draft — finalize once the image is generated:* "AFAQ AL HAYAT cleaning technician preparing equipment in a bright UAE home interior" |
| Alt text (AR) | *Draft, same caveat:* "فني تنظيف من آفاق الحياة يجهّز معداته داخل منزل مضيء في الإمارات" |

## Generation Prompt

*Wide-format 21:9 cinematic photograph, premium corporate photography style for a luxury
UAE home-cleaning brand. A bright, immaculate modern UAE living or dining interior — light
marble or polished floors, large windows with soft natural daylight, tasteful neutral décor.
A single professional cleaning technician in a clean navy or light-grey uniform stands on
the right third of the frame, with realistic cleaning equipment arranged neatly nearby — a
cleaning trolley, microfiber cloths, a spray bottle, and a vacuum, not cluttered. The AFAQ
AL HAYAT logo appears only on the technician's uniform and on the equipment — no other
branding surface. Bright, airy, natural lighting (not golden-hour, since this should read as
"clean daylight" rather than the warmer maintenance/pest-control mood), sharp detail, no
artificial lens flares or over-processed effects. The left two-thirds and center of the frame
stay deliberately open, low-detail negative space — a softly blurred window, wall, or hallway
— reserved for a headline and CTA buttons to be added later in the website's own typography,
not baked into the image.*

**Hard constraints — the generated image must contain NONE of the following:**

- No text of any kind, in any language, anywhere in the frame (check corners and
  reflections — the pest-control hero batch had stray text bleed into background surfaces).
- No numbers (phone numbers, years, ratings, counts).
- No claims of any kind (safety, certification, guarantee, experience, response-time).
- No badges, seals, or marketing-style graphic overlays.
- No AI-fabricated logo approximations — only the real AFAQ AL HAYAT logo, and only on
  uniform/equipment, matching the same rule already applied to the approved pest-control and
  maintenance briefs.

## Acceptance checklist (use this to review the file once generated)

- [ ] No text anywhere in the frame, including reflections and small background surfaces.
- [ ] Logo appears only on uniform and equipment — nowhere else.
- [ ] No numbers, badges, ratings, or claim-style graphics.
- [ ] Left/center two-thirds genuinely low-detail enough for a real headline and buttons to
      sit on top of it with good contrast, in both Arabic and English layouts.
- [ ] Technician + equipment reads clearly on the right third.
- [ ] Lighting reads as bright/airy daylight, distinct in mood from the maintenance and
      pest-control heroes' warmer golden-hour treatment — the three sections should feel like
      one family, not three unrelated shoots, but still be visually distinguishable at a glance.
- [ ] Ratio is 21:9, file is `.webp`, matching this project's asset convention.
- [ ] Reads as real photography, not illustration or obvious AI artifact.

## Once generated

Drop the file at `public/brand/images/afaq-alhayat-cleaning-service-hero-banner-uae-21x9.webp`
and finalize the alt text against what's actually in the frame. Wiring it in follows the same
pattern already built twice — the homepage hero (`src/lib/media/homepage-hero.ts` +
`src/app/[locale]/page.tsx`) and the pest-control hero (`heroSection` in
`src/data/SERVICE_DATABASE.json` + the cinematic overlay block reused via
`src/components/service-detail-content.tsx`) are both ready-made templates. The natural target
is the `/[locale]/services/cleaning` section hub page
(`src/app/[locale]/services/cleaning/page.tsx`), which currently has no hero image of its own.

## Related Documents

- `docs/HOMEPAGE_HERO_GENERATION_BRIEF.md` (format and constraint precedent)
- `docs/MAINTENANCE_HERO_GENERATION_BRIEF.md` (format and constraint precedent)
- `docs/PEST_CONTROL_ASSET_MANIFEST.md`
- `docs/IMAGE_APPROVAL_REPORT.md`
- `12_DESIGN_SYSTEM/LUXURY_DESIGN_DIRECTION.md`
