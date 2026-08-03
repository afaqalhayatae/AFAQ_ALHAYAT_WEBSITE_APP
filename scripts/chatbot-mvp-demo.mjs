#!/usr/bin/env node
/**
 * Interactive manual-testing CLI for the chatbot MVP.
 *
 * This is a standalone plain-JS mirror of the rules in
 * src/lib/chat-mvp/{intents,service-matcher,responses,qualification-flow}.ts
 * — it exists only because Node's ESM loader requires explicit file
 * extensions on relative TypeScript imports (verified: `.js`-extension
 * specifiers do NOT resolve to a sibling `.ts` file under Node's native
 * type-stripping, and adding real `.ts` extensions to the source files
 * risks breaking `tsconfig.json`'s `moduleResolution: "bundler"` setup
 * used by the rest of this codebase). The TS modules are the source of
 * truth and are what `npm test -- chatbot-mvp` actually exercises; this
 * script is a convenience for typing messages and watching replies
 * without spinning up the whole Next.js app.
 *
 * Run: node scripts/chatbot-mvp-demo.mjs
 * Exit: Ctrl+C, or type "exit"
 */
import readline from "node:readline";

const PHONE_E164 = "+971585431766";
const WHATSAPP_URL = "https://wa.me/message/JMZVJDFDQL3VD1";

const EMERGENCY_KEYWORDS = [
  "emergency", "urgent", "flooding", "flood", "burst", "sparking", "fire", "gas smell",
  "طوارئ", "عاجل", "غرق", "انفجار", "شرارة", "حريق", "رايحة غاز",
];
const PRICE_KEYWORDS = ["how much", "cost", "price", "cheap", "expensive", "quote", "كام", "السعر", "سعر", "تكلفة", "بكام", "عرض سعر"];
const MAINTENANCE_KEYWORDS = ["ac ", " ac", "air condition", "cooling", "repair", "plumb", "electric", "leak", "paint", "handyman", "drain", "تكييف", "صيانة", "سباك", "كهرب", "تسريب", "دهان", "صحي", "مصرف"];
const CLEANING_KEYWORDS = ["clean", "housekeeping", "maid", "تنظيف", "نظافة", "عاملة"];
const PEST_KEYWORDS = ["pest", "cockroach", "roach", "ant", "bed bug", "bedbug", "termite", "rodent", "mice", "mouse", "rat", "حشرات", "صرصور", "نمل", "بق", "أرضة", "فئران", "قوارض"];

function includesAny(text, list) {
  return list.some((k) => text.includes(k));
}

function detectIntent(message) {
  const m = message.toLowerCase();
  if (includesAny(m, EMERGENCY_KEYWORDS)) return "EMERGENCY";
  if (includesAny(m, PRICE_KEYWORDS)) return "PRICE_INQUIRY";
  if (includesAny(m, MAINTENANCE_KEYWORDS)) return "MAINTENANCE";
  if (includesAny(m, CLEANING_KEYWORDS)) return "CLEANING";
  if (includesAny(m, PEST_KEYWORDS)) return "PEST_CONTROL";
  return "UNKNOWN";
}

const RESPONSES = {
  welcome: "🤖 [AR] أهلًا بك، أنا المساعد الذكي لآفاق الحياة. كيف أقدر أساعدك اليوم؟\n🤖 [EN] Hello, I'm AFAQ Alhayat's AI assistant. How can I help you today?\n(This is a rule-based MVP demo — full logic + tests live in src/lib/chat-mvp/*.ts)\n",
  unknown: "🤖 [AR] تقدر تقولي أكتر عن اللي محتاجه؟\n🤖 [EN] Could you tell me more — maintenance, cleaning, or a pest problem?",
  price: `🤖 [AR] سعر الخدمة بيعتمد على تفاصيل الطلب، ومفيش قايمة أسعار ثابتة معلنة حاليًا. أقدر أسجل طلبك وتوصلك عرض سعر دقيق.\n🤖 [EN] Pricing depends on the job — no published price list right now. I can record your request for an accurate quote.`,
  emergency: `🤖 [AR] دي حالة عاجلة — اتصل بينا دلوقتي على ${PHONE_E164} أو واتساب: ${WHATSAPP_URL}\n🤖 [EN] This sounds urgent — call us now at ${PHONE_E164} or WhatsApp: ${WHATSAPP_URL}`,
};

function respondTo(intent) {
  switch (intent) {
    case "PRICE_INQUIRY":
      return RESPONSES.price;
    case "EMERGENCY":
      return RESPONSES.emergency;
    case "MAINTENANCE":
      return "🤖 [AR] يبدو إنك محتاج خدمة صيانة. في أي إمارة؟\n🤖 [EN] Sounds like a maintenance need. Which emirate are you in?";
    case "CLEANING":
      return "🤖 [AR] يبدو إنك محتاج خدمة تنظيف. في أي إمارة؟\n🤖 [EN] Sounds like a cleaning need. Which emirate are you in?";
    case "PEST_CONTROL":
      return "🤖 [AR] يبدو إن الموضوع مكافحة حشرات. في أي إمارة؟\n🤖 [EN] Sounds like a pest-control need. Which emirate are you in?";
    default:
      return RESPONSES.unknown;
  }
}

console.log(RESPONSES.welcome);
console.log("Type a message and press Enter (try: 'I need AC repair', 'I have cockroaches', 'how much does it cost?'). Type 'exit' to quit.\n");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: "You: " });
rl.prompt();

rl.on("line", (line) => {
  const message = line.trim();
  if (message.toLowerCase() === "exit") {
    rl.close();
    return;
  }
  const intent = detectIntent(message);
  console.log(`\n[intent: ${intent}]`);
  console.log(respondTo(intent) + "\n");
  rl.prompt();
});

rl.on("close", () => {
  console.log("\nSession ended.");
  process.exit(0);
});
