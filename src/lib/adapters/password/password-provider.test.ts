import { describe, expect, it } from "vitest";
import { createPasswordAuthProvider } from "./password-provider";

describe("password auth provider", () => {
  it("verifies a password against its own hash", () => {
    const provider = createPasswordAuthProvider();
    const { hash, salt } = provider.hash("correct-horse-battery-staple");

    expect(provider.verify("correct-horse-battery-staple", hash, salt)).toBe(true);
  });

  it("rejects an incorrect password", () => {
    const provider = createPasswordAuthProvider();
    const { hash, salt } = provider.hash("correct-horse-battery-staple");

    expect(provider.verify("wrong-password", hash, salt)).toBe(false);
  });

  it("produces a different salt (and hash) for the same password each time", () => {
    const provider = createPasswordAuthProvider();
    const first = provider.hash("same-password");
    const second = provider.hash("same-password");

    expect(first.salt).not.toBe(second.salt);
    expect(first.hash).not.toBe(second.hash);
  });
});
