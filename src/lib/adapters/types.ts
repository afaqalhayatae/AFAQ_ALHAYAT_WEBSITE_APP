/**
 * Adapter interfaces. Per 08_DIGITAL_SYSTEMS/API_CONTRACTS.md, integrations
 * are treated as adapters so provider-specific behavior never leaks into
 * domain code. Only in-memory, test-only implementations exist so far.
 *
 * Interfaces below mirror every core entity in
 * 08_DIGITAL_SYSTEMS/DATA_MODEL.md (Status: Approved, v0.2).
 */

import type {
  Approval,
  AuditEvent,
  BookingRequest,
  Consent,
  ContactPoint,
  Customer,
  Enquiry,
  Interaction,
  QuoteRequest,
  Service,
  ServiceArea,
  WorkOrder,
} from "@/types/domain";
import type { PasswordCredential, Session, User } from "@/types/identity";

export interface ConsentStore {
  record(consent: Consent): void;
  findById(id: Consent["id"]): Consent | undefined;
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
  /** Added in JOB-AGT-WEB-20260726-M2.4 to power the account dashboard's Bookings page. */
  findByCustomer(customerId: BookingRequest["customerId"]): BookingRequest[];
  clear(): void;
}

export interface QuoteRequestRepository {
  create(quoteRequest: QuoteRequest): void;
  findById(id: QuoteRequest["id"]): QuoteRequest | undefined;
  findByService(serviceId: QuoteRequest["serviceId"]): QuoteRequest[];
  /** Added in JOB-AGT-WEB-20260726-M2.4 to power the account dashboard's Quotes page. */
  findByCustomer(customerId: QuoteRequest["customerId"]): QuoteRequest[];
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
  findByTarget(
    targetType: Approval["targetType"],
    targetId: Approval["targetId"]
  ): Approval[];
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

/**
 * Identity layer (JOB-AGT-WEB-20260726-M2.1). Repositories and provider
 * adapters for the "Auth Provider Adapter" and "Session Management" layers
 * in the approved architecture:
 *   UI -> Auth API Boundary -> Identity Service -> Auth Provider Adapter -> Session Management
 */

export interface UserRepository {
  create(user: User): void;
  findById(id: User["id"]): User | undefined;
  findByContact(channel: ContactPoint["channel"], value: string): User | undefined;
  update(user: User): void;
  clear(): void;
}

export interface CredentialRepository {
  set(credential: PasswordCredential): void;
  findByUserId(userId: User["id"]): PasswordCredential | undefined;
  clear(): void;
}

export interface SessionRepository {
  create(session: Session): void;
  findById(id: Session["id"]): Session | undefined;
  revoke(id: Session["id"]): void;
  clear(): void;
}

/** The only Auth Provider Adapter implemented in M2.1 — see src/lib/adapters/password. */
export interface PasswordAuthProviderAdapter {
  hash(password: string): { hash: string; salt: string };
  verify(password: string, hash: string, salt: string): boolean;
}

/**
 * Google Sign-In adapter (Google Login upgrade). Implements the
 * Authorization Code + PKCE flow per
 * 07_WEBSITE/IMPLEMENTATION/08_AUTHENTICATION_ARCHITECTURE.md §5/§14.3 —
 * see src/lib/adapters/google/google-oauth-provider.ts for the real
 * implementation (google-auth-library) and src/lib/services/oauth-state.ts
 * for the signed-state CSRF/PKCE-carrier helper the route layer uses
 * alongside this adapter.
 */
export interface GoogleAuthProviderAdapter {
  /** Builds the URL the browser is redirected to, with PKCE code_challenge and the caller-supplied signed state. */
  getAuthorizationUrl(params: { state: string; codeChallenge: string }): string;
  /** Exchanges the authorization code (+ PKCE code_verifier) for tokens and returns the raw ID token. */
  exchangeCodeForIdToken(params: { code: string; codeVerifier: string }): Promise<string>;
  /** Verifies an ID token's signature/audience/issuer and returns its verified claims. Never "decode and trust." */
  verifyIdToken(idToken: string): Promise<{
    providerAccountId: string;
    email: string;
    emailVerified: boolean;
    displayName?: string;
    avatarUrl?: string;
  }>;
}

/**
 * Extension point for a future Apple Sign In adapter, per
 * 08_AUTHENTICATION_ARCHITECTURE.md §6. Not implemented — Apple requires an
 * active paid Developer Program membership and a self-signed, rotating
 * client-secret JWT; none of that exists, and none should be added without
 * separate approval. Declared only so "keep the system expandable" has a
 * real, typed target when that work is actually authorized.
 */
export interface AppleAuthProviderAdapter {
  verifyIdToken(idToken: string): Promise<{
    providerAccountId: string;
    email?: string;
    emailVerified: boolean;
  }>;
}

/**
 * Extension point for a future Facebook Login adapter, same status as
 * AppleAuthProviderAdapter — not implemented, no dependency added, no
 * credential exists. Facebook doesn't issue an OIDC ID token the way
 * Google/Apple do; a real implementation would call the Graph API's
 * `/me` endpoint with the access token instead of verifying a JWT, which
 * is why this shape differs slightly from the other two providers.
 */
export interface FacebookAuthProviderAdapter {
  fetchProfile(accessToken: string): Promise<{
    providerAccountId: string;
    email?: string;
    emailVerified: boolean;
    displayName?: string;
  }>;
}

/**
 * Extension point for a future phone OTP adapter ("prepare for" in
 * JOB-AGT-WEB-20260726-M2.1). Not implemented — scope prohibits connecting a
 * production SMS provider or shipping a fake OTP flow.
 */
export interface PhoneOtpAuthProviderAdapter {
  sendCode(phoneNumber: string): Promise<void>;
  verifyCode(phoneNumber: string, code: string): Promise<boolean>;
}
