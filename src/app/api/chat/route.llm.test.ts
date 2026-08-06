/**
 * Covers the LLM path branch of POST /api/chat (src/lib/chat/llm-adapter.ts
 * mocked — no real network call). The rule-based path is covered
 * separately in route.test.ts, which mocks the LLM adapter unavailable so
 * both suites stay deterministic regardless of real env state.
 */
import { describe, expect, it, vi } from "vitest";
import { enquiryRepository } from "@/app/api/enquiries/route";

vi.mock("@/lib/chat/llm-adapter", () => ({
  checkLlmAvailability: () => ({ available: true }),
  runLlmTurn: async ({
    onRecordLead,
  }: {
    onRecordLead: (args: { name: string; phoneE164: string; need: string }) => Promise<string>;
  }) => {
    const toolResult = await onRecordLead({
      name: "Ahmed",
      phoneE164: "+971501234567",
      need: "AC not cooling",
    });
    return { reply: `Got it — ${toolResult}`, leadRecorded: true };
  },
}));

const { POST } = await import("./route");

function req(body: unknown) {
  return new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  }) as unknown as Parameters<typeof POST>[0];
}

describe("POST /api/chat — LLM path", () => {
  it("uses the LLM adapter when available and records a real Enquiry via the record_lead tool callback", async () => {
    const sessionId = `test-llm-${crypto.randomUUID()}`;
    const response = await POST(req({ sessionId, message: "I need AC repair, I'm Ahmed, 0501234567" }));
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data.complete).toBe(true);
    expect(body.data.submission.recorded).toBe(true);
    expect(body.data.submission.reference).toBeTruthy();
    expect(body.data.replies[0].en).toContain("Got it");
    expect(body.data.replies[0].ar).toBe(body.data.replies[0].en);

    const created = await enquiryRepository.findById(body.data.submission.reference);
    expect(created).toBeTruthy();
    expect(created?.need).toContain("AC not cooling");
  });
});
