import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RegisterForm } from "./register-form";
import { getMessages } from "@/i18n/get-messages";

const t = getMessages("en");

function fillForm() {
  fireEvent.change(screen.getByLabelText(t.auth.register.nameLabel), {
    target: { value: "Jane Doe" },
  });
  fireEvent.change(screen.getByLabelText(t.auth.register.emailLabel), {
    target: { value: "jane@example.com" },
  });
  fireEvent.change(screen.getByLabelText(t.auth.register.phoneLabel), {
    target: { value: "050 000 0000" },
  });
  fireEvent.change(screen.getByLabelText(t.auth.register.passwordLabel), {
    target: { value: "correct-horse-battery-staple" },
  });
  fireEvent.change(screen.getByLabelText(t.auth.register.confirmPasswordLabel), {
    target: { value: "correct-horse-battery-staple" },
  });
  fireEvent.click(screen.getByLabelText(new RegExp(t.auth.register.termsLinkText)));
}

describe("RegisterForm", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows validation errors instead of submitting when fields are empty", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<RegisterForm locale="en" t={t} />);
    fireEvent.click(screen.getByRole("button", { name: t.auth.register.submit }));

    expect(screen.getByText(t.auth.register.validation.name)).toBeInTheDocument();
    expect(screen.getByText(t.auth.register.validation.email)).toBeInTheDocument();
    expect(screen.getByText(t.auth.register.validation.phone)).toBeInTheDocument();
    expect(screen.getByText(t.auth.register.validation.password)).toBeInTheDocument();
    expect(screen.getByText(t.auth.register.validation.terms)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects an invalid email address before submitting", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<RegisterForm locale="en" t={t} />);
    fireEvent.change(screen.getByLabelText(t.auth.register.emailLabel), {
      target: { value: "not-an-email" },
    });
    fireEvent.click(screen.getByRole("button", { name: t.auth.register.submit }));

    expect(screen.getByText(t.auth.register.validation.email)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a password shorter than 8 characters before submitting", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<RegisterForm locale="en" t={t} />);
    fireEvent.change(screen.getByLabelText(t.auth.register.passwordLabel), {
      target: { value: "short" },
    });
    fireEvent.click(screen.getByRole("button", { name: t.auth.register.submit }));

    expect(screen.getByText(t.auth.register.validation.password)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a mismatched confirm-password before submitting", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<RegisterForm locale="en" t={t} />);
    fireEvent.change(screen.getByLabelText(t.auth.register.passwordLabel), {
      target: { value: "correct-horse-battery-staple" },
    });
    fireEvent.change(screen.getByLabelText(t.auth.register.confirmPasswordLabel), {
      target: { value: "different-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: t.auth.register.submit }));

    expect(screen.getByText(t.auth.register.validation.confirmPassword)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("requires the terms checkbox before submitting", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<RegisterForm locale="en" t={t} />);
    fireEvent.change(screen.getByLabelText(t.auth.register.nameLabel), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByLabelText(t.auth.register.emailLabel), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByLabelText(t.auth.register.phoneLabel), {
      target: { value: "050 000 0000" },
    });
    fireEvent.change(screen.getByLabelText(t.auth.register.passwordLabel), {
      target: { value: "correct-horse-battery-staple" },
    });
    fireEvent.change(screen.getByLabelText(t.auth.register.confirmPasswordLabel), {
      target: { value: "correct-horse-battery-staple" },
    });
    fireEvent.click(screen.getByRole("button", { name: t.auth.register.submit }));

    expect(screen.getByText(t.auth.register.validation.terms)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts to /api/auth/register with the email channel and shows a success message", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        apiVersion: "v1",
        correlationId: "test",
        data: { id: "user_1", displayName: "Jane Doe" },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<RegisterForm locale="en" t={t} />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: t.auth.register.submit }));

    await waitFor(() => {
      expect(screen.getByText(t.auth.register.successTitle)).toBeInTheDocument();
    });

    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body as string);
    expect(body).toEqual({
      displayName: "Jane Doe",
      channel: "email",
      contactValue: "jane@example.com",
      password: "correct-horse-battery-staple",
      actor: "website-visitor",
    });
  });

  it("shows the API error message when registration is rejected", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        apiVersion: "v1",
        correlationId: "test",
        error: {
          code: "conflict",
          message: "An account already exists for contact: jane@example.com",
          retryable: false,
        },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<RegisterForm locale="en" t={t} />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: t.auth.register.submit }));

    await waitFor(() => {
      expect(screen.getByRole("alert", { name: undefined })).toBeInTheDocument();
    });
    expect(screen.getByText(/An account already exists for contact/)).toBeInTheDocument();
  });

  it("links to the login page and opens terms and conditions in a new tab", () => {
    render(<RegisterForm locale="en" t={t} />);
    expect(screen.getByRole("link", { name: t.auth.register.loginLink })).toHaveAttribute(
      "href",
      "/en/login"
    );
    expect(screen.getByRole("link", { name: t.auth.register.termsLinkText })).toHaveAttribute(
      "href",
      "/en/terms-and-conditions"
    );
  });
});
