/**
 * Validates that an inbound webhook POST really came from Meta, not a
 * spoofed request — Meta signs every webhook body with the app's App
 * Secret (X-Hub-Signature-256 header). Without this check, anyone who
 * discovers the webhook URL could inject fake "customer messages" that
 * get treated as real leads. See WHATSAPP_APP_SECRET in .env.example.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyWhatsAppSignature(rawBody: string, signatureHeader: string | null): boolean {
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (!appSecret || !signatureHeader) return false;

  const expected = `sha256=${createHmac("sha256", appSecret).update(rawBody).digest("hex")}`;
  const expectedBuf = Buffer.from(expected);
  const actualBuf = Buffer.from(signatureHeader);
  if (expectedBuf.length !== actualBuf.length) return false;

  return timingSafeEqual(expectedBuf, actualBuf);
}
