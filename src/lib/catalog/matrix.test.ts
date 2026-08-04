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

  it("is false for a structural-only service even though isActive is true", () => {
    expect(isActive("cctv-installation", "dubai")).toBe(true);
    expect(isPublishReady("cctv-installation", "dubai")).toBe(false);
  });

  it("is false for an unknown location even if the service is content-complete", () => {
    expect(isPublishReady("ac-maintenance", "not-a-real-location")).toBe(false);
  });
});
