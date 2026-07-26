/**
 * Identity/auth contracts for JOB-AGT-WEB-20260726-M2.1. Deliberately kept
 * separate from src/types/domain.ts: those types mirror
 * 08_DIGITAL_SYSTEMS/DATA_MODEL.md (Status: Approved, v0.2) and any addition
 * there requires a domain amendment migration (see M1.2). Identity is a
 * distinct concern — who is signed in — not yet part of that approved model.
 *
 * `AuthProvider` is intentionally a closed union of all providers this
 * system is designed for, including ones not implemented yet ("google",
 * "phone_otp") — the extension points those imply live in
 * src/lib/adapters/types.ts (GoogleAuthProviderAdapter,
 * PhoneOtpAuthProviderAdapter), not here.
 */

import type { ContactPoint } from "./domain";

export type AuthProvider = "password" | "google" | "phone_otp";

export type UserStatus = "active" | "disabled";

export interface User {
  id: string;
  displayName: string;
  contact: ContactPoint;
  emailVerified: boolean;
  phoneVerified: boolean;
  status: UserStatus;
  createdAt: string;
}

/** Only the "password" provider is implemented in M2.1 — see adapters/types.ts. */
export interface PasswordCredential {
  userId: User["id"];
  passwordHash: string;
  passwordSalt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  userId: User["id"];
  createdAt: string;
  expiresAt: string;
}
