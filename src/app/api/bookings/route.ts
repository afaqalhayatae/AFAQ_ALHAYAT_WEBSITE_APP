/**
 * API boundary for Booking Request per 08_DIGITAL_SYSTEMS/API_CONTRACTS.md.
 * Validates input, delegates to the booking service, and returns API
 * envelopes. No Prisma queries or database connections here — repositories
 * are the in-memory adapters from src/lib/adapters/in-memory, exported so
 * tests can seed and inspect state directly (including the Service /
 * ServiceArea catalogs the booking service validates against).
 */

import { NextRequest, NextResponse } from "next/server";
import type { ApiEnvelope, ApiErrorBody } from "@/types/api";
import type { ServiceAreaId, ServiceId } from "@/types/domain";
import { createInMemoryBookingRequestRepository } from "@/lib/adapters/in-memory/booking-request-repository";
import { createInMemoryServiceRepository } from "@/lib/adapters/in-memory/service-repository";
import { createInMemoryServiceAreaRepository } from "@/lib/adapters/in-memory/service-area-repository";
import { createInMemoryAuditEventRepository } from "@/lib/adapters/in-memory/audit-event-repository";
import { requestBooking } from "@/lib/services/booking-service";
import { UnknownServiceAreaError, UnknownServiceError } from "@/lib/services/errors";

export const bookingRepository = createInMemoryBookingRequestRepository();
export const serviceRepository = createInMemoryServiceRepository();
export const serviceAreaRepository = createInMemoryServiceAreaRepository();
export const auditEventRepository = createInMemoryAuditEventRepository();

const API_VERSION = "v1";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isServiceId(value: unknown): value is ServiceId {
  return typeof value === "string" && value.startsWith("SVC-");
}

function isServiceAreaId(value: unknown): value is ServiceAreaId {
  return typeof value === "string" && value.startsWith("LOC-AE-");
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

  const { serviceId, serviceAreaId, schedulePreference, actor } =
    body as Record<string, unknown>;

  if (
    !isServiceId(serviceId) ||
    !isServiceAreaId(serviceAreaId) ||
    !isNonEmptyString(schedulePreference) ||
    !isNonEmptyString(actor)
  ) {
    return errorResponse(
      400,
      "validation_error",
      "serviceId (SVC-*), serviceAreaId (LOC-AE-*), schedulePreference, and actor are required"
    );
  }

  try {
    const bookingRequest = requestBooking(
      {
        bookings: bookingRepository,
        services: serviceRepository,
        serviceAreas: serviceAreaRepository,
        auditEvents: auditEventRepository,
      },
      {
        serviceId,
        serviceAreaId,
        schedulePreference,
        actor,
      }
    );
    return NextResponse.json(envelope(bookingRequest), { status: 201 });
  } catch (error) {
    if (error instanceof UnknownServiceError || error instanceof UnknownServiceAreaError) {
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
    const bookingRequest = bookingRepository.findById(id);
    if (!bookingRequest) {
      return errorResponse(404, "not_found", `Booking request ${id} not found`);
    }
    return NextResponse.json(envelope(bookingRequest));
  }

  if (serviceId) {
    if (!isServiceId(serviceId)) {
      return errorResponse(400, "validation_error", "serviceId is not a valid Service id");
    }
    return NextResponse.json(envelope(bookingRepository.findByService(serviceId)));
  }

  return errorResponse(
    400,
    "validation_error",
    "id or serviceId query parameter is required"
  );
}
