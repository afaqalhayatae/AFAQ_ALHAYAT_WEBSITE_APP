/**
 * Automated implementation of
 * 08_DIGITAL_SYSTEMS/AI_CHATBOT/05_TEST_SCENARIOS.md (AFAQ_ALHAYAT_ENTERPRISE_KNOWLEDGE
 * repo) — keep both in sync.
 */
import { describe, expect, it } from "vitest";
import { createInitialState, handleMessage } from "./qualification-flow";

const PRICE_NUMBER_PATTERN = /(AED|aed|\d+\s*(dirham|درهم)|starting from|بداية من|discount|خصم|free\b|مجان)/i;

describe("chatbot MVP — named test scenarios", () => {
  it("Test 1 — 'I need AC repair' detects MAINTENANCE / SVC-AC-MAINTENANCE, asks next question, no commercial claims", () => {
    const state = createInitialState();
    const { state: next, replies } = handleMessage(state, "I need AC repair");

    expect(next.intent).toBe("MAINTENANCE");
    expect(next.serviceMatch?.serviceId).toBe("SVC-AC-MAINTENANCE");
    expect(next.pendingQuestion).toBe("customerType");

    const allText = replies.map((r) => r.en + r.ar).join(" ");
    expect(allText).not.toMatch(PRICE_NUMBER_PATTERN);
    expect(allText.toLowerCase()).not.toContain("same day");
    expect(allText.toLowerCase()).not.toContain("technician john");
  });

  it("Test 2 — 'I have cockroaches' detects PEST_CONTROL / SVC-PEST-CONTROL (Cockroach Control), no guarantee claims", () => {
    const state = createInitialState();
    const { state: next, replies } = handleMessage(state, "I have cockroaches");

    expect(next.intent).toBe("PEST_CONTROL");
    expect(next.serviceMatch?.serviceId).toBe("SVC-PEST-CONTROL");
    expect(next.serviceMatch?.subTopic).toBe("Cockroach Control");

    const allText = replies.map((r) => r.en + r.ar).join(" ");
    expect(allText.toLowerCase()).not.toContain("100% guaranteed");
    expect(allText.toLowerCase()).not.toContain("guaranteed");
  });

  it("Test 3 — 'I want house cleaning' detects CLEANING / SVC-GENERAL-CLEANING (generic fallback, no sub-pattern present)", () => {
    const state = createInitialState();
    const { state: next } = handleMessage(state, "I want house cleaning");

    expect(next.intent).toBe("CLEANING");
    expect(next.serviceMatch?.serviceId).toBe("SVC-GENERAL-CLEANING");
    // Property type must not be assumed without asking.
    expect(next.answers.propertyType).toBeUndefined();
  });

  it("Test 4 — 'How much does it cost?' returns the fixed price-deflection response, never a number (safety-critical)", () => {
    const state = createInitialState();
    const { state: next, replies } = handleMessage(state, "How much does it cost?");

    expect(next.intent).toBe("PRICE_INQUIRY");
    const allText = replies.map((r) => r.en + r.ar).join(" ");
    expect(allText).not.toMatch(PRICE_NUMBER_PATTERN);
    expect(allText.toLowerCase()).toContain("quote");
  });

  it("Test 5 — 'I need urgent service' detects EMERGENCY, surfaces phone before WhatsApp, no arrival-time promise", () => {
    const state = createInitialState();
    const { state: next, replies } = handleMessage(state, "I need urgent service");

    expect(next.intent).toBe("EMERGENCY");
    const enText = replies[0].en;
    expect(enText.indexOf("+971")).toBeLessThan(enText.indexOf("wa.me"));
    expect(enText.toLowerCase()).not.toContain("minutes");
    expect(enText.toLowerCase()).not.toContain("on the way");
  });
});

describe("chatbot MVP — edge cases", () => {
  it("ambiguous message with no keyword match asks a clarifying question, does not guess", () => {
    const state = createInitialState();
    const { state: next, replies } = handleMessage(state, "I need help");

    expect(next.intent).toBeNull();
    expect(replies[0].en).toContain("maintenance issue");
  });

  it("dual service intent in one message asks which to start with, doesn't silently pick one", () => {
    const state = createInitialState();
    const { state: next, replies } = handleMessage(state, "I need AC repair and cleaning");

    expect(next.intent).toBeNull();
    expect(next.awaitingIntentClarification).toBe(true);
    expect(replies[0].en.toLowerCase()).toContain("start");
  });

  it("pre-filled answers in the opening message skip already-answered questions", () => {
    const state = createInitialState();
    const { state: next } = handleMessage(state, "AC repair in Dubai, I'm in a villa");

    expect(next.answers.emirate).toBe("Dubai");
    expect(next.answers.propertyType).toBe("Villa");
    expect(next.pendingQuestion).toBe("customerType");
  });

  it("Arabic pest-control message matches the same intent/service as the English equivalent", () => {
    const state = createInitialState();
    const { state: next } = handleMessage(state, "عندي صرصور في المطبخ");

    expect(next.intent).toBe("PEST_CONTROL");
    expect(next.serviceMatch?.serviceId).toBe("SVC-PEST-CONTROL");
    expect(next.serviceMatch?.subTopic).toBe("Cockroach Control");
  });

  it("asking whether the assistant is a real person gets a truthful AI-identity answer", () => {
    const state = createInitialState();
    const { replies } = handleMessage(state, "Is this a real person?");

    expect(replies[0].en.toLowerCase()).toContain("ai assistant");
  });

  it("two consecutive unrecognized messages trigger escalation", () => {
    let state = createInitialState();
    ({ state } = handleMessage(state, "asdkfj random text"));
    const { state: finalState, replies } = handleMessage(state, "still nothing recognizable");

    expect(finalState.escalated).toBe(true);
    expect(replies.some((r) => r.en.includes("+971"))).toBe(true);
  });

  it("a full qualification walkthrough reaches completion with a summary, then a conversion route", () => {
    let state = createInitialState();
    let result = handleMessage(state, "I need AC repair");
    state = result.state;
    result = handleMessage(state, "individual");
    state = result.state;
    result = handleMessage(state, "Dubai");
    state = result.state;
    result = handleMessage(state, "Villa");
    state = result.state;
    result = handleMessage(state, "AC not cooling at all");
    state = result.state;
    result = handleMessage(state, "single visit");
    state = result.state;
    result = handleMessage(state, "tomorrow afternoon");
    state = result.state;
    result = handleMessage(state, "Ahmed, 0501234567");
    state = result.state;

    expect(state.complete).toBe(true);
    expect(result.replies[0].en.toLowerCase()).toContain("to confirm");
  });
});
