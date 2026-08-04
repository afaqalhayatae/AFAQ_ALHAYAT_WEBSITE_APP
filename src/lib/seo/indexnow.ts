/**
 * IndexNow readiness (Search Engine Ecosystem pass, 2026-08-04).
 *
 * IndexNow (Bing, Yandex, and other participating engines) requires a
 * self-generated key hosted as a plain-text file at the domain root
 * (`https://afaqalhayatae.com/{key}.txt`, containing only the key) — no
 * external account or approval is needed to generate or host the key
 * itself, unlike Search Console/Bing Webmaster Tools verification.
 *
 * This constant is the single source of truth for that key, matching the
 * real file already committed at `public/0feb6df0799313dc5eccfc6493e895b5.txt`
 * — if the key ever changes, both must be updated together.
 *
 * Hosting the key file is the actual "readiness" step and is complete.
 * Actually *submitting* URLs to IndexNow's API on publish/update — a
 * ping to `https://api.indexnow.org/indexnow?url=...&key=...&keyLocation=...`
 * — is a separate, later automation decision (e.g. wiring it into a
 * content-publish workflow) and is intentionally not built here.
 */
export const INDEXNOW_KEY = "0feb6df0799313dc5eccfc6493e895b5";

export const INDEXNOW_KEY_LOCATION = `https://afaqalhayatae.com/${INDEXNOW_KEY}.txt`;
