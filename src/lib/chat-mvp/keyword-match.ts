/**
 * Shared keyword-matching helper for intents.ts and service-matcher.ts.
 *
 * Plain substring matching is fine for most keywords here (it needs to
 * match word stems too — "clean" must match "cleaning", "repair" must
 * match "repairs") but is unsafe for a few short, whole English words
 * that are also substrings of common unrelated words — e.g. "ant" is
 * inside "want", "rat" is inside "separate", "ac" is a prefix of
 * "according". Those specific tokens are matched as whole words
 * (optionally plural) instead of naive substrings. This was found by a
 * real failing test (chatbot-mvp.test.ts Test 3: "I want house
 * cleaning" was mis-detected as PEST_CONTROL because of "w-ANT").
 */

const WHOLE_WORD_ONLY = new Set(["ac", "ant", "rat"]);

export function matchesKeyword(normalizedText: string, keyword: string): boolean {
  if (WHOLE_WORD_ONLY.has(keyword)) {
    return new RegExp(`\\b${keyword}s?\\b`, "i").test(normalizedText);
  }
  return normalizedText.includes(keyword);
}

export function matchesAnyKeyword(normalizedText: string, keywords: string[]): boolean {
  return keywords.some((keyword) => matchesKeyword(normalizedText, keyword));
}
