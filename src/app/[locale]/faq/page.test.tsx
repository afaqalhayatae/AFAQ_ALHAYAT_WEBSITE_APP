import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import FaqPage from "./page";
import { getMessages } from "@/i18n/get-messages";

describe("FaqPage", () => {
  it("renders real approved FAQ content and FAQPage JSON-LD (2026-08-04 final website completion pass)", async () => {
    const element = await FaqPage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(screen.getByRole("heading", { level: 1, name: t.faq.title })).toBeInTheDocument();
    expect(screen.queryByText(t.common.comingSoon)).not.toBeInTheDocument();
    const schema = document.querySelector('script[type="application/ld+json"]');
    expect(schema).not.toBeNull();
    expect(JSON.parse(schema!.innerHTML)["@type"]).toBe("FAQPage");
  });

  it("rejects an unsupported locale", async () => {
    await expect(FaqPage({ params: Promise.resolve({ locale: "fr" }) })).rejects.toThrow();
  });
});
