import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const generateAuthUrl = vi.fn();
const getToken = vi.fn();
const verifyIdToken = vi.fn();

vi.mock("google-auth-library", () => ({
  // Arrow functions can never be constructors ("X is not a constructor" is
  // the exact JS error for `new (() => {})()`) — this must be a real
  // function expression so `new OAuth2Client(...)` in the adapter works.
  OAuth2Client: vi.fn().mockImplementation(function MockOAuth2Client() {
    return { generateAuthUrl, getToken, verifyIdToken };
  }),
  CodeChallengeMethod: { Plain: "plain", S256: "S256" },
}));

import { createGoogleOAuthProvider, googleOAuthRedirectUri } from "./google-oauth-provider";

describe("googleOAuthRedirectUri", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses the canonical production domain in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(googleOAuthRedirectUri()).toBe("https://afaqalhayatae.com/api/auth/google/callback");
  });

  it("uses localhost outside production", () => {
    vi.stubEnv("NODE_ENV", "test");
    expect(googleOAuthRedirectUri()).toBe("http://localhost:3000/api/auth/google/callback");
  });
});

describe("createGoogleOAuthProvider", () => {
  beforeEach(() => {
    generateAuthUrl.mockReset();
    getToken.mockReset();
    verifyIdToken.mockReset();
  });

  const provider = () =>
    createGoogleOAuthProvider({ clientId: "test-client-id", clientSecret: "test-client-secret" });

  describe("getAuthorizationUrl", () => {
    it("requests openid/email/profile scope and PKCE S256 with the caller's state/challenge", () => {
      generateAuthUrl.mockReturnValue("https://accounts.google.com/o/oauth2/v2/auth?mock=1");

      const url = provider().getAuthorizationUrl({
        state: "signed-state-value",
        codeChallenge: "challenge-value",
      });

      expect(url).toBe("https://accounts.google.com/o/oauth2/v2/auth?mock=1");
      expect(generateAuthUrl).toHaveBeenCalledWith(
        expect.objectContaining({
          scope: ["openid", "email", "profile"],
          state: "signed-state-value",
          code_challenge: "challenge-value",
          code_challenge_method: "S256",
        })
      );
    });
  });

  describe("exchangeCodeForIdToken", () => {
    it("returns the id_token from a successful exchange", async () => {
      getToken.mockResolvedValue({ tokens: { id_token: "raw-id-token" } });

      const idToken = await provider().exchangeCodeForIdToken({
        code: "auth-code",
        codeVerifier: "verifier",
      });

      expect(idToken).toBe("raw-id-token");
      expect(getToken).toHaveBeenCalledWith({ code: "auth-code", codeVerifier: "verifier" });
    });

    it("throws if Google's response has no id_token", async () => {
      getToken.mockResolvedValue({ tokens: {} });

      await expect(
        provider().exchangeCodeForIdToken({ code: "auth-code", codeVerifier: "verifier" })
      ).rejects.toThrow(/id_token/);
    });
  });

  describe("verifyIdToken", () => {
    it("maps a verified payload to the adapter's identity shape", async () => {
      verifyIdToken.mockResolvedValue({
        getPayload: () => ({
          sub: "google-sub-1",
          email: "user@example.test",
          email_verified: true,
          name: "Test User",
          picture: "https://example.test/avatar.jpg",
        }),
      });

      const identity = await provider().verifyIdToken("raw-id-token");

      expect(identity).toEqual({
        providerAccountId: "google-sub-1",
        email: "user@example.test",
        emailVerified: true,
        displayName: "Test User",
        avatarUrl: "https://example.test/avatar.jpg",
      });
      expect(verifyIdToken).toHaveBeenCalledWith({
        idToken: "raw-id-token",
        audience: "test-client-id",
      });
    });

    it("defaults emailVerified to false when Google omits the claim", async () => {
      verifyIdToken.mockResolvedValue({
        getPayload: () => ({ sub: "google-sub-2", email: "user2@example.test" }),
      });

      const identity = await provider().verifyIdToken("raw-id-token");
      expect(identity.emailVerified).toBe(false);
    });

    it("throws if the payload is missing required claims", async () => {
      verifyIdToken.mockResolvedValue({ getPayload: () => null });
      await expect(provider().verifyIdToken("raw-id-token")).rejects.toThrow(/required claims/);
    });
  });
});
