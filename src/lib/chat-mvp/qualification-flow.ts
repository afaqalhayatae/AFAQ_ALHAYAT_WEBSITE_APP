/**
 * Conversation state machine for the chatbot MVP. Implements
 * 08_DIGITAL_SYSTEMS/AI_CHATBOT/02_CONVERSATION_FLOWS.md and
 * 03_SERVICE_QUALIFICATION_RULES.md §2 in the
 * AFAQ_ALHAYAT_ENTERPRISE_KNOWLEDGE repo.
 *
 * Rule-based, no LLM — see 01_AI_CHATBOT_ARCHITECTURE.md §1 for why this
 * is the deliberate MVP scope, not a shortcut.
 */

import { detectPrimaryIntent, hasMultipleServiceIntents, type Intent } from "./intents";
import { matchService, type ServiceMatch } from "./service-matcher";
import {
  buildAiIdentityResponse,
  buildConversionRoute,
  buildEmergencyResponse,
  buildEscalationResponse,
  buildPriceResponse,
  buildServiceRecommendation,
  buildSummary,
  buildUnmatchedServiceResponse,
  CLARIFY_MULTIPLE_INTENTS,
  CLARIFY_UNKNOWN_INTENT,
  questionPrompt,
  QUESTION_OPTIONS,
  WELCOME,
  type Bilingual,
} from "./responses";

const EMIRATES: { key: string; patterns: string[] }[] = [
  { key: "Dubai", patterns: ["dubai", "دبي"] },
  { key: "Abu Dhabi", patterns: ["abu dhabi", "أبوظبي", "ابوظبي"] },
  { key: "Sharjah", patterns: ["sharjah", "الشارقة"] },
  { key: "Ajman", patterns: ["ajman", "عجمان"] },
  { key: "Umm Al Quwain", patterns: ["umm al quwain", "أم القيوين", "ام القيوين"] },
  { key: "Ras Al Khaimah", patterns: ["ras al khaimah", "رأس الخيمة", "راس الخيمة"] },
  { key: "Fujairah", patterns: ["fujairah", "الفجيرة"] },
];

const PROPERTY_TYPES: { key: string; patterns: string[] }[] = [
  { key: "Villa", patterns: ["villa", "فيلا"] },
  { key: "Apartment", patterns: ["apartment", "flat", "شقة"] },
  { key: "Office", patterns: ["office", "مكتب"] },
];

function extractFromList(message: string, list: { key: string; patterns: string[] }[]): string | undefined {
  const normalized = message.toLowerCase();
  return list.find((entry) => entry.patterns.some((p) => normalized.includes(p)))?.key;
}

const QUESTION_ORDER = [
  "customerType",
  "emirate",
  "propertyType",
  "problem",
  "visitType",
  "preferredTime",
  "contact",
] as const;

type QuestionKey = (typeof QUESTION_ORDER)[number];

export type ConversationState = {
  intent: Intent | null;
  serviceMatch: ServiceMatch | null;
  answers: Partial<Record<QuestionKey, string>>;
  pendingQuestion: QuestionKey | null;
  failedAttempts: number;
  escalated: boolean;
  awaitingIntentClarification: boolean;
  complete: boolean;
  /** Public URLs of files/photos the customer uploaded via the chat
   *  widget (src/app/api/chat/upload/route.ts) — passed through as
   *  `evidence` on submission (src/lib/chat/tools.ts), the same field
   *  quote requests already support. The bot never inspects file
   *  contents; these exist purely for the human team to review. */
  attachments: string[];
  /** Google Maps link built from a customer-shared geolocation
   *  (src/app/api/chat/location/route.ts), if any. */
  locationLink: string | null;
  /** Raw turn history for the LLM path (src/lib/chat/llm-adapter.ts) —
   *  unused by the rule-based flow below, kept on the same session object
   *  so attachments/location/history all move together regardless of
   *  which path handled a given turn. */
  messageHistory: { role: "user" | "assistant"; content: string }[];
};

export function createInitialState(): ConversationState {
  return {
    intent: null,
    serviceMatch: null,
    answers: {},
    pendingQuestion: null,
    failedAttempts: 0,
    escalated: false,
    awaitingIntentClarification: false,
    complete: false,
    attachments: [],
    locationLink: null,
    messageHistory: [],
  };
}

function nextUnansweredQuestion(state: ConversationState): QuestionKey | null {
  return QUESTION_ORDER.find((key) => !state.answers[key]) ?? null;
}

function prefillFromMessage(state: ConversationState, message: string): void {
  const emirate = extractFromList(message, EMIRATES);
  if (emirate) state.answers.emirate = emirate;
  const propertyType = extractFromList(message, PROPERTY_TYPES);
  if (propertyType) state.answers.propertyType = propertyType;
}

export type StepResult = {
  state: ConversationState;
  replies: Bilingual[];
  /** Tappable quick-reply choices for `state.pendingQuestion`, when that
   *  question has a fixed answer set (QUESTION_OPTIONS) — undefined for
   *  open-text questions or when no question is pending. */
  options?: Bilingual[];
};

/** Every return point funnels through here so `options` is derived from
 *  `state.pendingQuestion` in exactly one place, instead of every call
 *  site having to remember to attach it. */
function respond(state: ConversationState, replies: Bilingual[]): StepResult {
  const options = state.pendingQuestion ? QUESTION_OPTIONS[state.pendingQuestion] : undefined;
  return options ? { state, replies, options } : { state, replies };
}

/**
 * Advances the conversation by exactly one customer message. Pure
 * function — no I/O, no network, safe to unit test directly.
 */
export function handleMessage(state: ConversationState, message: string): StepResult {
  const next: ConversationState = {
    ...state,
    answers: { ...state.answers },
  };

  if (
    /(real person|are you (a |an )?(human|robot|bot|ai)\b|is (this|it) (a |an )?(bot|robot|ai)\b)/i.test(message) ||
    /(انسان|إنسان|بشري|روبوت|ذكاء اصطناعي)/.test(message)
  ) {
    return respond(next, [buildAiIdentityResponse()]);
  }

  // First message — establish intent.
  if (!next.intent) {
    if (hasMultipleServiceIntents(message)) {
      next.awaitingIntentClarification = true;
      return respond(next, [CLARIFY_MULTIPLE_INTENTS]);
    }

    const primary = detectPrimaryIntent(message);

    if (primary === "UNKNOWN") {
      next.failedAttempts += 1;
      if (next.failedAttempts >= 2) {
        next.escalated = true;
        return respond(next, [CLARIFY_UNKNOWN_INTENT, buildEscalationResponse()]);
      }
      return respond(next, [CLARIFY_UNKNOWN_INTENT]);
    }

    next.intent = primary;

    if (primary === "EMERGENCY") {
      next.complete = true;
      return respond(next, [buildEmergencyResponse()]);
    }

    if (primary === "PRICE_INQUIRY") {
      return respond(next, [buildPriceResponse()]);
    }

    // MAINTENANCE / CLEANING / PEST_CONTROL / BOOKING_REQUEST
    const match = matchService(message);
    next.serviceMatch = match;
    prefillFromMessage(next, message);

    const replies: Bilingual[] = [];
    if (match) {
      replies.push(buildServiceRecommendation(match.label, match.subTopic));
    } else {
      replies.push(buildUnmatchedServiceResponse());
    }

    const question = nextUnansweredQuestion(next);
    next.pendingQuestion = question;
    if (question) replies.push(questionPrompt(question));
    else next.complete = true;

    return respond(next, replies);
  }

  // Follow-up message — was PRICE_INQUIRY the last thing handled, with no
  // service intent established yet? Try to pick up a service intent now.
  if ((next.intent === "PRICE_INQUIRY" || next.intent === "EMERGENCY") && !next.serviceMatch) {
    const match = matchService(message);
    if (match) {
      next.serviceMatch = match;
      next.intent = detectPrimaryIntent(message) === "UNKNOWN" ? next.intent : detectPrimaryIntent(message);
      prefillFromMessage(next, message);
      const question = nextUnansweredQuestion(next);
      next.pendingQuestion = question;
      const replies = [buildServiceRecommendation(match.label, match.subTopic)];
      if (question) replies.push(questionPrompt(question));
      return respond(next, replies);
    }
  }

  // Otherwise, this message answers the currently pending question.
  if (next.pendingQuestion) {
    next.answers[next.pendingQuestion] = message.trim();
    next.pendingQuestion = null;
  }

  const question = nextUnansweredQuestion(next);
  next.pendingQuestion = question;

  if (question) {
    return respond(next, [questionPrompt(question)]);
  }

  next.complete = true;
  const summary = buildSummary({
    serviceLabel: next.serviceMatch?.label ?? "Unspecified",
    emirate: next.answers.emirate,
    propertyType: next.answers.propertyType,
    problem: next.answers.problem,
    preferredTime: next.answers.preferredTime,
    contactName: next.answers.contact,
  });
  return respond(next, [summary]);
}

export function conversionStep(preferred: "whatsapp" | "phone" | "record"): Bilingual {
  return buildConversionRoute(preferred);
}

export { WELCOME };
