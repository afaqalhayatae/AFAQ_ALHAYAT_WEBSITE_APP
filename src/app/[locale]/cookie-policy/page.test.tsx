import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import CookiePolicyPage from "./page";
import { getMessages } from "@/i18n/get-messages";

describe("CookiePolicyPage", () => {
  it("renders the title, intro, and every section for English", async () => {
    const element = await CookiePolicyPage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(
      screen.getByRole("heading", { level: 1, name: t.legal.cookies.title })
    ).toBeInTheDocument();
    expect(screen.getByText(t.legal.cookies.intro)).toBeInTheDocument();
    for (const section of t.legal.cookies.sections) {
      expect(screen.getByRole("heading", { name: section.title })).toBeInTheDocument();
    }
  });

  it("honestly describes the one real cookie in use and frames analytics/ads as not yet active", async () => {
    const element = await CookiePolicyPage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    expect(screen.getAllByText(/session cookie/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/not active on this website today/i)).toBeInTheDocument();
  });

  it("renders the Arabic version", async () => {
    const element = await CookiePolicyPage({ params: Promise.resolve({ locale: "ar" }) });
    render(element);

    const t = getMessages("ar");
    expect(
      screen.getByRole("heading", { level: 1, name: t.legal.cookies.title })
    ).toBeInTheDocument();
  });

  it("rejects an unsupported locale", async () => {
    await expect(
      CookiePolicyPage({ params: Promise.resolve({ locale: "fr" }) })
    ).rejects.toThrow();
  });
});
