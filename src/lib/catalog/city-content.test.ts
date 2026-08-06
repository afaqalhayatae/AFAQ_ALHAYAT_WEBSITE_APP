import { describe, expect, it } from "vitest";
import {
  CITY_SERVICE_CONTENT,
  CITY_SECTION_CONTENT,
  getCityServiceContent,
  getCitySectionContent,
  isCityPagePublishReady,
  isCitySectionPublishReady,
} from "./city-content";

describe("city-content", () => {
  it("has real content for the published batches (2026-08-02 through -08-06 passes), section registry still empty", () => {
    expect(Object.keys(CITY_SERVICE_CONTENT)).toHaveLength(140);
    expect(Object.keys(CITY_SECTION_CONTENT)).toHaveLength(0);
  });

  it("resolves the published combos and returns undefined for any combo with no content yet", () => {
    expect(getCityServiceContent("ac-maintenance", "dubai")).toBeDefined();
    expect(getCityServiceContent("plumbing", "sharjah")).toBeDefined();
    expect(getCityServiceContent("plumbing", "dubai")).toBeDefined();
    expect(getCityServiceContent("cockroach-control", "sharjah")).toBeDefined();
    expect(getCityServiceContent("general-cleaning", "abu-dhabi")).toBeDefined();
    expect(getCityServiceContent("painting", "dubai")).toBeDefined();
    // ac-maintenance, plumbing, electrical-maintenance, general-cleaning,
    // painting, handyman, drain-unblocking, waterproofing, water-leak-detection,
    // deep-cleaning, water-tank-cleaning, villa-cleaning, office-cleaning,
    // post-construction-cleaning, carpet-upholstery-cleaning, cockroach-control,
    // ant-control, bed-bug-control, termite-control, and rodent-control now
    // have full 7-emirate coverage (2026-08-05/06 local SEO expansion
    // phases) — mosquito-control has no entries at all yet.
    expect(getCityServiceContent("mosquito-control", "dubai")).toBeUndefined();
    expect(getCitySectionContent("maintenance", "dubai")).toBeUndefined();
  });

  describe("isCityPagePublishReady", () => {
    it("is true for a content-complete catalog service with real city copy", () => {
      expect(isCityPagePublishReady("ac-maintenance", "dubai")).toBe(true);
      expect(isCityPagePublishReady("plumbing", "sharjah")).toBe(true);
      expect(isCityPagePublishReady("general-cleaning", "abu-dhabi")).toBe(true);
    });

    it("is true for a real, Owner-approved pest sub-service with real city copy", () => {
      expect(isCityPagePublishReady("cockroach-control", "sharjah")).toBe(true);
      expect(isCityPagePublishReady("ant-control", "dubai")).toBe(true);
      expect(isCityPagePublishReady("bed-bug-control", "fujairah")).toBe(true);
    });

    it("is false when there is no city copy at all, regardless of service approval", () => {
      expect(isCityPagePublishReady("ac-maintenance", "not-a-real-city")).toBe(false);
      expect(isCityPagePublishReady("mosquito-control", "dubai")).toBe(false);
    });

    it("is false for a not-yet-approved slug even if city copy existed for it", () => {
      // cctv-installation is structural-only (not in APPROVED_SERVICE_CONTENT_SLUGS)
      // and not a pest-control-pages.ts id, so it can never pass either branch.
      expect(isCityPagePublishReady("cctv-installation", "dubai")).toBe(false);
    });
  });

  describe("isCitySectionPublishReady", () => {
    it("is false for every combination while CITY_SECTION_CONTENT stays empty", () => {
      expect(isCitySectionPublishReady("maintenance", "dubai")).toBe(false);
      expect(isCitySectionPublishReady("pest-control", "dubai")).toBe(false);
    });
  });
});
