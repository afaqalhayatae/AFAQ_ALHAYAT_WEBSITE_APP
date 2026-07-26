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
});
