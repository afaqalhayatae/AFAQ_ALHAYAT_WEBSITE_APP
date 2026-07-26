/**
 * PROVISIONAL (M1.1) — 08_DIGITAL_SYSTEMS/DATA_MODEL.md is Status: Draft —
 * Contract Review Required. Enquiry: "customer need, source, status, and
 * safe free-text handling."
 */

import type { Enquiry } from "@/types/domain";
import type {
  AuditEventRepository,
  EnquiryRepository,
} from "@/lib/adapters/types";
import { generateId, writeAuditEvent } from "./audit";

export interface SubmitEnquiryInput {
  customerId: string;
  need: string;
  source: string;
  actor: string;
}

export function submitEnquiry(
  deps: { enquiries: EnquiryRepository; auditEvents: AuditEventRepository },
  input: SubmitEnquiryInput
): Enquiry {
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

  deps.enquiries.create(enquiry);
  writeAuditEvent(deps.auditEvents, {
    actor: input.actor,
    action: "enquiry.submitted",
    target: enquiry.id,
    outcome: "success",
  });

  return enquiry;
}
