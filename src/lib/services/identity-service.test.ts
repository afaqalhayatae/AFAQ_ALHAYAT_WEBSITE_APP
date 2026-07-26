import { beforeEach, describe, expect, it } from "vitest";
import {
  getCurrentUser,
  loginWithPassword,
  logout,
  registerWithPassword,
  updateProfile,
} from "./identity-service";
import { createInMemoryUserRepository } from "@/lib/adapters/in-memory/user-repository";
import { createInMemoryCredentialRepository } from "@/lib/adapters/in-memory/credential-repository";
import { createInMemorySessionRepository } from "@/lib/adapters/in-memory/session-repository";
import { createInMemoryAuditEventRepository } from "@/lib/adapters/in-memory/audit-event-repository";
import { createPasswordAuthProvider } from "@/lib/adapters/password/password-provider";
import {
  AccountDisabledError,
  ContactAlreadyRegisteredError,
  InvalidCredentialsError,
  WeakPasswordError,
} from "./errors";
import type {
  CredentialRepository,
  PasswordAuthProviderAdapter,
  SessionRepository,
  UserRepository,
} from "@/lib/adapters/types";
import type { AuditEventRepository } from "@/lib/adapters/types";

describe("identity-service", () => {
  let users: UserRepository;
  let credentials: CredentialRepository;
  let sessions: SessionRepository;
  let auditEvents: AuditEventRepository;
  let passwordProvider: PasswordAuthProviderAdapter;

  beforeEach(() => {
    users = createInMemoryUserRepository();
    credentials = createInMemoryCredentialRepository();
    sessions = createInMemorySessionRepository();
    auditEvents = createInMemoryAuditEventRepository();
    passwordProvider = createPasswordAuthProvider();
  });

  function register(overrides: Partial<Parameters<typeof registerWithPassword>[1]> = {}) {
    return registerWithPassword(
      { users, credentials, passwordProvider, auditEvents },
      {
        displayName: "Jane Doe",
        channel: "phone",
        contactValue: "0501234567",
        password: "correct-horse-battery-staple",
        actor: "test-actor",
        ...overrides,
      }
    );
  }

  describe("registerWithPassword", () => {
    it("creates a user and an audit event, never returning credential fields", () => {
      const user = register();

      expect(user.status).toBe("active");
      expect(user).not.toHaveProperty("passwordHash");
      expect(auditEvents.findByActor("test-actor")[0].action).toBe("user.registered");
      expect(credentials.findByUserId(user.id)).toBeDefined();
    });

    it("rejects a password shorter than the minimum length", () => {
      expect(() => register({ password: "short" })).toThrow(WeakPasswordError);
    });

    it("rejects registering the same contact twice", () => {
      register();
      expect(() => register()).toThrow(ContactAlreadyRegisteredError);
    });
  });

  describe("loginWithPassword", () => {
    it("issues a session for correct credentials", () => {
      register();

      const { user, session } = loginWithPassword(
        { users, credentials, sessions, passwordProvider, auditEvents },
        {
          channel: "phone",
          contactValue: "0501234567",
          password: "correct-horse-battery-staple",
          actor: "test-actor",
        }
      );

      expect(session.userId).toBe(user.id);
      expect(getCurrentUser({ users, sessions }, session.id)).toEqual(user);
    });

    it("rejects an unknown contact without revealing that it is unknown", () => {
      expect(() =>
        loginWithPassword(
          { users, credentials, sessions, passwordProvider, auditEvents },
          {
            channel: "phone",
            contactValue: "0500000000",
            password: "anything-at-all",
            actor: "test-actor",
          }
        )
      ).toThrow(InvalidCredentialsError);
    });

    it("rejects an incorrect password", () => {
      register();

      expect(() =>
        loginWithPassword(
          { users, credentials, sessions, passwordProvider, auditEvents },
          {
            channel: "phone",
            contactValue: "0501234567",
            password: "wrong-password",
            actor: "test-actor",
          }
        )
      ).toThrow(InvalidCredentialsError);
    });

    it("rejects login for a disabled account", () => {
      const user = register();
      users.update({ ...user, status: "disabled" });

      expect(() =>
        loginWithPassword(
          { users, credentials, sessions, passwordProvider, auditEvents },
          {
            channel: "phone",
            contactValue: "0501234567",
            password: "correct-horse-battery-staple",
            actor: "test-actor",
          }
        )
      ).toThrow(AccountDisabledError);
    });
  });

  describe("logout", () => {
    it("revokes the session so it can no longer be used", () => {
      register();
      const { session } = loginWithPassword(
        { users, credentials, sessions, passwordProvider, auditEvents },
        {
          channel: "phone",
          contactValue: "0501234567",
          password: "correct-horse-battery-staple",
          actor: "test-actor",
        }
      );

      logout({ sessions, auditEvents }, { sessionId: session.id, actor: "test-actor" });

      expect(() => getCurrentUser({ users, sessions }, session.id)).toThrow();
    });
  });

  describe("updateProfile", () => {
    it("updates the display name and writes an audit event", () => {
      const user = register();

      const updated = updateProfile(
        { users, auditEvents },
        { userId: user.id, displayName: "Jane Smith", actor: "test-actor" }
      );

      expect(updated.displayName).toBe("Jane Smith");
      expect(users.findById(user.id)?.displayName).toBe("Jane Smith");
    });

    it("rejects a blank display name", () => {
      const user = register();

      expect(() =>
        updateProfile(
          { users, auditEvents },
          { userId: user.id, displayName: "   ", actor: "test-actor" }
        )
      ).toThrow();
    });
  });
});
