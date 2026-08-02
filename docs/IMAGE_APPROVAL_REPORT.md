# Image Approval Report — Pest Control

## Document Information

- **Prepared:** 2026-07-29
- **Scope:** Every real (non-placeholder, non-illustration) service image that currently
  exists anywhere in the project — 4 files, all under Pest Control. No other service has
  any real image on disk (confirmed against `04_SERVICE_KNOWLEDGE/SERVICE_MASTER_DATABASE.md`
  and a filesystem search of every service's `assets/` folder).
- **Method:** Each image was opened and visually inspected directly (not just cross-referenced
  against prior documentation) against the six checks below, then checked against this
  project's binding standards: `12_DESIGN_SYSTEM/LUXURY_DESIGN_DIRECTION.md` (§4 Photography,
  §10 Prohibited Patterns), `01_PEST_CONTROL/SAFETY.md` (Draft — Competent Safety Review
  Required), `01_PEST_CONTROL/BUSINESS.md` Evidence Gate, and `02_BRAND/CONTACT_INFORMATION.md`
  (canonical phone `+971 58 543 1766`).
- **No image below is wired into any page.** This report is the gate; wiring is a separate,
  later step per image once (and if) it reaches `APPROVED`.

### Classification definitions

| Status | Meaning |
|---|---|
| `APPROVED` | Clears all six checks against current canonical/approved facts. Ready to prepare for publication metadata and wire in. |
| `NEEDS_REVISION` | Real, on-brand, correctly-matched asset, but carries a specific fixable problem (baked-in text/claims, a fixable artifact) that must be resolved — by re-generation, editing, or an explicit Owner decision — before it can move to `APPROVED`. |
| `REJECTED` | Contains a violation this project's governance treats as a hard stop (unconditional safety/guarantee claims, response-time commitments, superseded by a corrected version, wrong technical format). Not a candidate for revision; superseded or discarded. |

---

## Image 1 — Pest Control Homepage Hero

**File:** `pest-control-homepage-hero-v1.webp`
**Current location:** `public/brand/images/pest-control-homepage-hero-v1.webp` (copied, not wired) — source `04_SERVICE_KNOWLEDGE/01_PEST_CONTROL/assets/hero/pest-control-homepage-hero-v1.webp`

| Check | Finding |
|---|---|
| 1. Visual quality | High. Sharp, well-composed, good light, technician + branded van with Burj Khalifa/Dubai skyline and palm trees clearly establishing UAE setting. Professional PPE (gloves) visible. |
| 2. AI artifacts | Image is AI-generated (per `IMAGE_GENERATION_BRIEF.md`), which is itself a concern independent of pixel defects — see Safety/compliance row. Van-door tagline text is now correctly spelled ("FOR MAINTENANCE AND CLEANLINESS"). Smaller instances of the same tagline (jacket back, spray-tank label) are noticeably softer/less crisp than the van door version — consistent with the known unresolved fidelity issue on secondary text instances. |
| 3. Unwanted text inside image | No unapproved claim text. All visible text is branding (logo, tagline, phone number) — no efficacy, safety, certification, or response-time claims baked in. |
| 4. Brand consistency | Strong. Navy/white/green livery matches the AFAQ AL HAYAT logo and the app's `--color-primary` blue family; wordmark, logo mark, and tagline placement are consistent with `public/brand/logo-mark.png`. |
| 5. Safety/compliance concerns | Phone number (`0585431766`) matches canonical `+971 58 543 1766`. No unconditional safety/response-time claims. **Open concern:** `LUXURY_DESIGN_DIRECTION.md` §10 explicitly prohibits "AI-generated media presented as real company evidence," and §4 calls for real technicians/vehicles, not synthetic ones. This image is confirmed AI-generated, not a real photograph of AFAQ AL HAYAT's actual technician/van — that is a policy conflict independent of the text-fidelity issue. |
| 6. Correct service matching | Correct — general Pest Control branding/hero context, not tied to a specific pest type. Appropriate for a homepage or service-hero slot. |

**Classification: `NEEDS_REVISION`**

Two independent things need resolving, not one: (a) the secondary text-fidelity softness on the jacket/tank, and (b) an explicit Owner decision on whether AI-generated imagery is acceptable at all for this slot given §10's prohibition — or whether this stays a placeholder until real photography is commissioned. Fixing (a) alone does not clear (b).

---

## Image 2 — Cockroach Control Service Card (v2)

**File:** `cockroach-control-service-card-v2.webp`
**Current location:** `public/brand/images/cockroach-control-service-card-v2.webp` (copied, not wired) — source `04_SERVICE_KNOWLEDGE/01_PEST_CONTROL/assets/service-cards/cockroach-control-service-card-v2.webp`

| Check | Finding |
|---|---|
| 1. Visual quality | High. Clean kitchen setting, correct focal action (treating a cabinet base), good lighting, PPE visible (gloves, mask). Composite marketing layout (logo panel + photo + icon badge row + contact footer), not a plain photograph. |
| 2. AI artifacts | Logo/wordmark renders cleanly and consistently everywhere it appears in this file (cap, chest patch, tank, toolbox) — no garbling detected, an improvement over Image 1 and over v1 of this same card (see Image 4). |
| 3. Unwanted text inside image | **Yes — several baked-in marketing claims, not just branding:** the Arabic description asserts "معتمدة" (approved) pesticides; the icon-badge row asserts "فعالية طويلة الأمد" (long-lasting effectiveness), "حماية كاملة للمنزل من الحشرات الزاحفة" (complete home protection), and an eco/safety-adjacent pesticide claim — none sourced from an approved evidence document. |
| 4. Brand consistency | Strong — same palette/logo treatment as Image 1, consistent toolbox/tank branding. |
| 5. Safety/compliance concerns | Phone number (`058 543 1766`) matches canonical. Coverage claim ("ALL 7 EMIRATES" / UAE map) matches approved `SERVICE_MATRIX.md` coverage — no issue there. **The "complete protection" and safety/eco-pesticide claims sit in direct tension with `SAFETY.md`'s own "Draft — Competent Safety Review Required" status and `04_FAQ.md`'s explicit "no unconditional safety assurance."** These are exactly the kind of claims `BUSINESS.md`'s Evidence Gate says must not be inferred or asserted before Owner/evidence approval. |
| 6. Correct service matching | Correct — accurately depicts cockroach control, a named item within `SVC-PEST-CONTROL`'s approved scope (`06_PAGE_CONTENT.md` "Our Services"). |

**Classification: `NEEDS_REVISION`**

The photography and branding are close to ready. The blocker is entirely the claims text baked into the pixels — it cannot be edited in code. Path to `APPROVED`: either regenerate/re-edit the graphic with the claim badges removed (keep only the coverage/contact panel, which is evidence-backed), or obtain explicit, documented Owner sign-off tying each claim to a specific approved source before publication.

---

## Image 3 — Pest Control Hero (v1, superseded)

**File:** `pest-control-hero-v1.png`
**Current location:** knowledge base only — `04_SERVICE_KNOWLEDGE/01_PEST_CONTROL/assets/hero/pest-control-hero-v1.png` (not copied into the app)

| Check | Finding |
|---|---|
| 1. Visual quality | High production value — technician with respirator mask, residential UAE street scene, branded van, well-lit. |
| 2. AI artifacts | Logo and headline text render cleanly; no garbling observed. |
| 3. Unwanted text inside image | **Yes, and severe.** A left-hand badge column asserts: "آمنة على الأطفال والحيوانات الأليفة" (safe for children and pets — unconditional safety claim), "مبيدات معتمدة وصديقة للبيئة" (approved, eco-friendly pesticides), "فريق متخصص ومدرب" (specialized, trained team — competency claim), and **"24/7" / "خدمة سريعة على مدار الساعة"** (fast service around the clock — a response-time commitment). |
| 4. Brand consistency | Strong — same palette and logo treatment as the other three images. |
| 5. Safety/compliance concerns | **Hard violations.** The unconditional child/pet-safety claim directly contradicts `04_FAQ.md` ("no unconditional safety assurance... requires case-specific assessment"). The 24/7 response-time badge is explicitly prohibited by `LUXURY_DESIGN_DIRECTION.md` §10 ("No guaranteed time-slot or '24/7' messaging") and by `03_BOOKING_OPTIONS.md`'s own "What is explicitly NOT part of this booking form" list. |
| 6. Correct service matching | Correct subject (general pest control), but see format issue below. |

**Classification: `REJECTED`**

Two independent, sufficient reasons: (a) wrong technical format — `.png`, not the `.webp` this project's `NAMING_CONVENTIONS.md`/image pipeline requires, and (b) it carries unconditional safety and response-time claims that are hard governance violations, not fixable by minor revision. Superseded by Image 1 for the hero slot, which does not carry these specific claims.

---

## Image 4 — Cockroach Control Service Card (v1, superseded)

**File:** `cockroach-control-service-card-v1.webp`
**Current location:** knowledge base only — `04_SERVICE_KNOWLEDGE/01_PEST_CONTROL/assets/service-cards/cockroach-control-service-card-v1.webp` (not copied into the app)

| Check | Finding |
|---|---|
| 1. Visual quality | High — same kitchen setting and composition later reused (cleaned up) in Image 2. |
| 2. AI artifacts | None obviously detected in the photo itself. |
| 3. Unwanted text inside image | **Yes, and severe.** Badge row reads: "FAMILY SAFE" (unconditional safety claim), "LONG LASTING," "FULL PROTECTION," **"CERTIFIED SOLUTIONS" / "مبيدات معتمدة"** (an explicit, unsupported certification claim), and **"24/7 SUPPORT"** whose Arabic counterpart reads **"24/4"** — a self-contradicting claim on top of being a prohibited response-time commitment. An Arabic spelling error is also present in the first badge's caption. |
| 4. Brand consistency | Strong, consistent with the rest of the set. |
| 5. Safety/compliance concerns | **Hard violations** — same category as Image 3: unconditional safety claim, unsupported certification claim, prohibited response-time commitment, and an internal English/Arabic contradiction (24/7 vs 24/4) that would itself be a quality failure even if the claims were otherwise acceptable. |
| 6. Correct service matching | Correct subject (cockroach control), same scope item as Image 2. |

**Classification: `REJECTED`**

Superseded by Image 2, which removed the certification and 24/7 badges and fixed the spelling errors. Image 2 still isn't clean (see above), but Image 1 of this pair is strictly worse on every claim that differs between the two and should not be used even as a fallback.

---

## Summary

| # | File | Status | Primary blocker |
|---|---|---|---|
| 1 | `pest-control-homepage-hero-v1.webp` | `NEEDS_REVISION` | Secondary text fidelity + AI-generated-media policy question |
| 2 | `cockroach-control-service-card-v2.webp` | `NEEDS_REVISION` | Unsourced efficacy/safety/eco claims baked into pixels |
| 3 | `pest-control-hero-v1.png` | `REJECTED` | Unconditional safety + 24/7 claims; wrong format |
| 4 | `cockroach-control-service-card-v1.webp` | `REJECTED` | Certification + contradictory 24/7 claims; superseded |

**No image is `APPROVED`.** Per your instruction, the publication metadata block (final filename,
alt text AR/EN, title AR/EN, target page, component usage) is prepared only for `APPROVED`
images — so that section is intentionally empty in this report.

### What would move Image 1 and Image 2 to `APPROVED`

- **Image 1:** an Owner decision on whether AI-generated media is acceptable for this slot at
  all (§10 conflict) — if yes, a fidelity pass on the jacket/tank text; if no, this image is
  retired in favor of commissioned photography.
- **Image 2:** the claim badges removed or replaced with only evidence-backed content (the
  coverage/contact panel is fine as-is); the Arabic description's "معتمدة" (approved) claim
  either removed or tied to a real approved-product-list source.

Once either image is revised, re-run this same six-point check on the revised file before
reclassifying — a filename or version bump alone does not constitute re-approval.

## Related Documents

- `04_SERVICE_KNOWLEDGE/01_PEST_CONTROL/IMAGE_SEO_LIBRARY.md` (original delivery/correction history)
- `04_SERVICE_KNOWLEDGE/01_PEST_CONTROL/05_IMAGE_METADATA.md`
- `04_SERVICE_KNOWLEDGE/01_PEST_CONTROL/SAFETY.md`
- `12_DESIGN_SYSTEM/LUXURY_DESIGN_DIRECTION.md`
- `02_BRAND/CONTACT_INFORMATION.md`
