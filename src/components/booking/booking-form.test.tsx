import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BookingForm } from "./booking-form";
import { getMessages } from "@/i18n/get-messages";

const t = getMessages("en");

/**
 * Professional Booking System Foundation — step order now matches
 * MOBILE.md's documented sequence (Service → Location → Date →
 * Customer → Confirmation), folding Property Details into the location
 * step and Problem Details into the appointment step. Previously
 * Customer was step 1; it's step 4 now.
 */
function fillServiceStep() {
  fireEvent.click(screen.getByRole("button", { name: t.booking.service.categories["pest-control"] }));
  fireEvent.change(screen.getByLabelText(t.booking.service.serviceLabel), {
    target: { value: "pest-control" },
  });
  fireEvent.click(screen.getByRole("button", { name: t.booking.navigation.next }));
}

function fillLocationAndPropertyStep() {
  fireEvent.change(screen.getByLabelText(t.booking.location.emirateLabel), {
    target: { value: "dubai" },
  });
  fireEvent.change(screen.getByLabelText(t.booking.location.areaLabel), {
    target: { value: "Palm Jumeirah" },
  });
  fireEvent.change(screen.getByLabelText(t.booking.property.typeLabel), {
    target: { value: "villa" },
  });
  fireEvent.change(screen.getByLabelText(t.booking.property.sizeLabel), {
    target: { value: "3-bedroom" },
  });
  fireEvent.click(screen.getByRole("button", { name: t.booking.navigation.next }));
}

function fillScheduleStep() {
  fireEvent.change(screen.getByLabelText(t.booking.schedule.dateLabel), {
    target: { value: "2027-01-15" },
  });
  fireEvent.click(screen.getByRole("button", { name: t.booking.schedule.timeSlots.morning }));
  fireEvent.click(screen.getByRole("button", { name: t.booking.navigation.next }));
}

function fillCustomerStep() {
  fireEvent.change(screen.getByLabelText(t.booking.customer.nameLabel), {
    target: { value: "Jane Doe" },
  });
  fireEvent.change(screen.getByLabelText(t.booking.customer.phoneLabel), {
    target: { value: "501234567" },
  });
  fireEvent.change(screen.getByLabelText(t.booking.customer.emailLabel), {
    target: { value: "jane@example.com" },
  });
  fireEvent.click(screen.getByRole("button", { name: t.booking.customer.contactMethods.whatsapp }));
  fireEvent.click(screen.getByRole("button", { name: t.booking.navigation.next }));
}

describe("BookingForm", () => {
  it("blocks advancing past step 1 (Service) when nothing is selected", () => {
    render(<BookingForm locale="en" t={t} />);
    fireEvent.click(screen.getByRole("button", { name: t.booking.navigation.next }));

    expect(screen.getByText(t.booking.service.validation.category)).toBeInTheDocument();
    // Still on step 1 — the location step's fields must not be visible yet.
    expect(screen.queryByLabelText(t.booking.location.emirateLabel)).not.toBeInTheDocument();
  });

  it("blocks advancing past step 2 (Location & Property) when required fields are empty", () => {
    render(<BookingForm locale="en" t={t} />);
    fillServiceStep();
    fireEvent.click(screen.getByRole("button", { name: t.booking.navigation.next }));

    expect(screen.getByText(t.booking.location.validation.emirate)).toBeInTheDocument();
    expect(screen.getByText(t.booking.property.validation.type)).toBeInTheDocument();
    expect(screen.getByText(t.booking.property.validation.size)).toBeInTheDocument();
  });

  it("shows the pest-type field only for the Pest Control category, not other categories", () => {
    render(<BookingForm locale="en" t={t} />);

    fireEvent.click(screen.getByRole("button", { name: t.booking.service.categories.maintenance }));
    expect(screen.queryByLabelText(t.booking.service.pestTypeLabel)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: t.booking.service.categories["pest-control"] }));
    fireEvent.change(screen.getByLabelText(t.booking.service.serviceLabel), {
      target: { value: "pest-control" },
    });
    expect(screen.getByLabelText(t.booking.service.pestTypeLabel)).toBeInTheDocument();
  });

  it("only offers real, approved services within each category (no invented service names)", () => {
    render(<BookingForm locale="en" t={t} />);

    fireEvent.click(screen.getByRole("button", { name: t.booking.service.categories.cleaning }));
    const options = screen
      .getByLabelText(t.booking.service.serviceLabel)
      .querySelectorAll("option");
    const values = Array.from(options).map((option) => option.getAttribute("value"));
    expect(values).toEqual(["", "general-cleaning", "deep-cleaning", "water-tank-cleaning"]);
  });

  it("keeps the WhatsApp number field hidden while 'same as phone' is checked, and requires a valid one when unchecked", () => {
    render(<BookingForm locale="en" t={t} />);
    fillServiceStep();
    fillLocationAndPropertyStep();
    fillScheduleStep();

    expect(screen.queryByLabelText(t.booking.customer.whatsappLabel)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("checkbox", { name: t.booking.customer.whatsappSameAsPhoneLabel }));
    expect(screen.getByLabelText(t.booking.customer.whatsappLabel)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(t.booking.customer.nameLabel), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByLabelText(t.booking.customer.phoneLabel), {
      target: { value: "501234567" },
    });
    fireEvent.change(screen.getByLabelText(t.booking.customer.emailLabel), {
      target: { value: "jane@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: t.booking.customer.contactMethods.whatsapp }));
    fireEvent.click(screen.getByRole("button", { name: t.booking.navigation.next }));

    expect(screen.getByText(t.booking.customer.validation.whatsapp)).toBeInTheDocument();
  });

  it("walks through all 5 steps, posts to /api/booking-requests, and shows the real reference on submit", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        apiVersion: "v1",
        correlationId: "corr-1",
        data: { id: "book_test-id", status: "requested" },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<BookingForm locale="en" t={t} />);
    fillServiceStep();
    fillLocationAndPropertyStep();
    fillScheduleStep();
    fillCustomerStep();

    expect(screen.getByText(t.booking.summary.title)).toBeInTheDocument();
    expect(screen.getByText(t.booking.summary.disclaimer)).toBeInTheDocument();
    expect(screen.getByText("Jane Doe", { exact: false })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: t.booking.summary.submitButton }));

    const confirmation = await screen.findByRole("status");
    expect(confirmation).toHaveTextContent(t.booking.confirmation.title);
    expect(confirmation).toHaveTextContent(t.booking.confirmation.body);
    expect(confirmation).toHaveTextContent("book_test-id");
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/booking-requests",
      expect.objectContaining({ method: "POST" })
    );

    vi.unstubAllGlobals();
  });

  it("shows an error message instead of a confirmation when the booking API call fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    render(<BookingForm locale="en" t={t} />);
    fillServiceStep();
    fillLocationAndPropertyStep();
    fillScheduleStep();
    fillCustomerStep();

    fireEvent.click(screen.getByRole("button", { name: t.booking.summary.submitButton }));

    expect(await screen.findByRole("alert")).toHaveTextContent(t.booking.summary.errorMessage);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    vi.unstubAllGlobals();
  });

  it("prefills the category and service from initialServiceSlug on the first (service) step", () => {
    render(<BookingForm locale="en" t={t} initialServiceSlug="pest-control" />);

    expect(
      screen.getByRole("button", { name: t.booking.service.categories["pest-control"] })
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByLabelText(t.booking.service.serviceLabel)).toHaveValue("pest-control");
    expect(screen.getByLabelText(t.booking.service.pestTypeLabel)).toBeInTheDocument();
  });

  it("ignores an unrecognized initialServiceSlug rather than guessing a category", () => {
    render(<BookingForm locale="en" t={t} initialServiceSlug="not-a-real-service" />);

    for (const category of Object.values(t.booking.service.categories)) {
      expect(screen.getByRole("button", { name: category })).toHaveAttribute(
        "aria-pressed",
        "false"
      );
    }
  });

  it("prefills the emirate from initialLocationSlug once the location step is reached", () => {
    render(<BookingForm locale="en" t={t} initialLocationSlug="abu-dhabi" />);
    fillServiceStep();

    expect(screen.getByLabelText(t.booking.location.emirateLabel)).toHaveValue("abu-dhabi");
  });

  it("ignores an unrecognized initialLocationSlug rather than guessing an emirate", () => {
    render(<BookingForm locale="en" t={t} initialLocationSlug="riyadh" />);
    fillServiceStep();

    expect(screen.getByLabelText(t.booking.location.emirateLabel)).toHaveValue("");
  });

  it("renders the Arabic labels for the ar locale without crashing", () => {
    const tAr = getMessages("ar");
    render(<BookingForm locale="ar" t={tAr} />);
    expect(
      screen.getByRole("button", { name: tAr.booking.service.categories.maintenance })
    ).toBeInTheDocument();
  });
});
