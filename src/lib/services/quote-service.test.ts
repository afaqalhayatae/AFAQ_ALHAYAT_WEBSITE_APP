import { beforeEach, describe, expect, it } from "vitest";
import { requestQuote } from "./quote-service";
import { UnknownServiceError } from "./errors";
import { createInMemoryServiceRepository } from "@/lib/adapters/in-memory/service-repository";
import { createInMemoryQuoteRequestRepository } from "@/lib/adapters/in-memory/quote-request-repository";
import { createInMemoryAuditEventRepository } from "@/lib/adapters/in-memory/audit-event-repository";
import type {
  ServiceRepository,
  QuoteRequestRepository,
  AuditEventRepository,
} from "@/lib/adapters/types";

describe("requestQuote", () => {
  let services: ServiceRepository;
  let quotes: QuoteRequestRepository;
  let auditEvents: AuditEventRepository;

  beforeEach(() => {
    services = createInMemoryServiceRepository();
    quotes = createInMemoryQuoteRequestRepository();
    auditEvents = createInMemoryAuditEventRepository();
    services.upsert({ id: "SVC-TEST-SERVICE" });
  });

  it("creates a quote request with the given evidence", () => {
    const quoteRequest = requestQuote(
      { services, quotes, auditEvents },
      {
        serviceId: "SVC-TEST-SERVICE",
        requirements: "test requirements",
        evidence: ["test-fixture.jpg"],
        actor: "test-actor",
      }
    );

    expect(quotes.findById(quoteRequest.id)).toEqual(quoteRequest);
  });

  it("rejects an unknown service", () => {
    expect(() =>
      requestQuote(
        { services, quotes, auditEvents },
        {
          serviceId: "SVC-MISSING",
          requirements: "test requirements",
          evidence: [],
          actor: "test-actor",
        }
      )
    ).toThrow(UnknownServiceError);
  });
});
