import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import FaqPage from "./page";
import { getMessages } from "@/i18n/get-messages";

describe("FaqPage", () => {
  it("shows the coming-soon empty state while no FAQ content is approved", async () => {
    const element = await FaqPage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(screen.getByRole("heading", { name: t.nav.faq })).toBeInTheDocument();
    expect(screen.getByText(t.common.comingSoon)).toBeInTheDocument();
    expect(document.querySelector('script[type="application/ld+json"]')).toBeNull();
  });

  it("rejects an unsupported locale", async () => {
    await expect(FaqPage({ params: Promise.resolve({ locale: "fr" }) })).rejects.toThrow();
  });
});
