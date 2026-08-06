import { describe, expect, it } from "vitest";
import { buildCityServiceMetadata, buildCitySectionMetadata } from "./city-page-metadata";

describe("buildCityServiceMetadata", () => {
  it("is indexable for a real page whose underlying service has cleared its own approval gate (SEO_REALITY_MAP.md §5 Priority 1/3 fix)", () => {
    const metadata = buildCityServiceMetadata("en", "ac-maintenance", "dubai", "services/maintenance");
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });

  it("is indexable for a real pest sub-service city page", () => {
    const metadata = buildCityServiceMetadata(
      "en",
      "cockroach-control",
      "sharjah",
      "services/pest-control"
    );
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });

  it("returns empty metadata (no page) when there is no city copy at all", () => {
    expect(
      buildCityServiceMetadata("en", "mosquito-control", "dubai", "services/pest-control")
    ).toEqual({});
  });
});

describe("buildCitySectionMetadata", () => {
  it("returns empty metadata while CITY_SECTION_CONTENT stays empty", () => {
    expect(buildCitySectionMetadata("en", "maintenance", "dubai", "services/maintenance")).toEqual(
      {}
    );
  });
});
