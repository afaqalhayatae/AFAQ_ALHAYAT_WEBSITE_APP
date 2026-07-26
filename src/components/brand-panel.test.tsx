import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrandPanel } from "./brand-panel";

describe("BrandPanel", () => {
  it("renders the placeholder icon when no photo is provided", () => {
    render(<BrandPanel icon={<svg data-testid="placeholder-icon" />} />);
    expect(screen.getByTestId("placeholder-icon")).toBeInTheDocument();
  });

  it("renders the real photo instead of the placeholder when src is provided", () => {
    render(
      <BrandPanel
        icon={<svg data-testid="placeholder-icon" />}
        src="/images/services/pest-control-afaq-alhayat-dubai.jpg"
        alt="Pest control technician at work"
      />
    );

    expect(screen.getByRole("img", { name: "Pest control technician at work" })).toBeInTheDocument();
    expect(screen.queryByTestId("placeholder-icon")).not.toBeInTheDocument();
  });
});
