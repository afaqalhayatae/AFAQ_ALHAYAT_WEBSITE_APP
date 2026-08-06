import { describe, expect, it } from "vitest";
import { isActive, isPublishReady } from "./matrix";
import { APPROVED_SERVICE_CONTENT_SLUGS } from "./service-content";
import { SERVICES } from "./services";
import { LOCATIONS } from "./locations";

describe("isActive", () => {
  it("is unchanged: still true for every structurally valid service+location pair", () => {
    for (const service of SERVICES) {
      for (const location of LOCATIONS) {
        expect(isActive(service.slug, location.slug)).toBe(true);
      }
    }
  });

  it("is false for an unknown service or location slug", () => {
    expect(isActive("not-a-real-service", "dubai")).toBe(false);
    expect(isActive("ac-maintenance", "not-a-real-location")).toBe(false);
  });
});

describe("isPublishReady", () => {
  it("is true only for the 16 content-complete services, across every approved emirate", () => {
    for (const service of SERVICES) {
      for (const location of LOCATIONS) {
        const expected = APPROVED_SERVICE_CONTENT_SLUGS.includes(service.slug);
        expect(isPublishReady(service.slug, location.slug)).toBe(expected);
      }
    }
  });

  // The "structural-only service, isActive true but isPublishReady false"
  // case this dedicated test used to demonstrate (cctv-installation) no
  // longer exists in real data — 2026-08-06, the Owner approved publishing
  // every catalog service with ready content, so all 27 are now in
  // APPROVED_SERVICE_CONTENT_SLUGS. The gate itself is still fully
  // covered by the comprehensive loop test above (line 23), which would
  // catch a regression the moment a new service is added to SERVICES
  // without a matching content approval.

  it("is false for an unknown location even if the service is content-complete", () => {
    expect(isPublishReady("ac-maintenance", "not-a-real-location")).toBe(false);
  });
});
