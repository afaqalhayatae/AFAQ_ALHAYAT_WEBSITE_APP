import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { getMessages } from "@/i18n/get-messages";

const requireUser = vi.fn().mockResolvedValue({ id: "user_1", displayName: "Jane Doe" });

vi.mock("./_lib/session", () => ({
  requireUser: (...args: unknown[]) => requireUser(...args),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/en/account",
}));

import AccountLayout from "./layout";

describe("AccountLayout", () => {
  it("guards the section via requireUser and renders the nav plus children", async () => {
    const element = await AccountLayout({
      params: Promise.resolve({ locale: "en" }),
      children: <p>page content</p>,
    });
    render(element);

    expect(requireUser).toHaveBeenCalledWith("en");
    const t = getMessages("en");
    expect(screen.getByRole("link", { name: t.account.nav.profile })).toBeInTheDocument();
    expect(screen.getByText("page content")).toBeInTheDocument();
  });

  it("rejects an unsupported locale before checking the session", async () => {
    await expect(
      AccountLayout({ params: Promise.resolve({ locale: "fr" }), children: <p /> })
    ).rejects.toThrow();
  });
});
