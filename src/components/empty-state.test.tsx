import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("renders the title", () => {
    render(<EmptyState title="Services" />);
    expect(screen.getByRole("heading", { name: "Services" })).toBeInTheDocument();
  });

  it("renders the description when provided", () => {
    render(<EmptyState title="Services" description="Content is being prepared." />);
    expect(screen.getByText("Content is being prepared.")).toBeInTheDocument();
  });

  it("omits the description when not provided", () => {
    render(<EmptyState title="Services" />);
    expect(screen.queryByText("Content is being prepared.")).not.toBeInTheDocument();
  });
});
