import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import TermsAndConditionsPage from "./page";
import { getMessages } from "@/i18n/get-messages";

describe("TermsAndConditionsPage", () => {
  it("renders the title, intro, and every section for English", async () => {
    const element = await TermsAndConditionsPage({
      params: Promise.resolve({ locale: "en" }),
    });
    render(element);

    const t = getMessages("en");
    expect(
      screen.getByRole("heading", { level: 1, name: t.legal.terms.title })
    ).toBeInTheDocument();
    expect(screen.getByText(t.legal.terms.intro)).toBeInTheDocument();
    for (const section of t.legal.terms.sections) {
      expect(screen.getByRole("heading", { name: section.title })).toBeInTheDocument();
    }
  });

  it("renders the Arabic version", async () => {
    const element = await TermsAndConditionsPage({
      params: Promise.resolve({ locale: "ar" }),
    });
    render(element);

    const t = getMessages("ar");
    expect(
      screen.getByRole("heading", { level: 1, name: t.legal.terms.title })
    ).toBeInTheDocument();
  });

  it("rejects an unsupported locale", async () => {
    await expect(
      TermsAndConditionsPage({ params: Promise.resolve({ locale: "fr" }) })
    ).rejects.toThrow();
  });
});
