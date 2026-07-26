/**
 * Account API boundary — "my enquiries" (JOB-AGT-WEB-20260726-M2.2).
 * Resolves the caller's identity strictly from the session cookie (never
 * from a client-supplied id) and reads the enquiries recorded against the
 * matching contact value. This is the only linkage available today:
 * Enquiry has no relation to a User or Customer beyond the free-form
 * customerId string it was submitted with (see src/lib/services/
 * enquiry-service.ts) — the same contact value used at registration.
 *
 * BookingRequest and QuoteRequest have no customer/user linkage at all in
 * the approved domain model (see src/types/domain.ts and
 * prisma/schema.prisma), so there is no equivalent endpoint for them here —
 * see the M2.2 job report.
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

  const enquiries = enquiryRepository.findByCustomer(user.contact.value);
  return NextResponse.json(envelope(enquiries), { status: 200 });
}
