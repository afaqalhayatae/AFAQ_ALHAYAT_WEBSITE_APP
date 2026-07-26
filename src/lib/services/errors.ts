/**
 * Typed rejection reasons for the service layer. Each error ties to a
 * specific rule in 08_DIGITAL_SYSTEMS/DATA_MODEL.md (Status: Approved,
 * v0.2).
 */

export class UnknownServiceError extends Error {
  constructor(serviceId: string) {
    super(`Unknown service: ${serviceId}`);
    this.name = "UnknownServiceError";
  }
}

export class UnknownServiceAreaError extends Error {
  constructor(serviceAreaId: string) {
    super(`Unknown service area: ${serviceAreaId}`);
    this.name = "UnknownServiceAreaError";
  }
}

export class UnknownBookingRequestError extends Error {
  constructor(bookingRequestId: string) {
    super(`Unknown booking request: ${bookingRequestId}`);
    this.name = "UnknownBookingRequestError";
  }
}

export class UnknownApprovalError extends Error {
  constructor(approvalId: string) {
    super(`Unknown approval: ${approvalId}`);
    this.name = "UnknownApprovalError";
  }
}

/**
 * DATA_MODEL.md: "Interaction: channel event linked to consent and
 * retention rules." Raised when the referenced Consent id does not exist,
 * is not decision-equivalent "granted", or its channel does not match the
 * interaction's channel.
 */
export class ConsentRequiredError extends Error {
  constructor(consentId: string) {
    super(`No granted, matching consent on record for id: ${consentId}`);
    this.name = "ConsentRequiredError";
  }
}

/**
 * DATA_MODEL.md: "Work Order: created only by an approved operational
 * workflow." Raised when the referenced Approval is missing or not
 * decision: "approved".
 */
export class ApprovalRequiredError extends Error {
  constructor(approvalId: string) {
    super(`Approval ${approvalId} is not an approved decision`);
    this.name = "ApprovalRequiredError";
  }
}

/**
 * DATA_MODEL.md Rules: "An Approval must match the exact action instance —
 * target type and target ID — that it authorizes." Raised when an approved
 * Approval exists but its targetType/targetId does not match the entity
 * being created.
 */
export class ApprovalTargetMismatchError extends Error {
  constructor(approvalId: string, expectedTargetId: string) {
    super(
      `Approval ${approvalId} does not target ${expectedTargetId}`
    );
    this.name = "ApprovalTargetMismatchError";
  }
}

/** Raised when an Approval is re-decided instead of decided exactly once. */
export class ApprovalAlreadyDecidedError extends Error {
  constructor(approvalId: string) {
    super(`Approval ${approvalId} already has a recorded decision`);
    this.name = "ApprovalAlreadyDecidedError";
  }
}

/** Raised when an Approval is decided after its expiresAt timestamp. */
export class ApprovalExpiredError extends Error {
  constructor(approvalId: string) {
    super(`Approval ${approvalId} expired before it was decided`);
    this.name = "ApprovalExpiredError";
  }
}
