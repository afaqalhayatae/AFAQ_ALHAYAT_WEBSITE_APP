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

  it("renders the Trust, How it works, and Why Us sections with all six services", async () => {
    const element = await HomePage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(screen.getByRole("heading", { level: 2, name: t.home.trust.title })).toBeInTheDocument();
    for (const item of t.home.trust.items) {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    }

    expect(
      screen.getByRole("heading", { level: 2, name: t.home.howItWorks.title })
    ).toBeInTheDocument();
    for (const step of t.home.howItWorks.steps) {
      expect(screen.getByText(step.title)).toBeInTheDocument();
    }

    expect(screen.getByRole("heading", { level: 2, name: t.home.whyUs.title })).toBeInTheDocument();

    for (const service of t.services.list) {
      expect(screen.getByRole("heading", { name: service.name })).toBeInTheDocument();
    }
  });

  it("points the hero CTAs at Request Service and the canonical WhatsApp link", async () => {
    const element = await HomePage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(screen.getByRole("link", { name: t.home.hero.primaryCta })).toHaveAttribute(
      "href",
      "/en/contact"
    );
    expect(
      screen.getAllByRole("link", { name: t.home.hero.secondaryCta })[0]
    ).toHaveAttribute("href", "https://wa.me/message/JMZVJDFDQL3VD1");
  });
});
