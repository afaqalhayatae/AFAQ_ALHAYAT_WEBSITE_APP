/**
 * Adapter interfaces. Per 08_DIGITAL_SYSTEMS/API_CONTRACTS.md, integrations
 * are treated as adapters so provider-specific behavior never leaks into
 * domain code. Only in-memory, test-only implementations exist so far.
 */

import type { Consent, Enquiry } from "@/types/domain";

export interface ConsentStore {
  record(consent: Consent): void;
  findByChannel(channel: Consent["channel"]): Consent[];
  clear(): void;
}

export interface EnquiryRepository {
  create(enquiry: Enquiry): void;
  findById(id: Enquiry["id"]): Enquiry | undefined;
  findByCustomer(customerId: Enquiry["customerId"]): Enquiry[];
  clear(): void;
}
