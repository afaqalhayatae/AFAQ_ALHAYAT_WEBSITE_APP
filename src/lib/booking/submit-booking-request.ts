import type { Locale } from "@/i18n/config";
import type {
  BookingCategory,
  ContactMethod,
  PestType,
  PropertySize,
  PropertyType,
  TimeSlot,
} from "@/lib/catalog/booking-options";

/**
 * Professional Booking System Foundation — the full shape of one
 * customer's request, independent of the multi-step wizard UI that
 * collects it. This is the contract a real backend integration will
 * receive; keeping it as one typed object (rather than passing loose
 * form fields around) is what makes swapping the body of
 * `submitBookingRequest` below for a real API call a contained,
 * low-risk change instead of a rewrite.
 */
export type BookingRequestPayload = {
  customer: {
    name: string;
    phoneE164: string;
    whatsappE164: string;
    email: string;
    preferredContactMethod: ContactMethod;
  };
  location: {
    emirateSlug: string;
    area: string;
  };
  property: {
    type: PropertyType;
    size: PropertySize;
    notes: string;
  };
  service: {
    category: BookingCategory;
    serviceSlug: string;
    pestType?: PestType;
  };
  appointment: {
    date: string;
    timeSlot: TimeSlot;
  };
  problem: {
    description: string;
    /**
     * File *names* only today (the upload field is prepared, not wired —
     * see the DATABASE integration point below for what changes once
     * real file storage exists).
     */
    fileNames: string[];
  };
  locale: Locale;
};

export type BookingSubmissionResult =
  | {
      /**
       * The request reached the server, was validated against the real
       * approved service/emirate catalogs, and was stored as a real
       * `BookingRequest` record via the same `requestBooking()` service
       * `/api/bookings` already uses (Homepage Foundation Alignment,
       * booking-persistence decision). Storage is still in-memory —
       * it does not survive a server restart and isn't shared across
       * multiple server instances — and nothing yet notifies a human
       * (no CRM/email/WhatsApp integration exists). Real production
       * durability still needs a live database or a notification
       * channel; see the INTEGRATION POINT comments below.
       */
      status: "received";
      reference: string;
    }
  | {
      /**
       * The server rejected the request (e.g. an unrecognized service/
       * emirate slug, or the API being unreachable) — nothing was
       * stored. `message` is the server's error message, safe to show
       * as-is since it never contains invented facts, just validation
       * detail.
       */
      status: "failed";
      message: string;
    };

/**
 * Single entry point a real backend integration will eventually extend.
 * Deliberately isolated from `BookingForm` (which only calls this
 * function and reacts to its result) so each integration point below can
 * be built and tested independently, without touching the form's UI code.
 *
 * Posts to `/api/booking-requests` (src/app/api/booking-requests/route.ts),
 * which validates, resolves the service/emirate slugs against the
 * approved catalogs, creates a guest Customer record, and stores a real
 * BookingRequest — no longer a client-side-only fake. What's still
 * missing is covered by the INTEGRATION POINT comments below.
 */
export async function submitBookingRequest(
  payload: BookingRequestPayload
): Promise<BookingSubmissionResult> {
  // ---------------------------------------------------------------
  // INTEGRATION POINT — DURABLE DATABASE
  // /api/booking-requests stores the record in-memory today (no live
  // database is reachable in this environment yet). Once a real
  // database is provisioned and Prisma is migrated against it, that
  // route's in-memory repositories are the only thing that needs to
  // change — this function itself needs no changes.
  // ---------------------------------------------------------------

  // ---------------------------------------------------------------
  // INTEGRATION POINT — CRM
  // Push a new lead/opportunity to the CRM (see
  // 08_DIGITAL_SYSTEMS/AUTOMATION for the approved CRM integration
  // once selected) so the sales/dispatch team sees the request without
  // needing direct database access.
  // Example shape once wired:
  //   await crmClient.createLead({ ...payload, source: "website-booking-form" });
  // ---------------------------------------------------------------

  // ---------------------------------------------------------------
  // INTEGRATION POINT — WHATSAPP API
  // Send the customer a WhatsApp confirmation/acknowledgement message
  // via the WhatsApp Business API (only once `payload.customer.whatsappE164`
  // is a real, deliverable number and the Owner has approved the
  // message template — never invent message copy here ahead of that).
  // Example shape once wired:
  //   await whatsAppClient.sendTemplateMessage(payload.customer.whatsappE164, "booking_received_v1", {...});
  // ---------------------------------------------------------------

  // ---------------------------------------------------------------
  // INTEGRATION POINT — PAYMENT GATEWAY (future, optional)
  // Only relevant if the business ever requires a deposit/prepayment
  // at booking time — no such requirement is approved today (pricing
  // is A4-gated per AUTONOMY_AND_APPROVAL_MATRIX.md). If that changes,
  // this is where a payment-intent would be created and its result
  // would gate whether `status` below can become `"confirmed"`.
  // Example shape once wired:
  //   const paymentIntent = await paymentGateway.createIntent({ amount, currency: "AED" });
  // ---------------------------------------------------------------

  try {
    const response = await fetch("/api/booking-requests", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await response.json();
    if (!response.ok) {
      return { status: "failed", message: body?.error?.message ?? "Booking request failed" };
    }
    return { status: "received", reference: body.data.id };
  } catch {
    return { status: "failed", message: "Could not reach the booking service" };
  }
}
