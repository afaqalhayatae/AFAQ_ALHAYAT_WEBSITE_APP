import { beforeEach, describe, expect, it } from "vitest";
import { createInMemoryQuoteRequestRepository } from "./quote-request-repository";
import type { QuoteRequest } from "@/types/domain";
import type { QuoteRequestRepository } from "@/lib/adapters/types";

const sample: QuoteRequest = {
  id: "quote-1",
  serviceId: "SVC-TEST-SERVICE",
  requirements: "test requirements",
  evidence: ["test-fixture.jpg"],
};

describe("in-memory QuoteRequestRepository", () => {
  let repo: QuoteRequestRepository;

  beforeEach(() => {
    repo = createInMemoryQuoteRequestRepository();
  });

  it("creates and finds a quote request by id", () => {
    repo.create(sample);
    expect(repo.findById("quote-1")).toEqual(sample);
    expect(repo.findById("missing")).toBeUndefined();
  });

  it("finds quote requests by service", () => {
    repo.create(sample);
    expect(repo.findByService("SVC-TEST-SERVICE")).toEqual([sample]);
    expect(repo.findByService("SVC-OTHER")).toEqual([]);
  });

  it("clears all quote requests", () => {
    repo.create(sample);
    repo.clear();
    expect(repo.findById("quote-1")).toBeUndefined();
  });
});
