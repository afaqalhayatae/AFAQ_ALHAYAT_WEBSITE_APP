/**
 * Account API boundary — "my bookings" (JOB-AGT-WEB-20260726-M2.4).
 * Resolves the caller's identity strictly from the session cookie (never
 * from a client-supplied id) and reads the booking requests recorded
 * against the matching contact value — the same customerId bridge already
 * used by src/app/api/account/requests/route.ts for enquiries, now
 * possible for bookings because BookingRequest gained a real customerId in
 * M2.3 (src/lib/services/booking-service.ts).
 */

import { NextResponse } from "next/server";
import { resolveCurrentUser } from "@/app/api/auth/_lib/require-user";
import { bookingRepository } from "@/app/api/bookings/route";
import { envelope, errorResponse } from "../_lib/http";

export async function GET() {
  const user = await resolveCurrentUser();
  if (!user) {
    return errorResponse(401, "not_authenticated", "No active session");
  }

  const bookingRequests = await bookingRepository.findByCustomer(user.contact.value);
  return NextResponse.json(envelope(bookingRequests), { status: 200 });
}
