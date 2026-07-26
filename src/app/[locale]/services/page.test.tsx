import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ServicesPage from "./page";
import { getMessages, getServiceEntry } from "@/i18n/get-messages";
import { SERVICE_CATEGORIES, SERVICES } from "@/lib/catalog/services";

describe("ServicesPage", () => {
  it("lists every service from the canonical catalog", async () => {
    const element = await ServicesPage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    for (const service of SERVICES) {
      const entry = getServiceEntry(t, service.slug);
      expect(screen.getByRole("heading", { name: entry.name })).toBeInTheDocument();
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
