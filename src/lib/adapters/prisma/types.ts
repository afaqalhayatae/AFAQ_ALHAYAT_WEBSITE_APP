/**
 * Async counterparts of src/lib/adapters/types.ts's repository interfaces,
 * for the Prisma-backed implementations only (Database Foundation Phase
 * 1C). Real, found tension, not papered over: the original interfaces are
 * declared synchronous (`void` / `T | undefined` returns), but a real
 * database call is inherently async. A Promise<T> is not assignable to a
 * bare T for any query method (findById, findByCustomer, etc.) — this is a
 * hard TypeScript error, not a style choice. Even for the void-returning
 * methods (create/clear/record), TypeScript's void-return bivariance would
 * silently let an async function satisfy the sync interface without ever
 * being awaited by a caller — a real correctness risk, since a caller that
 * doesn't know a call is async won't wait for the write to finish before
 * moving on (e.g. sending an HTTP response).
 *
 * Rather than change src/lib/adapters/types.ts (out of scope for Phase 1C —
 * every existing caller and every in-memory adapter assumes synchronous
 * calls today), each Prisma repository here satisfies a new, additive async
 * interface with identical method names/parameters, differing only in
 * return type. Wiring a Prisma repository into a live route (a later phase)
 * will require that route's call sites to await these calls — which likely
 * means src/lib/adapters/types.ts itself needs an async amendment at that
 * point, or routes adopt a different pattern. Neither decision is made
 * here; this file only makes the tension visible and testable.
 */

import type {
  AuditEvent,
  BookingRequest,
  Consent,
  Customer,
  Enquiry,
  QuoteRequest,
} from "@/types/domain";

export interface AsyncCustomerRepository {
  create(customer: Customer): Promise<void>;
  findById(id: Customer["id"]): Promise<Customer | undefined>;
  clear(): Promise<void>;
}

export interface AsyncEnquiryRepository {
  create(enquiry: Enquiry): Promise<void>;
  findById(id: Enquiry["id"]): Promise<Enquiry | undefined>;
  findByCustomer(customerId: Enquiry["customerId"]): Promise<Enquiry[]>;
  clear(): Promise<void>;
}

export interface AsyncBookingRequestRepository {
  create(bookingRequest: BookingRequest): Promise<void>;
  findById(id: BookingRequest["id"]): Promise<BookingRequest | undefined>;
  findByService(serviceId: BookingRequest["serviceId"]): Promise<BookingRequest[]>;
  findByCustomer(customerId: BookingRequest["customerId"]): Promise<BookingRequest[]>;
  clear(): Promise<void>;
}

export interface AsyncQuoteRequestRepository {
  create(quoteRequest: QuoteRequest): Promise<void>;
  findById(id: QuoteRequest["id"]): Promise<QuoteRequest | undefined>;
  findByService(serviceId: QuoteRequest["serviceId"]): Promise<QuoteRequest[]>;
  findByCustomer(customerId: QuoteRequest["customerId"]): Promise<QuoteRequest[]>;
  clear(): Promise<void>;
}

export interface AsyncConsentStore {
  record(consent: Consent): Promise<void>;
  findById(id: Consent["id"]): Promise<Consent | undefined>;
  findByChannel(channel: Consent["channel"]): Promise<Consent[]>;
  clear(): Promise<void>;
}

export interface AsyncAuditEventRepository {
  record(event: AuditEvent): Promise<void>;
  findByActor(actor: AuditEvent["actor"]): Promise<AuditEvent[]>;
  clear(): Promise<void>;
}
