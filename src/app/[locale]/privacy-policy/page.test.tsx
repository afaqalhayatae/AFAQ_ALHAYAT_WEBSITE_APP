import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PrivacyPolicyPage from "./page";
import { getMessages } from "@/i18n/get-messages";

describe("PrivacyPolicyPage", () => {
  it("renders the title, intro, and every section for English", async () => {
    const element = await PrivacyPolicyPage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(
      screen.getByRole("heading", { level: 1, name: t.legal.privacy.title })
    ).toBeInTheDocument();
    expect(screen.getByText(t.legal.privacy.intro)).toBeInTheDocument();
    for (const section of t.legal.privacy.sections) {
      expect(screen.getByRole("heading", { name: section.title })).toBeInTheDocument();
    }
    expect(screen.getByText(t.contact.info.phone)).toBeInTheDocument();
  });

  it("renders the Arabic version", async () => {
    const element = await PrivacyPolicyPage({ params: Promise.resolve({ locale: "ar" }) });
    render(element);

    const t = getMessages("ar");
    expect(
      screen.getByRole("heading", { level: 1, name: t.legal.privacy.title })
    ).toBeInTheDocument();
  });

  it("rejects an unsupported locale", async () => {
    await expect(
      PrivacyPolicyPage({ params: Promise.resolve({ locale: "fr" }) })
    ).rejects.toThrow();
  });
});
