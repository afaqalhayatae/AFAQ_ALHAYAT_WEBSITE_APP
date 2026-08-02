# Hostinger Migration Runbook

**JOB-AGT-WEB-20260726-M4.7 — Safe Production Migration to Hostinger**

**Owner-executed only.** I (the AI agent working in this repo) have no
access to the Hostinger account, its file manager, its database, its
DNS records, or the domain registrar — none of that is reachable from
this codebase, and this project's own governance requires an explicit
human gate for all of it regardless
(`00_GOVERNANCE/AUTONOMY_AND_APPROVAL_MATRIX.md`: *"Delete, overwrite,
or irreversibly migrate data — A4 — every action plus backup
evidence"*; *"Change credentials, DNS, hosting, or security — A4, every
action."*). This document is a precise checklist for the person who
does have that access — nothing on it has been executed.

**No canonical source identifies a currently-live legacy site.** Every
"legacy" / "WordPress" reference in the knowledge base
(`07_WEBSITE/WORDPRESS/`) is explicitly marked non-canonical research,
never deployed. That is exactly why removal must never be the first
step — Phase A below exists to find out what's actually on the account
before Phase B touches anything.

---

## Phase A — Audit (safe, read-only, do this first)

Nothing in this phase changes or deletes anything. Its output is a
written inventory that Phase B depends on.

1. **File manager inventory**
   - [ ] List everything under `public_html` and any other web roots
         on the account (subdomains often get their own folder).
   - [ ] Note what each top-level folder/file appears to be (a CMS
         install, static files, an old build, unrelated personal
         files, etc.) — don't guess; if it's unclear, leave it alone
         and flag it rather than assuming it's safe to remove.

2. **Installed applications / databases**
   - [ ] Check Hostinger's "Websites" / "Auto Installer" panel for any
         installed application (WordPress, another CMS, a database
         instance) tied to this account or domain.
   - [ ] For each one found, record: what it is, whether it's
         currently reachable at `afaqalhayatae.com` (or a subdomain),
         and its last-modified date if visible.

3. **Subdomains**
   - [ ] List every subdomain currently configured on the account,
         even ones that don't obviously relate to the main site.

4. **Current DNS records**
   - [ ] Export or manually record the full current DNS record set
         (A, AAAA, CNAME, MX, TXT, NS) for `afaqalhayatae.com` before
         anything changes. This is the rollback reference — without it,
         a later DNS mistake has nothing to revert to.
   - [ ] Note the current nameservers (Hostinger's own vs. an external
         DNS provider).

5. **Backups**
   - [ ] Confirm whether Hostinger's automated backups are active on
         this plan (plan-dependent; `TECH_STACK.md` lists this as
         unverified for the actual purchased plan).
   - [ ] Regardless of the above, take a manual backup/export of the
         current account state now, before Phase B — download a copy
         of `public_html` and export any database found in step 2.
         Per the Autonomy Matrix, backup evidence must exist *before*
         any delete/overwrite action, not after.

**Phase A output:** a short written inventory answering — what exists,
what it is, is it confirmed legacy or still unknown, and is a backup of
it in hand. Do not proceed to Phase B for anything not confirmed.

---

## Phase B — Removal (only after Phase A confirms a target, backup in hand)

1. - [ ] Remove **only** what Phase A explicitly identified as legacy/
         superseded. Never a blanket "clear the account" step. If
         Phase A left something as "unknown," it is not a Phase B
         target yet — go back and identify it first.
2. - [ ] Prefer move/archive over hard-delete wherever the control
         panel allows it (e.g., rename `public_html` to
         `public_html_legacy_backup_<date>` or zip it, rather than
         deleting outright) — this keeps a recovery path even after
         "removal."
3. - [ ] After removal, verify `afaqalhayatae.com` still resolves and
         nothing else on the account (mail, other subdomains) was
         affected, before proceeding to deploy anything new.

---

## Deployment approach (new site)

- The app is a standard Next.js server: `npm run build` then
  `npm run start` (both already defined in `package.json`), which
  needs a persistent Node.js process — not static file hosting alone.
- `TECH_STACK.md` confirms Hostinger supports Node.js + MySQL on this
  plan, but still lists the exact deployment method, resource limits,
  region, staging environment, and SSH/CI access as unverified against
  the actual purchased plan — confirm these against the real Hostinger
  hPanel before deploying, they're plan-specific.
- [ ] Confirm the deployment method Hostinger actually offers for this
      plan (Node.js app manager in hPanel, Git-based deploy, or manual
      SSH) and record it here once known.
- [ ] Confirm CI/CD (GitHub Actions, planned per
      `00_GOVERNANCE/CURRENT_PROJECT_STATUS.md`) before relying on
      manual deploys long-term.

## Environment variables

These are the only environment variables this codebase actually reads
today (verified by grepping `process.env` usage in `src/` and
`prisma.config.ts`) — no others are needed, and none are invented here:

| Variable | Purpose | Source |
|---|---|---|
| `DATABASE_URL` | MySQL connection string (Prisma) | Owner-provisioned Hostinger MySQL database — see `.env.example` for the expected format |
| `NEXT_PUBLIC_GTM_CONTAINER_ID` | Enables the Google Tag Manager loader | Owner's real GTM container ID (see `docs/google-ecosystem-setup.md` §2) — unset today, so GTM currently loads nothing |
| `GOOGLE_SITE_VERIFICATION` | Renders the Search Console verification meta tag | Owner's real verification code (see `docs/google-ecosystem-setup.md` §1) — unset today, so nothing renders |

- [ ] Set all three in the production environment before first deploy.
      None of these values are fabricated anywhere in this repo — real
      values must come from the owner's own Hostinger/Google accounts.

## Build requirements

- Node.js version matching what's declared for local development
  (check `.nvmrc` / `engines` if present, otherwise match the Node
  major version used in this repo's dev environment).
- `npm run build` must succeed with the real production
  `DATABASE_URL` reachable at build/start time (Prisma needs a live
  connection).

---

## Domain setup

*(Recorded here for completeness; **no DNS change is made by this
runbook** — every box below is the owner's own action in the registrar
/ Hostinger DNS panel.)*

- [ ] DNS review: compare current records (Phase A, step 4) against
      what's needed for the new deployment target before changing
      anything.
- [ ] SSL/HTTPS: confirm Hostinger's automatic SSL covers both the
      apex domain and `www`.
- [ ] Canonical domain: this codebase already assumes apex
      (`https://afaqalhayatae.com`, no `www`) throughout —
      `metadataBase`, the sitemap, and `buildAlternates` all use the
      apex form. Confirm the DNS/redirect setup matches this assumption
      rather than the reverse.
- [ ] `www` → apex redirect: configure a 301 redirect so `www` visitors
      land on the canonical apex URL, not a duplicate.

---

## Explicitly not in this runbook

- No file is deleted, moved, or modified on the Hostinger account by
  this document — every checkbox is owner-executed.
- No DNS record is changed.
- No credential, ID, or verification code is invented anywhere above —
  every value marked "owner's real X" must come from the actual
  Hostinger/Google account, never guessed or placeholder-filled.
- This runbook does not claim Implementation Readiness Gates 2–5
  (`00_GOVERNANCE/IMPLEMENTATION_READINESS_REPORT.md`) are closed —
  completing Phase A/B here does not by itself authorize production
  deployment; the separate go-live gate in `docs/launch-checklist.md`
  still applies.
