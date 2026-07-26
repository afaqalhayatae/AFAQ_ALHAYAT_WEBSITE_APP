import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import RegisterPage from "./page";
import { getMessages } from "@/i18n/get-messages";

describe("RegisterPage", () => {
  it("renders the register form for English", async () => {
    const element = await RegisterPage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(
      screen.getByRole("heading", { level: 1, name: t.auth.register.title })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(t.auth.register.nameLabel)).toBeInTheDocument();
  });

  it("renders the register form for Arabic", async () => {
    const element = await RegisterPage({ params: Promise.resolve({ locale: "ar" }) });
    render(element);

    const t = getMessages("ar");
    expect(
      screen.getByRole("heading", { level: 1, name: t.auth.register.title })
    ).toBeInTheDocument();
  });

  it("rejects an unsupported locale", async () => {
    await expect(RegisterPage({ params: Promise.resolve({ locale: "fr" }) })).rejects.toThrow();
  });
});
