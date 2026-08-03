"use client";

/**
 * `next/dynamic` with `ssr:false` is not allowed directly inside a
 * Server Component in the App Router (verified via a real build failure
 * — Next.js 16 rejected it in src/app/[locale]/layout.tsx directly).
 * This one-line client wrapper is the fix: layout.tsx (a Server
 * Component) renders this plain client component normally, and the
 * lazy/no-SSR import happens inside it, which Next.js allows.
 */
import dynamic from "next/dynamic";
import type { Locale } from "@/i18n/config";

const ChatWidget = dynamic(() => import("./chat-widget").then((mod) => mod.ChatWidget), {
  ssr: false,
});

export function ChatWidgetLoader({ locale }: { locale: Locale }) {
  return <ChatWidget locale={locale} />;
}
