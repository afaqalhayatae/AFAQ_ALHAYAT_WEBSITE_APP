# Email Sending Domain & DNS Readiness Runbook

**JOB-AGT-WEB-20260726-M4.6 — Marketing Email & Launch Foundation**

This expands `10_MARKETING_AND_SEO/EMAIL_MARKETING.md`'s Technical
Readiness and Launch Gate sections into actionable steps. **No DNS
record has been changed and no ESP has been chosen or contacted** — this
is a handoff runbook for the domain owner (Hostinger DNS access
required), per `AUTONOMY_AND_APPROVAL_MATRIX.md`: *"Change credentials,
DNS, hosting, or security — A4, every action."*

> Per `EMAIL_MARKETING.md`: *"No campaign may launch from an
> unauthenticated or placeholder domain."* Nothing below should be
> treated as done until every step is actually verified against a real
> DNS lookup.

## 1. Choose an ESP first (owner decision — none is pre-selected)

No email service provider is named or adopted anywhere in the knowledge
base. Per this ticket's rule ("no unnecessary paid subscriptions, use
free tiers where appropriate"), evaluate free-tier-eligible options
before committing to a paid plan — for example (not an endorsement, just
starting points to research and compare against current pricing/limits):

- A provider with a free tier sized for the expected list size at launch.
- Confirm whichever provider is chosen supports: SPF/DKIM/DMARC
  configuration, TLS-only sending, bounce/complaint/suppression
  handling, and one-click unsubscribe — all required by
  `EMAIL_MARKETING.md`'s Technical Readiness section regardless of
  vendor.

## 2. SPF (Sender Policy Framework)

A TXT record on the sending domain (or subdomain, e.g. `mail.afaqalhayatae.com`)
listing which mail servers are authorized to send as that domain.
General shape (the ESP's own setup docs give the exact value to use):

```
Type: TXT
Host: @ (or the sending subdomain)
Value: v=spf1 include:<esp-provided-include> ~all
```

Do not add more than one SPF record per domain — if a record already
exists, merge the `include:` mechanisms into it instead of creating a
second TXT record (multiple SPF records break validation).

## 3. DKIM (DomainKeys Identified Mail)

The ESP generates a public/private key pair and gives you a CNAME or TXT
record to add — this cannot be authored in advance because the key is
specific to the chosen ESP. General shape:

```
Type: CNAME (most ESPs) or TXT
Host: <esp-provided-selector>._domainkey
Value: <esp-provided-value>
```

## 4. DMARC (Domain-based Message Authentication, Reporting & Conformance)

Start in monitor-only mode so nothing gets silently rejected while
SPF/DKIM are still being verified, then tighten once alignment is
confirmed passing:

```
Type: TXT
Host: _dmarc
Value: v=DMARC1; p=none; rua=mailto:<an-inbox-you-actually-monitor>
```

After a monitoring period with no unexpected failures, move `p=none` to
`p=quarantine` and eventually `p=reject` — this is standard email
deliverability practice, not a claim about this domain's current state.

## 5. TLS, bounce/complaint handling, unsubscribe

- Confirm the chosen ESP sends over TLS by default (nearly all
  reputable ESPs do — verify, don't assume).
- Configure bounce, complaint, and suppression-list handling in the
  ESP's dashboard so hard bounces and spam complaints stop future sends
  automatically.
- Every marketing email needs a visible, working unsubscribe link and
  should support one-click unsubscribe (RFC 8058) where the ESP offers it.
- Connect Google Postmaster Tools for the sending domain once volume is
  meaningful, per `EMAIL_MARKETING.md`.

## 6. Verify before the first real send

Use any DNS-lookup tool (`dig txt afaqalhayatae.com`, or the ESP's own
built-in domain-verification check) to confirm SPF/DKIM/DMARC all
resolve and pass alignment **before** sending a single real campaign.
Send a test email to a mail-tester-style service and confirm a clean
authentication result.

## 7. Consent & audience rules (already enforced in-app)

This repo already records newsletter consent through the approved
`Consent` API (`src/components/newsletter-form.tsx` → `/api/consents`),
satisfying `EMAIL_MARKETING.md`'s Audience Rules: consent is only ever
recorded from an explicit checkbox with retained wording, source, and
timestamp; nothing here purchases, rents, or scrapes a list.

---

**Launch Gate reproduced from `EMAIL_MARKETING.md` for convenience:**

- [ ] Sending domain and provider are approved.
- [ ] SPF, DKIM, DMARC, TLS, and alignment pass.
- [ ] Consent and suppression records are operational.
- [ ] Privacy and unsubscribe workflows are tested.
- [ ] Canonical contact details are verified.
- [ ] Arabic and English templates pass inbox tests.
- [ ] Links, analytics, and conversion events pass.
- [ ] Test emails have been reviewed on mobile and desktop.
- [ ] Journey owner and emergency pause control are assigned.
- [ ] No Draft, HOLD, or Unverified fact can enter a send.
