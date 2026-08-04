/**
 * Repository factory abstraction (Database Foundation Phase 1D). Prepared,
 * dev-only integration layer — NOT imported by any route today. See
 * 07_WEBSITE/BOOKING_SYSTEM/08_REPOSITORY_SWITCHOVER_PLAN.md for the full
 * migration plan this exists to support.
 *
 * Every function here returns the Async*Repository-typed interface
 * (src/lib/adapters/prisma/types.ts) regardless of which backend is
 * selected — including the in-memory case, via the thin async wrappers
 * below. This is what makes "environment-based selection" type-consistent:
 * a caller using this factory always gets the same async-shaped contract,
 * never a driver-specific one.
 *
 * REPOSITORY_DRIVER is read once per call, defaults to "memory" (current
 * production behavior, unchanged), and must never be set to "prisma" in
 * any deployed environment — selecting "prisma" requires a real, reachable
 * DATABASE_URL, which today only exists in local development (Phase 1B).
 */

import type {
  ConsentStore,
  CustomerRepository,
  EnquiryRepository,
  BookingRequestRepository,
  QuoteRequestRepository,
  AuditEventRepository,
} from "./types";
import type {
  AsyncConsentStore,
  AsyncCustomerRepository,
  AsyncEnquiryRepository,
  AsyncBookingRequestRepository,
  AsyncQuoteRequestRepository,
  AsyncAuditEventRepository,
} from "./prisma/types";

import { createInMemoryConsentStore } from "./in-memory/consent-store";
import { createInMemoryCustomerRepository } from "./in-memory/customer-repository";
import { createInMemoryEnquiryRepository } from "./in-memory/enquiry-repository";
import { createInMemoryBookingRequestRepository } from "./in-memory/booking-request-repository";
import { createInMemoryQuoteRequestRepository } from "./in-memory/quote-request-repository";
import { createInMemoryAuditEventRepository } from "./in-memory/audit-event-repository";

import { createPrismaConsentStore } from "./prisma/consent-store";
import { createPrismaCustomerRepository } from "./prisma/customer-repository";
import { createPrismaEnquiryRepository } from "./prisma/enquiry-repository";
import { createPrismaBookingRequestRepository } from "./prisma/booking-request-repository";
import { createPrismaQuoteRequestRepository } from "./prisma/quote-request-repository";
import { createPrismaAuditEventRepository } from "./prisma/audit-event-repository";

export type RepositoryDriver = "memory" | "prisma";

function resolveDriver(): RepositoryDriver {
  return process.env.REPOSITORY_DRIVER === "prisma" ? "prisma" : "memory";
}

function wrapConsentStore(sync: ConsentStore): AsyncConsentStore {
  return {
    async record(consent) {
      sync.record(consent);
    },
    async findById(id) {
      return sync.findById(id);
    },
    async findByChannel(channel) {
      return sync.findByChannel(channel);
    },
    async clear() {
      sync.clear();
    },
  };
}

function wrapCustomerRepository(sync: CustomerRepository): AsyncCustomerRepository {
  return {
    async create(customer) {
      sync.create(customer);
    },
    async findById(id) {
      return sync.findById(id);
    },
    async clear() {
      sync.clear();
    },
  };
}

function wrapEnquiryRepository(sync: EnquiryRepository): AsyncEnquiryRepository {
  return {
    async create(enquiry) {
      sync.create(enquiry);
    },
    async findById(id) {
      return sync.findById(id);
    },
    async findByCustomer(customerId) {
      return sync.findByCustomer(customerId);
    },
    async clear() {
      sync.clear();
    },
  };
}

function wrapBookingRequestRepository(
  sync: BookingRequestRepository
): AsyncBookingRequestRepository {
  return {
    async create(bookingRequest) {
      sync.create(bookingRequest);
    },
    async findById(id) {
      return sync.findById(id);
    },
    async findByService(serviceId) {
      return sync.findByService(serviceId);
    },
    async findByCustomer(customerId) {
      return sync.findByCustomer(customerId);
    },
    async clear() {
      sync.clear();
    },
  };
}

function wrapQuoteRequestRepository(sync: QuoteRequestRepository): AsyncQuoteRequestRepository {
  return {
    async create(quoteRequest) {
      sync.create(quoteRequest);
    },
    async findById(id) {
      return sync.findById(id);
    },
    async findByService(serviceId) {
      return sync.findByService(serviceId);
    },
    async findByCustomer(customerId) {
      return sync.findByCustomer(customerId);
    },
    async clear() {
      sync.clear();
    },
  };
}

function wrapAuditEventRepository(sync: AuditEventRepository): AsyncAuditEventRepository {
  return {
    async record(event) {
      sync.record(event);
    },
    async findByActor(actor) {
      return sync.findByActor(actor);
    },
    async clear() {
      sync.clear();
    },
  };
}

export function getConsentStore(): AsyncConsentStore {
  return resolveDriver() === "prisma"
    ? createPrismaConsentStore()
    : wrapConsentStore(createInMemoryConsentStore());
}

export function getCustomerRepository(): AsyncCustomerRepository {
  return resolveDriver() === "prisma"
    ? createPrismaCustomerRepository()
    : wrapCustomerRepository(createInMemoryCustomerRepository());
}

export function getEnquiryRepository(): AsyncEnquiryRepository {
  return resolveDriver() === "prisma"
    ? createPrismaEnquiryRepository()
    : wrapEnquiryRepository(createInMemoryEnquiryRepository());
}

export function getBookingRequestRepository(): AsyncBookingRequestRepository {
  return resolveDriver() === "prisma"
    ? createPrismaBookingRequestRepository()
    : wrapBookingRequestRepository(createInMemoryBookingRequestRepository());
}

export function getQuoteRequestRepository(): AsyncQuoteRequestRepository {
  return resolveDriver() === "prisma"
    ? createPrismaQuoteRequestRepository()
    : wrapQuoteRequestRepository(createInMemoryQuoteRequestRepository());
}

export function getAuditEventRepository(): AsyncAuditEventRepository {
  return resolveDriver() === "prisma"
    ? createPrismaAuditEventRepository()
    : wrapAuditEventRepository(createInMemoryAuditEventRepository());
}
