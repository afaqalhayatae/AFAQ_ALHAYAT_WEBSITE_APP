/**
 * Identity/auth contracts for JOB-AGT-WEB-20260726-M2.1. Deliberately kept
 * separate from src/types/domain.ts: those types mirror
 * 08_DIGITAL_SYSTEMS/DATA_MODEL.md (Approved, v0.3 as of the Identity
 * Domain Amendment) — User/Session/PasswordCredential are formally
 * approved there; any further addition still requires its own amendment.
 *
 * `AuthProvider` is intentionally a closed union of all providers this
 * system is designed for, including ones not implemented yet ("google",
 * "apple", "facebook", "phone_otp") — the extension points those imply
 * live in src/lib/adapters/types.ts (GoogleAuthProviderAdapter and, once
 * actually built, Apple/Facebook equivalents), not here. "apple" and
 * "facebook" added as closed-union placeholders per the Google Login
 * upgrade's "keep the system expandable" requirement — neither is
 * implemented; only "password" and "google" have real adapters today.
 */

import type { ContactPoint } from "./domain";

export type AuthProvider = "password" | "google" | "apple" | "facebook" | "phone_otp";

export type UserStatus = "active" | "disabled";

export interface User {
  id: string;
  displayName: string;
  contact: ContactPoint;
  emailVerified: boolean;
  phoneVerified: boolean;
  status: UserStatus;
  createdAt: string;
  /**
   * Which provider created/owns this account. Undefined for every user
   * created before this field existed (treated as "password" — the only
   * provider that existed then). A user has at most one provider today —
   * this is a deliberate simplification of
   * 08_AUTHENTICATION_ARCHITECTURE.md §7's fuller multi-provider
   * `LinkedIdentity` design, appropriate because this upgrade only makes
   * Google real; linking multiple providers to one account is future scope.
   */
  authProvider?: AuthProvider;
  /** The provider's own stable subject/account id (Google's "sub"). Unset for password accounts. */
  providerAccountId?: string;
  /** Provider-supplied profile photo URL, if any. Never a locally-hosted copy — a remote URL only. */
  avatarUrl?: string;
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
