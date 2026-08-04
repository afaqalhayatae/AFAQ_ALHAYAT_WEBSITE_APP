import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { CityContentBlock } from "@/lib/catalog/city-content";

/**
 * TEST FIXTURE — CITY_SERVICE_CONTENT is empty in the real registry (see
 * src/lib/catalog/city-content.ts); this mock stands in one entry so the
 * generateStaticParams/render/notFound wiring can be proven without
 * publishing real content.
 */
const { FIXTURE_SERVICE_CONTENT } = vi.hoisted(() => {
  const content: Record<string, CityContentBlock> = {
    "ac-maintenance:dubai": {
      title: { en: "AC Maintenance in Dubai", ar: "صيانة مكيفات في دبي" },
      h1: { en: "AC Maintenance in Dubai", ar: "صيانة مكيفات في دبي" },
      metaDescription: { en: "Test description.", ar: "وصف تجريبي." },
      intro: { en: "Test intro.", ar: "مقدمة تجريبية." },
      body: [],
      status: "TEST FIXTURE",
    },
  };
  return { FIXTURE_SERVICE_CONTENT: content };
});

vi.mock("@/lib/catalog/city-content", async () => {
  const actual = await vi.importActual<typeof import("@/lib/catalog/city-content")>(
    "@/lib/catalog/city-content"
  );
  return {
    ...actual,
    getCityServiceContent: (serviceSlug: string, citySlug: string) =>
      FIXTURE_SERVICE_CONTENT[`${serviceSlug}:${citySlug}`],
  };
});

import MaintenanceServiceCityPage, { generateStaticParams } from "./page";

describe("MaintenanceServiceCityPage", () => {
  it("generates a static param only for the one service/city combo that has content", () => {
    expect(generateStaticParams()).toEqual([{ slug: "ac-maintenance", city: "dubai" }]);
  });

  it("renders the page for a known service/city combo with content", async () => {
    const element = await MaintenanceServiceCityPage({
      params: Promise.resolve({ locale: "en", slug: "ac-maintenance", city: "dubai" }),
    });
    render(element);

    expect(
      screen.getByRole("heading", { level: 1, name: "AC Maintenance in Dubai" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "AC Maintenance" })).toHaveAttribute(
      "href",
      "/en/services/maintenance/ac-maintenance"
    );
    // Direct booking link, not a generic contact form (SEO_CONTENT_QUALITY_AUDIT.md §4 fix).
    expect(screen.getAllByRole("link", { name: "Request Service" })[0]).toHaveAttribute(
      "href",
      "/en/book?service=ac-maintenance&location=dubai"
    );
  });

  it("404s for a service/city combo with no content yet", async () => {
    await expect(
      MaintenanceServiceCityPage({
        params: Promise.resolve({ locale: "en", slug: "plumbing", city: "dubai" }),
      })
    ).rejects.toThrow();
  });

  it("404s for a service slug outside the maintenance section", async () => {
    await expect(
      MaintenanceServiceCityPage({
        params: Promise.resolve({ locale: "en", slug: "general-cleaning", city: "dubai" }),
      })
    ).rejects.toThrow();
  });

  it("404s for an unsupported locale", async () => {
    await expect(
      MaintenanceServiceCityPage({
        params: Promise.resolve({ locale: "fr", slug: "ac-maintenance", city: "dubai" }),
      })
    ).rejects.toThrow();
  });
});
