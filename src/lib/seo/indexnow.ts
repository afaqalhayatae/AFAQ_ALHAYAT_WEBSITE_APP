/**
 * IndexNow (Search Engine Ecosystem pass, 2026-08-04 — key generated and
 * hosted; 2026-08-06 — actual submission wired in, per Owner request).
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
 * Honesty note: Google does not participate in IndexNow (confirmed
 * publicly by Google's own Search Central team) — there is no public,
 * unrestricted API for "instant" Google indexing of ordinary content.
 * Google's official Indexing API is restricted by their own policy to
 * JobPosting/BroadcastEvent structured data, which doesn't apply here.
 * The real, honest lever for Google specifically stays what it already
 * is: a correct, current sitemap.xml (already implemented) plus Search
 * Console requesting a manual crawl — this module doesn't claim more
 * than IndexNow actually delivers.
 */
import { SITE_URL } from "@/lib/brand/links";

export const INDEXNOW_KEY = "0feb6df0799313dc5eccfc6493e895b5";

export const INDEXNOW_KEY_LOCATION = `https://afaqalhayatae.com/${INDEXNOW_KEY}.txt`;

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

export type IndexNowResult =
  | { ok: true; submitted: number }
  | { ok: false; status: number; error: string };

/**
 * Submits a batch of absolute or relative URLs to IndexNow. Relative
 * paths are resolved against SITE_URL. IndexNow accepts up to 10,000
 * URLs per request; this doesn't chunk beyond that since no caller here
 * approaches that volume.
 */
export async function submitToIndexNow(urls: string[]): Promise<IndexNowResult> {
  if (urls.length === 0) return { ok: true, submitted: 0 };

  const absoluteUrls = urls.map((url) => (url.startsWith("http") ? url : `${SITE_URL}${url}`));
  const host = new URL(SITE_URL).host;

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: INDEXNOW_KEY_LOCATION,
        urlList: absoluteUrls,
      }),
    });

    // IndexNow returns 200 or 202 on success — no response body to parse.
    if (response.ok || response.status === 202) {
      return { ok: true, submitted: absoluteUrls.length };
    }
    return { ok: false, status: response.status, error: await response.text() };
  } catch (err) {
    return { ok: false, status: 0, error: err instanceof Error ? err.message : String(err) };
  }
}
