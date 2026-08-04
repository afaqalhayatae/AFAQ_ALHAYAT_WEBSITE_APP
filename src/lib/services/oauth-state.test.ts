import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { generatePkcePair, signOAuthState, verifyOAuthState } from "./oauth-state";
import { OAuthStateInvalidError } from "./errors";

describe("generatePkcePair", () => {
  it("produces a code_verifier and its S256 code_challenge, both URL-safe", () => {
    const { codeVerifier, codeChallenge } = generatePkcePair();
    expect(codeVerifier.length).toBeGreaterThan(30);
    expect(codeChallenge.length).toBeGreaterThan(30);
    // base64url never contains +, /, or = padding — a real requirement for
    // a query-string-safe PKCE parameter.
    expect(codeVerifier).not.toMatch(/[+/=]/);
    expect(codeChallenge).not.toMatch(/[+/=]/);
  });

  it("produces a distinct pair on every call", () => {
    const a = generatePkcePair();
    const b = generatePkcePair();
    expect(a.codeVerifier).not.toBe(b.codeVerifier);
    expect(a.codeChallenge).not.toBe(b.codeChallenge);
  });
});

describe("signOAuthState / verifyOAuthState", () => {
  const originalSecret = process.env.AUTH_SECRET;

  beforeEach(() => {
    process.env.AUTH_SECRET = "test-only-secret-do-not-use-in-production";
  });

  afterEach(() => {
    if (originalSecret === undefined) {
      delete process.env.AUTH_SECRET;
    } else {
      process.env.AUTH_SECRET = originalSecret;
    }
    vi.useRealTimers();
  });

  it("round-trips the code_verifier and locale through a signed state", () => {
    const state = signOAuthState("verifier-abc", "ar");
    expect(verifyOAuthState(state)).toEqual({ codeVerifier: "verifier-abc", locale: "ar" });
  });

  it("produces a distinct state on every call, even for the same input", () => {
    const a = signOAuthState("same-verifier", "en");
    const b = signOAuthState("same-verifier", "en");
    expect(a).not.toBe(b);
  });

  it("rejects a state with a tampered payload", () => {
    const state = signOAuthState("verifier-abc", "ar");
    const [payloadB64, signature] = state.split(".");
    const tamperedPayload = Buffer.from(
      JSON.stringify({ nonce: "x", codeVerifier: "attacker-controlled", locale: "ar", issuedAt: Date.now() })
    ).toString("base64url");
    expect(() => verifyOAuthState(`${tamperedPayload}.${signature}`)).toThrow(OAuthStateInvalidError);
    void payloadB64;
  });

  it("rejects a state signed with a different secret", () => {
    const state = signOAuthState("verifier-abc", "ar");
    process.env.AUTH_SECRET = "a-completely-different-secret";
    expect(() => verifyOAuthState(state)).toThrow(OAuthStateInvalidError);
  });

  it("rejects a malformed state string", () => {
    expect(() => verifyOAuthState("not-a-valid-state")).toThrow(OAuthStateInvalidError);
    expect(() => verifyOAuthState("")).toThrow(OAuthStateInvalidError);
  });

  it("rejects an expired state", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    const state = signOAuthState("verifier-abc", "ar");

    vi.setSystemTime(new Date("2026-01-01T00:11:00.000Z")); // 11 minutes later, TTL is 10
    expect(() => verifyOAuthState(state)).toThrow(OAuthStateInvalidError);
  });

  it("accepts a state just under the expiry window", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    const state = signOAuthState("verifier-abc", "ar");

    vi.setSystemTime(new Date("2026-01-01T00:09:00.000Z")); // 9 minutes later
    expect(verifyOAuthState(state).codeVerifier).toBe("verifier-abc");
  });

  it("throws a clear error when AUTH_SECRET is unset", () => {
    delete process.env.AUTH_SECRET;
    expect(() => signOAuthState("verifier-abc", "ar")).toThrow(/AUTH_SECRET/);
  });
});
