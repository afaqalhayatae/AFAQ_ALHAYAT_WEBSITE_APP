import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { getMessages } from "@/i18n/get-messages";
import type { BookingRequest } from "@/types/domain";

const requireUser = vi.fn().mockResolvedValue({ id: "user_1", displayName: "Jane Doe" });
const fetchAccountData = vi.fn<(path: string) => Promise<BookingRequest[]>>();

vi.mock("../_lib/session", () => ({
  requireUser: (...args: unknown[]) => requireUser(...args),
  fetchAccountData: (...args: [string]) => fetchAccountData(...args),
}));

import BookingsPage from "./page";

describe("BookingsPage", () => {
  beforeEach(() => {
    fetchAccountData.mockReset();
  });

  it("shows the empty state when there are no bookings", async () => {
    fetchAccountData.mockResolvedValue([]);

    const element = await BookingsPage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(screen.getByText(t.account.bookings.emptyTitle)).toBeInTheDocument();
  });

  it("lists bookings with their service, area, schedule, and status", async () => {
    fetchAccountData.mockResolvedValue([
      {
        id: "book_1",
        customerId: "0501234567",
        serviceId: "SVC-ac-repair",
        serviceAreaId: "LOC-AE-dubai",
        schedulePreference: "weekday-morning",
        status: "confirmed",
      },
    ]);

    const element = await BookingsPage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(screen.getByText("SVC-ac-repair")).toBeInTheDocument();
    expect(screen.getByText("LOC-AE-dubai")).toBeInTheDocument();
    expect(screen.getByText("weekday-morning")).toBeInTheDocument();
    expect(screen.getByText(t.account.bookings.statuses.confirmed)).toBeInTheDocument();
  });

  it("shows an error message when the bookings request fails", async () => {
    fetchAccountData.mockRejectedValue(new Error("boom"));

    const element = await BookingsPage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(screen.getByRole("alert")).toHaveTextContent(t.account.bookings.errorGeneric);
  });

  it("rejects an unsupported locale", async () => {
    await expect(BookingsPage({ params: Promise.resolve({ locale: "fr" }) })).rejects.toThrow();
  });
});
