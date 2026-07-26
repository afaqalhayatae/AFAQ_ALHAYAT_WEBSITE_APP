import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ServicesPage from "./page";
import { getMessages } from "@/i18n/get-messages";

describe("ServicesPage", () => {
  it("lists every service from the messages catalog", async () => {
    const element = await ServicesPage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    for (const service of t.services.list) {
      expect(screen.getByRole("heading", { name: service.name })).toBeInTheDocument();
    }
  });

  it("renders Arabic service names for the ar locale", async () => {
    const element = await ServicesPage({ params: Promise.resolve({ locale: "ar" }) });
    render(element);

    const t = getMessages("ar");
    expect(screen.getByRole("heading", { name: t.services.list[0].name })).toBeInTheDocument();
  });

  it("rejects an unsupported locale", async () => {
    await expect(
      ServicesPage({ params: Promise.resolve({ locale: "fr" }) })
    ).rejects.toThrow();
  });
});
