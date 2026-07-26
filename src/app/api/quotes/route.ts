/**
 * API boundary for Quote Request per 08_DIGITAL_SYSTEMS/API_CONTRACTS.md.
 * Validates input, delegates to the quote service, and returns API
 * envelopes. No Prisma queries or database connections here — repositories
 * are the in-memory adapters from src/lib/adapters/in-memory, exported so
 * tests can seed and inspect state directly (including the Service catalog
 * the quote service validates against).
 *
 * requestQuote's input type has no price field — the route body is likewise
 * never given a price to forward, so it is structurally impossible to
 * submit a price through this endpoint.
 */

import { NextRequest, NextResponse } from "next/server";
import type { ApiEnvelope, ApiErrorBody } from "@/types/api";
import type { ServiceId } from "@/types/domain";
import { createInMemoryQuoteRequestRepository } from "@/lib/adapters/in-memory/quote-request-repository";
import { createInMemoryServiceRepository } from "@/lib/adapters/in-memory/service-repository";
import { createInMemoryAuditEventRepository } from "@/lib/adapters/in-memory/audit-event-repository";
import { requestQuote } from "@/lib/services/quote-service";
import { UnknownServiceError } from "@/lib/services/errors";

export const quoteRepository = createInMemoryQuoteRequestRepository();
export const serviceRepository = createInMemoryServiceRepository();
export const auditEventRepository = createInMemoryAuditEventRepository();

const API_VERSION = "v1";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isServiceId(value: unknown): value is ServiceId {
  return typeof value === "string" && value.startsWith("SVC-");
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
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

  const { serviceId, requirements, evidence, actor } = body as Record<string, unknown>;

  if (
    !isServiceId(serviceId) ||
    !isNonEmptyString(requirements) ||
    !isStringArray(evidence) ||
    !isNonEmptyString(actor)
  ) {
    return errorResponse(
      400,
      "validation_error",
      "serviceId (SVC-*), requirements, evidence (string[]), and actor are required"
    );
  }

  try {
    const quoteRequest = requestQuote(
      { quotes: quoteRepository, services: serviceRepository, auditEvents: auditEventRepository },
      { serviceId, requirements, evidence, actor }
    );
    return NextResponse.json(envelope(quoteRequest), { status: 201 });
  } catch (error) {
    if (error instanceof UnknownServiceError) {
      return errorResponse(404, "not_found", error.message);
    }
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
  const serviceId = searchParams.get("serviceId");

  if (id) {
    const quoteRequest = quoteRepository.findById(id);
    if (!quoteRequest) {
      return errorResponse(404, "not_found", `Quote request ${id} not found`);
    }
    return NextResponse.json(envelope(quoteRequest));
  }

  if (serviceId) {
    if (!isServiceId(serviceId)) {
      return errorResponse(400, "validation_error", "serviceId is not a valid Service id");
    }
    return NextResponse.json(envelope(quoteRepository.findByService(serviceId)));
  }

  return errorResponse(
    400,
    "validation_error",
    "id or serviceId query parameter is required"
  );
}
