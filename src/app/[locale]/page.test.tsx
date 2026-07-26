import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "./page";
import { getMessages, getServiceEntry } from "@/i18n/get-messages";
import { SERVICES } from "@/lib/catalog/services";

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

  it("renders the Trust, How it works, and Why Us sections with the service preview", async () => {
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

    for (const service of SERVICES.slice(0, 6)) {
      const entry = getServiceEntry(t, service.slug);
      expect(screen.getByRole("heading", { name: entry.name })).toBeInTheDocument();
    }
  });

  it("links homepage service cards to their detail pages, not straight to contact", async () => {
    const element = await HomePage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    const first = SERVICES[0];
    const entry = getServiceEntry(t, first.slug);
    expect(screen.getByRole("link", { name: entry.name })).toHaveAttribute(
      "href",
      `/en/services/${first.slug}`
    );
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

  it("shows the hero visual with clearly-labeled alt text while demo visuals are on (JOB-AGT-WEB-20260726-M4.5)", async () => {
    const element = await HomePage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const heroImage = screen.getByRole("img");
    expect(heroImage).toHaveAttribute("alt", expect.stringContaining("Demo placeholder"));
  });
});
