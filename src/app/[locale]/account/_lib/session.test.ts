import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: async () => ({
    toString: () => "afaq_session=sess_123",
  }),
  headers: async () => ({
    get: (name: string) => (name === "host" ? "example.test" : null),
  }),
}));

vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error(`REDIRECT:${url}`);
  },
}));

import { fetchAccountData, requireUser } from "./session";

describe("requireUser", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the user when the session endpoint responds ok", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        apiVersion: "v1",
        correlationId: "test",
        data: { id: "user_1", displayName: "Jane Doe" },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const user = await requireUser("en");

    expect(user).toEqual({ id: "user_1", displayName: "Jane Doe" });
    expect(fetchMock).toHaveBeenCalledWith(
      "http://example.test/api/auth/session",
      expect.objectContaining({ headers: { cookie: "afaq_session=sess_123" } })
    );
  });

  it("redirects to /{locale}/login when there is no valid session", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) });
    vi.stubGlobal("fetch", fetchMock);

    await expect(requireUser("ar")).rejects.toThrow("REDIRECT:/ar/login");
  });
});

describe("fetchAccountData", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the data field on success", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ apiVersion: "v1", correlationId: "test", data: [1, 2, 3] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchAccountData("/api/account/requests")).resolves.toEqual([1, 2, 3]);
  });

  it("throws with the API error message on failure", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: { message: "No active session" } }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchAccountData("/api/account/requests")).rejects.toThrow(
      "No active session"
    );
  });
});
