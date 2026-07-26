import { beforeEach, describe, expect, it } from "vitest";
import { createInMemoryUserRepository } from "./user-repository";
import type { User } from "@/types/identity";
import type { UserRepository } from "@/lib/adapters/types";

describe("in-memory user repository", () => {
  let repo: UserRepository;

  beforeEach(() => {
    repo = createInMemoryUserRepository();
  });

  function makeUser(overrides: Partial<User> = {}): User {
    return {
      id: "user_1",
      displayName: "Jane Doe",
      contact: { channel: "phone", value: "0501234567" },
      emailVerified: false,
      phoneVerified: false,
      status: "active",
      createdAt: new Date().toISOString(),
      ...overrides,
    };
  }

  it("creates and finds a user by id", () => {
    const user = makeUser();
    repo.create(user);

    expect(repo.findById(user.id)).toEqual(user);
  });

  it("finds a user by matching channel and contact value", () => {
    const user = makeUser();
    repo.create(user);

    expect(repo.findByContact("phone", "0501234567")).toEqual(user);
    expect(repo.findByContact("email", "0501234567")).toBeUndefined();
    expect(repo.findByContact("phone", "0000000000")).toBeUndefined();
  });

  it("updates an existing user in place", () => {
    const user = makeUser();
    repo.create(user);

    repo.update({ ...user, displayName: "Jane Smith" });

    expect(repo.findById(user.id)?.displayName).toBe("Jane Smith");
  });

  it("clears all users", () => {
    repo.create(makeUser());
    repo.clear();

    expect(repo.findById("user_1")).toBeUndefined();
  });
});
