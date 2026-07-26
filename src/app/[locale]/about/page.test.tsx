import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AboutPage from "./page";
import { getMessages } from "@/i18n/get-messages";

describe("AboutPage", () => {
  it("renders the hero, mission, vision, and values", async () => {
    const element = await AboutPage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(
      screen.getByRole("heading", { level: 1, name: t.about.hero.title })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: t.about.mission.title })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: t.about.vision.title })).toBeInTheDocument();
    for (const value of t.about.values.items) {
      expect(screen.getByText(value.title)).toBeInTheDocument();
    }
  });

  it("links to the services page and contact CTA", async () => {
    const element = await AboutPage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(screen.getAllByRole("link", { name: t.services.categories["general-maintenance"] })[0]).toHaveAttribute(
      "href",
      "/en/services"
    );
    expect(screen.getByRole("link", { name: t.about.cta.button })).toHaveAttribute(
      "href",
      "/en/contact"
    );
  });

  it("rejects an unsupported locale", async () => {
    await expect(AboutPage({ params: Promise.resolve({ locale: "fr" }) })).rejects.toThrow();
  });
});
