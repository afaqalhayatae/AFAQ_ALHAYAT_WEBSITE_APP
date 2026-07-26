import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { getMessages } from "@/i18n/get-messages";
import type { Enquiry } from "@/types/domain";

const requireUser = vi.fn().mockResolvedValue({ id: "user_1", displayName: "Jane Doe" });
const fetchAccountData = vi.fn<(path: string) => Promise<Enquiry[]>>();

vi.mock("../_lib/session", () => ({
  requireUser: (...args: unknown[]) => requireUser(...args),
  fetchAccountData: (...args: [string]) => fetchAccountData(...args),
}));

import RequestsPage from "./page";

describe("RequestsPage", () => {
  beforeEach(() => {
    fetchAccountData.mockReset();
  });

  it("shows the empty state when there are no enquiries", async () => {
    fetchAccountData.mockResolvedValue([]);

    const element = await RequestsPage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(screen.getByText(t.account.requests.emptyTitle)).toBeInTheDocument();
  });

  it("lists enquiries with their status", async () => {
    fetchAccountData.mockResolvedValue([
      {
        id: "enq_1",
        customerId: "0501234567",
        need: "AC not cooling",
        source: "website",
        status: "in_progress",
      },
    ]);

    const element = await RequestsPage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(screen.getByText("AC not cooling")).toBeInTheDocument();
    expect(screen.getByText(t.account.requests.statuses.in_progress)).toBeInTheDocument();
  });

  it("shows an error message when the enquiries request fails", async () => {
    fetchAccountData.mockRejectedValue(new Error("boom"));

    const element = await RequestsPage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(screen.getByRole("alert")).toHaveTextContent(t.account.requests.errorGeneric);
  });
});
