import { beforeEach, describe, expect, it } from "vitest";
import { createInMemoryInteractionRepository } from "./interaction-repository";
import type { Interaction } from "@/types/domain";
import type { InteractionRepository } from "@/lib/adapters/types";

const sample: Interaction = {
  id: "int-1",
  channel: "whatsapp",
  consentId: "consent-1",
  occurredAt: "2026-07-26T00:00:00.000Z",
};

describe("in-memory InteractionRepository", () => {
  let repo: InteractionRepository;

  beforeEach(() => {
    repo = createInMemoryInteractionRepository();
  });

  it("records and finds interactions by consent", () => {
    repo.record(sample);
    expect(repo.findByConsent("consent-1")).toEqual([sample]);
    expect(repo.findByConsent("other")).toEqual([]);
  });

  it("clears all interactions", () => {
    repo.record(sample);
    repo.clear();
    expect(repo.findByConsent("consent-1")).toEqual([]);
  });
});
