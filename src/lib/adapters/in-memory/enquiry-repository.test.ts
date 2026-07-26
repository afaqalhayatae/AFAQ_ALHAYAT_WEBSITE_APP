import { beforeEach, describe, expect, it } from "vitest";
import { createInMemoryEnquiryRepository } from "./enquiry-repository";
import type { Enquiry } from "@/types/domain";
import type { EnquiryRepository } from "@/lib/adapters/types";

const sample: Enquiry = {
  id: "enq-1",
  customerId: "cust-1",
  need: "test enquiry",
  source: "test",
  status: "new",
};

describe("in-memory EnquiryRepository", () => {
  let repo: EnquiryRepository;

  beforeEach(() => {
    repo = createInMemoryEnquiryRepository();
  });

  it("creates and finds an enquiry by id", () => {
    repo.create(sample);
    expect(repo.findById("enq-1")).toEqual(sample);
    expect(repo.findById("missing")).toBeUndefined();
  });

  it("finds enquiries by customer", () => {
    repo.create(sample);
    expect(repo.findByCustomer("cust-1")).toEqual([sample]);
    expect(repo.findByCustomer("other")).toEqual([]);
  });

  it("clears all enquiries", () => {
    repo.create(sample);
    repo.clear();
    expect(repo.findById("enq-1")).toBeUndefined();
  });
});
