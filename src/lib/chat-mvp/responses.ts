/**
 * Bilingual canned response templates for the chatbot MVP.
 * Implements 08_DIGITAL_SYSTEMS/AI_CHATBOT/04_CHATBOT_SYSTEM_PROMPT.md's
 * "MVP Voice Notes" verbatim.
 *
 * Structural safety guarantee: buildPriceResponse() takes no numeric
 * parameter anywhere in its signature or body — there is no code path
 * in this file that can interpolate a currency figure into a response.
 * This mirrors the same guarantee /api/quotes already has (no price
 * field exists on QuoteRequest) — see 05_TEST_SCENARIOS.md test 4.
 */

import { PHONE_E164, WHATSAPP_URL } from "../brand/links";

export type Bilingual = { ar: string; en: string };

export const WELCOME: Bilingual = {
  ar: "أهلًا بك، أنا المساعد الذكي لآفاق الحياة. كيف أقدر أساعدك اليوم؟",
  en: "Hello, I'm AFAQ Alhayat's AI assistant. How can I help you today?",
};

export const CLARIFY_UNKNOWN_INTENT: Bilingual = {
  ar: "تقدر تقولي أكتر عن اللي محتاجه — مشكلة صيانة، تنظيف، ولا حشرات؟",
  en: "Could you tell me a bit more about what you need — is it a maintenance issue, cleaning, or a pest problem?",
};

export const CLARIFY_MULTIPLE_INTENTS: Bilingual = {
  ar: "شكلك محتاج أكتر من خدمة — نبدأ بإيه الأول؟",
  en: "Looks like you might need more than one service — which should we start with?",
}

export function buildPriceResponse(): Bilingual {
  return {
    ar: "سعر الخدمة بيعتمد على تفاصيل الطلب، ومفيش قايمة أسعار ثابتة معلنة حاليًا. أقدر أسجل طلبك وتوصلك عرض سعر دقيق.",
    en: "Pricing depends on the specific job, and there's no published price list right now. I can record your request so you get an accurate quote.",
  };
}

export function buildEmergencyResponse(): Bilingual {
  return {
    ar: `دي حالة عاجلة — أفضل حاجة تتصل بينا دلوقتي على ${PHONE_E164} أو من هنا على واتساب: ${WHATSAPP_URL}. تقدر تقولي كمان إيه اللي حصل والإمارة ونوع العقار؟`,
    en: `This sounds urgent — the fastest way is to call us now at ${PHONE_E164} or message us on WhatsApp: ${WHATSAPP_URL}. Can you also tell me what's happening and which emirate/property type?`,
  };
}

export function buildEscalationResponse(): Bilingual {
  return {
    ar: `المعلومة دي محتاجة تأكيد من صاحب النشاط. تقدر تكلمنا على ${PHONE_E164} أو أسجل التفاصيل وهو يراجعها.`,
    en: `That needs confirmation from the business owner. You can call us at ${PHONE_E164}, or I can record the details for review.`,
  };
}

export function buildAiIdentityResponse(): Bilingual {
  return {
    ar: "أيوه، أنا مساعد ذكي (AI) بخدم آفاق الحياة، مش موظف بشري.",
    en: "Yes, I'm an AI assistant working on behalf of AFAQ Alhayat — not a human.",
  };
}

export function buildServiceRecommendation(label: string, subTopic?: string): Bilingual {
  const service = subTopic ? `${label} (${subTopic})` : label;
  return {
    ar: `يبدو إن الخدمة المناسبة هي: ${service}.`,
    en: `It sounds like the right service is: ${service}.`,
  };
}

export function buildUnmatchedServiceResponse(): Bilingual {
  return {
    ar: "مش متأكد بالظبط الخدمة المطلوبة إيه — تقدر توصفها بطريقة تانية؟",
    en: "I'm not certain exactly which service fits — could you describe it a bit differently?",
  };
}

const QUESTION_PROMPTS: Record<string, Bilingual> = {
  customerType: {
    ar: "الطلب ده لشخصك ولا لشركة؟",
    en: "Is this request for yourself, or for a company?",
  },
  emirate: {
    ar: "في أي إمارة؟",
    en: "Which emirate is this in?",
  },
  propertyType: {
    ar: "نوع العقار؟ فيلا، شقة، مكتب، ولا حاجة تانية؟",
    en: "What type of property — villa, apartment, office, or other?",
  },
  problem: {
    ar: "احكيلي أكتر عن المشكلة اللي بتواجهها.",
    en: "Tell me more about the problem you're facing.",
  },
  visitType: {
    ar: "محتاج زيارة واحدة، ولا مهتم بعقد دوري؟",
    en: "Would you like a single visit, or are you interested in a recurring/contract arrangement?",
  },
  preferredTime: {
    ar: "إيه الوقت المفضل للزيارة؟",
    en: "What's your preferred appointment time?",
  },
  contact: {
    ar: "أقدر آخد اسمك ورقم موبايلك، وموافق نتواصل معاك بخصوص الطلب ده؟",
    en: "Could I get your name and phone number — and do you agree we can contact you about this request?",
  },
};

export function questionPrompt(key: keyof typeof QUESTION_PROMPTS): Bilingual {
  return QUESTION_PROMPTS[key];
}

export function buildSummary(state: {
  serviceLabel: string;
  emirate?: string;
  propertyType?: string;
  problem?: string;
  preferredTime?: string;
  contactName?: string;
}): Bilingual {
  const partsEn = [
    `Service: ${state.serviceLabel}`,
    state.emirate ? `Emirate: ${state.emirate}` : null,
    state.propertyType ? `Property: ${state.propertyType}` : null,
    state.problem ? `Problem: ${state.problem}` : null,
    state.preferredTime ? `Preferred time: ${state.preferredTime}` : null,
    state.contactName ? `Contact: ${state.contactName}` : null,
  ].filter(Boolean);
  return {
    ar: `للتأكيد: ${partsEn.join(" — ")}. صح كده؟`,
    en: `To confirm: ${partsEn.join(" — ")}. Is that right?`,
  };
}

export function buildConversionRoute(preferred: "whatsapp" | "phone" | "record"): Bilingual {
  if (preferred === "whatsapp") {
    return {
      ar: `تمام، كلمنا على واتساب: ${WHATSAPP_URL}`,
      en: `Great — message us on WhatsApp: ${WHATSAPP_URL}`,
    };
  }
  if (preferred === "phone") {
    return {
      ar: `تمام، اتصل بينا على ${PHONE_E164}`,
      en: `Great — call us at ${PHONE_E164}`,
    };
  }
  return {
    ar: "تمام، سجلت طلبك — هيتم مراجعته والتواصل معاك.",
    en: "Done — your request has been recorded and will be reviewed and followed up on.",
  };
}
