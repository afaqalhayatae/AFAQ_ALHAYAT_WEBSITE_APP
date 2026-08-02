# Homepage Hero — Image Generation Brief

## Document Information

- **Status:** Specification only. **No image has been generated.**
- **Prepared:** 2026-07-30
- **Package:** general/homepage (not tied to a single service — contrast with
  `01_PEST_CONTROL/IMAGE_GENERATION_BRIEF.md`, which this document follows in format)

## Important — read before using this document

This session has no image-generation tool, model, or API available — nothing equivalent to
DALL·E, Midjourney, Gemini image generation, or Stable Diffusion is present in this toolset.
Rather than fabricate a placeholder and describe it as a generated asset — which would
misrepresent what happened — this document provides a complete, execution-ready specification:
exact filename, alt text, usage, a detailed generation prompt, and an acceptance checklist, so
you (or whichever tool produced the 11 pest-control assets already in
`public/brand/images/pest-control/`) can generate the actual file against a precise,
pre-agreed spec.

**Once generated, the file still needs a human visual check against the checklist below before
it's wired into any page** — same as every asset in `IMAGE_APPROVAL_REPORT.md`.

---

## Asset Specification

| Field | Value |
|---|---|
| SEO filename | `homepage-hero-luxury-v1.webp` |
| Recommended location once generated | `public/brand/images/homepage-hero-luxury-v1.webp` |
| Usage | Homepage (`/[locale]`) — full-width hero section, behind headline + CTA overlay |
| Ratio | 21:9 (cinematic wide, matches `HERO_PEST_CONTROL_21x9.webp`'s precedent) |
| Alt text (EN) | *Draft — finalize once the actual image is generated, since alt text must describe what's really in the frame:* "AFAQ AL HAYAT maintenance technician at a luxury UAE villa with Dubai skyline in the background" |
| Alt text (AR) | *Draft, same caveat:* "فني صيانة من آفاق الحياة عند فيلا فاخرة في الإمارات وفي الخلفية أفق دبي" |
| Keyword target | home services UAE / luxury villa maintenance Dubai (candidate, unresearched) |

---

## Generation Prompt

*Wide-format 21:9 cinematic photograph, premium corporate photography style for a luxury UAE
home-services brand. A modern luxury villa exterior with clean marble/stone outdoor flooring,
elegant landscaping, and mature palm trees; the Dubai skyline visible in the atmospheric
background. A single professional maintenance technician in clean, unbranded workwear stands on
the right third of the frame, with realistic professional equipment nearby — a toolbox, cleaning
equipment, and pest-control equipment arranged neatly, not cluttered — suggesting (without any
labels or icons) that maintenance, cleaning, and pest-control services are all part of one
company's work. Warm golden-hour lighting, realistic natural reflections off the marble and
glass, sharp detail, no artificial lens flares or over-processed effects. The left two-thirds
and center of the frame are deliberately open, low-detail negative space — sky, softly blurred
landscaping, out-of-focus villa facade — reserved for a headline and call-to-action buttons to
be overlaid later in the website's own typography, not baked into the image.*

**Hard constraints — the generated image must contain NONE of the following:**

- No text of any kind, in any language, anywhere in the frame.
- No logos, wordmarks, or brand marks (including on uniform, vehicles, or equipment).
- No numbers (phone numbers, years, ratings, counts).
- No claims of any kind (safety, certification, guarantee, experience, etc.).
- No badges, seals, icons-with-labels, or marketing-style graphic overlays.
- No AI-fabricated logo approximations on clothing or equipment.

This is a stricter constraint set than the pest-control asset batch (which does carry real
branding) — this hero is meant to be a clean photographic background with all message and
branding added later in code, per the request that prompted this brief.

## Acceptance checklist (use this to review the file once generated)

- [ ] No text anywhere in the frame (check corners and reflections too — prior AI-generated
      assets in this project have had stray text bleed into background surfaces).
- [ ] No logo or wordmark on the technician's clothing, equipment, or any surface.
- [ ] No numbers visible anywhere.
- [ ] No badges, ratings, or claim-style graphics.
- [ ] Left/center two-thirds genuinely low-detail enough for real headline text to sit on top of
      it with good contrast (check against both a light and a dark overlay treatment).
- [ ] Main subject (technician + equipment + villa) reads clearly on the right third.
- [ ] Ratio is 21:9 and the file is `.webp`, matching this project's asset convention
      (`public/brand/images/<purpose>-<context>-v<N>.webp`, per `brand-panel.tsx`).
- [ ] Lighting/style reads as real photography, not illustration or obvious AI artifact —
      compare against `docs/IMAGE_APPROVAL_REPORT.md`'s findings on the pest-control hero before
      accepting.

## Once generated

Drop the file at `public/brand/images/homepage-hero-luxury-v1.webp` and finalize the alt text
above against what's actually in the frame — then it's ready for the same wiring step already
documented for the pest-control hero in `docs/PEST_CONTROL_ASSET_MANIFEST.md`'s "Code
integration notes" (pass `src`/`alt` into the existing `BrandPanel variant="hero"` call on the
homepage, `src/app/[locale]/page.tsx`). No code has been changed by this document.

## Related Documents

- `04_SERVICE_KNOWLEDGE/01_PEST_CONTROL/IMAGE_GENERATION_BRIEF.md` (format precedent)
- `docs/IMAGE_APPROVAL_REPORT.md`
- `docs/PEST_CONTROL_ASSET_MANIFEST.md`
- `12_DESIGN_SYSTEM/LUXURY_DESIGN_DIRECTION.md`
- `src/components/brand-panel.tsx`
