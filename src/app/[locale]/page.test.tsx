import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "./page";
import { getMessages } from "@/i18n/get-messages";

describe("HomePage", () => {
  it("renders the localized hero for English", async () => {
    const element = await HomePage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(screen.getByRole("heading", { level: 1, name: t.home.hero.title })).toBeInTheDocument();
  });

  it("renders the localized hero for Arabic", async () => {
    const element = await HomePage({ params: Promise.resolve({ locale: "ar" }) });
    render(element);

    const t = getMessages("ar");
    expect(screen.getByRole("heading", { level: 1, name: t.home.hero.title })).toBeInTheDocument();
  });

  it("rejects an unsupported locale", async () => {
    await expect(
      HomePage({ params: Promise.resolve({ locale: "fr" }) })
    ).rejects.toThrow();
  });
});
