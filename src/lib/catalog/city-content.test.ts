import { describe, expect, it } from "vitest";
import {
  CITY_SERVICE_CONTENT,
  CITY_SECTION_CONTENT,
  getCityServiceContent,
  getCitySectionContent,
} from "./city-content";

describe("city-content", () => {
  it("has real content for the published batches (2026-08-02 through -08-05 passes), section registry still empty", () => {
    expect(Object.keys(CITY_SERVICE_CONTENT)).toHaveLength(57);
    expect(Object.keys(CITY_SECTION_CONTENT)).toHaveLength(0);
  });

  it("resolves the published combos and returns undefined for any combo with no content yet", () => {
    expect(getCityServiceContent("ac-maintenance", "dubai")).toBeDefined();
    expect(getCityServiceContent("plumbing", "sharjah")).toBeDefined();
    expect(getCityServiceContent("plumbing", "dubai")).toBeDefined();
    expect(getCityServiceContent("cockroach-control", "sharjah")).toBeDefined();
    expect(getCityServiceContent("general-cleaning", "abu-dhabi")).toBeDefined();
    // ac-maintenance, plumbing, electrical-maintenance, general-cleaning,
    // cockroach-control, ant-control, bed-bug-control, and termite-control
    // now have full 7-emirate coverage (2026-08-05 local SEO expansion
    // phase) — painting and mosquito-control have no entries at all yet.
    expect(getCityServiceContent("painting", "dubai")).toBeUndefined();
    expect(getCityServiceContent("mosquito-control", "dubai")).toBeUndefined();
    expect(getCitySectionContent("maintenance", "dubai")).toBeUndefined();
  });
});
