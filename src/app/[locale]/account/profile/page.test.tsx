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

vi.mock("../_lib/session", () => ({
  requireUser: vi.fn().mockResolvedValue(user),
}));

import ProfilePage from "./page";

describe("ProfilePage", () => {
  it("renders the profile form pre-filled with the signed-in user", async () => {
    const element = await ProfilePage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(
      screen.getByRole("heading", { level: 1, name: t.account.profile.title })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(t.account.profile.displayNameLabel)).toHaveValue("Jane Doe");
  });

  it("rejects an unsupported locale", async () => {
    await expect(ProfilePage({ params: Promise.resolve({ locale: "fr" }) })).rejects.toThrow();
  });
});
