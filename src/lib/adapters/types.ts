/**
 * Adapter interfaces. Per 08_DIGITAL_SYSTEMS/API_CONTRACTS.md, integrations
 * are treated as adapters so provider-specific behavior never leaks into
 * domain code. Only in-memory, test-only implementations exist so far.
 *
 * Provisional (M1): interfaces below mirror every core entity in
 * 08_DIGITAL_SYSTEMS/DATA_MODEL.md, which is Status: Draft — Contract Review
 * Required. Shapes may change when that document is approved.
 */

import type {
  Approval,
  AuditEvent,
  BookingRequest,
  Consent,
  Customer,
  Enquiry,
  Interaction,
  QuoteRequest,
  Service,
  ServiceArea,
  WorkOrder,
} from "@/types/domain";

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

export interface ServiceRepository {
  upsert(service: Service): void;
  findById(id: Service["id"]): Service | undefined;
  list(): Service[];
  clear(): void;
}

export interface ServiceAreaRepository {
  upsert(area: ServiceArea): void;
  findById(id: ServiceArea["id"]): ServiceArea | undefined;
  list(): ServiceArea[];
  clear(): void;
}

export interface CustomerRepository {
  create(customer: Customer): void;
  findById(id: Customer["id"]): Customer | undefined;
  clear(): void;
}

export interface BookingRequestRepository {
  create(bookingRequest: BookingRequest): void;
  findById(id: BookingRequest["id"]): BookingRequest | undefined;
  findByService(serviceId: BookingRequest["serviceId"]): BookingRequest[];
  clear(): void;
}

export interface QuoteRequestRepository {
  create(quoteRequest: QuoteRequest): void;
  findById(id: QuoteRequest["id"]): QuoteRequest | undefined;
  findByService(serviceId: QuoteRequest["serviceId"]): QuoteRequest[];
  clear(): void;
}

export interface WorkOrderRepository {
  create(workOrder: WorkOrder): void;
  findById(id: WorkOrder["id"]): WorkOrder | undefined;
  findByBookingRequest(
    bookingRequestId: WorkOrder["bookingRequestId"]
  ): WorkOrder[];
  clear(): void;
}

export interface ApprovalRepository {
  create(approval: Approval): void;
  findById(id: Approval["id"]): Approval | undefined;
  findByRiskLevel(riskLevel: Approval["riskLevel"]): Approval[];
  clear(): void;
}

export interface InteractionRepository {
  record(interaction: Interaction): void;
  findByConsent(consentId: Interaction["consentId"]): Interaction[];
  clear(): void;
}

export interface AuditEventRepository {
  record(event: AuditEvent): void;
  findByActor(actor: AuditEvent["actor"]): AuditEvent[];
  clear(): void;
}
