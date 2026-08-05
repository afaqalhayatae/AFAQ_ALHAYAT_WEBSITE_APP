"use client";

/**
 * Chat widget — Phase 2 UX/visual upgrade over the Phase 1 MVP mount.
 * Same backend contract as before (POST /api/chat, same request/response
 * shape) — this pass is UI-only, per the Phase 2 brief's "do not change
 * backend logic unless required." The one required exception is noted
 * inline below (src/lib/chat-mvp/intents.ts "maintenance" keyword).
 *
 * Message/input rendering stays inline in this one file, same reasoning
 * as the original mount note: still small enough that splitting further
 * added no real value.
 */
import { useRef, useState } from "react";
import { Bot, MessageCircle, RotateCcw, Send, X } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { PHONE_E164, WHATSAPP_URL } from "@/lib/brand/links";

type Bilingual = { ar: string; en: string };

type ChatApiResponse = {
  data: {
    replies: Bilingual[];
    complete: boolean;
    escalated: boolean;
    submission: { recorded: boolean; reference?: string };
  };
};

type DisplayMessage = { author: "user" | "bot"; text: string };

function pickText(bilingual: Bilingual, locale: Locale): string {
  return locale === "ar" ? bilingual.ar : bilingual.en;
}

const WELCOME: Bilingual = {
  ar: "أهلًا بك، أنا المساعد الذكي لآفاق الحياة. كيف أقدر أساعدك اليوم؟",
  en: "Hello, I'm AFAQ Alhayat's AI assistant. How can I help you today?",
};

/**
 * Service-selection shortcuts (Phase 2 task 1). Each sends a real message
 * through the exact same /api/chat path as free typing — no special-cased
 * backend behavior for shortcut clicks, so there's nothing new to secure
 * or test beyond the message text itself matching an existing intent
 * keyword (src/lib/chat-mvp/intents.ts).
 */
const SHORTCUTS: { label: Bilingual; message: Bilingual }[] = [
  {
    label: { ar: "صيانة", en: "Maintenance" },
    message: { ar: "محتاج خدمة صيانة", en: "I need a maintenance service" },
  },
  {
    label: { ar: "تنظيف", en: "Cleaning" },
    message: { ar: "محتاج خدمة تنظيف", en: "I need a cleaning service" },
  },
  {
    label: { ar: "مكافحة حشرات", en: "Pest Control" },
    message: { ar: "عندي مشكلة حشرات", en: "I have a pest control issue" },
  },
  {
    label: { ar: "حالة طارئة", en: "Emergency" },
    message: { ar: "حالة طارئة، محتاج مساعدة فورية", en: "I need urgent service" },
  },
];

function TypingIndicator() {
  return (
    <div
      className="me-auto flex max-w-[75%] items-center gap-1 rounded-2xl bg-(--color-surface-secondary) px-space-2 py-space-2"
      aria-label="Assistant is typing"
    >
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-(--color-text-muted) [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-(--color-text-muted) [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-(--color-text-muted)" />
    </div>
  );
}

export function ChatWidget({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [complete, setComplete] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const dir = locale === "ar" ? "rtl" : "ltr";

  function scrollToBottom() {
    requestAnimationFrame(() => {
      const node = scrollRef.current;
      if (!node) return;
      // Plain scrollTop assignment rather than scrollTo({behavior:"smooth"})
      // — broadly supported and, unlike scrollTo, doesn't throw in
      // environments (jsdom's test DOM, verified by a real failing test)
      // that implement Element without the smooth-scroll API.
      node.scrollTop = node.scrollHeight;
    });
  }

  function toggle() {
    setOpen((prev) => {
      const next = !prev;
      if (next && messages.length === 0) {
        setMessages([{ author: "bot", text: pickText(WELCOME, locale) }]);
      }
      return next;
    });
  }

  function restart() {
    setSessionId(crypto.randomUUID());
    setMessages([{ author: "bot", text: pickText(WELCOME, locale) }]);
    setInput("");
    setSending(false);
    setComplete(false);
  }

  async function sendText(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setInput("");
    setMessages((prev) => [...prev, { author: "user", text: trimmed }]);
    setSending(true);
    scrollToBottom();
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId, message: trimmed }),
      });
      const body = (await response.json()) as ChatApiResponse;
      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          { author: "bot", text: locale === "ar" ? "حصل خطأ، حاول تاني." : "Something went wrong — please try again." },
        ]);
        return;
      }
      const botReplies = body.data.replies.map((reply) => ({
        author: "bot" as const,
        text: pickText(reply, locale),
      }));
      setMessages((prev) => [...prev, ...botReplies]);
      if (body.data.complete) setComplete(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        { author: "bot", text: locale === "ar" ? "مش قادر أوصل للخدمة دلوقتي." : "Couldn't reach the assistant right now." },
      ]);
    } finally {
      setSending(false);
      scrollToBottom();
    }
  }

  const showShortcuts = messages.length <= 1 && !complete && !sending;

  return (
    <div className="fixed bottom-space-4 end-space-4 z-50" dir={dir}>
      {open ? (
        <div className="hero-fade-up flex h-[30rem] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-2xl shadow-black/20">
          {/* Header — premium identity block: avatar, name, visible AI/online status (never a fake "human typing" claim, per CONVERSATIONAL_ASSISTANT_STANDARD.md §9), restart + close controls. */}
          <div className="flex items-center justify-between gap-space-2 bg-(--color-primary) px-space-3 py-space-2 text-white">
            <div className="flex items-center gap-space-2">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15"
                aria-hidden="true"
              >
                <Bot className="h-5 w-5" />
              </span>
              <div className="leading-tight">
                <p className="text-small font-semibold">
                  {locale === "ar" ? "المساعد الذكي" : "AI Assistant"}
                </p>
                <p className="flex items-center gap-1 text-[11px] text-white/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-(--color-success)" aria-hidden="true" />
                  {locale === "ar" ? "آفاق الحياة — متصل (AI)" : "AFAQ AL HAYAT — Online (AI)"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-space-1">
              <button
                type="button"
                onClick={restart}
                aria-label={locale === "ar" ? "بدء محادثة جديدة" : "Restart conversation"}
                title={locale === "ar" ? "بدء محادثة جديدة" : "Restart conversation"}
                className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={toggle}
                aria-label={locale === "ar" ? "إغلاق" : "Close"}
                className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-space-2 overflow-y-auto p-space-3 text-small">
            {messages.length === 0 ? (
              <p className="pt-space-4 text-center text-(--color-text-muted)">
                {locale === "ar" ? "ابدأ المحادثة لطلب المساعدة." : "Start a conversation to get help."}
              </p>
            ) : null}
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.author === "user"
                    ? "ms-auto max-w-[85%] rounded-2xl bg-(--color-primary) px-space-2 py-space-2 text-white shadow-sm"
                    : "me-auto max-w-[85%] rounded-2xl bg-(--color-surface-secondary) px-space-2 py-space-2 text-(--color-text-primary) shadow-sm"
                }
              >
                {message.text}
              </div>
            ))}
            {sending ? <TypingIndicator /> : null}

            {showShortcuts ? (
              <div className="flex flex-wrap gap-space-1 pt-space-1">
                {SHORTCUTS.map((shortcut) => (
                  <button
                    key={shortcut.label.en}
                    type="button"
                    onClick={() => sendText(pickText(shortcut.message, locale))}
                    className="rounded-full border border-(--color-primary)/30 px-space-2 py-1 text-[13px] font-medium text-(--color-primary) transition-colors hover:bg-(--color-primary) hover:text-white"
                  >
                    {pickText(shortcut.label, locale)}
                  </button>
                ))}
              </div>
            ) : null}

            {complete ? (
              <div className="flex flex-col gap-space-1 border-t border-(--color-border) pt-space-2">
                <p className="text-center text-[13px] text-(--color-text-secondary)">
                  {locale === "ar" ? "تقدر كمان تتواصل معنا مباشرة:" : "You can also reach us directly:"}
                </p>
                <a
                  href={`tel:${PHONE_E164}`}
                  className="rounded-xl border border-(--color-primary) py-space-1 text-center text-small font-semibold text-(--color-primary) transition-colors hover:bg-(--color-primary) hover:text-white"
                >
                  {locale === "ar" ? `اتصل بنا: ${PHONE_E164}` : `Call us: ${PHONE_E164}`}
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-(--color-whatsapp) py-space-1 text-center text-small font-semibold text-white transition-opacity hover:opacity-90"
                >
                  {locale === "ar" ? "تواصل عبر واتساب" : "Message us on WhatsApp"}
                </a>
              </div>
            ) : null}
          </div>

          {/* Input */}
          <div className="flex gap-space-1 border-t border-(--color-border) p-space-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && sendText(input)}
              placeholder={locale === "ar" ? "اكتب رسالتك..." : "Type a message..."}
              className="flex-1 rounded-full border border-(--color-border) px-space-2 py-space-1 text-small outline-none transition-colors focus:border-(--color-primary)"
              disabled={sending}
              aria-label={locale === "ar" ? "اكتب رسالتك" : "Type a message"}
            />
            <button
              type="button"
              onClick={() => sendText(input)}
              disabled={sending || !input.trim()}
              aria-label={locale === "ar" ? "إرسال" : "Send"}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--color-primary) text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:pointer-events-none disabled:opacity-40"
            >
              <Send className="h-4 w-4 rtl:-scale-x-100" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={toggle}
          aria-label={locale === "ar" ? "افتح المساعد الذكي" : "Open AI assistant"}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-(--color-primary) text-white shadow-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary) focus-visible:ring-offset-2 active:scale-95"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
