import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LanguageSwitcher } from "./language-switcher";

vi.mock("next/navigation", () => ({
  usePathname: () => "/en/services",
}));

describe("LanguageSwitcher", () => {
  it("links each locale option to the equivalent path in that locale", () => {
    render(<LanguageSwitcher locale="en" label="Language" />);

    expect(screen.getByRole("link", { name: "ar" })).toHaveAttribute(
      "href",
      "/ar/services"
    );
    expect(screen.getByRole("link", { name: "en" })).toHaveAttribute(
      "href",
      "/en/services"
    );
  });

  it("marks the current locale as active", () => {
    render(<LanguageSwitcher locale="en" label="Language" />);

    expect(screen.getByRole("link", { name: "en" })).toHaveAttribute(
      "aria-current",
      "true"
    );
    expect(screen.getByRole("link", { name: "ar" })).not.toHaveAttribute(
      "aria-current"
    );
  });
});
