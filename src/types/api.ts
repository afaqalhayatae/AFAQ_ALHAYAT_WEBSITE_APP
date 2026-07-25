/**
 * Typed API contract placeholders per 08_DIGITAL_SYSTEMS/API_CONTRACTS.md.
 * No live endpoints or fetch implementations — shapes only.
 */

export interface ApiEnvelope<T> {
  apiVersion: string;
  correlationId: string;
  data: T;
}

export interface ApiErrorBody {
  apiVersion: string;
  correlationId: string;
  error: {
    code: string;
    message: string;
    retryable: boolean;
  };
}

export interface PaginationParams {
  cursor?: string;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  nextCursor: string | null;
}
