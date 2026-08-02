import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";
import { BLOG_POSTS } from "@/lib/catalog/blog";

describe("sitemap", () => {
  it("excludes temporary demo blog posts", () => {
    const entries = sitemap();
    for (const post of BLOG_POSTS.filter((candidate) => candidate.isDemo)) {
      expect(entries.some((entry) => entry.url.includes(`/blog/${post.slug}`))).toBe(false);
    }
  });

  it("adds a city-SEO page for each published CITY_SERVICE_CONTENT combo, and no legacy /services/[slug]/[location] page", () => {
    const entries = sitemap();
    expect(
      entries.some((entry) => entry.url === "https://afaqalhayatae.com/en/services/maintenance/ac-maintenance/dubai")
    ).toBe(true);
    expect(
      entries.some((entry) => entry.url === "https://afaqalhayatae.com/en/services/pest-control/cockroach-control/sharjah")
    ).toBe(true);
    expect(entries.some((entry) => entry.url.includes("/services/ac-maintenance/dubai"))).toBe(false);
  });

  it("includes the legal pages for both locales with hreflang alternates", () => {
    const entries = sitemap();

    for (const path of ["privacy-policy", "terms-and-conditions", "cookie-policy"]) {
      const en = entries.find((entry) => entry.url === `https://afaqalhayatae.com/en/${path}`);
      const ar = entries.find((entry) => entry.url === `https://afaqalhayatae.com/ar/${path}`);
      expect(en).toBeDefined();
      expect(ar).toBeDefined();
      expect(en?.alternates?.languages).toMatchObject({
        en: `https://afaqalhayatae.com/en/${path}`,
        ar: `https://afaqalhayatae.com/ar/${path}`,
      });
    }
  });
});
