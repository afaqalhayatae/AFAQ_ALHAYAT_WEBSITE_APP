import { describe, expect, it } from "vitest";
import CleaningCityPage, { generateStaticParams } from "./page";

/**
 * CITY_SECTION_CONTENT is genuinely empty today (see
 * src/lib/catalog/city-content.ts) — these tests run against the real
 * registry to confirm the route publishes zero pages and hard-404s until
 * real content is added. Full render-pipeline coverage (with a mocked
 * fixture) lives on the maintenance equivalent of this route.
 */
describe("CleaningCityPage", () => {
  it("generates no static params while the city-content registry is empty", () => {
    expect(generateStaticParams()).toEqual([]);
  });

  it("404s for any city", async () => {
    await expect(
      CleaningCityPage({ params: Promise.resolve({ locale: "en", city: "dubai" }) })
    ).rejects.toThrow();
  });

  it("404s for an unsupported locale", async () => {
    await expect(
      CleaningCityPage({ params: Promise.resolve({ locale: "fr", city: "dubai" }) })
    ).rejects.toThrow();
  });
});
