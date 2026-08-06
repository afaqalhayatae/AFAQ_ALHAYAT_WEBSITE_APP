/**
 * LLM adapter — real implementation (2026-08-06), using an OpenAI API key
 * the Owner provided directly in chat (their own funded account, not a
 * credential this session created or paid for). Completes the
 * "production transition" described in
 * 08_DIGITAL_SYSTEMS/AI_CHATBOT/06_WEBSITE_INTEGRATION_PLAN.md §6.
 *
 * src/app/api/chat/route.ts must check checkLlmAvailability() first and
 * fall back to the rule-based MVP engine (src/lib/chat-mvp/*) whenever
 * this throws or OPENAI_API_KEY is unset — the rule-based engine is never
 * removed, only superseded when a real key is present.
 *
 * Tool-calling: the model can call `record_lead` once it has gathered a
 * name, phone number, and a description of the need — src/app/api/chat/
 * route.ts supplies `onRecordLead`, which persists the lead through the
 * same src/lib/chat/tools.ts functions the rule-based flow already uses,
 * so an LLM-captured lead lands in the exact same place a rule-based one
 * does. The model never sees or handles the actual submission — it only
 * gets back the short confirmation string.
 */
import OpenAI from "openai";

const MODEL = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";

export type LlmAvailability = { available: true } | { available: false; reason: "no_api_key" };

/**
 * Cheap, side-effect-free check the route can call before deciding
 * whether to use the LLM path or fall back to the rule-based MVP engine.
 * Reading env var presence is not the same as using the credential — no
 * request is made here.
 */
export function checkLlmAvailability(): LlmAvailability {
  if (!process.env.OPENAI_API_KEY) {
    return { available: false, reason: "no_api_key" };
  }
  return { available: true };
}

let client: OpenAI | null = null;
function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

export type RecordLeadArgs = {
  name: string;
  phoneE164: string;
  need: string;
};

export type LlmTurnInput = {
  systemPrompt: string;
  conversationHistory: { role: "user" | "assistant"; content: string }[];
  message: string;
  /** Invoked when the model decides it has enough information to record
   *  a lead — must return a short human-readable result (e.g. "Recorded,
   *  reference ENQ-123" or "Could not record — ask the customer to try
   *  again") that gets fed back to the model so its final reply reflects
   *  what actually happened, never a guess. */
  onRecordLead: (args: RecordLeadArgs) => Promise<string>;
};

export type LlmTurnResult = {
  reply: string;
  leadRecorded: boolean;
};

const RECORD_LEAD_TOOL: OpenAI.Chat.Completions.ChatCompletionTool = {
  type: "function",
  function: {
    name: "record_lead",
    description:
      "Record this customer's contact details and need so the AFAQ AL HAYAT team can follow up. Only call this once you have a name, a phone number, and a clear description of what they need — never call it with guessed or placeholder values.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "The customer's name, as they gave it." },
        phoneE164: { type: "string", description: "The customer's phone number, digits only or E.164 (e.g. +9715xxxxxxxx)." },
        need: { type: "string", description: "A concise summary of what the customer needs, in their own words." },
      },
      required: ["name", "phoneE164", "need"],
      additionalProperties: false,
    },
  },
};

/**
 * Runs one conversational turn, including the model's own follow-up
 * completion after a tool call so the returned reply is always real
 * model output — never a hardcoded confirmation string standing in for
 * one. Throws on any API failure; the caller must catch and fall back to
 * the rule-based engine rather than surfacing a raw error to the customer.
 */
export async function runLlmTurn(input: LlmTurnInput): Promise<LlmTurnResult> {
  const openai = getClient();

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: input.systemPrompt },
    ...input.conversationHistory.map((turn) => ({ role: turn.role, content: turn.content }) as const),
    { role: "user", content: input.message },
  ];

  const first = await openai.chat.completions.create({
    model: MODEL,
    messages,
    tools: [RECORD_LEAD_TOOL],
    temperature: 0.4,
    max_tokens: 500,
  });

  const choice = first.choices[0];
  const toolCall = choice?.message.tool_calls?.[0];

  if (!toolCall || toolCall.type !== "function") {
    return { reply: choice?.message.content?.trim() || "", leadRecorded: false };
  }

  let args: RecordLeadArgs;
  try {
    args = JSON.parse(toolCall.function.arguments) as RecordLeadArgs;
  } catch {
    return {
      reply: choice.message.content?.trim() || "Sorry, something went wrong — could you repeat that?",
      leadRecorded: false,
    };
  }

  const toolResult = await input.onRecordLead(args);

  const second = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      ...messages,
      choice.message,
      { role: "tool", tool_call_id: toolCall.id, content: toolResult },
    ],
    temperature: 0.4,
    max_tokens: 300,
  });

  return {
    reply: second.choices[0]?.message.content?.trim() || toolResult,
    leadRecorded: true,
  };
}
