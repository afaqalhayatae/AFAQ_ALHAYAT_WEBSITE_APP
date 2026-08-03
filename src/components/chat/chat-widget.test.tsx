/**
 * Full customer-journey test, requested explicitly:
 * Visitor opens website → chatbot opens → customer asks for a service →
 * bot qualifies the request → request reaches the API → no regression.
 * Complements route.test.ts (API-level) and chatbot-mvp.test.ts
 * (rules-engine-level) with the actual widget UI a visitor interacts with.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ChatWidget } from "./chat-widget";

function mockChatResponse(replies: { ar: string; en: string }[], complete = false) {
  return {
    ok: true,
    json: async () => ({
      apiVersion: "v1",
      correlationId: "test",
      data: { replies, complete, escalated: false, submission: { recorded: false } },
    }),
  };
}

describe("ChatWidget — full customer journey", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("visitor opens the widget, sees the welcome message, and the bubble is closed by default", () => {
    render(<ChatWidget locale="en" />);

    // Closed by default — matches a real first-time site visitor, not an
    // intrusive auto-opened popup.
    expect(screen.queryByText(/AI Assistant/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /open ai assistant/i }));

    expect(screen.getByText("Hello, I'm AFAQ Alhayat's AI assistant. How can I help you today?")).toBeInTheDocument();
  });

  it("customer asks for a service, the request reaches /api/chat, and the bot's qualifying reply renders", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(
      mockChatResponse([
        { ar: "يبدو إنك محتاج خدمة صيانة تكييف.", en: "Sounds like you need AC maintenance." },
        { ar: "في أي إمارة؟", en: "Which emirate?" },
      ])
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<ChatWidget locale="en" />);
    fireEvent.click(screen.getByRole("button", { name: /open ai assistant/i }));

    const input = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(input, { target: { value: "I need AC repair" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    // Request reaches the API — real endpoint, real payload shape.
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/chat");
    const sentBody = JSON.parse(options.body);
    expect(sentBody.message).toBe("I need AC repair");
    expect(sentBody.sessionId).toBeTruthy();

    // Bot qualifies the request — its reply renders back to the visitor.
    await waitFor(() => expect(screen.getByText("Which emirate?")).toBeInTheDocument());
    expect(screen.getByText("Sounds like you need AC maintenance.")).toBeInTheDocument();

    // The visitor's own message is also shown, so the conversation reads
    // as a real back-and-forth, not just bot output.
    expect(screen.getByText("I need AC repair")).toBeInTheDocument();
  });

  it("once qualification completes, conversion CTAs (call/WhatsApp) appear — no regression in the conversion path", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(
      mockChatResponse([{ ar: "تم تسجيل طلبك.", en: "Your request has been recorded." }], true)
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<ChatWidget locale="en" />);
    fireEvent.click(screen.getByRole("button", { name: /open ai assistant/i }));
    fireEvent.change(screen.getByPlaceholderText("Type a message..."), {
      target: { value: "Ahmed, 0501234567" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => expect(screen.getByText(/Call us:/)).toBeInTheDocument());
    expect(screen.getByText(/Message us on WhatsApp/)).toBeInTheDocument();
  });

  it("a network failure shows a graceful error instead of crashing the widget", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValueOnce(new Error("network down"))
    );

    render(<ChatWidget locale="en" />);
    fireEvent.click(screen.getByRole("button", { name: /open ai assistant/i }));
    fireEvent.change(screen.getByPlaceholderText("Type a message..."), { target: { value: "hello" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() =>
      expect(screen.getByText("Couldn't reach the assistant right now.")).toBeInTheDocument()
    );
  });
});

describe("ChatWidget — Phase 2 UX upgrades", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows the 4 service-selection shortcuts at the empty/welcome state, each sends a real message that reaches /api/chat", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(
      mockChatResponse([{ ar: "في أي إمارة؟", en: "Which emirate?" }])
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<ChatWidget locale="en" />);
    fireEvent.click(screen.getByRole("button", { name: /open ai assistant/i }));

    expect(screen.getByRole("button", { name: "Maintenance" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cleaning" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pest Control" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Emergency" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Maintenance" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const sentBody = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sentBody.message).toBe("I need a maintenance service");
    await waitFor(() => expect(screen.getByText("Which emirate?")).toBeInTheDocument());
  });

  it("shortcuts disappear once the conversation has moved past the welcome message", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(mockChatResponse([{ ar: "تمام", en: "Got it" }]));
    vi.stubGlobal("fetch", fetchMock);

    render(<ChatWidget locale="en" />);
    fireEvent.click(screen.getByRole("button", { name: /open ai assistant/i }));
    fireEvent.click(screen.getByRole("button", { name: "Cleaning" }));

    await waitFor(() => expect(screen.getByText("Got it")).toBeInTheDocument());
    expect(screen.queryByRole("button", { name: "Maintenance" })).not.toBeInTheDocument();
  });

  it("shows a typing indicator while waiting for the response, and it clears once the reply arrives", async () => {
    let resolveFetch: (value: unknown) => void = () => {};
    const pending = new Promise((resolve) => {
      resolveFetch = resolve;
    });
    vi.stubGlobal("fetch", vi.fn().mockReturnValueOnce(pending));

    render(<ChatWidget locale="en" />);
    fireEvent.click(screen.getByRole("button", { name: /open ai assistant/i }));
    fireEvent.change(screen.getByPlaceholderText("Type a message..."), { target: { value: "I need AC repair" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(await screen.findByLabelText("Assistant is typing")).toBeInTheDocument();

    resolveFetch(mockChatResponse([{ ar: "تمام", en: "Got it" }]));
    await waitFor(() => expect(screen.getByText("Got it")).toBeInTheDocument());
    expect(screen.queryByLabelText("Assistant is typing")).not.toBeInTheDocument();
  });

  it("restart clears the conversation, shows the welcome message again, and starts a new session", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(mockChatResponse([{ ar: "تمام", en: "Got it" }]));
    vi.stubGlobal("fetch", fetchMock);

    render(<ChatWidget locale="en" />);
    fireEvent.click(screen.getByRole("button", { name: /open ai assistant/i }));
    fireEvent.change(screen.getByPlaceholderText("Type a message..."), { target: { value: "I need AC repair" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    await waitFor(() => expect(screen.getByText("Got it")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: "Restart conversation" }));

    expect(screen.queryByText("Got it")).not.toBeInTheDocument();
    expect(screen.queryByText("I need AC repair")).not.toBeInTheDocument();
    expect(screen.getByText("Hello, I'm AFAQ Alhayat's AI assistant. How can I help you today?")).toBeInTheDocument();

    // A restart must start a genuinely new session, not resend the old one.
    const fetchMock2 = vi.fn().mockResolvedValueOnce(mockChatResponse([{ ar: "تمام", en: "Got it again" }]));
    vi.stubGlobal("fetch", fetchMock2);
    fireEvent.change(screen.getByPlaceholderText("Type a message..."), { target: { value: "second message" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    await waitFor(() => expect(fetchMock2).toHaveBeenCalledTimes(1));
    const firstSessionId = JSON.parse(fetchMock.mock.calls[0][1].body).sessionId;
    const secondSessionId = JSON.parse(fetchMock2.mock.calls[0][1].body).sessionId;
    expect(secondSessionId).not.toBe(firstSessionId);
  });

  it("renders RTL for Arabic and keeps the Arabic welcome/shortcut/CTA text intact", () => {
    render(<ChatWidget locale="ar" />);
    fireEvent.click(screen.getByRole("button", { name: /افتح المساعد الذكي/ }));

    const panel = screen.getByText("أهلًا بك، أنا المساعد الذكي لآفاق الحياة. كيف أقدر أساعدك اليوم؟").closest("div[dir]");
    expect(panel).toHaveAttribute("dir", "rtl");
    expect(screen.getByRole("button", { name: "صيانة" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "مكافحة حشرات" })).toBeInTheDocument();
  });
});
