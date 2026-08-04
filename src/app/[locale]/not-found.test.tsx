import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import LocaleNotFound from "./not-found";

describe("LocaleNotFound", () => {
  it("renders the English 404 content with working links back into the site", async () => {
    const element = await LocaleNotFound({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to homepage" })).toHaveAttribute("href", "/en");
    expect(screen.getByRole("link", { name: "Browse services" })).toHaveAttribute(
      "href",
      "/en/services"
    );
  });

  it("renders the Arabic 404 content with locale-correct links", async () => {
    const element = await LocaleNotFound({ params: Promise.resolve({ locale: "ar" }) });
    render(element);

    expect(screen.getByRole("heading", { name: "الصفحة غير موجودة" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "العودة إلى الصفحة الرئيسية" })).toHaveAttribute(
      "href",
      "/ar"
    );
  });

  it("falls back to the default locale (ar) when the locale param is invalid, instead of crashing", async () => {
    const element = await LocaleNotFound({ params: Promise.resolve({ locale: "xx" }) });
    render(element);
    expect(screen.getByRole("heading", { name: "الصفحة غير موجودة" })).toBeInTheDocument();
  });

  it("falls back to the default locale (ar) when params are entirely missing, instead of crashing", async () => {
    const element = await LocaleNotFound({ params: undefined });
    render(element);
    expect(screen.getByRole("heading", { name: "الصفحة غير موجودة" })).toBeInTheDocument();
  });
});
