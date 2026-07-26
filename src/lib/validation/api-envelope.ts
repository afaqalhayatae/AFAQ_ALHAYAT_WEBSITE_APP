/**
 * Runtime shape guards for the API contract types in src/types/api.ts, per
 * 08_DIGITAL_SYSTEMS/API_CONTRACTS.md ("validate request shape, size, type").
 * Hand-written rather than a schema library — no new dependency for a
 * handful of flat shapes with no live endpoints consuming them yet.
 */

import type {
  ApiErrorBody,
  ApiEnvelope,
  PaginationParams,
} from "@/types/api";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

export function isApiEnvelope<T>(
  value: unknown,
  isData: (data: unknown) => data is T
): value is ApiEnvelope<T> {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    isNonEmptyString(candidate.apiVersion) &&
    isNonEmptyString(candidate.correlationId) &&
    isData(candidate.data)
  );
}

export function isApiErrorBody(value: unknown): value is ApiErrorBody {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  if (
    !isNonEmptyString(candidate.apiVersion) ||
    !isNonEmptyString(candidate.correlationId) ||
    typeof candidate.error !== "object" ||
    candidate.error === null
  ) {
    return false;
  }
  const error = candidate.error as Record<string, unknown>;
  return (
    isNonEmptyString(error.code) &&
    isNonEmptyString(error.message) &&
    typeof error.retryable === "boolean"
  );
}

export function isPaginationParams(value: unknown): value is PaginationParams {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  const cursorValid =
    candidate.cursor === undefined || typeof candidate.cursor === "string";
  return (
    cursorValid &&
    typeof candidate.limit === "number" &&
    Number.isInteger(candidate.limit) &&
    candidate.limit > 0
  );
}
