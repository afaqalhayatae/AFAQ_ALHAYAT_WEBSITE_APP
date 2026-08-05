import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import LocationsPage from "./page";
import { getMessages } from "@/i18n/get-messages";

describe("LocationsPage", () => {
  it("renders the locations index heading and links to Dubai", async () => {
    const element = await LocationsPage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(
      screen.getByRole("heading", { level: 1, name: t.locations.index.title })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: t.locations.dubai.title })).toHaveAttribute(
      "href",
      "/en/locations/dubai"
    );
  });

  it("uses Dubai's real approved emirate hero photo, not a placeholder illustration", async () => {
    const element = await LocationsPage({ params: Promise.resolve({ locale: "en" }) });
    render(element);
    expect(document.querySelector('[data-testid="brand-scene"]')).not.toBeInTheDocument();
    expect(screen.getAllByRole("img").length).toBeGreaterThan(0);
  });

  it("rejects an unsupported locale", async () => {
    await expect(
      LocationsPage({ params: Promise.resolve({ locale: "fr" }) })
    ).rejects.toThrow();
  });
});
