import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { getMessages } from "@/i18n/get-messages";

vi.mock("../_lib/session", () => ({
  requireUser: vi.fn().mockResolvedValue({ id: "user_1", displayName: "Jane Doe" }),
}));

import QuotesPage from "./page";

describe("QuotesPage", () => {
  it("shows the honest not-yet-linked empty state", async () => {
    const element = await QuotesPage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(screen.getByText(t.account.quotes.emptyTitle)).toBeInTheDocument();
  });

  it("rejects an unsupported locale", async () => {
    await expect(QuotesPage({ params: Promise.resolve({ locale: "fr" }) })).rejects.toThrow();
  });
});
