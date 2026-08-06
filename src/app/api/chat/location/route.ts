/**
 * Chat location sharing — records a Google Maps link built from the
 * customer's browser-reported coordinates (navigator.geolocation in
 * chat-widget.tsx), so the human team can see roughly where a job is
 * without asking the customer to type an address. No reverse-geocoding
 * (would need a paid Google Maps API key, not available) — the raw
 * coordinates link is enough for a technician to open in Maps.
 */
import { NextRequest, NextResponse } from "next/server";
import type { ApiEnvelope, ApiErrorBody } from "@/types/api";
import { setSessionLocation } from "@/lib/chat/session";

const API_VERSION = "v1";

function envelope<T>(data: T): ApiEnvelope<T> {
  return { apiVersion: API_VERSION, correlationId: crypto.randomUUID(), data };
}

function errorResponse(status: number, code: string, message: string, retryable = false) {
  const body: ApiErrorBody = {
    apiVersion: API_VERSION,
    correlationId: crypto.randomUUID(),
    error: { code, message, retryable },
  };
  return NextResponse.json(body, { status });
}

function isValidSessionId(value: unknown): value is string {
  return typeof value === "string" && /^[a-zA-Z0-9-]{1,100}$/.test(value);
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

  const { sessionId, lat, lng } = body as Record<string, unknown>;
  if (!isValidSessionId(sessionId)) {
    return errorResponse(400, "validation_error", "sessionId is required and must be a valid session id");
  }
  if (
    typeof lat !== "number" ||
    typeof lng !== "number" ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    return errorResponse(400, "validation_error", "lat/lng must be finite numbers in valid range");
  }

  const url = `https://www.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}`;
  setSessionLocation(sessionId, url);

  return NextResponse.json(envelope({ url }));
}

export async function GET() {
  return errorResponse(405, "method_not_allowed", "Use POST with { sessionId, lat, lng }");
}
