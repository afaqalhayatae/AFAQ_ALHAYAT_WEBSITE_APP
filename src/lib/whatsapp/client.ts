/**
 * WhatsApp Business Platform (Cloud API) client — the official Meta API,
 * not a third-party or unofficial library. Requires two env vars the
 * Owner obtains from Meta for Developers (see
 * src/app/api/whatsapp/webhook/route.ts's header comment for the full
 * setup steps): WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID.
 */

const GRAPH_VERSION = "v22.0";

function requireEnv(name: "WHATSAPP_ACCESS_TOKEN" | "WHATSAPP_PHONE_NUMBER_ID"): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

/** Sends a plain-text WhatsApp message to a customer. `to` is the
 *  customer's number in the format WhatsApp's webhook gives it (digits
 *  only, no "+", e.g. "9715xxxxxxxx"). Throws on any non-2xx response —
 *  the caller (the webhook route) must decide how to handle a failed
 *  send; it must never be reported to the customer as if it succeeded. */
export async function sendWhatsAppText(to: string, body: string): Promise<void> {
  const phoneNumberId = requireEnv("WHATSAPP_PHONE_NUMBER_ID");
  const token = requireEnv("WHATSAPP_ACCESS_TOKEN");

  const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`WhatsApp send failed: ${res.status} ${errText}`);
  }
}

export type WhatsAppMediaDownload = { buffer: Buffer; mimeType: string };

/** Resolves a WhatsApp media id (from an incoming image/document message)
 *  to its actual bytes — the webhook payload only ever contains an id,
 *  never a direct URL; Meta requires a two-step authenticated fetch. */
export async function downloadWhatsAppMedia(mediaId: string): Promise<WhatsAppMediaDownload> {
  const token = requireEnv("WHATSAPP_ACCESS_TOKEN");

  const metaRes = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${mediaId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!metaRes.ok) throw new Error(`WhatsApp media lookup failed: ${metaRes.status}`);
  const meta = (await metaRes.json()) as { url: string; mime_type: string };

  const fileRes = await fetch(meta.url, { headers: { Authorization: `Bearer ${token}` } });
  if (!fileRes.ok) throw new Error(`WhatsApp media download failed: ${fileRes.status}`);
  const buffer = Buffer.from(await fileRes.arrayBuffer());

  return { buffer, mimeType: meta.mime_type };
}
