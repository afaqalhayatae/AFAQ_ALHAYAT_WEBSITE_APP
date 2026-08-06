import { describe, expect, it } from "vitest";
import PestControlSubServiceCityPage, { generateStaticParams } from "./page";

/**
 * CITY_SERVICE_CONTENT now has 7 real pest-type+city entries (2026-08-02
 * + 2026-08-03 passes) — these tests run against the real registry to
 * confirm the route publishes exactly those combos and still hard-404s
 * for anything else. Full render-pipeline coverage (with a mocked
 * fixture) lives on the maintenance service-city route, since both share
 * the same CityPageContent component and generateStaticParams shape.
 */
describe("PestControlSubServiceCityPage", () => {
  it("generates a static param for each published pest-type+city combo", () => {
    expect(generateStaticParams()).toEqual(
      expect.arrayContaining([
        { subService: "cockroach-control", city: "sharjah" },
        { subService: "ant-control", city: "dubai" },
        { subService: "bed-bug-control", city: "abu-dhabi" },
        { subService: "termite-control", city: "ajman" },
        { subService: "termite-control", city: "dubai" },
        { subService: "cockroach-control", city: "abu-dhabi" },
        { subService: "ant-control", city: "sharjah" },
      ])
    );
    expect(generateStaticParams()).toHaveLength(35);
  });

  it("404s for any sub-service/city combo with no content yet", async () => {
    // cockroach-control, ant-control, bed-bug-control, and termite-control
    // now have full 7-emirate coverage (2026-08-05 local SEO expansion
    // phase) — mosquito-control has no entries at all yet.
    await expect(
      PestControlSubServiceCityPage({
        params: Promise.resolve({ locale: "en", subService: "mosquito-control", city: "dubai" }),
      })
    ).rejects.toThrow();
  });

  it("404s for an unsupported locale", async () => {
    await expect(
      PestControlSubServiceCityPage({
        params: Promise.resolve({ locale: "fr", subService: "cockroach-control", city: "dubai" }),
      })
    ).rejects.toThrow();
  });
});
