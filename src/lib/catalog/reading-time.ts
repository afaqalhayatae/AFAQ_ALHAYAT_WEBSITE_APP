import type { Locale } from "@/i18n/config";
import type { ArticleBlock } from "./blog";

const WORDS_PER_MINUTE = 200;

function countWords(blocks: ArticleBlock[]): number {
  return blocks.reduce((total, block) => {
    if (block.type === "list") {
      return (
        total +
        block.items.reduce((sum, item) => sum + item.trim().split(/\s+/).filter(Boolean).length, 0)
      );
    }
    return total + block.text.trim().split(/\s+/).filter(Boolean).length;
  }, 0);
}

/** Reading time is computed from the actual article body, never invented. */
export function getReadingTimeMinutes(blocks: ArticleBlock[]): number {
  return Math.max(1, Math.round(countWords(blocks) / WORDS_PER_MINUTE));
}

export function formatReadingTime(minutes: number, locale: Locale): string {
  if (locale === "ar") {
    if (minutes === 1) return "دقيقة واحدة للقراءة";
    if (minutes === 2) return "دقيقتان للقراءة";
    if (minutes >= 3 && minutes <= 10) return `${minutes} دقائق للقراءة`;
    return `${minutes} دقيقة للقراءة`;
  }
  return minutes === 1 ? "1 min read" : `${minutes} min read`;
}
