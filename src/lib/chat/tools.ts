/**
 * Tool wrappers for the chat API route. Each function here calls the
 * REAL, already-existing service layer — the same functions
 * /api/enquiries, /api/quotes, and /api/consents already call — so a
 * chat-originated lead lands in the same repositories those endpoints
 * read from, not a second parallel data path. Per
 * 08_DIGITAL_SYSTEMS/AI_CHATBOT/06_WEBSITE_INTEGRATION_PLAN.md §4.
 *
 * Reuses booking-requests/route.ts's serviceRepository/serviceAreaRepository
 * (already seeded with the real catalog on module load) rather than
 * quotes/route.ts's own instance, which — verified this session — is
 * never seeded, so requestQuote() against it would fail UnknownServiceError
 * for every real service. requestQuote() is dependency-injected, so
 * passing a properly-seeded repository from another route module is
 * correct, not a workaround.
 */
import type { Consent, ContactPoint, Customer, Enquiry, QuoteRequest, ServiceId } from "@/types/domain";
import { generateId, writeAuditEvent } from "@/lib/services/audit";
import { submitEnquiry } from "@/lib/services/enquiry-service";
import { requestQuote } from "@/lib/services/quote-service";
import { recordConsent } from "@/lib/services/consent-service";

import {
  customerRepository,
  serviceRepository,
  auditEventRepository,
} from "@/app/api/booking-requests/route";
import { enquiryRepository } from "@/app/api/enquiries/route";
import { quoteRepository } from "@/app/api/quotes/route";
import { consentStore } from "@/app/api/consents/route";

const ACTOR = "chat-widget";

// Async since Database Foundation Phase 1G's Customer switchover made
// customerRepository.create async (may be Prisma-backed, per
// 08_REPOSITORY_SWITCHOVER_PLAN.md).
async function createGuestCustomer(name: string, phoneE164: string, email?: string): Promise<Customer> {
  const contactPoints: ContactPoint[] = [
    { channel: "phone", value: phoneE164 },
    ...(email ? [{ channel: "email" as const, value: email }] : []),
  ];
  const customer: Customer = { id: generateId("cust"), contactPoints };
  await customerRepository.create(customer);
  await writeAuditEvent(auditEventRepository, {
    actor: ACTOR,
    action: "customer.created_from_chat",
    target: customer.id,
    outcome: "success",
  });
  return customer;
}

// Async since Database Foundation Phase 1F's Enquiry switchover made
// submitEnquiry async (enquiryRepository may be Prisma-backed, per
// 08_REPOSITORY_SWITCHOVER_PLAN.md) — no other tool function here changed.
export async function submitChatEnquiry(input: {
  name: string;
  phoneE164: string;
  need: string;
}): Promise<Enquiry> {
  const customer = await createGuestCustomer(input.name, input.phoneE164);
  return submitEnquiry(
    { enquiries: enquiryRepository, auditEvents: auditEventRepository },
    { customerId: customer.id, need: input.need, source: "chat-widget", actor: ACTOR }
  );
}

// Async since Database Foundation Phase 1G's Customer switchover made
// createGuestCustomer async — requestQuote/QuoteRequest itself is
// untouched (still synchronous, out of scope for this phase).
export async function submitChatQuoteRequest(input: {
  name: string;
  phoneE164: string;
  serviceId: ServiceId;
  requirements: string;
  evidence: string[];
}): Promise<QuoteRequest> {
  const customer = await createGuestCustomer(input.name, input.phoneE164);
  return requestQuote(
    { quotes: quoteRepository, services: serviceRepository, auditEvents: auditEventRepository },
    {
      customerId: customer.id,
      serviceId: input.serviceId,
      requirements: input.requirements,
      evidence: input.evidence,
      actor: ACTOR,
    }
  );
}

// Async since Database Foundation Phase 1E's Consent switchover made
// recordConsent async (consentStore may be Prisma-backed, per
// 08_REPOSITORY_SWITCHOVER_PLAN.md) — no other tool function here changed.
export async function recordChatConsent(input: {
  channel: ContactPoint["channel"];
  purpose: string;
  source: string;
  evidence: string;
}): Promise<Consent> {
  return recordConsent(
    { consents: consentStore, auditEvents: auditEventRepository },
    {
      channel: input.channel,
      purpose: input.purpose,
      status: "granted",
      source: input.source,
      evidence: input.evidence,
      recordedAt: new Date().toISOString(),
      actor: ACTOR,
    }
  );
}
