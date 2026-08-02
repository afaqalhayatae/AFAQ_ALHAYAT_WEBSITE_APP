import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { CityContentBlock } from "@/lib/catalog/city-content";

/**
 * TEST FIXTURE — CITY_SECTION_CONTENT/CITY_SERVICE_CONTENT are empty in
 * the real registry (see src/lib/catalog/city-content.ts); this mock
 * stands in one section entry and one service entry so the internal
 * "section page links to service pages in the same city" chain can be
 * proven without publishing real content.
 */
const { FIXTURE_SECTION_CONTENT, FIXTURE_SERVICE_CONTENT } = vi.hoisted(() => {
  const sectionContent: Record<string, CityContentBlock> = {
    "maintenance:dubai": {
      title: { en: "Home Maintenance in Dubai", ar: "صيانة المنازل في دبي" },
      h1: { en: "Home Maintenance in Dubai", ar: "صيانة المنازل في دبي" },
      metaDescription: { en: "Test description.", ar: "وصف تجريبي." },
      intro: { en: "Test intro.", ar: "مقدمة تجريبية." },
      body: [],
      status: "TEST FIXTURE",
    },
  };
  const serviceContent: Record<string, CityContentBlock> = {
    "ac-maintenance:dubai": {
      title: { en: "AC Maintenance in Dubai", ar: "صيانة مكيفات في دبي" },
      h1: { en: "AC Maintenance in Dubai", ar: "صيانة مكيفات في دبي" },
      metaDescription: { en: "Test description.", ar: "وصف تجريبي." },
      intro: { en: "Test intro.", ar: "مقدمة تجريبية." },
      body: [],
      status: "TEST FIXTURE",
    },
  };
  return { FIXTURE_SECTION_CONTENT: sectionContent, FIXTURE_SERVICE_CONTENT: serviceContent };
});

vi.mock("@/lib/catalog/city-content", async () => {
  const actual = await vi.importActual<typeof import("@/lib/catalog/city-content")>(
    "@/lib/catalog/city-content"
  );
  return {
    ...actual,
    getCitySectionContent: (section: string, citySlug: string) =>
      FIXTURE_SECTION_CONTENT[`${section}:${citySlug}`],
    getCityServiceContent: (serviceSlug: string, citySlug: string) =>
      FIXTURE_SERVICE_CONTENT[`${serviceSlug}:${citySlug}`],
  };
});

import MaintenanceCityPage, { generateStaticParams } from "./page";

describe("MaintenanceCityPage", () => {
  it("generates a static param only for a city that has section-level content", () => {
    expect(generateStaticParams()).toEqual([{ city: "dubai" }]);
  });

  it("renders the section page and links to the one related service that also has city content", async () => {
    const element = await MaintenanceCityPage({
      params: Promise.resolve({ locale: "en", city: "dubai" }),
    });
    render(element);

    expect(
      screen.getByRole("heading", { level: 1, name: "Home Maintenance in Dubai" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "AC Maintenance" })).toHaveAttribute(
      "href",
      "/en/services/maintenance/ac-maintenance/dubai"
    );
  });

  it("404s for a city with no section-level content yet", async () => {
    await expect(
      MaintenanceCityPage({ params: Promise.resolve({ locale: "en", city: "abu-dhabi" }) })
    ).rejects.toThrow();
  });

  it("404s for an unsupported locale", async () => {
    await expect(
      MaintenanceCityPage({ params: Promise.resolve({ locale: "fr", city: "dubai" }) })
    ).rejects.toThrow();
  });
});
