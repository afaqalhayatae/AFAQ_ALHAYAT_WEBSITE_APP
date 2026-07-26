import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ServiceLocationPage, { generateStaticParams } from "./page";
import { getMessages } from "@/i18n/get-messages";
import { SERVICES } from "@/lib/catalog/services";

describe("ServiceLocationPage", () => {
  it("generates a static param for every service in Dubai", () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(SERVICES.length);
    expect(params).toContainEqual({ slug: "pest-control", location: "dubai" });
  });

  it("renders the service name and Dubai in the heading, plus both CTAs", async () => {
    const element = await ServiceLocationPage({
      params: Promise.resolve({ locale: "en", slug: "pest-control", location: "dubai" }),
    });
    render(element);

    const t = getMessages("en");
    const entry = t.services.entries["pest-control"];
    expect(
      screen.getByRole("heading", { level: 1, name: `${entry.name} in Dubai` })
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: t.common.requestService })).toHaveAttribute(
      "href",
      "/en/contact"
    );
    expect(screen.getByRole("link", { name: t.locations.combo.backToService })).toHaveAttribute(
      "href",
      "/en/services/pest-control"
    );
    expect(screen.getByRole("link", { name: t.locations.combo.backToLocation })).toHaveAttribute(
      "href",
      "/en/locations/dubai"
    );
  });

  it("404s for a location outside the approved registry", async () => {
    await expect(
      ServiceLocationPage({
        params: Promise.resolve({ locale: "en", slug: "pest-control", location: "abu-dhabi" }),
      })
    ).rejects.toThrow();
  });

  it("404s for an unknown service slug", async () => {
    await expect(
      ServiceLocationPage({
        params: Promise.resolve({ locale: "en", slug: "not-a-service", location: "dubai" }),
      })
    ).rejects.toThrow();
  });
});
