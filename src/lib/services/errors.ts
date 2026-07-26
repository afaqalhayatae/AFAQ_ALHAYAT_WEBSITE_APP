/**
 * PROVISIONAL (M1.1) — typed rejection reasons for the service layer.
 * 08_DIGITAL_SYSTEMS/DATA_MODEL.md is Status: Draft — Contract Review
 * Required, so these error shapes may change when it is approved.
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
 * retention rules." Raised when no granted Consent exists for the channel.
 */
export class ConsentRequiredError extends Error {
  constructor(channel: string) {
    super(`No granted consent on record for channel: ${channel}`);
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
