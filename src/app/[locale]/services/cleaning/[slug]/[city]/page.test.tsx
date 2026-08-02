import { describe, expect, it } from "vitest";
import CleaningServiceCityPage, { generateStaticParams } from "./page";

/**
 * CITY_SERVICE_CONTENT now has 3 real general-cleaning+city entries
 * (2026-08-03 local-SEO expansion pass) — these tests run against the
 * real registry to confirm the route publishes exactly those combos and
 * still hard-404s for anything else. Full render-pipeline coverage (with
 * a mocked fixture) lives on the maintenance equivalent of this route,
 * since both share the same CityPageContent component and
 * generateStaticParams shape.
 */
describe("CleaningServiceCityPage", () => {
  it("generates a static param for each published cleaning+city combo", () => {
    expect(generateStaticParams()).toEqual(
      expect.arrayContaining([
        { slug: "general-cleaning", city: "dubai" },
        { slug: "general-cleaning", city: "abu-dhabi" },
        { slug: "general-cleaning", city: "sharjah" },
      ])
    );
    expect(generateStaticParams()).toHaveLength(7);
  });

  it("404s for a service/city combo with no content yet", async () => {
    await expect(
      CleaningServiceCityPage({
        params: Promise.resolve({ locale: "en", slug: "deep-cleaning", city: "dubai" }),
      })
    ).rejects.toThrow();
  });

  it("404s for an unsupported locale", async () => {
    await expect(
      CleaningServiceCityPage({
        params: Promise.resolve({ locale: "fr", slug: "general-cleaning", city: "dubai" }),
      })
    ).rejects.toThrow();
  });
});
