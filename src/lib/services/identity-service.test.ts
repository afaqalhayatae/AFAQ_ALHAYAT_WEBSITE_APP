import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  getCurrentUser,
  loginOrRegisterWithGoogle,
  loginWithPassword,
  logout,
  registerWithPassword,
  updateProfile,
} from "./identity-service";
import { createInMemoryUserRepository } from "@/lib/adapters/in-memory/user-repository";
import { createInMemoryCredentialRepository } from "@/lib/adapters/in-memory/credential-repository";
import { createInMemorySessionRepository } from "@/lib/adapters/in-memory/session-repository";
import { getAuditEventRepository } from "@/lib/adapters/repository-factory";
import { createPasswordAuthProvider } from "@/lib/adapters/password/password-provider";
import {
  AccountDisabledError,
  ContactAlreadyRegisteredError,
  GoogleAccountDisabledError,
  InvalidCredentialsError,
  WeakPasswordError,
} from "./errors";
import type {
  CredentialRepository,
  PasswordAuthProviderAdapter,
  SessionRepository,
  UserRepository,
} from "@/lib/adapters/types";
import type { AsyncAuditEventRepository } from "@/lib/adapters/prisma/types";

// Database Foundation Phase 1J — AuditEvent switchover. Every function in
// identity-service.ts became async purely as a consequence of
// writeAuditEvent's signature change — no authentication logic changed.
// users/credentials/sessions stay the existing synchronous repositories,
// untouched (not in the migration priority list).
describe("identity-service", () => {
  let users: UserRepository;
  let credentials: CredentialRepository;
  let sessions: SessionRepository;
  let auditEvents: AsyncAuditEventRepository;
  let passwordProvider: PasswordAuthProviderAdapter;

  beforeEach(() => {
    users = createInMemoryUserRepository();
    credentials = createInMemoryCredentialRepository();
    sessions = createInMemorySessionRepository();
    auditEvents = getAuditEventRepository();
    passwordProvider = createPasswordAuthProvider();
  });

  afterEach(async () => {
    await auditEvents.clear();
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
    it("creates a user and an audit event, never returning credential fields", async () => {
      const user = await register();

      expect(user.status).toBe("active");
      expect(user).not.toHaveProperty("passwordHash");
      const events = await auditEvents.findByActor("test-actor");
      expect(events[0].action).toBe("user.registered");
      expect(credentials.findByUserId(user.id)).toBeDefined();
    });

    it("rejects a password shorter than the minimum length", async () => {
      await expect(register({ password: "short" })).rejects.toThrow(WeakPasswordError);
    });

    it("rejects registering the same contact twice", async () => {
      await register();
      await expect(register()).rejects.toThrow(ContactAlreadyRegisteredError);
    });
  });

  describe("loginWithPassword", () => {
    it("issues a session for correct credentials", async () => {
      await register();

      const { user, session } = await loginWithPassword(
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

    it("rejects an unknown contact without revealing that it is unknown", async () => {
      await expect(
        loginWithPassword(
          { users, credentials, sessions, passwordProvider, auditEvents },
          {
            channel: "phone",
            contactValue: "0500000000",
            password: "anything-at-all",
            actor: "test-actor",
          }
        )
      ).rejects.toThrow(InvalidCredentialsError);
    });

    it("rejects an incorrect password", async () => {
      await register();

      await expect(
        loginWithPassword(
          { users, credentials, sessions, passwordProvider, auditEvents },
          {
            channel: "phone",
            contactValue: "0501234567",
            password: "wrong-password",
            actor: "test-actor",
          }
        )
      ).rejects.toThrow(InvalidCredentialsError);
    });

    it("rejects login for a disabled account", async () => {
      const user = await register();
      users.update({ ...user, status: "disabled" });

      await expect(
        loginWithPassword(
          { users, credentials, sessions, passwordProvider, auditEvents },
          {
            channel: "phone",
            contactValue: "0501234567",
            password: "correct-horse-battery-staple",
            actor: "test-actor",
          }
        )
      ).rejects.toThrow(AccountDisabledError);
    });
  });

  describe("logout", () => {
    it("revokes the session so it can no longer be used", async () => {
      await register();
      const { session } = await loginWithPassword(
        { users, credentials, sessions, passwordProvider, auditEvents },
        {
          channel: "phone",
          contactValue: "0501234567",
          password: "correct-horse-battery-staple",
          actor: "test-actor",
        }
      );

      await logout({ sessions, auditEvents }, { sessionId: session.id, actor: "test-actor" });

      expect(() => getCurrentUser({ users, sessions }, session.id)).toThrow();
    });
  });

  describe("updateProfile", () => {
    it("updates the display name and writes an audit event", async () => {
      const user = await register();

      const updated = await updateProfile(
        { users, auditEvents },
        { userId: user.id, displayName: "Jane Smith", actor: "test-actor" }
      );

      expect(updated.displayName).toBe("Jane Smith");
      expect(users.findById(user.id)?.displayName).toBe("Jane Smith");
    });

    it("rejects a blank display name", async () => {
      const user = await register();

      await expect(
        updateProfile(
          { users, auditEvents },
          { userId: user.id, displayName: "   ", actor: "test-actor" }
        )
      ).rejects.toThrow();
    });
  });

  describe("loginOrRegisterWithGoogle", () => {
    const googleIdentity = {
      providerAccountId: "google-sub-123",
      email: "jane@example.test",
      emailVerified: true,
      displayName: "Jane From Google",
      avatarUrl: "https://lh3.googleusercontent.com/a/example",
      actor: "google-oauth",
    };

    it("creates a new user with no password credential, matching the Google profile", async () => {
      const { user, session, isNewUser } = await loginOrRegisterWithGoogle(
        { users, sessions, auditEvents },
        googleIdentity
      );

      expect(isNewUser).toBe(true);
      expect(user.displayName).toBe("Jane From Google");
      expect(user.contact).toEqual({ channel: "email", value: "jane@example.test" });
      expect(user.emailVerified).toBe(true);
      expect(user.authProvider).toBe("google");
      expect(user.providerAccountId).toBe("google-sub-123");
      expect(user.avatarUrl).toBe("https://lh3.googleusercontent.com/a/example");
      // The core requirement: no password credential is ever created for a
      // Google-originated account.
      expect(credentials.findByUserId(user.id)).toBeUndefined();
      expect(session.userId).toBe(user.id);

      const events = await auditEvents.findByActor("google-oauth");
      expect(events[0].action).toBe("user.registered_via_google");
    });

    it("falls back to the email's local part when Google returns no display name", async () => {
      const { user } = await loginOrRegisterWithGoogle(
        { users, sessions, auditEvents },
        { ...googleIdentity, displayName: undefined }
      );
      expect(user.displayName).toBe("jane");
    });

    it("logs in an existing user found by verified email, without creating a duplicate", async () => {
      const { user: created } = await loginOrRegisterWithGoogle(
        { users, sessions, auditEvents },
        googleIdentity
      );

      const { user: loggedIn, isNewUser } = await loginOrRegisterWithGoogle(
        { users, sessions, auditEvents },
        googleIdentity
      );

      expect(isNewUser).toBe(false);
      expect(loggedIn.id).toBe(created.id);
    });

    it("rejects an unverified Google email without creating an account", async () => {
      await expect(
        loginOrRegisterWithGoogle(
          { users, sessions, auditEvents },
          { ...googleIdentity, emailVerified: false }
        )
      ).rejects.toThrow(InvalidCredentialsError);

      expect(users.findByContact("email", "jane@example.test")).toBeUndefined();
    });

    it("rejects sign-in for an existing account that has been disabled", async () => {
      const { user } = await loginOrRegisterWithGoogle(
        { users, sessions, auditEvents },
        googleIdentity
      );
      users.update({ ...user, status: "disabled" });

      await expect(
        loginOrRegisterWithGoogle({ users, sessions, auditEvents }, googleIdentity)
      ).rejects.toThrow(GoogleAccountDisabledError);
    });

    it("issues a real session usable by the existing session/cookie machinery", async () => {
      const { session } = await loginOrRegisterWithGoogle(
        { users, sessions, auditEvents },
        googleIdentity
      );
      const user = getCurrentUser({ users, sessions }, session.id);
      expect(user.contact.value).toBe("jane@example.test");
    });
  });
});
