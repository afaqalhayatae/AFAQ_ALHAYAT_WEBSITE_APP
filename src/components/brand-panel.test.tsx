import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrandPanel } from "./brand-panel";

describe("BrandPanel", () => {
  it("renders the placeholder icon when no photo is provided", () => {
    render(<BrandPanel icon={<svg data-testid="placeholder-icon" />} />);
    expect(screen.getByTestId("placeholder-icon")).toBeInTheDocument();
  });

  it("renders the real photo instead of the illustration when src is provided, with the icon badge overlaid on top (Final Visual Design Implementation)", () => {
    render(
      <BrandPanel
        icon={<svg data-testid="placeholder-icon" />}
        category="pest-control"
        src="/images/brand/services/pest-control-afaq-alhayat-dubai.jpg"
        alt="Pest control technician at work"
      />
    );

    expect(screen.getByRole("img", { name: "Pest control technician at work" })).toBeInTheDocument();
    expect(screen.queryByTestId("brand-scene")).not.toBeInTheDocument();
    // The icon badge is not the same thing as the illustration Scene —
    // every real caller in the app passes the same icon whether or not
    // a photo exists, so it must still render alongside the real photo.
    expect(screen.getByTestId("placeholder-icon")).toBeInTheDocument();
  });

  it("applies a distinct tonal gradient per category", () => {
    const { container: maintenance } = render(
      <BrandPanel icon={<svg />} category="maintenance" />
    );
    const { container: cleaning } = render(<BrandPanel icon={<svg />} category="cleaning" />);
    const { container: pestControl } = render(
      <BrandPanel icon={<svg />} category="pest-control" />
    );

    expect(maintenance.firstChild).toHaveClass("from-(--color-primary)", "to-[#123f66]");
    expect(cleaning.firstChild).toHaveClass("from-[#1a5f95]", "to-[#0d3660]");
    expect(pestControl.firstChild).toHaveClass("from-[#0c3d68]", "to-[#071f38]");
  });

  it("still renders the icon badge alongside the category illustration", () => {
    render(<BrandPanel icon={<svg data-testid="placeholder-icon" />} category="cleaning" />);
    expect(screen.getByTestId("placeholder-icon")).toBeInTheDocument();
    expect(screen.getByTestId("brand-scene")).toBeInTheDocument();
  });

  it("renders the flagship hero illustration only for the hero variant", () => {
    render(<BrandPanel icon={<svg />} variant="hero" />);
    expect(screen.getByTestId("brand-scene")).toBeInTheDocument();
  });

  it("renders no illustration for a plain card with no category", () => {
    render(<BrandPanel icon={<svg />} variant="card" />);
    expect(screen.queryByTestId("brand-scene")).not.toBeInTheDocument();
  });
});
