import { beforeEach, describe, expect, it } from "vitest";
import { createInMemoryServiceRepository } from "./service-repository";
import type { Service } from "@/types/domain";
import type { ServiceRepository } from "@/lib/adapters/types";

const sample: Service = {
  id: "SVC-TEST-SERVICE",
};

describe("in-memory ServiceRepository", () => {
  let repo: ServiceRepository;

  beforeEach(() => {
    repo = createInMemoryServiceRepository();
  });

  it("upserts and finds a service by id", () => {
    repo.upsert(sample);
    expect(repo.findById("SVC-TEST-SERVICE")).toEqual(sample);
    expect(repo.findById("SVC-MISSING")).toBeUndefined();
  });

  it("lists all services", () => {
    repo.upsert(sample);
    expect(repo.list()).toEqual([sample]);
  });

  it("clears all services", () => {
    repo.upsert(sample);
    repo.clear();
    expect(repo.list()).toEqual([]);
  });
});
