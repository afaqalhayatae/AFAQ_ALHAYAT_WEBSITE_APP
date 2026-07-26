import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import LocationDetailPage, { generateStaticParams } from "./page";
import { getMessages, getServiceEntry } from "@/i18n/get-messages";
import { SERVICES } from "@/lib/catalog/services";

describe("LocationDetailPage", () => {
  it("generates a static param for every registered location", () => {
    expect(generateStaticParams()).toEqual([{ slug: "dubai" }]);
  });

  it("renders the Dubai hub with links to every service x Dubai combo page", async () => {
    const element = await LocationDetailPage({
      params: Promise.resolve({ locale: "en", slug: "dubai" }),
    });
    render(element);

    const t = getMessages("en");
    expect(
      screen.getByRole("heading", { level: 1, name: t.locations.dubai.title })
    ).toBeInTheDocument();

    for (const service of SERVICES) {
      const entry = getServiceEntry(t, service.slug);
      expect(screen.getByRole("link", { name: entry.name })).toHaveAttribute(
        "href",
        `/en/services/${service.slug}/dubai`
      );
    }
  });

  it("404s for a location outside the approved registry", async () => {
    await expect(
      LocationDetailPage({ params: Promise.resolve({ locale: "en", slug: "abu-dhabi" }) })
    ).rejects.toThrow();
  });
});
