import { describe, expect, it } from "vitest";
import { formatReadingTime, getReadingTimeMinutes } from "./reading-time";
import type { ArticleBlock } from "./blog";

describe("getReadingTimeMinutes", () => {
  it("counts words across paragraph, heading, and list blocks", () => {
    const blocks: ArticleBlock[] = [
      { type: "heading", id: "h1", text: "one two three" },
      { type: "paragraph", text: "four five six seven" },
      { type: "list", items: ["eight nine", "ten"] },
    ];

    // 10 words at 200 wpm rounds up to the 1-minute floor.
    expect(getReadingTimeMinutes(blocks)).toBe(1);
  });

  it("never returns less than 1 minute for a short body", () => {
    expect(getReadingTimeMinutes([{ type: "paragraph", text: "hi" }])).toBe(1);
  });

  it("scales with body length", () => {
    const longParagraph = Array(600).fill("word").join(" ");
    const blocks: ArticleBlock[] = [{ type: "paragraph", text: longParagraph }];
    expect(getReadingTimeMinutes(blocks)).toBe(3);
  });
});

describe("formatReadingTime", () => {
  it("formats English singular and plural", () => {
    expect(formatReadingTime(1, "en")).toBe("1 min read");
    expect(formatReadingTime(5, "en")).toBe("5 min read");
  });

  it("formats Arabic singular, dual, and plural forms", () => {
    expect(formatReadingTime(1, "ar")).toBe("دقيقة واحدة للقراءة");
    expect(formatReadingTime(2, "ar")).toBe("دقيقتان للقراءة");
    expect(formatReadingTime(5, "ar")).toBe("5 دقائق للقراءة");
    expect(formatReadingTime(15, "ar")).toBe("15 دقيقة للقراءة");
  });
});
