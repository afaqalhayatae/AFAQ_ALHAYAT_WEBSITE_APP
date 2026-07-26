/**
 * PROVISIONAL (M1.1) — 08_DIGITAL_SYSTEMS/DATA_MODEL.md is Status: Draft —
 * Contract Review Required. Quote Request: "requirements and evidence;
 * never an approved price by itself." QuoteRequestInput has no price field
 * — it is structurally impossible to submit a price through this function.
 */

import type { QuoteRequest } from "@/types/domain";
import type {
  AuditEventRepository,
  QuoteRequestRepository,
  ServiceRepository,
} from "@/lib/adapters/types";
import { generateId, writeAuditEvent } from "./audit";
import { UnknownServiceError } from "./errors";

export interface RequestQuoteInput {
  serviceId: QuoteRequest["serviceId"];
  requirements: string;
  evidence: string[];
  actor: string;
}

export function requestQuote(
  deps: {
    quotes: QuoteRequestRepository;
    services: ServiceRepository;
    auditEvents: AuditEventRepository;
  },
  input: RequestQuoteInput
): QuoteRequest {
  if (!deps.services.findById(input.serviceId)) {
    throw new UnknownServiceError(input.serviceId);
  }
  if (!input.requirements) {
    throw new Error("requirements is required");
  }

  const quoteRequest: QuoteRequest = {
    id: generateId("quote"),
    serviceId: input.serviceId,
    requirements: input.requirements,
    evidence: input.evidence,
  };

  deps.quotes.create(quoteRequest);
  writeAuditEvent(deps.auditEvents, {
    actor: input.actor,
    action: "quote_request.requested",
    target: quoteRequest.id,
    outcome: "success",
  });

  return quoteRequest;
}
