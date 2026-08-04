/**
 * PROVISIONAL (M1.1) — 08_DIGITAL_SYSTEMS/DATA_MODEL.md is Status: Draft —
 * Contract Review Required. Enquiry: "customer need, source, status, and
 * safe free-text handling."
 */

import type { Enquiry } from "@/types/domain";
import type { AsyncEnquiryRepository, AsyncAuditEventRepository } from "@/lib/adapters/prisma/types";
import { generateId, writeAuditEvent } from "./audit";

export interface SubmitEnquiryInput {
  customerId: string;
  need: string;
  source: string;
  actor: string;
}

// enquiries (Phase 1F) and auditEvents (Phase 1J) are both now async-typed —
// both are awaited below. No business logic changed either time, only the
// repository contract each dependency satisfies.
export async function submitEnquiry(
  deps: { enquiries: AsyncEnquiryRepository; auditEvents: AsyncAuditEventRepository },
  input: SubmitEnquiryInput
): Promise<Enquiry> {
  if (!input.customerId || !input.need || !input.source) {
    throw new Error("customerId, need, and source are required");
  }

  const enquiry: Enquiry = {
    id: generateId("enq"),
    customerId: input.customerId,
    need: input.need,
    source: input.source,
    status: "new",
  };

  await deps.enquiries.create(enquiry);
  await writeAuditEvent(deps.auditEvents, {
    actor: input.actor,
    action: "enquiry.submitted",
    target: enquiry.id,
    outcome: "success",
  });

  return enquiry;
}
