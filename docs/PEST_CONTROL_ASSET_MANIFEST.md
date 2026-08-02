# Pest Control Asset Manifest

## Document Information

- **Prepared:** 2026-07-30
- **Status:** Assets designated approved by the Owner. This manifest organizes them and
  prepares SEO/frontend metadata — it does not re-run an approval decision.
- **Source:** `~/Downloads/` (11 files, delivered 2026-07-30)
- **Stored at:** `public/brand/images/pest-control/` (copied byte-for-byte; filenames,
  pixels, and content unmodified)
- **Not yet wired into any page** — see "Code integration notes" at the end.

---

## Asset 1 — Hero Banner

| Field | Value |
|---|---|
| Filename | `HERO_PEST_CONTROL_21x9.webp` |
| Dimensions | 1915 × 821 px (≈ 21:9, confirmed) |
| Location | `public/brand/images/pest-control/HERO_PEST_CONTROL_21x9.webp` |
| Title (EN) | Pest Control — AFAQ AL HAYAT |
| Title (AR) | مكافحة الحشرات — آفاق الحياة |
| Alt text (EN) | AFAQ AL HAYAT pest control technician treating the exterior of a modern Dubai villa at dusk |
| Alt text (AR) | فني مكافحة حشرات من آفاق الحياة يعالج محيط فيلا حديثة في دبي عند الغسق |
| Service relationship | General Pest Control (`SVC-PEST-CONTROL`) — brand/category hero, not tied to one pest type |
| Target page | `/[locale]/services/pest-control` — hero section |
| Recommended usage | Full-width service-page hero background/banner |

**Note (factual, not a re-approval decision):** this file carries baked-in marketing text and
claim badges (an "10+ years experience" / "thousands of customers" statistic, a 5-star rating
graphic, and an effectiveness-guarantee line in the bottom strip) in addition to the pest-type
icon row and contact/coverage strip. That is a text overlay in the literal sense, and the
statistics/rating/guarantee badges are the same category of claim flagged `REJECTED` in
`IMAGE_APPROVAL_REPORT.md` for the prior hero asset and are inconsistent with
`LUXURY_DESIGN_DIRECTION.md` §10 ("Unsupported awards, ratings, certifications, guarantees, or
statistics"). Recorded here for visibility; not blocking this deliverable per your instruction
to treat these as approved.

---

## Asset 2 — Service Card Set (10 files)

All ten share the same visual system: AFAQ AL HAYAT technician in navy uniform with PPE,
realistic UAE residential/commercial settings, consistent logo placement on cap/chest/equipment.
No promotional text overlays on any of the ten (see per-image notes for the one exception).

| # | Filename | Service (EN / AR) |
|---|---|---|
| 1 | `001-rodent-control-service-card.webp` | Rodent Control / مكافحة القوارض |
| 2 | `002-ant-control-service-card.webp` | Ant Control / مكافحة النمل |
| 3 | `003-termite-control-service-card.webp` | Termite Control / مكافحة النمل الأبيض |
| 4 | `004-cockroach-control-service-card.webp` | Cockroach Control / مكافحة الصراصير |
| 5 | `005-snake-control-service-card.webp` | Snake Control / مكافحة الثعابين |
| 6 | `006-pigeon-control-service-card.webp` | Pigeon Control / مكافحة الحمام |
| 7 | `007-gecko-control-service-card.webp` | Gecko Control / مكافحة أبو بريص |
| 8 | `008-wasp-bee-control-service-card.webp` | Wasp & Bee Control / مكافحة الدبابير والنحل |
| 9 | `009-mosquito-control-service-card.webp` | Mosquito Control / مكافحة البعوض |
| 10 | `010-house-fly-control-light-trap-installation.webp` | House Fly Control & Light Trap Installation / مكافحة الذباب المنزلي وتركيب المصائد الضوئية |

### Full metadata per card

**001 — Rodent Control**
- Dimensions: 1402×1122 px
- Alt (EN): AFAQ AL HAYAT technician placing a rodent bait station beside a mouse entry point in a UAE kitchen
- Alt (AR): فني آفاق الحياة يضع محطة طعم للقوارض بجانب فتحة دخول فأر في مطبخ بالإمارات
- Title (EN/AR): Rodent Control / مكافحة القوارض
- Service relationship: Matches `SVC-PEST-CONTROL` scope item "Rodent Control" (`SERVICE_DATABASE.json` → `content.en.scope.included`).
- Target page / usage: `/services/pest-control` — pest-type card grid.

**002 — Ant Control**
- Dimensions: 1254×1254 px
- Alt (EN): AFAQ AL HAYAT technician treating an ant trail along a kitchen wall in the UAE
- Alt (AR): فني آفاق الحياة يعالج مسار نمل على جدار مطبخ في الإمارات
- Title (EN/AR): Ant Control / مكافحة النمل
- Service relationship: Matches approved scope item "Ant Control."
- Target page / usage: `/services/pest-control` — pest-type card grid.

**003 — Termite Control**
- Dimensions: 1254×1254 px
- Alt (EN): AFAQ AL HAYAT technician treating termite damage at a wall baseboard
- Alt (AR): فني آفاق الحياة يعالج أضرار النمل الأبيض عند حافة الجدار
- Title (EN/AR): Termite Control / مكافحة النمل الأبيض
- Service relationship: Matches approved scope item "Termite Control."
- Target page / usage: `/services/pest-control` — pest-type card grid.
- Note: the AFAQ wordmark is not visible on the spray tank in this frame (visible on cap/chest/shield only) — a minor consistency gap versus the other nine cards, not a defect requiring rework, just recorded.

**004 — Cockroach Control**
- Dimensions: 1254×1254 px
- Alt (EN): AFAQ AL HAYAT technician treating a cockroach near a kitchen cabinet base in the UAE
- Alt (AR): فني آفاق الحياة يعالج صرصورًا بالقرب من قاعدة خزانة مطبخ في الإمارات
- Title (EN/AR): Cockroach Control / مكافحة الصراصير
- Service relationship: Matches approved scope item "Cockroach Control." (Note: this supersedes the earlier `cockroach-control-service-card-v2.webp` reviewed in `IMAGE_APPROVAL_REPORT.md` — that file remains `NEEDS_REVISION` and unused; this new file is a different, cleaner asset.)
- Target page / usage: `/services/pest-control` — pest-type card grid.
- Note: faint ghosted "AFAQ" text is visible in the floor reflection (a generation artifact, not an intentional overlay) — cosmetic only, worth a look before print-quality use.

**005 — Snake Control**
- Dimensions: 1254×1254 px
- Alt (EN): AFAQ AL HAYAT technician safely capturing a snake indoors using capture tongs and a containment bag
- Alt (AR): فني آفاق الحياة يمسك بأمان بثعبان داخل المنزل باستخدام ملقط إمساك وكيس احتواء
- Title (EN/AR): Snake Control / مكافحة الثعابين
- Service relationship: **Not currently in `SERVICE_DATABASE.json`'s approved scope list or `03_BOOKING_OPTIONS.md`'s pest-type dropdown.** Falls under the booking form's generic "Other" free-text option today. Recommend adding "Snake Control" to the approved scope list (with Owner confirmation) before presenting it as a named sub-service on the page.
- Target page / usage: `/services/pest-control` — pest-type card grid, pending the scope-list update above.

**006 — Pigeon Control**
- Dimensions: 1402×1122 px
- Alt (EN): AFAQ AL HAYAT technician installing anti-roosting bird spikes and netting on a Dubai rooftop ledge
- Alt (AR): فني آفاق الحياة يركّب أشواك وشباك لمنع استيطان الحمام على حافة سطح في دبي
- Title (EN/AR): Pigeon Control / مكافحة الحمام
- Service relationship: **Not currently in the approved scope list or booking dropdown** — same open item as Snake Control above.
- Target page / usage: `/services/pest-control` — pest-type card grid, pending scope-list update.
- Note: this image (and 007–010) uses a plain environmental photo without the left-hand shield-emblem graphic panel used in cards 001–005 — a compositional style difference across the set worth being aware of if the ten are displayed together in one uniform grid.

**007 — Gecko Control**
- Dimensions: 1402×1122 px
- Alt (EN): AFAQ AL HAYAT technician inspecting a wall with a flashlight to treat a gecko sighting indoors
- Alt (AR): فني آفاق الحياة يفحص الجدار بمصباح يدوي لمعالجة وجود سحلية داخل المنزل
- Title (EN/AR): Gecko Control / مكافحة أبو بريص
- Service relationship: **Not currently in the approved scope list or booking dropdown** — same open item as above.
- Target page / usage: `/services/pest-control` — pest-type card grid, pending scope-list update.
- Note: uses a stainless-steel sprayer tank, versus the white/green-base tank in cards 001–005 and the hero — an equipment-styling inconsistency across the set (shared with 008 and 009).

**008 — Wasp & Bee Control**
- Dimensions: 1402×1122 px
- Alt (EN): AFAQ AL HAYAT technician treating a wasp nest under a villa roof overhang in the UAE
- Alt (AR): فني آفاق الحياة يعالج عش دبابير أسفل سقف فيلا في الإمارات
- Title (EN/AR): Wasp & Bee Control / مكافحة الدبابير والنحل
- Service relationship: **Not currently in the approved scope list or booking dropdown** — same open item as above.
- Target page / usage: `/services/pest-control` — pest-type card grid, pending scope-list update.

**009 — Mosquito Control**
- Dimensions: 1393×1129 px
- Alt (EN): AFAQ AL HAYAT technician fogging garden vegetation for mosquito control beside a villa pool at dusk
- Alt (AR): فني آفاق الحياة يرش النباتات في الحديقة لمكافحة البعوض بجانب مسبح فيلا عند الغسق
- Title (EN/AR): Mosquito Control / مكافحة البعوض
- Service relationship: Matches approved scope item "Mosquito Control."
- Target page / usage: `/services/pest-control` — pest-type card grid.

**010 — House Fly Control & Light Trap Installation**
- Dimensions: 1386×1135 px
- Alt (EN): AFAQ AL HAYAT technician installing a UV fly light trap on a restaurant wall in the UAE
- Alt (AR): فني آفاق الحياة يركّب مصيدة ضوئية للذباب بالأشعة فوق البنفسجية على جدار مطعم في الإمارات
- Title (EN/AR): House Fly Control & Light Trap Installation / مكافحة الذباب المنزلي وتركيب المصائد الضوئية
- Service relationship: Matches approved scope item "Fly Control," and specifically depicts the light-trap method — a commercial/food-service detail not yet described in `06_PAGE_CONTENT.md`'s text, so this image adds real information the current text doesn't cover yet.
- Target page / usage: `/services/pest-control` — pest-type card grid.
- Note: this frame includes real in-scene wall signage ("مكافحة الذباب من أجل بيئة حية" with a no-fly icon) as a physical prop in the photographed environment — not a promotional text overlay, so it does not conflict with the "no text overlays" rule the way the hero's badge strip does.

---

## Cross-cutting observations (factual, non-blocking)

1. **Scope-list gap:** 5 of the 10 cards (Snake, Pigeon, Gecko, Wasp & Bee — Mosquito and House
   Fly are fine) depict pest types not yet listed in `src/data/SERVICE_DATABASE.json`'s
   `content.scope.included` or in `03_BOOKING_OPTIONS.md`'s approved pest-type dropdown. Using
   these cards as named sub-service tiles implies a scope the approved text doesn't state yet.
   Two options: (a) get Owner confirmation to add these 4 pest types to the approved scope list,
   or (b) display all 10 cards but keep only the 6 already-in-scope types as clickable/named
   sub-services, with the other 4 shown generically under "and other common pests" per `FAQ.md`
   Q6's existing wording.
2. **Style consistency:** cards 001–005 use a left-hand shield-emblem graphic panel; 006–010 are
   plain environmental photos. Two different sprayer-tank designs (white/green-base vs.
   stainless steel) appear across the set. Neither breaks brand colors/logo/uniform (rule 1–2
   are intact), but a uniform grid of all ten will read as two slightly different sub-styles
   side by side.
3. **Hero text overlay:** see Asset 1's note above — the only asset that doesn't meet the
   stated "no text overlays" rule as literally written.

None of the above blocks using the assets — they're recorded so whoever wires them in can decide
whether to address them first or ship as-is.

---

## Code integration notes

Nothing below has been implemented — this is preparation only, per your instruction to
organize and document, not to modify pages.

- **Hero:** the service detail page (`src/app/[locale]/services/[slug]/page.tsx`) already
  renders a `BrandPanel variant="hero"` for every service, currently icon/illustration-only for
  `pest-control`. Passing `src="/brand/images/pest-control/HERO_PEST_CONTROL_21x9.webp"` and the
  alt text above to that one call site is the entire wiring change — `BrandPanel`'s existing
  type already requires `src`+`alt` together (see `src/components/brand-panel.tsx`).
- **Service cards:** there is currently no "pest-type card grid" component in the codebase — the
  detail page only renders overview/scope/benefits/FAQ text sections. Displaying the 10 cards
  needs a new presentational section (e.g. `ServicePestTypesSection`, following the existing
  pattern in `src/components/service-content-sections.tsx`), rendered only for `pest-control`,
  mapping each card to its slug-safe key (`rodent`, `ant`, `termite`, `cockroach`, `snake`,
  `pigeon`, `gecko`, `wasp-bee`, `mosquito`, `house-fly`) and rendering each via `next/image`
  with the filename/alt pairs documented above.
- **Data:** the natural place for this mapping is a new array in `src/data/SERVICE_DATABASE.json`
  under the `pest-control` entry (e.g. `pestTypeImages: [...]`) so the card grid can read from
  the same single source of truth as the rest of the service content, consistent with how
  `service-content.ts`/`faq.ts` already derive from that file.
- Recommend resolving the scope-list gap (observation 1 above) before wiring the 4 out-of-scope
  cards as named, clickable sub-services.

## Related Documents

- `docs/IMAGE_APPROVAL_REPORT.md`
- `src/data/SERVICE_DATABASE.json`
- `src/components/brand-panel.tsx`
- `12_DESIGN_SYSTEM/LUXURY_DESIGN_DIRECTION.md`
