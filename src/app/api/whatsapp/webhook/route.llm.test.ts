/**
 * Covers the LLM path branch of the WhatsApp webhook (llm-adapter mocked
 * — no real network call), mirroring src/app/api/chat/route.llm.test.ts.
 * The rule-based path and signature/verification handling are covered
 * separately in route.test.ts.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createHmac } from "node:crypto";
import { enquiryRepository } from "@/app/api/enquiries/route";

vi.mock("@/lib/chat/llm-adapter", () => ({
  checkLlmAvailability: () => ({ available: true }),
  runLlmTurn: async ({
    onRecordLead,
  }: {
    onRecordLead: (args: { name: string; phoneE164: string; need: string }) => Promise<string>;
  }) => {
    const toolResult = await onRecordLead({
      name: "Fatima",
      phoneE164: "+971509876543",
      need: "Deep cleaning for a villa",
    });
    return { reply: `Got it — ${toolResult}`, leadRecorded: true };
  },
}));

const { sendWhatsAppText, downloadWhatsAppMedia } = vi.hoisted(() => ({
  sendWhatsAppText: vi.fn(async (_to: string, _body: string) => undefined),
  downloadWhatsAppMedia: vi.fn(async (_mediaId: string) => ({ buffer: Buffer.from(""), mimeType: "image/jpeg" })),
}));
vi.mock("@/lib/whatsapp/client", () => ({ sendWhatsAppText, downloadWhatsAppMedia }));

const { POST } = await import("./route");
const { _sessionStoreForTests } = await import("@/lib/chat/session");

beforeEach(() => {
  vi.stubEnv("WHATSAPP_APP_SECRET", "test-app-secret");
  sendWhatsAppText.mockClear();
  _sessionStoreForTests.clear();
});

describe("POST /api/whatsapp/webhook — LLM path", () => {
  it("uses the LLM adapter and records a real Enquiry via the record_lead tool callback", async () => {
    const from = "971501112222";
    const payload = {
      object: "whatsapp_business_account",
      entry: [
        {
          id: "waba-1",
          changes: [
            {
              field: "messages",
              value: {
                messages: [
                  { from, id: "wamid.1", type: "text", text: { body: "I need a villa deep cleaned, I'm Fatima" } },
                ],
              },
            },
          ],
        },
      ],
    };
    const rawBody = JSON.stringify(payload);
    const signature = `sha256=${createHmac("sha256", "test-app-secret").update(rawBody).digest("hex")}`;
    const request = new Request("http://localhost/api/whatsapp/webhook", {
      method: "POST",
      headers: { "content-type": "application/json", "x-hub-signature-256": signature },
      body: rawBody,
    }) as unknown as Parameters<typeof POST>[0];

    const response = await POST(request);
    expect(response.status).toBe(200);
    expect(sendWhatsAppText).toHaveBeenCalledTimes(1);

    const [to, body] = sendWhatsAppText.mock.calls[0] as [string, string];
    expect(to).toBe(from);
    expect(body).toContain("Got it");

    // The reply embeds "Reference: ENQ-..." from the real tool result —
    // confirms the Enquiry was actually created via the same tools.ts
    // path the website chat uses, not just a mocked-looking reply.
    const referenceMatch = body.match(/Reference:\s*(\S+)\./);
    expect(referenceMatch).toBeTruthy();
    const created = await enquiryRepository.findById(referenceMatch![1]);
    expect(created).toBeTruthy();
    expect(created?.need).toContain("Deep cleaning for a villa");
  });
});
