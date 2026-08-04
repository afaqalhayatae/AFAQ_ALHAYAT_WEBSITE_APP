/**
 * API boundary for Enquiry per 08_DIGITAL_SYSTEMS/API_CONTRACTS.md. Validates
 * input, delegates to the enquiry service, and returns API envelopes.
 *
 * Enquiry persistence goes through the repository factory (Database
 * Foundation Phase 1F — second controlled switchover, after Consent, see
 * 07_WEBSITE/BOOKING_SYSTEM/08_REPOSITORY_SWITCHOVER_PLAN.md). Driver is
 * selected by REPOSITORY_DRIVER (default "memory" — unset in every
 * deployed environment today, so production behavior is unchanged).
 * AuditEvent (Phase 1J — the last of the six-entity migration series)
 * also now goes through the factory.
 */

import { NextRequest, NextResponse } from "next/server";
import type { ApiEnvelope, ApiErrorBody } from "@/types/api";
import { getAuditEventRepository, getEnquiryRepository } from "@/lib/adapters/repository-factory";
import { submitEnquiry } from "@/lib/services/enquiry-service";

export const enquiryRepository = getEnquiryRepository();
export const auditEventRepository = getAuditEventRepository();

const API_VERSION = "v1";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function envelope<T>(data: T): ApiEnvelope<T> {
  return { apiVersion: API_VERSION, correlationId: crypto.randomUUID(), data };
}

function errorResponse(
  status: number,
  code: string,
  message: string,
  retryable = false
) {
  const body: ApiErrorBody = {
    apiVersion: API_VERSION,
    correlationId: crypto.randomUUID(),
    error: { code, message, retryable },
  };
  return NextResponse.json(body, { status });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(400, "invalid_json", "Request body must be valid JSON");
  }
  if (typeof body !== "object" || body === null) {
    return errorResponse(400, "invalid_body", "Request body must be a JSON object");
  }

  const { customerId, need, source, actor } = body as Record<string, unknown>;
  if (
    !isNonEmptyString(customerId) ||
    !isNonEmptyString(need) ||
    !isNonEmptyString(source) ||
    !isNonEmptyString(actor)
  ) {
    return errorResponse(
      400,
      "validation_error",
      "customerId, need, source, and actor are required non-empty strings"
    );
  }

  try {
    const enquiry = await submitEnquiry(
      { enquiries: enquiryRepository, auditEvents: auditEventRepository },
      { customerId, need, source, actor }
    );
    return NextResponse.json(envelope(enquiry), { status: 201 });
  } catch (error) {
    return errorResponse(
      400,
      "validation_error",
      error instanceof Error ? error.message : "Invalid request"
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");
  const customerId = searchParams.get("customerId");

  if (id) {
    const enquiry = await enquiryRepository.findById(id);
    if (!enquiry) {
      return errorResponse(404, "not_found", `Enquiry ${id} not found`);
    }
    return NextResponse.json(envelope(enquiry));
  }

  if (customerId) {
    return NextResponse.json(
      envelope(await enquiryRepository.findByCustomer(customerId))
    );
  }

  return errorResponse(
    400,
    "validation_error",
    "id or customerId query parameter is required"
  );
}
