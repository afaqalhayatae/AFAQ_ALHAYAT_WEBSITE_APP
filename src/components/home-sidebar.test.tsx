import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HomeQuickActions } from "./home-sidebar";
import { getMessages } from "@/i18n/get-messages";
import { PHONE_E164, WHATSAPP_URL } from "@/lib/brand/links";

describe("HomeQuickActions", () => {
  it("is desktop-only (hidden by default, desktop:flex) and not viewport-fixed", () => {
    const t = getMessages("en");
    const { container } = render(<HomeQuickActions locale="en" t={t} />);
    const card = container.querySelector('[aria-label]');
    expect(card?.className).toContain("hidden");
    expect(card?.className).toContain("desktop:flex");
    expect(card?.className).not.toContain("fixed");
  });

  it("wires the booking, WhatsApp, and phone CTAs to real working paths", () => {
    const t = getMessages("en");
    render(<HomeQuickActions locale="en" t={t} />);

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

  it("shows real approved trust facts (24/7 availability, UAE-wide coverage) — not invented claims", () => {
    const t = getMessages("en");
    render(<HomeQuickActions locale="en" t={t} />);
    expect(screen.getByText(t.homeSidebar.trustAvailability)).toBeInTheDocument();
    expect(screen.getByText(t.homeSidebar.trustCoverage)).toBeInTheDocument();
  });

  it("renders correctly in Arabic with locale-correct hrefs", () => {
    const t = getMessages("ar");
    render(<HomeQuickActions locale="ar" t={t} />);

    expect(screen.getByRole("link", { name: t.home.booking.button })).toHaveAttribute(
      "href",
      "/ar/book"
    );
  });
});
