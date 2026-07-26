import { beforeEach, describe, expect, it, vi } from "vitest";
import { createSession, revokeSession, validateSession } from "./session-service";
import { createInMemorySessionRepository } from "@/lib/adapters/in-memory/session-repository";
import { SessionExpiredError, SessionNotFoundError } from "./errors";
import type { SessionRepository } from "@/lib/adapters/types";

describe("session-service", () => {
  let sessions: SessionRepository;

  beforeEach(() => {
    sessions = createInMemorySessionRepository();
  });

  it("creates a session that is valid immediately", () => {
    const session = createSession({ sessions }, "user_1");

    expect(session.userId).toBe("user_1");
    expect(validateSession({ sessions }, session.id)).toEqual(session);
  });

  it("throws SessionNotFoundError for an unknown session id", () => {
    expect(() => validateSession({ sessions }, "sess_missing")).toThrow(
      SessionNotFoundError
    );
  });

  it("throws SessionExpiredError and revokes an expired session", () => {
    const session = createSession({ sessions }, "user_1");
    vi.spyOn(Date, "now").mockReturnValue(Date.parse(session.expiresAt) + 1);

    expect(() => validateSession({ sessions }, session.id)).toThrow(
      SessionExpiredError
    );
    vi.restoreAllMocks();
    expect(sessions.findById(session.id)).toBeUndefined();
  });

  it("revokes a session on demand", () => {
    const session = createSession({ sessions }, "user_1");
    revokeSession({ sessions }, session.id);

    expect(() => validateSession({ sessions }, session.id)).toThrow(
      SessionNotFoundError
    );
  });
});
