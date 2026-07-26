import { beforeEach, describe, expect, it } from "vitest";
import { createInMemoryCustomerRepository } from "./customer-repository";
import type { Customer } from "@/types/domain";
import type { CustomerRepository } from "@/lib/adapters/types";

const sample: Customer = {
  id: "cust-1",
  contactPoints: [{ channel: "email", value: "test@example.test" }],
};

describe("in-memory CustomerRepository", () => {
  let repo: CustomerRepository;

  beforeEach(() => {
    repo = createInMemoryCustomerRepository();
  });

  it("creates and finds a customer by id", () => {
    repo.create(sample);
    expect(repo.findById("cust-1")).toEqual(sample);
    expect(repo.findById("missing")).toBeUndefined();
  });

  it("clears all customers", () => {
    repo.create(sample);
    repo.clear();
    expect(repo.findById("cust-1")).toBeUndefined();
  });
});
