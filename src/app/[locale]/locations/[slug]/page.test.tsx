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

  it("links to every real pest sub-service x Dubai page, in addition to the generic Pest Control link (SEO_REALITY_MAP.md §5 Priority 3 fix)", async () => {
    const element = await LocationDetailPage({
      params: Promise.resolve({ locale: "en", slug: "dubai" }),
    });
    render(element);

    // ant, cockroach, termite, and bed-bug control all have real Dubai
    // city copy (2026-08-02 through -08-05 passes) and are now reachable
    // from this hub page — they were not before this fix.
    expect(screen.getByRole("link", { name: "Ant Control" })).toHaveAttribute(
      "href",
      "/en/services/pest-control/ant-control/dubai"
    );
    expect(screen.getByRole("link", { name: "Cockroach Control" })).toHaveAttribute(
      "href",
      "/en/services/pest-control/cockroach-control/dubai"
    );
    expect(screen.getByRole("link", { name: "White Ant / Termite Control" })).toHaveAttribute(
      "href",
      "/en/services/pest-control/termite-control/dubai"
    );
    expect(screen.getByRole("link", { name: "Bed Bug Control" })).toHaveAttribute(
      "href",
      "/en/services/pest-control/bed-bug-control/dubai"
    );

    // Rodent Control has no Dubai entry (Umm Al Quwain only) — must not
    // be linked from the Dubai hub.
    expect(screen.queryByRole("link", { name: "Rodent Control" })).not.toBeInTheDocument();
  });

  it("links to Rodent Control specifically from the Umm Al Quwain hub, its only real city entry", async () => {
    const element = await LocationDetailPage({
      params: Promise.resolve({ locale: "en", slug: "umm-al-quwain" }),
    });
    render(element);
    expect(screen.getByRole("link", { name: "Rodent Control" })).toHaveAttribute(
      "href",
      "/en/services/pest-control/rodent-control/umm-al-quwain"
    );
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
