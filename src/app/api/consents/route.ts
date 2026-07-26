/**
 * API boundary for Consent per 08_DIGITAL_SYSTEMS/API_CONTRACTS.md. Validates
 * input, delegates to the consent service, and returns API envelopes. No
 * Prisma queries or database connections here — repositories are the
 * in-memory adapters from src/lib/adapters/in-memory, exported so tests can
 * seed and inspect state directly.
 */

import { NextRequest, NextResponse } from "next/server";
import type { ApiEnvelope, ApiErrorBody } from "@/types/api";
import type { ConsentStatus } from "@/types/domain";
import type { ContactPoint } from "@/types/domain";
import { createInMemoryConsentStore } from "@/lib/adapters/in-memory/consent-store";
import { createInMemoryAuditEventRepository } from "@/lib/adapters/in-memory/audit-event-repository";
import { recordConsent } from "@/lib/services/consent-service";

export const consentStore = createInMemoryConsentStore();
export const auditEventRepository = createInMemoryAuditEventRepository();

const API_VERSION = "v1";
const CHANNELS: ContactPoint["channel"][] = ["phone", "whatsapp", "email"];
const STATUSES: ConsentStatus[] = ["granted", "withdrawn", "expired"];

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

  const { channel, purpose, status, source, evidence, recordedAt, actor } =
    body as Record<string, unknown>;

  if (
    !CHANNELS.includes(channel as ContactPoint["channel"]) ||
    !STATUSES.includes(status as ConsentStatus) ||
    !isNonEmptyString(purpose) ||
    !isNonEmptyString(source) ||
    !isNonEmptyString(evidence) ||
    !isNonEmptyString(recordedAt) ||
    !isNonEmptyString(actor)
  ) {
    return errorResponse(
      400,
      "validation_error",
      "channel, purpose, status, source, evidence, recordedAt, and actor are required and must be valid"
    );
  }

  try {
    const consent = recordConsent(
      { consents: consentStore, auditEvents: auditEventRepository },
      {
        channel: channel as ContactPoint["channel"],
        purpose,
        status: status as ConsentStatus,
        source,
        evidence,
        recordedAt,
        actor,
      }
    );
    return NextResponse.json(envelope(consent), { status: 201 });
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
  const channel = searchParams.get("channel");

  if (id) {
    const consent = consentStore.findById(id);
    if (!consent) {
      return errorResponse(404, "not_found", `Consent ${id} not found`);
    }
    return NextResponse.json(envelope(consent));
  }

  if (channel) {
    if (!CHANNELS.includes(channel as ContactPoint["channel"])) {
      return errorResponse(400, "validation_error", "channel is not a recognized value");
    }
    return NextResponse.json(
      envelope(consentStore.findByChannel(channel as ContactPoint["channel"]))
    );
  }

  return errorResponse(
    400,
    "validation_error",
    "id or channel query parameter is required"
  );
}
