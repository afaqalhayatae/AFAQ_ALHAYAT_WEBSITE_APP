import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Link from "next/link";
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

  it("renders children below the description when provided (not-found.tsx CTA links)", () => {
    render(
      <EmptyState title="Page not found">
        <Link href="/en">Back to homepage</Link>
      </EmptyState>
    );
    expect(screen.getByRole("link", { name: "Back to homepage" })).toBeInTheDocument();
  });

  it("renders nothing extra when children is omitted", () => {
    const { container } = render(<EmptyState title="Services" />);
    expect(container.querySelectorAll("a, button")).toHaveLength(0);
  });
});
