import { beforeEach, describe, expect, it } from "vitest";
import { createInMemorySessionRepository } from "./session-repository";
import type { SessionRepository } from "@/lib/adapters/types";

describe("in-memory session repository", () => {
  let repo: SessionRepository;

  beforeEach(() => {
    repo = createInMemorySessionRepository();
  });

  function makeSession() {
    return {
      id: "sess_1",
      userId: "user_1",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 1000).toISOString(),
    };
  }

  it("creates and finds a session by id", () => {
    const session = makeSession();
    repo.create(session);

    expect(repo.findById(session.id)).toEqual(session);
  });

  it("revokes a session so it can no longer be found", () => {
    const session = makeSession();
    repo.create(session);

    repo.revoke(session.id);

    expect(repo.findById(session.id)).toBeUndefined();
  });

  it("clears all sessions", () => {
    repo.create(makeSession());
    repo.clear();

    expect(repo.findById("sess_1")).toBeUndefined();
  });
});
