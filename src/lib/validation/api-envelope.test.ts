import { describe, expect, it } from "vitest";
import {
  isApiEnvelope,
  isApiErrorBody,
  isPaginationParams,
} from "./api-envelope";

function isString(value: unknown): value is string {
  return typeof value === "string";
}

describe("isApiEnvelope", () => {
  it("accepts a valid envelope", () => {
    expect(
      isApiEnvelope(
        { apiVersion: "1.0", correlationId: "corr-1", data: "ok" },
        isString
      )
    ).toBe(true);
  });

  it("rejects a missing correlationId", () => {
    expect(
      isApiEnvelope({ apiVersion: "1.0", data: "ok" }, isString)
    ).toBe(false);
  });

  it("rejects data that fails the inner guard", () => {
    expect(
      isApiEnvelope(
        { apiVersion: "1.0", correlationId: "corr-1", data: 42 },
        isString
      )
    ).toBe(false);
  });
});

describe("isApiErrorBody", () => {
  it("accepts a valid error body", () => {
    expect(
      isApiErrorBody({
        apiVersion: "1.0",
        correlationId: "corr-1",
        error: { code: "NOT_FOUND", message: "test", retryable: false },
      })
    ).toBe(true);
  });

  it("rejects a non-boolean retryable flag", () => {
    expect(
      isApiErrorBody({
        apiVersion: "1.0",
        correlationId: "corr-1",
        error: { code: "NOT_FOUND", message: "test", retryable: "no" },
      })
    ).toBe(false);
  });
});

describe("isPaginationParams", () => {
  it("accepts params without a cursor", () => {
    expect(isPaginationParams({ limit: 20 })).toBe(true);
  });

  it("accepts params with a cursor", () => {
    expect(isPaginationParams({ cursor: "abc", limit: 20 })).toBe(true);
  });

  it("rejects a non-positive limit", () => {
    expect(isPaginationParams({ limit: 0 })).toBe(false);
  });

  it("rejects a non-integer limit", () => {
    expect(isPaginationParams({ limit: 1.5 })).toBe(false);
  });
});
