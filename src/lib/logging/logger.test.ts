import { afterEach, describe, expect, it, vi } from "vitest";
import { logError, logInfo, logWarn } from "./logger";

describe("logger", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logError writes a structured JSON line to console.error with error name/message/stack and context", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = new Error("db connection dropped");

    logError("Unexpected error in POST /api/enquiries", error, { route: "enquiries", method: "POST" });

    expect(spy).toHaveBeenCalledTimes(1);
    const entry = JSON.parse(spy.mock.calls[0][0] as string);
    expect(entry.level).toBe("error");
    expect(entry.message).toBe("Unexpected error in POST /api/enquiries");
    expect(entry.errorName).toBe("Error");
    expect(entry.errorMessage).toBe("db connection dropped");
    expect(entry.stack).toEqual(expect.stringContaining("Error"));
    expect(entry.route).toBe("enquiries");
    expect(entry.method).toBe("POST");
    expect(typeof entry.timestamp).toBe("string");
  });

  it("logError handles a non-Error thrown value without crashing", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    logError("Unexpected error", "a plain string was thrown");
    const entry = JSON.parse(spy.mock.calls[0][0] as string);
    expect(entry.error).toBe("a plain string was thrown");
  });

  it("logWarn writes to console.warn, logInfo writes to console.log", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    logWarn("degraded path taken", { reason: "cache miss" });
    logInfo("routine event", { userId: "u-1" });

    expect(JSON.parse(warnSpy.mock.calls[0][0] as string)).toMatchObject({
      level: "warn",
      message: "degraded path taken",
      reason: "cache miss",
    });
    expect(JSON.parse(logSpy.mock.calls[0][0] as string)).toMatchObject({
      level: "info",
      message: "routine event",
      userId: "u-1",
    });
  });
});
