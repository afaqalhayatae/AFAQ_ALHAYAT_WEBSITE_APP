"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import type { Locale } from "@/i18n/config";
import type { getMessages } from "@/i18n/get-messages";
import { isApiErrorBody } from "@/lib/validation/api-envelope";
import { CheckCircleIcon } from "@/components/icons";
import { trackEvent } from "@/lib/analytics/track-event";
import { AuthDivider, GoogleContinueButton } from "./google-continue-button";

type Messages = ReturnType<typeof getMessages>;
type Status = "idle" | "submitting" | "success" | "error";
type FieldErrors = {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Registration UI (Phase 1 scope — see 08_AUTHENTICATION_ARCHITECTURE.md).
 * Email and phone are both collected per the approved field set, but the
 * current identity API (`registerWithPassword`) models a single contact
 * channel per user, not two. This form submits email as the primary
 * sign-in channel; phone is validated and displayed but not yet sent to
 * the API — wiring a second, linked contact point is future work per
 * §12 of that plan, not invented here. The Terms checkbox is a
 * client-side gate only; it is not yet recorded as a `Consent` entity
 * (no backend/database change is made by this UI-only phase).
 */
export function RegisterForm({ locale, t }: { locale: Locale; t: Messages }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = t.auth.register;
  const disabled = status === "submitting";

  function validate(): boolean {
    const errors: FieldErrors = {};
    if (!name.trim()) errors.name = form.validation.name;
    if (!EMAIL_PATTERN.test(email.trim())) errors.email = form.validation.email;
    if (!phone.trim()) errors.phone = form.validation.phone;
    if (password.length < 8) errors.password = form.validation.password;
    if (confirmPassword !== password) errors.confirmPassword = form.validation.confirmPassword;
    if (!termsAccepted) errors.terms = form.validation.terms;
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          displayName: name.trim(),
          channel: "email",
          contactValue: email.trim(),
          password,
          actor: "website-visitor",
        }),
      });

      if (!response.ok) {
        const body: unknown = await response.json().catch(() => null);
        setErrorMessage(isApiErrorBody(body) ? body.error.message : form.errorGeneric);
        setStatus("error");
        return;
      }

      setStatus("success");
      trackEvent("sign_up", { method: "email" });
    } catch {
      setErrorMessage(form.errorGeneric);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex items-start gap-space-2 rounded-2xl border border-(--color-success) bg-(--color-surface) p-space-3"
      >
        <CheckCircleIcon className="h-6 w-6 shrink-0 text-(--color-success)" />
        <div>
          <p className="text-h6 font-semibold text-(--color-success)">{form.successTitle}</p>
          <p className="mt-space-1 text-small text-(--color-text-secondary)">{form.successBody}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-space-3">
      <GoogleContinueButton locale={locale} t={t} />
      <AuthDivider t={t} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-space-3">
      <div className="flex flex-col gap-space-1">
        <label htmlFor="register-name" className="text-small font-medium text-(--color-text-primary)">
          {form.nameLabel}
        </label>
        <input
          id="register-name"
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={form.namePlaceholder}
          disabled={disabled}
          className="h-12 rounded-xl border border-(--color-border) px-space-2 text-(--color-text-primary) focus:border-(--color-primary) focus:outline-none disabled:opacity-60"
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? "register-name-error" : undefined}
        />
        {fieldErrors.name ? (
          <p id="register-name-error" role="alert" className="text-small text-(--color-danger)">
            {fieldErrors.name}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-space-1">
        <label htmlFor="register-email" className="text-small font-medium text-(--color-text-primary)">
          {form.emailLabel}
        </label>
        <input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          dir="ltr"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={form.emailPlaceholder}
          disabled={disabled}
          className="h-12 rounded-xl border border-(--color-border) px-space-2 text-(--color-text-primary) focus:border-(--color-primary) focus:outline-none disabled:opacity-60"
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "register-email-error" : undefined}
        />
        {fieldErrors.email ? (
          <p id="register-email-error" role="alert" className="text-small text-(--color-danger)">
            {fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-space-1">
        <label htmlFor="register-phone" className="text-small font-medium text-(--color-text-primary)">
          {form.phoneLabel}
        </label>
        <input
          id="register-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          dir="ltr"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder={form.phonePlaceholder}
          disabled={disabled}
          className="h-12 rounded-xl border border-(--color-border) px-space-2 text-(--color-text-primary) focus:border-(--color-primary) focus:outline-none disabled:opacity-60"
          aria-invalid={Boolean(fieldErrors.phone)}
          aria-describedby={fieldErrors.phone ? "register-phone-error" : undefined}
        />
        {fieldErrors.phone ? (
          <p id="register-phone-error" role="alert" className="text-small text-(--color-danger)">
            {fieldErrors.phone}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-space-1">
        <label htmlFor="register-password" className="text-small font-medium text-(--color-text-primary)">
          {form.passwordLabel}
        </label>
        <input
          id="register-password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder={form.passwordPlaceholder}
          disabled={disabled}
          className="h-12 rounded-xl border border-(--color-border) px-space-2 text-(--color-text-primary) focus:border-(--color-primary) focus:outline-none disabled:opacity-60"
          aria-invalid={Boolean(fieldErrors.password)}
          aria-describedby={fieldErrors.password ? "register-password-error" : "register-password-hint"}
        />
        {fieldErrors.password ? (
          <p id="register-password-error" role="alert" className="text-small text-(--color-danger)">
            {fieldErrors.password}
          </p>
        ) : (
          <p id="register-password-hint" className="text-small text-(--color-text-muted)">
            {form.passwordHint}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-space-1">
        <label
          htmlFor="register-confirm-password"
          className="text-small font-medium text-(--color-text-primary)"
        >
          {form.confirmPasswordLabel}
        </label>
        <input
          id="register-confirm-password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder={form.confirmPasswordPlaceholder}
          disabled={disabled}
          className="h-12 rounded-xl border border-(--color-border) px-space-2 text-(--color-text-primary) focus:border-(--color-primary) focus:outline-none disabled:opacity-60"
          aria-invalid={Boolean(fieldErrors.confirmPassword)}
          aria-describedby={fieldErrors.confirmPassword ? "register-confirm-password-error" : undefined}
        />
        {fieldErrors.confirmPassword ? (
          <p id="register-confirm-password-error" role="alert" className="text-small text-(--color-danger)">
            {fieldErrors.confirmPassword}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-space-1">
        <div className="flex items-start gap-space-2">
          <input
            id="register-terms"
            name="terms"
            type="checkbox"
            checked={termsAccepted}
            onChange={(event) => setTermsAccepted(event.target.checked)}
            disabled={disabled}
            className="mt-0.5 h-5 w-5 shrink-0 rounded border-(--color-border) text-(--color-primary) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary) disabled:opacity-60"
            aria-invalid={Boolean(fieldErrors.terms)}
            aria-describedby={fieldErrors.terms ? "register-terms-error" : undefined}
          />
          <label htmlFor="register-terms" className="text-small text-(--color-text-secondary)">
            {form.termsPrefix}
            <Link
              href={`/${locale}/terms-and-conditions`}
              target="_blank"
              className="font-semibold text-(--color-primary) hover:underline"
            >
              {form.termsLinkText}
            </Link>
          </label>
        </div>
        {fieldErrors.terms ? (
          <p id="register-terms-error" role="alert" className="text-small text-(--color-danger)">
            {fieldErrors.terms}
          </p>
        ) : null}
      </div>

      {status === "error" && errorMessage ? (
        <p role="alert" className="text-small text-(--color-danger)">
          {form.errorTitle}: {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={disabled}
        className="h-12 rounded-xl bg-(--color-primary) px-space-3 text-small font-semibold text-(--color-surface) transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {disabled ? form.sending : form.submit}
      </button>

      <p className="text-small text-(--color-text-secondary)">
        {form.hasAccount}{" "}
        <Link href={`/${locale}/login`} className="font-semibold text-(--color-primary)">
          {form.loginLink}
        </Link>
      </p>
      </form>
    </div>
  );
}
