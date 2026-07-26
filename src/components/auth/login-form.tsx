"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import type { Locale } from "@/i18n/config";
import type { getMessages } from "@/i18n/get-messages";
import { isApiErrorBody } from "@/lib/validation/api-envelope";

type Messages = ReturnType<typeof getMessages>;
type Status = "idle" | "submitting" | "error";
type FieldErrors = { contact?: string; password?: string };

export function LoginForm({ locale, t }: { locale: Locale; t: Messages }) {
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = t.auth.login;

  function validate(): boolean {
    const errors: FieldErrors = {};
    if (!contact.trim()) errors.contact = form.validation.contact;
    if (!password) errors.password = form.validation.password;
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          channel: "phone",
          contactValue: contact.trim(),
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

      window.location.href = `/${locale}`;
    } catch {
      setErrorMessage(form.errorGeneric);
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-space-3">
      <div className="flex flex-col gap-space-1">
        <label htmlFor="login-contact" className="text-small font-medium text-(--color-text-primary)">
          {form.contactLabel}
        </label>
        <input
          id="login-contact"
          name="contact"
          type="tel"
          value={contact}
          onChange={(event) => setContact(event.target.value)}
          placeholder={form.contactPlaceholder}
          className="rounded-md border border-(--color-border) px-space-2 py-space-1 text-(--color-text-primary) focus:border-(--color-primary) focus:outline-none"
          aria-invalid={Boolean(fieldErrors.contact)}
          aria-describedby={fieldErrors.contact ? "login-contact-error" : undefined}
        />
        {fieldErrors.contact ? (
          <p id="login-contact-error" className="text-small text-(--color-danger)">
            {fieldErrors.contact}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-space-1">
        <label htmlFor="login-password" className="text-small font-medium text-(--color-text-primary)">
          {form.passwordLabel}
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder={form.passwordPlaceholder}
          className="rounded-md border border-(--color-border) px-space-2 py-space-1 text-(--color-text-primary) focus:border-(--color-primary) focus:outline-none"
          aria-invalid={Boolean(fieldErrors.password)}
          aria-describedby={fieldErrors.password ? "login-password-error" : undefined}
        />
        {fieldErrors.password ? (
          <p id="login-password-error" className="text-small text-(--color-danger)">
            {fieldErrors.password}
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
        disabled={status === "submitting"}
        className="rounded-md bg-(--color-primary) px-space-3 py-space-2 text-small font-semibold text-(--color-surface) disabled:opacity-60"
      >
        {status === "submitting" ? form.sending : form.submit}
      </button>

      <p className="text-small text-(--color-text-secondary)">
        {form.noAccount}{" "}
        <Link href={`/${locale}/register`} className="font-semibold text-(--color-primary)">
          {form.registerLink}
        </Link>
      </p>
    </form>
  );
}
