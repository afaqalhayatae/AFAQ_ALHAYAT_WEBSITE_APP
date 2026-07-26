import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "./login-form";
import { getMessages } from "@/i18n/get-messages";

const t = getMessages("en");

function fillForm() {
  fireEvent.change(screen.getByLabelText(t.auth.login.contactLabel), {
    target: { value: "050 000 0000" },
  });
  fireEvent.change(screen.getByLabelText(t.auth.login.passwordLabel), {
    target: { value: "correct-horse-battery-staple" },
  });
}

describe("LoginForm", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows validation errors instead of submitting when fields are empty", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<LoginForm locale="en" t={t} />);
    fireEvent.click(screen.getByRole("button", { name: t.auth.login.submit }));

    expect(screen.getByText(t.auth.login.validation.contact)).toBeInTheDocument();
    expect(screen.getByText(t.auth.login.validation.password)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts to /api/auth/login with a fixed phone channel", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        apiVersion: "v1",
        correlationId: "test",
        data: { id: "user_1" },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<LoginForm locale="en" t={t} />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: t.auth.login.submit }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body as string);
    expect(body).toEqual({
      channel: "phone",
      contactValue: "050 000 0000",
      password: "correct-horse-battery-staple",
      actor: "website-visitor",
    });
  });

  it("shows the API error message when login is rejected", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        apiVersion: "v1",
        correlationId: "test",
        error: { code: "unauthorized", message: "Invalid contact or password", retryable: false },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<LoginForm locale="en" t={t} />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: t.auth.login.submit }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Invalid contact or password");
    });
  });

  it("links to the register page", () => {
    render(<LoginForm locale="en" t={t} />);
    expect(screen.getByRole("link", { name: t.auth.login.registerLink })).toHaveAttribute(
      "href",
      "/en/register"
    );
  });
});
