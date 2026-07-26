import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AccountNav } from "./account-nav";
import { getMessages } from "@/i18n/get-messages";

vi.mock("next/navigation", () => ({
  usePathname: () => "/en/account/profile",
}));

describe("AccountNav", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders every account section link under the current locale", () => {
    const t = getMessages("en");
    render(<AccountNav locale="en" t={t} />);

    expect(screen.getByRole("link", { name: t.account.nav.profile })).toHaveAttribute(
      "href",
      "/en/account/profile"
    );
    expect(screen.getByRole("link", { name: t.account.nav.bookings })).toHaveAttribute(
      "href",
      "/en/account/bookings"
    );
  });

  it("marks the current section as active", () => {
    const t = getMessages("en");
    render(<AccountNav locale="en" t={t} />);

    expect(screen.getByRole("link", { name: t.account.nav.profile })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(screen.getByRole("link", { name: t.account.nav.overview })).not.toHaveAttribute(
      "aria-current"
    );
  });

  it("logs out and redirects home when the sign-out button is clicked", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
    vi.stubGlobal("fetch", fetchMock);

    const t = getMessages("en");
    render(<AccountNav locale="en" t={t} />);

    fireEvent.click(screen.getByRole("button", { name: t.account.nav.logout }));

    await vi.waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/auth/logout", { method: "POST" });
    });
  });
});
