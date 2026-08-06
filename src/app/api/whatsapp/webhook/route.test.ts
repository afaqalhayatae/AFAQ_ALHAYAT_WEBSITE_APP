/**
 * Covers the webhook verification handshake, signature enforcement, and
 * the rule-based turn path (LLM adapter mocked unavailable — same split
 * as src/app/api/chat/route.test.ts / route.llm.test.ts). Real network
 * calls (WhatsApp send/media) are mocked; the real in-memory session
 * store (src/lib/chat/session.ts) is used as-is so attachment/location
 * side effects can be asserted directly.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createHmac } from "node:crypto";

vi.mock("@/lib/chat/llm-adapter", () => ({
  checkLlmAvailability: () => ({ available: false, reason: "no_api_key" }),
  runLlmTurn: vi.fn(),
}));

const { sendWhatsAppText, downloadWhatsAppMedia } = vi.hoisted(() => ({
  sendWhatsAppText: vi.fn(async (_to: string, _body: string) => undefined),
  downloadWhatsAppMedia: vi.fn(async (_mediaId: string) => ({
    buffer: Buffer.from("fake-image-bytes"),
    mimeType: "image/jpeg",
  })),
}));

vi.mock("@/lib/whatsapp/client", () => ({ sendWhatsAppText, downloadWhatsAppMedia }));

const { GET, POST } = await import("./route");
const { getOrCreateSession, _sessionStoreForTests } = await import("@/lib/chat/session");

function signedReq(payload: unknown) {
  const rawBody = JSON.stringify(payload);
  const signature = `sha256=${createHmac("sha256", "test-app-secret").update(rawBody).digest("hex")}`;
  return new Request("http://localhost/api/whatsapp/webhook", {
    method: "POST",
    headers: { "content-type": "application/json", "x-hub-signature-256": signature },
    body: rawBody,
  }) as unknown as Parameters<typeof POST>[0];
}

function textMessagePayload(from: string, body: string) {
  return {
    object: "whatsapp_business_account",
    entry: [
      {
        id: "waba-1",
        changes: [
          {
            field: "messages",
            value: {
              messaging_product: "whatsapp",
              metadata: { display_phone_number: "971500000000", phone_number_id: "123" },
              contacts: [{ profile: { name: "Ahmed" }, wa_id: from }],
              messages: [{ from, id: "wamid.1", timestamp: "1700000000", type: "text", text: { body } }],
            },
          },
        ],
      },
    ],
  };
}

beforeEach(() => {
  vi.stubEnv("WHATSAPP_APP_SECRET", "test-app-secret");
  vi.stubEnv("WHATSAPP_VERIFY_TOKEN", "test-verify-token");
  sendWhatsAppText.mockClear();
  downloadWhatsAppMedia.mockClear();
  _sessionStoreForTests.clear();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("GET /api/whatsapp/webhook (verification handshake)", () => {
  it("echoes the challenge when the verify token matches", async () => {
    const url =
      "http://localhost/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=test-verify-token&hub.challenge=12345";
    const response = await GET(new Request(url) as unknown as Parameters<typeof GET>[0]);
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("12345");
  });

  it("returns 403 when the verify token does not match", async () => {
    const url =
      "http://localhost/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=wrong-token&hub.challenge=12345";
    const response = await GET(new Request(url) as unknown as Parameters<typeof GET>[0]);
    expect(response.status).toBe(403);
  });
});

describe("POST /api/whatsapp/webhook (signature enforcement)", () => {
  it("rejects a request with no signature header", async () => {
    const rawBody = JSON.stringify(textMessagePayload("971501234567", "hello"));
    const request = new Request("http://localhost/api/whatsapp/webhook", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: rawBody,
    }) as unknown as Parameters<typeof POST>[0];

    const response = await POST(request);
    expect(response.status).toBe(401);
    expect(sendWhatsAppText).not.toHaveBeenCalled();
  });

  it("rejects a request with an invalid signature", async () => {
    const rawBody = JSON.stringify(textMessagePayload("971501234567", "hello"));
    const request = new Request("http://localhost/api/whatsapp/webhook", {
      method: "POST",
      headers: { "content-type": "application/json", "x-hub-signature-256": "sha256=deadbeef" },
      body: rawBody,
    }) as unknown as Parameters<typeof POST>[0];

    const response = await POST(request);
    expect(response.status).toBe(401);
    expect(sendWhatsAppText).not.toHaveBeenCalled();
  });
});

describe("POST /api/whatsapp/webhook (rule-based turn handling)", () => {
  it("processes an inbound text message and replies via the WhatsApp client", async () => {
    const from = "971501234567";
    const response = await POST(signedReq(textMessagePayload(from, "I need AC repair")));

    expect(response.status).toBe(200);
    expect(sendWhatsAppText).toHaveBeenCalledTimes(1);
    const [to, body] = sendWhatsAppText.mock.calls[0] as [string, string];
    expect(to).toBe(from);
    expect(body.length).toBeGreaterThan(0);
  });

  it("stores a shared location on the customer's session", async () => {
    const from = "971509999999";
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
                  {
                    from,
                    id: "wamid.loc",
                    type: "location",
                    location: { latitude: 25.2048, longitude: 55.2708 },
                  },
                ],
              },
            },
          ],
        },
      ],
    };

    await POST(signedReq(payload));

    const state = getOrCreateSession(`whatsapp:${from}`);
    expect(state.locationLink).toBe("https://www.google.com/maps?q=25.204800,55.270800");
  });

  it("downloads and attaches an inbound image", async () => {
    const from = "971508888888";
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
                  {
                    from,
                    id: "wamid.img",
                    type: "image",
                    image: { id: "media-123", mime_type: "image/jpeg" },
                  },
                ],
              },
            },
          ],
        },
      ],
    };

    await POST(signedReq(payload));

    expect(downloadWhatsAppMedia).toHaveBeenCalledWith("media-123");
    const state = getOrCreateSession(`whatsapp:${from}`);
    expect(state.attachments).toHaveLength(1);
    expect(state.attachments[0]).toMatch(new RegExp(`^/uploads/whatsapp/${from}/.+\\.jpg$`));
  });

  it("acks 200 even when an individual message fails to process, without crashing the batch", async () => {
    downloadWhatsAppMedia.mockRejectedValueOnce(new Error("network error"));
    const from = "971507777777";
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
                  { from, id: "wamid.img2", type: "image", image: { id: "media-broken", mime_type: "image/jpeg" } },
                ],
              },
            },
          ],
        },
      ],
    };

    const response = await POST(signedReq(payload));
    expect(response.status).toBe(200);
    // The download failed, but the turn should still run and reply using
    // the fallback caption text rather than dropping the message.
    expect(sendWhatsAppText).toHaveBeenCalledTimes(1);
  });
});
