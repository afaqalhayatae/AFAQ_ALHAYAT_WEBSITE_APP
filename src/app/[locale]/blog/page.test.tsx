import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import BlogPage from "./page";
import { getMessages } from "@/i18n/get-messages";

describe("BlogPage", () => {
  it("shows the coming-soon empty state while no articles are published", async () => {
    const element = await BlogPage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(screen.getByRole("heading", { name: t.nav.blog })).toBeInTheDocument();
    expect(screen.getByText(t.common.comingSoon)).toBeInTheDocument();
  });

  it("rejects an unsupported locale", async () => {
    await expect(BlogPage({ params: Promise.resolve({ locale: "fr" }) })).rejects.toThrow();
  });
});
