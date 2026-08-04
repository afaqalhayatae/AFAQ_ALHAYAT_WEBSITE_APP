import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HomeSidebar } from "./home-sidebar";
import { getMessages } from "@/i18n/get-messages";
import { PHONE_E164, WHATSAPP_URL } from "@/lib/brand/links";
import { POPULAR_SERVICE_SLUGS } from "@/lib/catalog/blog";
import { ALL_EMIRATES } from "@/lib/catalog/locations";

describe("HomeSidebar", () => {
  it("is desktop-only (hidden by default, desktop:flex)", () => {
    const t = getMessages("en");
    const { container } = render(<HomeSidebar locale="en" t={t} />);
    const aside = container.querySelector("aside");
    expect(aside?.className).toContain("hidden");
    expect(aside?.className).toContain("desktop:flex");
  });

  it("wires the booking, WhatsApp, and phone CTAs to real working paths", () => {
    const t = getMessages("en");
    render(<HomeSidebar locale="en" t={t} />);

    expect(screen.getByRole("link", { name: t.home.booking.button })).toHaveAttribute(
      "href",
      "/en/book"
    );
    expect(screen.getByRole("link", { name: t.common.whatsappCta })).toHaveAttribute(
      "href",
      WHATSAPP_URL
    );
    expect(screen.getByRole("link", { name: t.common.callNow })).toHaveAttribute(
      "href",
      `tel:${PHONE_E164}`
    );
  });

  it("links every popular service via the real canonical /services/{section}/{slug} URL, not the legacy flat one", () => {
    const t = getMessages("en");
    render(<HomeSidebar locale="en" t={t} />);

    // ac-maintenance and general-cleaning are both in POPULAR_SERVICE_SLUGS
    // and both content-complete — confirms the section-aware URL, not
    // /en/services/{slug} (the bug URL_AND_LINKING_AUDIT.md flagged
    // elsewhere in this codebase).
    expect(screen.getByRole("link", { name: t.services.entries["ac-maintenance"].name })).toHaveAttribute(
      "href",
      "/en/services/maintenance/ac-maintenance"
    );
    expect(
      screen.getByRole("link", { name: t.services.entries["general-cleaning"].name })
    ).toHaveAttribute("href", "/en/services/cleaning/general-cleaning");

    expect(POPULAR_SERVICE_SLUGS.length).toBeGreaterThan(0);
  });

  it("links Pest Control directly to /services/pest-control, not the duplicated /services/pest-control/pest-control a naive section+slug join would produce", () => {
    const t = getMessages("en");
    render(<HomeSidebar locale="en" t={t} />);
    expect(POPULAR_SERVICE_SLUGS).toContain("pest-control");
    expect(
      screen.getByRole("link", { name: t.services.entries["pest-control"].name })
    ).toHaveAttribute("href", "/en/services/pest-control");
  });

  it("links to /services for the full catalog", () => {
    const t = getMessages("en");
    render(<HomeSidebar locale="en" t={t} />);
    expect(screen.getByRole("link", { name: t.homeSidebar.allServices })).toHaveAttribute(
      "href",
      "/en/services"
    );
  });

  it("links every one of the 7 emirates, using the same hasPage-safe pattern the homepage's own areas section uses", () => {
    const t = getMessages("en");
    render(<HomeSidebar locale="en" t={t} />);

    expect(ALL_EMIRATES).toHaveLength(7);
    for (const emirate of ALL_EMIRATES) {
      const expectedHref = emirate.hasPage ? `/en/locations/${emirate.slug}` : "/en/locations";
      expect(screen.getByRole("link", { name: emirate.name.en })).toHaveAttribute(
        "href",
        expectedHref
      );
    }
  });

  it("shows real approved trust facts (24/7 availability, UAE-wide coverage) — not invented claims", () => {
    const t = getMessages("en");
    render(<HomeSidebar locale="en" t={t} />);
    expect(screen.getByText(t.homeSidebar.trustAvailability)).toBeInTheDocument();
    expect(screen.getByText(t.homeSidebar.trustCoverage)).toBeInTheDocument();
  });

  it("renders correctly in Arabic with locale-correct hrefs and labels", () => {
    const t = getMessages("ar");
    render(<HomeSidebar locale="ar" t={t} />);

    expect(screen.getByRole("link", { name: t.home.booking.button })).toHaveAttribute(
      "href",
      "/ar/book"
    );
    expect(screen.getByRole("link", { name: t.services.entries["ac-maintenance"].name })).toHaveAttribute(
      "href",
      "/ar/services/maintenance/ac-maintenance"
    );
    expect(screen.getByRole("link", { name: ALL_EMIRATES[0].name.ar })).toBeInTheDocument();
  });
});
