#!/usr/bin/env node
/**
 * Standalone IndexNow submission script (2026-08-06) — run after
 * publishing new/changed pages to notify Bing/Yandex/etc. faster than
 * their normal crawl cycle. Google does not participate in IndexNow (see
 * src/lib/seo/indexnow.ts's comment) — this only affects the engines that
 * actually support the protocol.
 *
 * Usage:
 *   node scripts/submit-indexnow.mjs /en/blog/some-new-post /ar/blog/some-new-post
 *   node scripts/submit-indexnow.mjs --sitemap   # submits every URL in sitemap.xml
 *
 * Constants below are kept in sync with src/lib/seo/indexnow.ts by hand
 * (this script deliberately has no build step / TS import, so it can run
 * with plain `node` in any environment, including a deploy hook).
 */
const SITE_URL = "https://afaqalhayatae.com";
// Must match src/lib/seo/indexnow.ts's INDEXNOW_KEY exactly — the real
// key already hosted at public/{key}.txt since the 2026-08-04 readiness pass.
const INDEXNOW_KEY = "0feb6df0799313dc5eccfc6493e895b5";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

async function urlsFromSitemap() {
  const res = await fetch(`${SITE_URL}/sitemap.xml`);
  if (!res.ok) throw new Error(`Failed to fetch sitemap.xml: ${res.status}`);
  const xml = await res.text();
  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)];
  return matches.map((m) => m[1]);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("Usage: node scripts/submit-indexnow.mjs <url> [<url> ...] | --sitemap");
    process.exit(1);
  }

  const urls = args[0] === "--sitemap" ? await urlsFromSitemap() : args;
  const absoluteUrls = urls.map((u) => (u.startsWith("http") ? u : `${SITE_URL}${u}`));

  console.log(`Submitting ${absoluteUrls.length} URL(s) to IndexNow...`);

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(SITE_URL).host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: absoluteUrls,
    }),
  });

  if (response.ok || response.status === 202) {
    console.log(`Done — IndexNow accepted the submission (status ${response.status}).`);
  } else {
    console.error(`IndexNow rejected the submission: ${response.status} ${await response.text()}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
