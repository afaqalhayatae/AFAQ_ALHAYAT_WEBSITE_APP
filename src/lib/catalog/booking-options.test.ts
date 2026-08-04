import { describe, expect, it } from "vitest";
import {
  getCategoryForServiceSlug,
  getServicesForCategory,
  PEST_TYPES,
} from "./booking-options";

describe("getCategoryForServiceSlug", () => {
  it("resolves the 4 previously-unbooked content-complete cleaning services (SEO_REALITY_MAP.md §3 fix)", () => {
    expect(getCategoryForServiceSlug("villa-cleaning")).toBe("cleaning");
    expect(getCategoryForServiceSlug("office-cleaning")).toBe("cleaning");
    expect(getCategoryForServiceSlug("post-construction-cleaning")).toBe("cleaning");
    expect(getCategoryForServiceSlug("carpet-upholstery-cleaning")).toBe("cleaning");
  });

  it("still resolves every pre-existing mapped slug", () => {
    expect(getCategoryForServiceSlug("ac-maintenance")).toBe("maintenance");
    expect(getCategoryForServiceSlug("general-cleaning")).toBe("cleaning");
    expect(getCategoryForServiceSlug("pest-control")).toBe("pest-control");
  });

  it("returns null for a structural-only service not offered for booking", () => {
    expect(getCategoryForServiceSlug("cctv-installation")).toBeNull();
  });
});

describe("getServicesForCategory", () => {
  it("includes all 7 cleaning services (3 original + 4 fixed) under the cleaning category", () => {
    const slugs = getServicesForCategory("cleaning").map((service) => service.slug);
    expect(slugs).toEqual(
      expect.arrayContaining([
        "general-cleaning",
        "deep-cleaning",
        "water-tank-cleaning",
        "villa-cleaning",
        "office-cleaning",
        "post-construction-cleaning",
        "carpet-upholstery-cleaning",
      ])
    );
  });
});

describe("PEST_TYPES", () => {
  it("covers all 11 real pest-control-pages.ts sub-services plus the general option (SEO_REALITY_MAP.md §3 fix)", () => {
    expect(PEST_TYPES).toEqual([
      "general",
      "cockroach",
      "ant",
      "rodent",
      "termite",
      "bed-bug",
      "snake",
      "mosquito",
      "wasp",
      "bird",
      "gecko",
      "home-pest-prevention",
    ]);
  });
});
