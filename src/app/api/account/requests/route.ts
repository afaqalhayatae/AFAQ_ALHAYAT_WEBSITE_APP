/**
 * Account API boundary — "my enquiries" (JOB-AGT-WEB-20260726-M2.2).
 * Resolves the caller's identity strictly from the session cookie (never
 * from a client-supplied id) and reads the enquiries recorded against the
 * matching contact value. Enquiry has no relation to a User or Customer
 * beyond the free-form customerId string it was submitted with (see
 * src/lib/services/enquiry-service.ts) — the same contact value used at
 * registration. The equivalent endpoints for BookingRequest and
 * QuoteRequest (which gained a real customerId in M2.3) are
 * src/app/api/account/bookings/route.ts and
 * src/app/api/account/quotes/route.ts (JOB-AGT-WEB-20260726-M2.4).
 */

import { NextResponse } from "next/server";
import { resolveCurrentUser } from "@/app/api/auth/_lib/require-user";
import { enquiryRepository } from "@/app/api/enquiries/route";
import { envelope, errorResponse } from "../_lib/http";

export async function GET() {
  const user = await resolveCurrentUser();
  if (!user) {
    return errorResponse(401, "not_authenticated", "No active session");
  }

  const enquiries = await enquiryRepository.findByCustomer(user.contact.value);
  return NextResponse.json(envelope(enquiries), { status: 200 });
}
