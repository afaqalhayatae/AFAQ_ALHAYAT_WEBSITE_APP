import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ProfileForm } from "./profile-form";
import { getMessages } from "@/i18n/get-messages";
import type { User } from "@/types/identity";

const t = getMessages("en");

const user: User = {
  id: "user_1",
  displayName: "Jane Doe",
  contact: { channel: "phone", value: "0501234567" },
  emailVerified: false,
  phoneVerified: false,
  status: "active",
  createdAt: new Date().toISOString(),
};

describe("ProfileForm", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("pre-fills the display name and shows the contact as read-only", () => {
    render(<ProfileForm t={t} user={user} />);

    expect(screen.getByLabelText(t.account.profile.displayNameLabel)).toHaveValue("Jane Doe");
    expect(screen.getByLabelText(t.account.profile.contactLabel)).toBeDisabled();
    expect(screen.getByLabelText(t.account.profile.contactLabel)).toHaveValue("0501234567");
  });

  it("blocks submission when the display name is cleared", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<ProfileForm t={t} user={user} />);
    fireEvent.change(screen.getByLabelText(t.account.profile.displayNameLabel), {
      target: { value: "   " },
    });
    fireEvent.click(screen.getByRole("button", { name: t.account.profile.save }));

    expect(screen.getByText(t.account.profile.validation.displayName)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("PATCHes /api/auth/session and shows a success message", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        apiVersion: "v1",
        correlationId: "test",
        data: { ...user, displayName: "Jane Smith" },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<ProfileForm t={t} user={user} />);
    fireEvent.change(screen.getByLabelText(t.account.profile.displayNameLabel), {
      target: { value: "Jane Smith" },
    });
    fireEvent.click(screen.getByRole("button", { name: t.account.profile.save }));

    await waitFor(() => {
      expect(screen.getByText(t.account.profile.successMessage)).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/session",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ displayName: "Jane Smith" }),
      })
    );
  });

  it("shows the API error message when the update is rejected", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        apiVersion: "v1",
        correlationId: "test",
        error: { code: "validation_error", message: "displayName is required", retryable: false },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<ProfileForm t={t} user={user} />);
    fireEvent.change(screen.getByLabelText(t.account.profile.displayNameLabel), {
      target: { value: "Jane Smith" },
    });
    fireEvent.click(screen.getByRole("button", { name: t.account.profile.save }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("displayName is required");
    });
  });
});
