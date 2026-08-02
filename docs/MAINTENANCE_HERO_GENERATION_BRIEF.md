# Maintenance Service Hero — Image Generation Brief

## Document Information

- **Status:** Specification only. **No image has been generated.** Same limitation as
  `docs/HOMEPAGE_HERO_GENERATION_BRIEF.md` — this session has no image-generation tool,
  model, or API available.
- **Prepared:** 2026-07-30
- **Package:** general-maintenance category hero (not tied to one specific maintenance
  sub-service — AC, plumbing, electrical, painting, handyman all share this category)

## Asset Specification

| Field | Value |
|---|---|
| SEO filename | `afaq-alhayat-maintenance-service-hero-banner-uae-21x9.webp` |
| Recommended location once generated | `public/brand/images/afaq-alhayat-maintenance-service-hero-banner-uae-21x9.webp` |
| Ratio | 21:9 |
| Alt text (EN) | *Draft — finalize once the image is generated:* "AFAQ AL HAYAT maintenance technician with tools at a luxury UAE villa" |
| Alt text (AR) | *Draft, same caveat:* "فني صيانة من آفاق الحياة ومعه أدواته عند فيلا فاخرة في الإمارات" |

## Generation Prompt

*Wide-format 21:9 cinematic photograph, premium corporate photography style for a luxury
UAE home-maintenance brand. A modern luxury villa exterior with premium marble outdoor
flooring, clean elegant landscaping, and the Dubai skyline visible in the atmospheric
background. A single professional maintenance technician in a dark navy uniform stands on
the right third of the frame, with realistic maintenance equipment nearby — a toolbox,
electrical tools, plumbing tools, and HVAC tools arranged neatly, not cluttered. The AFAQ
AL HAYAT logo appears only on the technician's uniform and on the toolbox — no other
branding surface. Warm golden-hour lighting, realistic shadows and reflections off the
marble, sharp detail, no artificial lens flares or over-processed effects. The left
two-thirds and center of the frame stay deliberately open, low-detail negative space — sky,
softly blurred landscaping, out-of-focus villa facade — reserved for an Arabic headline and
CTA buttons to be added later in the website's own typography, not baked into the image.*

**Hard constraints — the generated image must contain NONE of the following:**

- No text of any kind, in any language, anywhere in the frame (check corners and
  reflections — the pest-control hero batch had stray text bleed into background surfaces).
- No numbers (phone numbers, years, ratings, counts).
- No claims of any kind (safety, certification, guarantee, experience, response-time).
- No badges, seals, or marketing-style graphic overlays.
- No AI-fabricated logo approximations — only the real AFAQ AL HAYAT logo, and only on
  uniform/toolbox, matching the same rule already applied to the approved pest-control hero.

## Acceptance checklist (use this to review the file once generated)

- [ ] No text anywhere in the frame, including reflections and small background surfaces.
- [ ] Logo appears only on uniform and toolbox — nowhere else.
- [ ] No numbers, badges, ratings, or claim-style graphics.
- [ ] Left/center two-thirds genuinely low-detail enough for a real Arabic headline and
      buttons to sit on top of it with good contrast.
- [ ] Technician + equipment reads clearly on the right third.
- [ ] Ratio is 21:9, file is `.webp`, matching this project's asset convention.
- [ ] Reads as real photography, not illustration or obvious AI artifact.

## Once generated

Drop the file at `public/brand/images/afaq-alhayat-maintenance-service-hero-banner-uae-21x9.webp`
and finalize the alt text against what's actually in the frame. Wiring it in is then the
same pattern already built twice now — the homepage hero (`src/lib/media/homepage-hero.ts` +
`src/app/[locale]/page.tsx`) and the pest-control hero (`heroSection` in
`src/data/SERVICE_DATABASE.json` + the cinematic overlay block in
`src/app/[locale]/services/[slug]/page.tsx`) are both ready-made templates for whichever
maintenance service page(s) this should apply to.

## Related Documents

- `docs/HOMEPAGE_HERO_GENERATION_BRIEF.md` (format and constraint precedent)
- `docs/IMAGE_APPROVAL_REPORT.md`
- `12_DESIGN_SYSTEM/LUXURY_DESIGN_DIRECTION.md`
