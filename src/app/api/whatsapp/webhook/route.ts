/**
 * Official WhatsApp Business Platform (Cloud API) webhook — Meta's real
 * API, not a third-party or unofficial library. Reuses the exact same AI
 * chat engine as the website widget (src/lib/chat/engine.ts), keyed by
 * the customer's WhatsApp number instead of a browser session id, so a
 * lead captured over WhatsApp lands in the same Enquiry/QuoteRequest
 * pipeline as the website chat.
 *
 * ── Setup required on Meta's side (the Owner does this, not this code —
 *    account creation and OAuth-style app approval aren't something this
 *    assistant can do) ──
 *   1. Create/use a Meta Business Account at business.facebook.com.
 *   2. At developers.facebook.com, create an app and add the "WhatsApp"
 *      product to it.
 *   3. Under WhatsApp > API Setup, either use the free test number Meta
 *      provides during development, or add and verify the business's
 *      real number.
 *   4. Copy these into this project's .env (never into a git-tracked
 *      file — see .env.example for the placeholders):
 *        WHATSAPP_ACCESS_TOKEN     — a permanent token from a System
 *                                    User with whatsapp_business_messaging
 *                                    permission (Business Settings >
 *                                    System Users), not the 24h temporary
 *                                    token API Setup shows by default.
 *        WHATSAPP_PHONE_NUMBER_ID  — shown on the same API Setup page.
 *        WHATSAPP_APP_SECRET       — App Settings > Basic > App Secret.
 *        WHATSAPP_VERIFY_TOKEN     — any string the Owner makes up
 *                                    (e.g. a random password); it just
 *                                    has to match what's typed into step 5.
 *   5. Under WhatsApp > Configuration > Webhook, set:
 *        Callback URL:  https://afaqalhayatae.com/api/whatsapp/webhook
 *        Verify token:  the same WHATSAPP_VERIFY_TOKEN value from step 4
 *      then click "Verify and save" — Meta calls the GET handler below
 *      once to confirm this route is real. Subscribe to the "messages"
 *      webhook field.
 *   6. Rebuild/redeploy so the new env vars take effect (Next.js reads
 *      them at server start, same as every other var in .env).
 */
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { getOrCreateSession, saveSession, appendAttachment, setSessionLocation } from "@/lib/chat/session";
import { runChatTurn } from "@/lib/chat/engine";
import type { Bilingual } from "@/lib/chat-mvp/responses";
import { sendWhatsAppText, downloadWhatsAppMedia } from "@/lib/whatsapp/client";
import { verifyWhatsAppSignature } from "@/lib/whatsapp/webhook-verify";
import { detectAndRememberLocale } from "@/lib/whatsapp/locale-store";
import type { Locale } from "@/i18n/config";

export const runtime = "nodejs";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads", "whatsapp");

const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

type WhatsAppInboundMessage = {
  from: string;
  id: string;
  type: string;
  text?: { body: string };
  image?: { id: string; mime_type: string; caption?: string };
  document?: { id: string; mime_type: string; caption?: string };
  location?: { latitude: number; longitude: number };
};

type WhatsAppWebhookPayload = {
  object?: string;
  entry?: {
    changes?: {
      field?: string;
      value?: {
        messages?: WhatsAppInboundMessage[];
      };
    }[];
  }[];
};

/** Meta calls this once, when the Owner clicks "Verify and save" on the
 *  webhook config page — see setup step 5 above. */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && challenge && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

function formatReplyText(replies: Bilingual[], options: Bilingual[] | undefined, locale: Locale): string {
  const lines = replies.map((r) => r[locale]).filter(Boolean);
  if (options && options.length > 0) {
    lines.push(options.map((o) => `• ${o[locale]}`).join("\n"));
  }
  return lines.join("\n\n");
}

async function storeInboundMedia(waId: string, mediaId: string): Promise<string> {
  const { buffer, mimeType } = await downloadWhatsAppMedia(mediaId);
  const ext = MIME_EXTENSIONS[mimeType] ?? "bin";

  const dir = path.join(UPLOAD_ROOT, waId);
  await mkdir(dir, { recursive: true });
  const storedName = `${randomUUID()}.${ext}`;
  await writeFile(path.join(dir, storedName), buffer);

  return `/uploads/whatsapp/${waId}/${storedName}`;
}

async function handleInboundMessage(message: WhatsAppInboundMessage): Promise<void> {
  const waId = message.from;
  const sessionKey = `whatsapp:${waId}`;
  console.log(`[whatsapp] inbound message from=${waId} type=${message.type} id=${message.id}`);

  let text = "";
  if (message.type === "text" && message.text) {
    text = message.text.body;
  } else if (message.type === "image" && message.image) {
    try {
      const url = await storeInboundMedia(waId, message.image.id);
      appendAttachment(sessionKey, url);
    } catch (err) {
      console.error("[whatsapp] failed to download inbound image:", err);
    }
    text = message.image.caption?.trim() || "I'm sending a photo of the issue.";
  } else if (message.type === "document" && message.document) {
    try {
      const url = await storeInboundMedia(waId, message.document.id);
      appendAttachment(sessionKey, url);
    } catch (err) {
      console.error("[whatsapp] failed to download inbound document:", err);
    }
    text = message.document.caption?.trim() || "I'm sending a document.";
  } else if (message.type === "location" && message.location) {
    const { latitude, longitude } = message.location;
    setSessionLocation(sessionKey, `https://www.google.com/maps?q=${latitude.toFixed(6)},${longitude.toFixed(6)}`);
    text = "I'm sharing my location.";
  } else {
    // Unsupported message type (sticker, reaction, poll, etc.) — nudge
    // the customer toward a message we can actually act on.
    text = "";
  }

  const locale = detectAndRememberLocale(waId, text || "");
  const state = getOrCreateSession(sessionKey);

  if (!text) {
    await sendWhatsAppText(
      waId,
      locale === "ar"
        ? "لم أتمكن من فهم هذا النوع من الرسائل، ممكن تكتب طلبك أو ترسل صورة أو موقعك؟"
        : "I couldn't read that message type — could you type your request, or send a photo or your location instead?"
    );
    return;
  }

  const result = await runChatTurn({ state, message: text, source: "whatsapp" });
  saveSession(sessionKey, result.state);

  const replyText = formatReplyText(result.replies, result.options, locale);
  if (replyText) {
    try {
      await sendWhatsAppText(waId, replyText);
      console.log(`[whatsapp] reply sent to=${waId}`);
    } catch (err) {
      console.error("[whatsapp] failed to send reply:", err);
    }
  }
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  // TEMPORARY (2026-08-06) — diagnosing why real Meta-originated webhook
  // calls weren't reaching this route while manually-signed test calls
  // did. Writes every raw POST attempt (before signature verification) to
  // a public debug file so it can be inspected directly via curl,
  // bypassing unreliable Hostinger log-viewer visibility. Remove once
  // resolved.
  try {
    const debugDir = path.join(process.cwd(), "public");
    await writeFile(
      path.join(debugDir, "whatsapp-debug.json"),
      JSON.stringify(
        {
          receivedAt: new Date().toISOString(),
          hasSignatureHeader: Boolean(request.headers.get("x-hub-signature-256")),
          signatureValid: verifyWhatsAppSignature(rawBody, request.headers.get("x-hub-signature-256")),
          bodyPreview: rawBody.slice(0, 2000),
        },
        null,
        2
      )
    );
  } catch (err) {
    console.error("[whatsapp] debug write failed:", err);
  }

  if (!verifyWhatsAppSignature(rawBody, request.headers.get("x-hub-signature-256"))) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  let payload: WhatsAppWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as WhatsAppWebhookPayload;
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  const messages =
    payload.entry?.flatMap((entry) => entry.changes?.flatMap((change) => change.value?.messages ?? []) ?? []) ?? [];

  for (const message of messages) {
    try {
      await handleInboundMessage(message);
    } catch (err) {
      // One bad message must never break the webhook ack for the rest of
      // the batch, and Meta will retry on a non-200 — always ack 200.
      console.error("[whatsapp] failed to handle inbound message:", err);
    }
  }

  // Meta requires a fast 200 ack regardless of processing outcome —
  // failures above are logged, never surfaced as a webhook error (which
  // would trigger Meta's retry-and-eventually-disable-webhook behavior).
  return NextResponse.json({ status: "ok" });
}
