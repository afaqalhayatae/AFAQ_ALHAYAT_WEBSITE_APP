import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ServicesPage from "./page";
import { getMessages, getServiceEntry } from "@/i18n/get-messages";
import { SERVICE_CATEGORIES, SERVICES } from "@/lib/catalog/services";
import { APPROVED_SERVICE_CONTENT_SLUGS, getServiceCardImage } from "@/lib/catalog/service-content";

// A service is only card-eligible with both a real photo AND approved page
// content — 48-Hour Production Mode fix, 2026-08-05: cardImage alone let a
// card link through to a real-but-empty detail page for services whose
// content is still Draft (confirmed live in production before the fix).
const isCardEligible = (slug: string) =>
  Boolean(getServiceCardImage(slug)) && APPROVED_SERVICE_CONTENT_SLUGS.includes(slug);

describe("ServicesPage", () => {
  it("lists every service that has both a real card image and approved content (a service missing either is excluded from the grid entirely, never shown with the bare category gradient or linking to an empty detail page)", async () => {
    const element = await ServicesPage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    for (const service of SERVICES) {
      const entry = getServiceEntry(t, service.slug);
      if (isCardEligible(service.slug)) {
        expect(screen.getByRole("heading", { name: entry.name })).toBeInTheDocument();
      } else {
        expect(screen.queryByRole("heading", { name: entry.name })).not.toBeInTheDocument();
      }
    }
  });

  it("groups services under all three canonical categories", async () => {
    const element = await ServicesPage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    for (const category of SERVICE_CATEGORIES) {
      expect(
        screen.getByRole("heading", { level: 2, name: t.services.categories[category] })
      ).toBeInTheDocument();
    }
  });

  it("links each service card to its detail page", async () => {
    const element = await ServicesPage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    const first = SERVICES[0];
    const entry = getServiceEntry(t, first.slug);
    expect(screen.getByRole("link", { name: entry.name })).toHaveAttribute(
      "href",
      `/en/services/${first.slug}`
    );
  });

  it("renders a real photo (not the bare category gradient) for every card shown (Visual Quality Correction Pass)", async () => {
    const element = await ServicesPage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    for (const service of SERVICES) {
      if (!isCardEligible(service.slug)) continue;
      const cardImage = getServiceCardImage(service.slug);
      const fileName = cardImage?.src.split("/").pop();
      expect(fileName).toBeTruthy();
      const images = screen.getAllByRole("img").filter((img) =>
        img.getAttribute("src")?.includes(encodeURIComponent(fileName as string))
      );
      expect(images.length).toBeGreaterThan(0);
    }
  });

  it("renders Arabic service names for the ar locale", async () => {
    const element = await ServicesPage({ params: Promise.resolve({ locale: "ar" }) });
    render(element);

    const t = getMessages("ar");
    const entry = getServiceEntry(t, SERVICES[0].slug);
    expect(screen.getByRole("heading", { name: entry.name })).toBeInTheDocument();
  });

  it("rejects an unsupported locale", async () => {
    await expect(
      ServicesPage({ params: Promise.resolve({ locale: "fr" }) })
    ).rejects.toThrow();
  });
});
