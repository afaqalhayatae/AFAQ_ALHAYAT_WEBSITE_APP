import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
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
