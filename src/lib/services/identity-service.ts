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
  AuditEventRepository,
  CredentialRepository,
  PasswordAuthProviderAdapter,
  SessionRepository,
  UserRepository,
} from "@/lib/adapters/types";
import { generateId, writeAuditEvent } from "./audit";
import { createSession, revokeSession, validateSession } from "./session-service";
import {
  AccountDisabledError,
  ContactAlreadyRegisteredError,
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

export function registerWithPassword(
  deps: {
    users: UserRepository;
    credentials: CredentialRepository;
    passwordProvider: PasswordAuthProviderAdapter;
    auditEvents: AuditEventRepository;
  },
  input: RegisterInput
): User {
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

  writeAuditEvent(deps.auditEvents, {
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

export function loginWithPassword(
  deps: {
    users: UserRepository;
    credentials: CredentialRepository;
    sessions: SessionRepository;
    passwordProvider: PasswordAuthProviderAdapter;
    auditEvents: AuditEventRepository;
  },
  input: LoginInput
): { user: User; session: Session } {
  const user = deps.users.findByContact(input.channel, input.contactValue);
  const credential = user ? deps.credentials.findByUserId(user.id) : undefined;

  if (
    !user ||
    !credential ||
    !deps.passwordProvider.verify(input.password, credential.passwordHash, credential.passwordSalt)
  ) {
    writeAuditEvent(deps.auditEvents, {
      actor: input.actor,
      action: "user.login",
      target: input.contactValue,
      outcome: "rejected",
    });
    throw new InvalidCredentialsError();
  }

  if (user.status !== "active") {
    writeAuditEvent(deps.auditEvents, {
      actor: input.actor,
      action: "user.login",
      target: user.id,
      outcome: "rejected",
    });
    throw new AccountDisabledError(user.id);
  }

  const session = createSession({ sessions: deps.sessions }, user.id);

  writeAuditEvent(deps.auditEvents, {
    actor: input.actor,
    action: "user.login",
    target: user.id,
    outcome: "success",
  });

  return { user, session };
}

export function logout(
  deps: { sessions: SessionRepository; auditEvents: AuditEventRepository },
  input: { sessionId: Session["id"]; actor: string }
): void {
  revokeSession({ sessions: deps.sessions }, input.sessionId);
  writeAuditEvent(deps.auditEvents, {
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

export function updateProfile(
  deps: { users: UserRepository; auditEvents: AuditEventRepository },
  input: UpdateProfileInput
): User {
  const user = deps.users.findById(input.userId);
  if (!user) {
    throw new InvalidCredentialsError();
  }
  if (!input.displayName.trim()) {
    throw new Error("displayName is required");
  }

  const updated: User = { ...user, displayName: input.displayName.trim() };
  deps.users.update(updated);

  writeAuditEvent(deps.auditEvents, {
    actor: input.actor,
    action: "user.profile_updated",
    target: user.id,
    outcome: "success",
  });

  return updated;
}
