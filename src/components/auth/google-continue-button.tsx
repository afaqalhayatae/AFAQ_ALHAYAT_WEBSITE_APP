import type { Locale } from "@/i18n/config";
import type { getMessages } from "@/i18n/get-messages";
import { GoogleIcon } from "@/components/icons";
import { trackEvent } from "@/lib/analytics/track-event";

type Messages = ReturnType<typeof getMessages>;

/**
 * Google Login upgrade — the primary, first-shown sign-in/sign-up action
 * on both the login and register pages. A plain link (not a form/fetch)
 * because /api/auth/google's whole job is a top-level redirect to Google's
 * consent screen — see that route for why. Existing phone/email/password
 * flow stays fully intact below this button; nothing here removes it.
 */
export function GoogleContinueButton({ locale, t }: { locale: Locale; t: Messages }) {
  return (
    <a
      href={`/api/auth/google?locale=${locale}`}
      onClick={() => trackEvent("login", { method: "google" })}
      className="flex h-12 items-center justify-center gap-space-2 rounded-xl border border-(--color-border) bg-(--color-surface) px-space-3 text-small font-semibold text-(--color-text-primary) transition-opacity hover:opacity-90"
    >
      <GoogleIcon className="h-5 w-5" />
      {t.auth.google.continue}
    </a>
  );
}

export function AuthDivider({ t }: { t: Messages }) {
  return (
    <div className="flex items-center gap-space-2" role="separator">
      <span className="h-px flex-1 bg-(--color-border)" />
      <span className="text-small text-(--color-text-muted)">{t.auth.google.divider}</span>
      <span className="h-px flex-1 bg-(--color-border)" />
    </div>
  );
}
