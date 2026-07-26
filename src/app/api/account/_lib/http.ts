import { NextResponse } from "next/server";
import type { ApiEnvelope, ApiErrorBody } from "@/types/api";

const API_VERSION = "v1";

export function envelope<T>(data: T): ApiEnvelope<T> {
  return { apiVersion: API_VERSION, correlationId: crypto.randomUUID(), data };
}

export function errorResponse(
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
