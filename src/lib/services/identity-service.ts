/**
 * "Identity Service" layer (JOB-AGT-WEB-20260726-M2.1). Owns every
 * authentication and profile business rule — password policy, credential
 * verification, account status, contact-uniqueness — so the API boundary
 * and UI stay dumb. Depends on a PasswordAuthProviderAdapter (the "Auth
 * Provider Adapter" layer) and src/lib/services/session-service.ts (the
 * "Session Management" layer) rather than any concrete crypto or storage
 * detail directly.
 */

import type { ContactPoint } from "@/types/domain";
import type { Session, User } from "@/types/identity";
import type {
  CredentialRepository,
  PasswordAuthProviderAdapter,
  SessionRepository,
  UserRepository,
} from "@/lib/adapters/types";
import type { AsyncAuditEventRepository } from "@/lib/adapters/prisma/types";
import { generateId, writeAuditEvent } from "./audit";
import { createSession, revokeSession, validateSession } from "./session-service";
import {
  AccountDisabledError,
  ContactAlreadyRegisteredError,
  GoogleAccountDisabledError,
  InvalidCredentialsError,
  WeakPasswordError,
} from "./errors";

const MIN_PASSWORD_LENGTH = 8;

export interface RegisterInput {
  displayName: string;
  channel: ContactPoint["channel"];
  contactValue: string;
  password: string;
  actor: string;
}

// Async (Database Foundation Phase 1J — AuditEvent switchover). Every
// function in this file becomes async purely as a consequence of
// writeAuditEvent's signature change — no authentication/business logic
// changed. users/credentials/sessions stay the existing synchronous
// repositories, untouched (not in the migration priority list).
export async function registerWithPassword(
  deps: {
    users: UserRepository;
    credentials: CredentialRepository;
    passwordProvider: PasswordAuthProviderAdapter;
    auditEvents: AsyncAuditEventRepository;
  },
  input: RegisterInput
): Promise<User> {
  if (!input.displayName || !input.contactValue || !input.password) {
    throw new Error("displayName, contactValue, and password are required");
  }
  if (input.password.length < MIN_PASSWORD_LENGTH) {
    throw new WeakPasswordError(MIN_PASSWORD_LENGTH);
  }
  if (deps.users.findByContact(input.channel, input.contactValue)) {
    throw new ContactAlreadyRegisteredError(input.contactValue);
  }

  const user: User = {
    id: generateId("user"),
    displayName: input.displayName,
    contact: { channel: input.channel, value: input.contactValue },
    emailVerified: false,
    phoneVerified: false,
    status: "active",
    createdAt: new Date().toISOString(),
  };
  deps.users.create(user);

  const { hash, salt } = deps.passwordProvider.hash(input.password);
  deps.credentials.set({
    userId: user.id,
    passwordHash: hash,
    passwordSalt: salt,
    updatedAt: new Date().toISOString(),
  });

  await writeAuditEvent(deps.auditEvents, {
    actor: input.actor,
    action: "user.registered",
    target: user.id,
    outcome: "success",
  });

  return user;
}

export interface LoginInput {
  channel: ContactPoint["channel"];
  contactValue: string;
  password: string;
  actor: string;
}

export async function loginWithPassword(
  deps: {
    users: UserRepository;
    credentials: CredentialRepository;
    sessions: SessionRepository;
    passwordProvider: PasswordAuthProviderAdapter;
    auditEvents: AsyncAuditEventRepository;
  },
  input: LoginInput
): Promise<{ user: User; session: Session }> {
  const user = deps.users.findByContact(input.channel, input.contactValue);
  const credential = user ? deps.credentials.findByUserId(user.id) : undefined;

  if (
    !user ||
    !credential ||
    !deps.passwordProvider.verify(input.password, credential.passwordHash, credential.passwordSalt)
  ) {
    await writeAuditEvent(deps.auditEvents, {
      actor: input.actor,
      action: "user.login",
      target: input.contactValue,
      outcome: "rejected",
    });
    throw new InvalidCredentialsError();
  }

  if (user.status !== "active") {
    await writeAuditEvent(deps.auditEvents, {
      actor: input.actor,
      action: "user.login",
      target: user.id,
      outcome: "rejected",
    });
    throw new AccountDisabledError(user.id);
  }

  const session = createSession({ sessions: deps.sessions }, user.id);

  await writeAuditEvent(deps.auditEvents, {
    actor: input.actor,
    action: "user.login",
    target: user.id,
    outcome: "success",
  });

  return { user, session };
}

export async function logout(
  deps: { sessions: SessionRepository; auditEvents: AsyncAuditEventRepository },
  input: { sessionId: Session["id"]; actor: string }
): Promise<void> {
  revokeSession({ sessions: deps.sessions }, input.sessionId);
  await writeAuditEvent(deps.auditEvents, {
    actor: input.actor,
    action: "user.logout",
    target: input.sessionId,
    outcome: "success",
  });
}

export function getCurrentUser(
  deps: { users: UserRepository; sessions: SessionRepository },
  sessionId: Session["id"]
): User {
  const session = validateSession({ sessions: deps.sessions }, sessionId);
  const user = deps.users.findById(session.userId);
  if (!user) {
    throw new InvalidCredentialsError();
  }
  return user;
}

export interface UpdateProfileInput {
  userId: User["id"];
  displayName: string;
  actor: string;
}

export async function updateProfile(
  deps: { users: UserRepository; auditEvents: AsyncAuditEventRepository },
  input: UpdateProfileInput
): Promise<User> {
  const user = deps.users.findById(input.userId);
  if (!user) {
    throw new InvalidCredentialsError();
  }
  if (!input.displayName.trim()) {
    throw new Error("displayName is required");
  }

  const updated: User = { ...user, displayName: input.displayName.trim() };
  deps.users.update(updated);

  await writeAuditEvent(deps.auditEvents, {
    actor: input.actor,
    action: "user.profile_updated",
    target: user.id,
    outcome: "success",
  });

  return updated;
}

export interface GoogleIdentityInput {
  providerAccountId: string;
  email: string;
  emailVerified: boolean;
  displayName?: string;
  avatarUrl?: string;
  actor: string;
}

/**
 * Google Login upgrade. Finds-or-creates a User from an already-verified
 * Google identity (the caller — src/app/api/auth/google/callback/route.ts
 * — must have already called GoogleAuthProviderAdapter.verifyIdToken;
 * this function trusts its input, it does not re-verify a token itself).
 *
 * Reuses UserRepository.findByContact("email", ...) exactly as password
 * accounts do — no new lookup mechanism, no LinkedIdentity entity
 * (08_AUTHENTICATION_ARCHITECTURE.md §7's fuller multi-provider design is
 * deliberately deferred, per that section). A user has at most one
 * provider today: matching an existing password-registered email to a
 * Google sign-in is intentionally treated as "log in to that account" only
 * when the email itself is provider-verified (never on an unverified
 * claim, per §7's explicit rule) — this does not create a second account,
 * but it also does not (yet) formally "link" two distinct credential
 * types beyond that shared email match.
 *
 * No PasswordCredential is ever created here — a Google-created account
 * has no password, matching "do not require users to create a password."
 */
export async function loginOrRegisterWithGoogle(
  deps: { users: UserRepository; sessions: SessionRepository; auditEvents: AsyncAuditEventRepository },
  input: GoogleIdentityInput
): Promise<{ user: User; session: Session; isNewUser: boolean }> {
  if (!input.emailVerified) {
    await writeAuditEvent(deps.auditEvents, {
      actor: input.actor,
      action: "user.login",
      target: input.email,
      outcome: "rejected",
    });
    throw new InvalidCredentialsError();
  }

  const existing = deps.users.findByContact("email", input.email);

  if (existing) {
    if (existing.status !== "active") {
      await writeAuditEvent(deps.auditEvents, {
        actor: input.actor,
        action: "user.login",
        target: existing.id,
        outcome: "rejected",
      });
      throw new GoogleAccountDisabledError(existing.id);
    }

    const session = createSession({ sessions: deps.sessions }, existing.id);
    await writeAuditEvent(deps.auditEvents, {
      actor: input.actor,
      action: "user.login",
      target: existing.id,
      outcome: "success",
    });
    return { user: existing, session, isNewUser: false };
  }

  const user: User = {
    id: generateId("user"),
    displayName: input.displayName?.trim() || input.email.split("@")[0],
    contact: { channel: "email", value: input.email },
    emailVerified: true,
    phoneVerified: false,
    status: "active",
    createdAt: new Date().toISOString(),
    authProvider: "google",
    providerAccountId: input.providerAccountId,
    avatarUrl: input.avatarUrl,
  };
  deps.users.create(user);

  const session = createSession({ sessions: deps.sessions }, user.id);

  await writeAuditEvent(deps.auditEvents, {
    actor: input.actor,
    action: "user.registered_via_google",
    target: user.id,
    outcome: "success",
  });

  return { user, session, isNewUser: true };
}
