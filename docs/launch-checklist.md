# Domain Launch Checklist

**JOB-AGT-WEB-20260726-M4.6 — Marketing Email & Launch Foundation**

This is a consolidated go-live checklist assembled from the per-topic
gates already approved in the `AFAQ_ALHAYAT_ENTERPRISE_KNOWLEDGE` base —
it does not invent new requirements, only collects existing ones in one
place with their source cited. **Every item here is owner-executed**
(DNS, credentials, billing, account creation) — none of it can be done
from this codebase or by an AI agent, per
`00_GOVERNANCE/AUTONOMY_AND_APPROVAL_MATRIX.md`: *"Change credentials,
DNS, hosting, or security — A4, every action."*

## 1. Domain & hosting

- [ ] Verify the purchased Hostinger plan against the canonical stack
      (Next.js, Node.js, MySQL). *Source:
      `00_GOVERNANCE/CURRENT_PROJECT_STATUS.md`, Current Priority Order #1.*
- [ ] Confirm canonical apex vs. `www` redirect behavior for
      `afaqalhayatae.com`. *Source: `00_GOVERNANCE/TECH_STACK.md`.*
- [ ] Confirm CI/CD (GitHub Actions, planned) and automated backups are
      configured before first production deploy. *Source:
      `00_GOVERNANCE/TECH_STACK.md`.*
- [ ] Run the Hostinger audit phase (inventory files/apps/DBs/DNS,
      confirm backups exist) **before** removing anything old from the
      account — see `docs/hostinger-migration-runbook.md` Phase A.
      Only remove what that audit confirms is legacy — Phase B.

## 2. Pending business facts (block publication until confirmed)

Per `02_BRAND/CONTACT_INFORMATION.md`'s Status table, these remain
**Pending** in the knowledge base independently of anything used in this
project's build sessions — confirm/update the canonical doc before
relying on them for paid campaigns or compliance-sensitive flows:

- [ ] WhatsApp number (if different from the approved phone)
- [ ] Official email address
- [ ] Working hours
- [ ] Social profile URLs
- [ ] Emergency-service availability

## 3. Service & commercial claims

- [ ] Confirm service methods, qualifications, equipment, safety
      evidence, availability, and exclusions per service before
      publishing expanded service-detail copy. *Source:
      `00_GOVERNANCE/IMPLEMENTATION_READINESS_REPORT.md`, Open Gate #3.*
- [ ] Approve prices, discounts, packages, warranty terms, emergency
      commitments, and any commercial claim before publication. *Source:
      same report, Open Gate #4.*

## 4. Email marketing (see `docs/email-dns-readiness.md` for the runbook)

- [ ] Sending domain and ESP are approved (owner decision — no vendor is
      pre-selected in this repo).
- [ ] SPF, DKIM, DMARC, TLS, and alignment pass.
- [ ] Consent and suppression records are operational (this repo already
      has the backend — see §5 below).
- [ ] Privacy and unsubscribe workflows are tested.
- [ ] Arabic and English templates pass inbox tests on mobile and desktop.

*Source: `10_MARKETING_AND_SEO/EMAIL_MARKETING.md`'s Launch Gate,
reproduced in full in `docs/email-dns-readiness.md`.*

## 5. Consent & lead capture (already built, verify before relying on it)

- [x] `Consent` domain model and `/api/consents` endpoint exist and are
      tested (`src/lib/services/consent-service.ts`).
- [x] Newsletter signup (`src/components/newsletter-form.tsx`) records a
      real lead via `/api/enquiries` and a compliance record via
      `/api/consents` — no ESP is connected to act on it yet.
- [ ] Decide the real ESP and connect it to actually send to the list
      this has been building.

## 6. Google ecosystem (see `docs/google-ecosystem-setup.md` for the runbook)

- [ ] Google Search Console: canonical domain verified, sitemap submitted.
- [ ] Google Tag Manager: container created, `NEXT_PUBLIC_GTM_CONTAINER_ID`
      added to production environment.
- [ ] Google Analytics 4: property created, configured as a tag inside GTM.
- [ ] Google Ads conversion tracking: configured as a tag inside GTM,
      only after real campaigns are approved
      (`10_MARKETING_AND_SEO/PAID_MEDIA_STRATEGY.md` is still Draft).
- [ ] Google Business Profile: eligible profile claimed/verified under
      owner control, correct Place ID recorded.
- [ ] Google Reviews: Business Profile has at least one real, public
      review and it has been manually copied into `VERIFIED_REVIEWS`
      (see `docs/google-ecosystem-setup.md` §6a) before the Reviews
      section is expected to show anything on the live site.

*Source: `07_WEBSITE/GOOGLE_LIVE_ECOSYSTEM.md`'s Implementation Sequence
and Release Gate.*

## 7. Final go-live gate

- [x] Temporary demo blog content and demo visual placeholders
      (JOB-AGT-WEB-20260726-M4.5 visual-testing prep) have been removed
      from the codebase (`BLOG_POSTS = []`, `SHOW_DEMO_VISUALS = false`)
      — done in JOB-AGT-WEB-20260726-M4.7. The underlying registries and
      image pipeline are untouched and ready for real content.
- [ ] No Draft, HOLD, or Unverified fact is live anywhere on the site.
- [ ] No live customer communications or booking commitments before the
      relevant gates above are closed. *Source:
      `00_GOVERNANCE/IMPLEMENTATION_READINESS_REPORT.md`'s
      prohibited-until-gate-approval list.*
- [ ] Owner has explicitly approved production deployment
      (`AI_OPERATING_MODEL.md`'s Mandatory Owner Gates).

---

**Nothing on this list has been executed by this ticket.** It's the
handoff artifact — every checkbox needs a human with the relevant
account access (Hostinger, DNS registrar, Google, the eventual ESP) to
actually check it off.
