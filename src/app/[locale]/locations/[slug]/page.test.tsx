import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import LocationDetailPage, { generateStaticParams } from "./page";
import { getMessages, getServiceEntry } from "@/i18n/get-messages";
import { SERVICES } from "@/lib/catalog/services";

describe("LocationDetailPage", () => {
  it("generates a static param for every registered location (all 7 emirates, 2026-08-02 content-integration pass)", () => {
    expect(generateStaticParams()).toEqual([
      { slug: "dubai" },
      { slug: "abu-dhabi" },
      { slug: "sharjah" },
      { slug: "ajman" },
      { slug: "umm-al-quwain" },
      { slug: "ras-al-khaimah" },
      { slug: "fujairah" },
    ]);
  });

  it("renders the Dubai hub with links to every service x Dubai combo page", async () => {
    const element = await LocationDetailPage({
      params: Promise.resolve({ locale: "en", slug: "dubai" }),
    });
    render(element);

    const t = getMessages("en");
    expect(
      screen.getByRole("heading", { level: 1, name: t.locations.dubai.title })
    ).toBeInTheDocument();

    // ac-maintenance, plumbing, and general-cleaning now have real
    // canonical Dubai city pages (2026-08-02 + 2026-08-03 passes), so
    // they resolve to the new URL instead of the legacy one.
    const canonicalDubaiHrefs: Record<string, string> = {
      "ac-maintenance": "/en/services/maintenance/ac-maintenance/dubai",
      plumbing: "/en/services/maintenance/plumbing/dubai",
      "electrical-maintenance": "/en/services/maintenance/electrical-maintenance/dubai",
      "general-cleaning": "/en/services/cleaning/general-cleaning/dubai",
    };

    for (const service of SERVICES) {
      const entry = getServiceEntry(t, service.slug);
      const expectedHref = canonicalDubaiHrefs[service.slug] ?? `/en/services/${service.slug}/dubai`;
      expect(screen.getByRole("link", { name: entry.name })).toHaveAttribute(
        "href",
        expectedHref
      );
    }
  });

  it("shows the brand illustration in place of a photo while no real photography exists yet", async () => {
    const element = await LocationDetailPage({
      params: Promise.resolve({ locale: "en", slug: "dubai" }),
    });
    render(element);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(document.querySelector('[data-testid="brand-scene"]')).toBeInTheDocument();
  });

  it("404s for a location outside the approved registry", async () => {
    await expect(
      LocationDetailPage({ params: Promise.resolve({ locale: "en", slug: "riyadh" }) })
    ).rejects.toThrow();
  });
});
