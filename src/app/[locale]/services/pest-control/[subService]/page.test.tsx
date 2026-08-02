import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PestControlSubServicePage from "./page";
import { getMessages } from "@/i18n/get-messages";

describe("PestControlSubServicePage", () => {
  it("renders a real sub-service page", async () => {
    const element = await PestControlSubServicePage({
      params: Promise.resolve({ locale: "en", subService: "cockroach-control" }),
    });
    render(element);

    expect(screen.getByRole("heading", { level: 1, name: "Cockroach Control" })).toBeInTheDocument();
  });

  it("shows the full approved content package — overview, benefits, process, preparation, safety, and live FAQs — now that the Owner has approved it (Service Completion Phase, 2026-07-31)", async () => {
    const element = await PestControlSubServicePage({
      params: Promise.resolve({ locale: "en", subService: "cockroach-control" }),
    });
    render(element);

    const t = getMessages("en");
    expect(screen.getByRole("heading", { name: t.services.detail.benefitsTitle })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: t.services.detail.howItWorksTitle })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: t.services.detail.preparationTitle })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: t.services.detail.safetyTitle })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: t.services.detail.faqTitle })).toBeInTheDocument();
  });

  it("falls back to the service+location content for a legacy /services/pest-control/{location} combo (Canonical URL Architecture Finalization)", async () => {
    const element = await PestControlSubServicePage({
      params: Promise.resolve({ locale: "en", subService: "dubai" }),
    });
    render(element);

    const t = getMessages("en");
    const entry = t.services.entries["pest-control"];
    expect(
      screen.getByRole("heading", { level: 1, name: `${entry.name} in Dubai` })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: t.locations.combo.backToLocation })).toHaveAttribute(
      "href",
      "/en/locations/dubai"
    );
  });

  it("404s for a value that is neither a real sub-service nor a real location", async () => {
    await expect(
      PestControlSubServicePage({
        params: Promise.resolve({ locale: "en", subService: "not-a-real-thing" }),
      })
    ).rejects.toThrow();
  });

  it("404s for a location outside the approved registry", async () => {
    await expect(
      PestControlSubServicePage({
        params: Promise.resolve({ locale: "en", subService: "riyadh" }),
      })
    ).rejects.toThrow();
  });
});
