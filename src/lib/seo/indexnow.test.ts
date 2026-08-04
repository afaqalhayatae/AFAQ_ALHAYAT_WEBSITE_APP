import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { INDEXNOW_KEY, INDEXNOW_KEY_LOCATION } from "./indexnow";

describe("IndexNow key", () => {
  it("matches the content of the hosted public/{key}.txt file exactly", () => {
    const fileContent = readFileSync(
      join(process.cwd(), "public", `${INDEXNOW_KEY}.txt`),
      "utf-8"
    ).trim();
    expect(fileContent).toBe(INDEXNOW_KEY);
  });

  it("is a valid IndexNow key: 8-128 hexadecimal characters", () => {
    expect(INDEXNOW_KEY).toMatch(/^[a-f0-9]{8,128}$/);
  });

  it("key location URL matches the real domain and key", () => {
    expect(INDEXNOW_KEY_LOCATION).toBe(
      `https://afaqalhayatae.com/${INDEXNOW_KEY}.txt`
    );
  });
});
