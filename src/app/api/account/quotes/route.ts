/**
 * Account API boundary — "my quotes" (JOB-AGT-WEB-20260726-M2.4). Resolves
 * the caller's identity strictly from the session cookie (never from a
 * client-supplied id) and reads the quote requests recorded against the
 * matching contact value — the same customerId bridge already used by
 * src/app/api/account/requests/route.ts for enquiries, now possible for
 * quotes because QuoteRequest gained a real customerId in M2.3
 * (src/lib/services/quote-service.ts).
 */

import { NextResponse } from "next/server";
import { resolveCurrentUser } from "@/app/api/auth/_lib/require-user";
import { quoteRepository } from "@/app/api/quotes/route";
import { envelope, errorResponse } from "../_lib/http";

export async function GET() {
  const user = await resolveCurrentUser();
  if (!user) {
    return errorResponse(401, "not_authenticated", "No active session");
  }

  const quoteRequests = quoteRepository.findByCustomer(user.contact.value);
  return NextResponse.json(envelope(quoteRequests), { status: 200 });
}
