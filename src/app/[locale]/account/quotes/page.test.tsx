import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { getMessages } from "@/i18n/get-messages";
import type { QuoteRequest } from "@/types/domain";

const requireUser = vi.fn().mockResolvedValue({ id: "user_1", displayName: "Jane Doe" });
const fetchAccountData = vi.fn<(path: string) => Promise<QuoteRequest[]>>();

vi.mock("../_lib/session", () => ({
  requireUser: (...args: unknown[]) => requireUser(...args),
  fetchAccountData: (...args: [string]) => fetchAccountData(...args),
}));

import QuotesPage from "./page";

describe("QuotesPage", () => {
  beforeEach(() => {
    fetchAccountData.mockReset();
  });

  it("shows the empty state when there are no quotes", async () => {
    fetchAccountData.mockResolvedValue([]);

    const element = await QuotesPage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(screen.getByText(t.account.quotes.emptyTitle)).toBeInTheDocument();
  });

  it("lists quotes with their service and requirements", async () => {
    fetchAccountData.mockResolvedValue([
      {
        id: "quote_1",
        customerId: "0501234567",
        serviceId: "SVC-deep-clean",
        requirements: "3-bedroom villa",
        evidence: [],
      },
    ]);

    const element = await QuotesPage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    expect(screen.getByText("SVC-deep-clean")).toBeInTheDocument();
    expect(screen.getByText("3-bedroom villa")).toBeInTheDocument();
  });

  it("shows an error message when the quotes request fails", async () => {
    fetchAccountData.mockRejectedValue(new Error("boom"));

    const element = await QuotesPage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(screen.getByRole("alert")).toHaveTextContent(t.account.quotes.errorGeneric);
  });

  it("rejects an unsupported locale", async () => {
    await expect(QuotesPage({ params: Promise.resolve({ locale: "fr" }) })).rejects.toThrow();
  });
});
