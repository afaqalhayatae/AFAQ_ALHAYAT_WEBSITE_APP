import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "./header";
import { getMessages } from "@/i18n/get-messages";

vi.mock("next/navigation", () => ({
  usePathname: () => "/en",
}));

describe("Header", () => {
  it("renders localized nav links pointing at the current locale", () => {
    const t = getMessages("en");
    render(<Header locale="en" t={t} />);

    const homeLink = screen.getAllByRole("link", { name: t.nav.home })[0];
    expect(homeLink).toHaveAttribute("href", "/en");

    const servicesLink = screen.getAllByRole("link", { name: t.nav.services })[0];
    expect(servicesLink).toHaveAttribute("href", "/en/services");

    const locationsLink = screen.getAllByRole("link", { name: t.nav.locations })[0];
    expect(locationsLink).toHaveAttribute("href", "/en/locations");
  });

  it("toggles the mobile menu", () => {
    const t = getMessages("en");
    render(<Header locale="en" t={t} />);

    const toggle = screen.getByRole("button", { name: t.common.menu });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: t.common.closeMenu })).toBeInTheDocument();
  });

  it("renders Arabic nav labels for the ar locale", () => {
    const t = getMessages("ar");
    render(<Header locale="ar" t={t} />);

    expect(screen.getAllByRole("link", { name: t.nav.home })[0]).toBeInTheDocument();
  });

  it("renders the Account link, WhatsApp action, and Request Service CTA", () => {
    const t = getMessages("en");
    render(<Header locale="en" t={t} />);

    expect(screen.getByRole("link", { name: t.nav.account })).toHaveAttribute(
      "href",
      "/en/account"
    );

    const whatsapp = screen.getByRole("link", { name: t.common.whatsappCta });
    expect(whatsapp).toHaveAttribute("href", "https://wa.me/message/JMZVJDFDQL3VD1");
    expect(whatsapp).toHaveAttribute("target", "_blank");

    expect(screen.getByRole("link", { name: t.common.requestService })).toHaveAttribute(
      "href",
      "/en/book"
    );
  });

  // Supersedes the old "Final Production Cleanup Rule" test, which pinned
  // this CTA to /contact back when the booking form genuinely wasn't
  // functional yet. It's a real, complete form now (971-line
  // booking-form.tsx, wired to a real /api/bookings endpoint) — the Owner
  // explicitly requested Request Service go straight to it (2026-08-05),
  // matching the same fast-path convention every other Request Service
  // CTA site-wide was updated to at the same time.
  it("sends Request Service straight to the booking form, not the contact page", () => {
    const t = getMessages("en");
    render(<Header locale="en" t={t} />);

    expect(screen.getByRole("link", { name: t.common.requestService })).toHaveAttribute(
      "href",
      "/en/book"
    );
  });
});
