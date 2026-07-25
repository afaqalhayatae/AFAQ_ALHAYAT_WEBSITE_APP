/**
 * Typed contract placeholders for the core entities defined in
 * 08_DIGITAL_SYSTEMS/DATA_MODEL.md. That document is Status: Draft —
 * Contract Review Required, so these shapes are provisional and carry no
 * runtime data, seed data, or Prisma models yet.
 */

export type ServiceId = `SVC-${string}`;
export type ServiceAreaId = `LOC-AE-${string}`;

export interface Service {
  id: ServiceId;
}

export interface ServiceArea {
  id: ServiceAreaId;
}

export interface ContactPoint {
  channel: "phone" | "whatsapp" | "email";
  value: string;
}

export interface Customer {
  id: string;
  contactPoints: ContactPoint[];
}

export type ConsentStatus = "granted" | "withdrawn" | "expired";

export interface Consent {
  channel: ContactPoint["channel"];
  purpose: string;
  status: ConsentStatus;
  source: string;
  evidence: string;
  recordedAt: string;
}

export type EnquiryStatus = "new" | "in_progress" | "resolved" | "closed";

export interface Enquiry {
  id: string;
  customerId: Customer["id"];
  need: string;
  source: string;
  status: EnquiryStatus;
}

export type BookingRequestStatus =
  | "requested"
  | "confirmed"
  | "rescheduled"
  | "cancelled";

export interface BookingRequest {
  id: string;
  serviceId: ServiceId;
  serviceAreaId: ServiceAreaId;
  schedulePreference: string;
  status: BookingRequestStatus;
}

export interface QuoteRequest {
  id: string;
  serviceId: ServiceId;
  requirements: string;
  evidence: string[];
}

export type WorkOrderStatus = "created" | "scheduled" | "completed" | "cancelled";

export interface WorkOrder {
  id: string;
  bookingRequestId: BookingRequest["id"];
  status: WorkOrderStatus;
}

export type ApprovalRiskLevel = "A0" | "A1" | "A2" | "A3" | "A4";
export type ApprovalDecision = "pending" | "approved" | "rejected" | "expired";

export interface Approval {
  id: string;
  action: string;
  riskLevel: ApprovalRiskLevel;
  requester: string;
  decision: ApprovalDecision;
  evidence: string;
  expiresAt: string;
}

export interface Interaction {
  id: string;
  channel: ContactPoint["channel"];
  consentId: string;
  occurredAt: string;
}

export interface AuditEvent {
  id: string;
  actor: string;
  action: string;
  target: string;
  outcome: string;
  timestamp: string;
  correlationId: string;
}
