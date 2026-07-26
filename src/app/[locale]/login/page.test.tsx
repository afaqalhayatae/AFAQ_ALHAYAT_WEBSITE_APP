import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import LoginPage from "./page";
import { getMessages } from "@/i18n/get-messages";

describe("LoginPage", () => {
  it("renders the login form for English", async () => {
    const element = await LoginPage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(screen.getByRole("heading", { level: 1, name: t.auth.login.title })).toBeInTheDocument();
    expect(screen.getByLabelText(t.auth.login.contactLabel)).toBeInTheDocument();
  });

  it("renders the login form for Arabic", async () => {
    const element = await LoginPage({ params: Promise.resolve({ locale: "ar" }) });
    render(element);

    const t = getMessages("ar");
    expect(screen.getByRole("heading", { level: 1, name: t.auth.login.title })).toBeInTheDocument();
  });

  it("rejects an unsupported locale", async () => {
    await expect(LoginPage({ params: Promise.resolve({ locale: "fr" }) })).rejects.toThrow();
  });
});
