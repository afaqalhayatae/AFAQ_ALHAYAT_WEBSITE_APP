import { describe, expect, it } from "vitest";
import { getRelatedServices } from "./service-relationships";
import { SERVICES } from "./services";

const VALID_IDS = new Set(SERVICES.map((service) => service.id));

describe("getRelatedServices", () => {
  it("returns the confirmed cross-sell edge for AC Maintenance -> Electrical Maintenance", () => {
    const related = getRelatedServices("SVC-AC-MAINTENANCE");
    expect(related.some((service) => service.id === "SVC-ELECTRICAL-MAINTENANCE")).toBe(true);
  });

  it("is bidirectional — Electrical Maintenance also lists AC Maintenance back", () => {
    const related = getRelatedServices("SVC-ELECTRICAL-MAINTENANCE");
    expect(related.some((service) => service.id === "SVC-AC-MAINTENANCE")).toBe(true);
  });

  it("returns General Cleaning's two confirmed Related edges (Deep Cleaning, Pest Control)", () => {
    const related = getRelatedServices("SVC-GENERAL-CLEANING").map((service) => service.id);
    expect(related).toContain("SVC-DEEP-CLEANING");
    expect(related).toContain("SVC-PEST-CONTROL");
  });

  it("returns an empty list for a service with no confirmed relationship (e.g. a structural-only expansion service)", () => {
    expect(getRelatedServices("SVC-CCTV-INSTALLATION")).toEqual([]);
  });

  it("never returns a service id that doesn't exist in the current catalog", () => {
    const allIds = SERVICES.flatMap((service) => getRelatedServices(service.id).map((r) => r.id));
    for (const id of allIds) {
      expect(VALID_IDS.has(id)).toBe(true);
    }
  });
});
