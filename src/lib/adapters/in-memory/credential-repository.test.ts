import { beforeEach, describe, expect, it } from "vitest";
import { createInMemoryCredentialRepository } from "./credential-repository";
import type { CredentialRepository } from "@/lib/adapters/types";

describe("in-memory credential repository", () => {
  let repo: CredentialRepository;

  beforeEach(() => {
    repo = createInMemoryCredentialRepository();
  });

  it("sets and finds a credential by user id", () => {
    const credential = {
      userId: "user_1",
      passwordHash: "hash",
      passwordSalt: "salt",
      updatedAt: new Date().toISOString(),
    };
    repo.set(credential);

    expect(repo.findByUserId("user_1")).toEqual(credential);
  });

  it("returns undefined for an unknown user id", () => {
    expect(repo.findByUserId("user_missing")).toBeUndefined();
  });

  it("overwrites the credential when set again for the same user", () => {
    repo.set({
      userId: "user_1",
      passwordHash: "old-hash",
      passwordSalt: "old-salt",
      updatedAt: new Date(0).toISOString(),
    });
    repo.set({
      userId: "user_1",
      passwordHash: "new-hash",
      passwordSalt: "new-salt",
      updatedAt: new Date(1).toISOString(),
    });

    expect(repo.findByUserId("user_1")?.passwordHash).toBe("new-hash");
  });

  it("clears all credentials", () => {
    repo.set({
      userId: "user_1",
      passwordHash: "hash",
      passwordSalt: "salt",
      updatedAt: new Date().toISOString(),
    });
    repo.clear();

    expect(repo.findByUserId("user_1")).toBeUndefined();
  });
});
