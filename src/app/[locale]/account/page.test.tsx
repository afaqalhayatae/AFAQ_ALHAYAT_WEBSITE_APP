import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { getMessages } from "@/i18n/get-messages";
import type { User } from "@/types/identity";

const { user } = vi.hoisted(() => ({
  user: {
    id: "user_1",
    displayName: "Jane Doe",
    contact: { channel: "phone", value: "0501234567" },
    emailVerified: false,
    phoneVerified: false,
    status: "active",
    createdAt: new Date().toISOString(),
  } satisfies User,
}));

vi.mock("./_lib/session", () => ({
  requireUser: vi.fn().mockResolvedValue(user),
}));

import AccountOverviewPage from "./page";

describe("AccountOverviewPage", () => {
  it("greets the signed-in user and links to every section", async () => {
    const element = await AccountOverviewPage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: new RegExp(t.account.overview.sections.profile.title) })
    ).toHaveAttribute("href", "/en/account/profile");
    expect(
      screen.getByRole("link", { name: new RegExp(t.account.overview.sections.bookings.title) })
    ).toHaveAttribute("href", "/en/account/bookings");
  });

  it("rejects an unsupported locale", async () => {
    await expect(
      AccountOverviewPage({ params: Promise.resolve({ locale: "fr" }) })
    ).rejects.toThrow();
  });
});
