/**
 * Concrete "Auth Provider Adapter" for the "password" provider
 * (JOB-AGT-WEB-20260726-M2.1). Uses Node's built-in crypto.scrypt — no new
 * dependency — so this ships without waiting on a library approval. Google
 * and phone OTP providers are separate adapters (see
 * src/lib/adapters/types.ts) and are not implemented here.
 */

import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import type { PasswordAuthProviderAdapter } from "@/lib/adapters/types";

const KEY_LENGTH = 64;

export function createPasswordAuthProvider(): PasswordAuthProviderAdapter {
  return {
    hash(password) {
      const salt = randomBytes(16).toString("hex");
      const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");
      return { hash, salt };
    },
    verify(password, hash, salt) {
      const stored = Buffer.from(hash, "hex");
      const candidate = scryptSync(password, salt, KEY_LENGTH);
      if (candidate.length !== stored.length) {
        return false;
      }
      return timingSafeEqual(candidate, stored);
    },
  };
}
