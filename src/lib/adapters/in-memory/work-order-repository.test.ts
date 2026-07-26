import { beforeEach, describe, expect, it } from "vitest";
import { createInMemoryWorkOrderRepository } from "./work-order-repository";
import type { WorkOrder } from "@/types/domain";
import type { WorkOrderRepository } from "@/lib/adapters/types";

const sample: WorkOrder = {
  id: "wo-1",
  bookingRequestId: "book-1",
  status: "created",
};

describe("in-memory WorkOrderRepository", () => {
  let repo: WorkOrderRepository;

  beforeEach(() => {
    repo = createInMemoryWorkOrderRepository();
  });

  it("creates and finds a work order by id", () => {
    repo.create(sample);
    expect(repo.findById("wo-1")).toEqual(sample);
    expect(repo.findById("missing")).toBeUndefined();
  });

  it("finds work orders by booking request", () => {
    repo.create(sample);
    expect(repo.findByBookingRequest("book-1")).toEqual([sample]);
    expect(repo.findByBookingRequest("other")).toEqual([]);
  });

  it("clears all work orders", () => {
    repo.create(sample);
    repo.clear();
    expect(repo.findById("wo-1")).toBeUndefined();
  });
});
