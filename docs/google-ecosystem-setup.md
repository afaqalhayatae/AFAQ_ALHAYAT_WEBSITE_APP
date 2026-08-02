# Google Ecosystem Setup Runbook

**JOB-AGT-WEB-20260726-M4.6 — Marketing Email & Launch Foundation**

Restates `07_WEBSITE/GOOGLE_LIVE_ECOSYSTEM.md`'s Implementation Sequence
and Release Gate as an actionable runbook for this specific domain/stack.
**No Google account, property, container, or verification has been
created by this ticket** — every step below needs the business owner's
own Google account access, per `AI_OPERATING_MODEL.md`'s Mandatory Owner
Gates: *"New credentials, domains, social accounts, Google Business
Profile changes, or access granted to another party."*

The app code for this is already in place and does nothing until the
owner completes the matching step below — see "What's already built"
under each section.

## 1. Google Search Console

- [ ] Verify the canonical domain property (`afaqalhayatae.com`) using
      the HTML-tag method.
- [ ] Copy the verification code Search Console gives you.
- [ ] Set it as `GOOGLE_SITE_VERIFICATION` in the production environment.
- [ ] Submit the XML sitemap (already live at `/sitemap.xml`).
- [ ] Use a role-based company Google account, not a personal one, per
      `GOOGLE_LIVE_ECOSYSTEM.md`.

**What's already built:** `src/app/[locale]/layout.tsx` reads
`GOOGLE_SITE_VERIFICATION` and renders the verification meta tag only
when it's set — unset today, so nothing renders.

## 2. Google Tag Manager (the single foundation for GA4 + Ads tracking)

- [ ] Create a GTM container under the same role-based company account.
- [ ] Set its container ID as `NEXT_PUBLIC_GTM_CONTAINER_ID` in the
      production environment.
- [ ] Configure Consent Mode inside GTM so tags respect the visitor's
      choice (see §4 below — this app already surfaces that choice).

**What's already built:**
`src/components/google-tag-manager.tsx` loads the GTM script/noscript
pair only when BOTH `NEXT_PUBLIC_GTM_CONTAINER_ID` is set AND the
visitor has accepted the cookie banner (`src/components/consent-banner.tsx`,
cookie `afaq_consent`). Neither condition is true in this repo today, so
nothing loads.

## 3. Google Analytics 4

- [ ] Create a GA4 property under the same account.
- [ ] Add GA4 as a tag inside the GTM container created in §2 — **not**
      as a separate hardcoded script in this codebase. This is why the
      app only needs one container ID, not a separate GA4 measurement ID
      env var.
- [ ] Configure the events `GOOGLE_LIVE_ECOSYSTEM.md` names as in scope:
      call, WhatsApp, form, booking-start, and booking-complete clicks.
      Remember: *"Clicks are intent signals. They are not automatically
      qualified leads, bookings, or revenue."*

## 4. Consent Mode

- [ ] Inside GTM, configure Consent Mode so analytics/advertising tags
      wait for the visitor's choice before firing.

**What's already built:** the cookie banner and its `afaq_consent`
cookie already exist and gate the GTM loader itself (§2) — Consent Mode
configuration inside GTM is the remaining owner-side step once a real
container exists.

## 5. Google Ads conversion tracking

- [ ] Only after `10_MARKETING_AND_SEO/PAID_MEDIA_STRATEGY.md` clears its
      own Draft status and a real campaign budget is approved — this
      file is currently: *"Draft framework — budget, accounts, targets,
      and offers require approval."*
- [ ] Add the Google Ads conversion tag inside the same GTM container as
      GA4 (§3), never as a separate script.

## 6. Google Business Profile

- [ ] Confirm the business is eligible as a real, verified location
      (not a virtual office — `GOOGLE_LIVE_ECOSYSTEM.md`: *"No location,
      branch, or service area may be created merely for SEO"*).
- [ ] Claim/verify the profile under an individual manager account
      (never a shared password).
- [ ] Record the correct Place ID once verified.
- [ ] Use only the Approved contact facts from
      `02_BRAND/CONTACT_INFORMATION.md` — do not enter Pending fields.

**Not built in this ticket**: an embedded live Google Map component.
`GOOGLE_LIVE_ECOSYSTEM.md` gates that behind a restricted Google Cloud
API key with budgets/alerts — real, if usage-based, cost — which this
ticket's "no unnecessary paid subscriptions" rule means I won't
introduce speculatively. Build it once the Business Profile (this
section) and a budgeted Cloud project both exist.

### 6a. Reviews — manual, verified curation (JOB-AGT-WEB-20260726-M4.7)

The website's Reviews section (`src/lib/catalog/reviews.ts`,
`src/components/reviews-section.tsx`) is built to show *only* reviews
the owner has personally copied in — it does not call any Google API,
so there is nothing to bill or authenticate. Once the Business Profile
above is live and has real reviews on it:

- [ ] For each review to feature, copy from the live Google Business
      Profile listing (never invent or paraphrase): the reviewer's
      displayed name, their star rating (1–5), the review text
      verbatim, the publish date, and the review's own permalink
      (open the review on Google, copy its URL — this is what
      `sourceUrl` should be).
- [ ] Add one entry per review to the `VERIFIED_REVIEWS` array in
      `src/lib/catalog/reviews.ts`, matching the existing `Review` type
      (`source` is always the literal `"google-business-profile"` —
      there is no other value to represent a review that wasn't
      actually sourced from there).
- [ ] Leave `sourceUrl` unset only if a direct permalink genuinely isn't
      available — when set, the site renders a "View on Google" /
      "عرض على جوجل" link next to the review so visitors can verify it
      themselves.
- [ ] Do not add a review until it is confirmed live and public on the
      profile. Removing a review from Google means removing it from
      `VERIFIED_REVIEWS` too.

**What's already built:** `ReviewsSection` renders nothing at all while
`VERIFIED_REVIEWS` is empty (true today) and emits no
`Organization`/`AggregateRating`/`Review` schema until real entries
exist — the aggregate rating shown is always computed from the exact
reviews rendered, never a separately-entered number. A live Google
Maps/Places API integration was deliberately **not** built for this —
see the cost note above; this manual path has zero ongoing cost and
keeps every displayed review individually traceable back to a real,
public Google review.

## 7. Cost note

Search Console, GTM, and GA4 are free. Google Ads is spend-based (gated
behind Paid Media Strategy approval, §5). Maps/Places API is Google
Cloud usage-based billing, not a flat subscription, but still real cost
— flagged here so it isn't accidentally treated as "free tier."

---

**Release Gate reproduced from `GOOGLE_LIVE_ECOSYSTEM.md` for
convenience:**

- [ ] Legal business owner and authorized Google managers are confirmed.
- [ ] NAP and service-area data are approved.
- [ ] Business Profile eligibility and status are confirmed.
- [ ] Correct Place ID is recorded.
- [ ] Search Console domain ownership is verified.
- [ ] API keys are restricted and budgets/alerts are active.
- [ ] Map has an accessible text and external-link fallback.
- [ ] Reviews are authentic, attributed, current, and policy-compliant.
- [ ] Consent Mode and Tag Assistant tests pass.
- [ ] No personal address appears in page URLs or analytics payloads.
- [ ] Booking address and coverage decisions remain separate.
- [ ] Page speed and Core Web Vitals remain acceptable.
- [ ] Failure and rollback procedures are tested.
