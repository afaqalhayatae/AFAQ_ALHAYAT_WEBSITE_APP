import { beforeEach, describe, expect, it } from "vitest";
import { createInMemoryServiceAreaRepository } from "./service-area-repository";
import type { ServiceArea } from "@/types/domain";
import type { ServiceAreaRepository } from "@/lib/adapters/types";

const sample: ServiceArea = {
  id: "LOC-AE-TEST",
};

describe("in-memory ServiceAreaRepository", () => {
  let repo: ServiceAreaRepository;

  beforeEach(() => {
    repo = createInMemoryServiceAreaRepository();
  });

  it("upserts and finds a service area by id", () => {
    repo.upsert(sample);
    expect(repo.findById("LOC-AE-TEST")).toEqual(sample);
    expect(repo.findById("LOC-AE-MISSING")).toBeUndefined();
  });

  it("lists all service areas", () => {
    repo.upsert(sample);
    expect(repo.list()).toEqual([sample]);
  });

  it("clears all service areas", () => {
    repo.upsert(sample);
    repo.clear();
    expect(repo.list()).toEqual([]);
  });
});
