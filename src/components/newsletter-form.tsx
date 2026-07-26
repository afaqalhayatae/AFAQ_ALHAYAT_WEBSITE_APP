"use client";

import { useState, type FormEvent } from "react";
import type { getMessages } from "@/i18n/get-messages";
import { isApiErrorBody } from "@/lib/validation/api-envelope";

type Messages = ReturnType<typeof getMessages>;
type Status = "idle" | "submitting" | "success" | "error";
type FieldErrors = { contact?: string; consent?: string };

/**
 * Newsletter / lead-capture foundation (JOB-AGT-WEB-20260726-M4.6). Reuses
 * the two backends this repo already has and already tests — no new API
 * route, no new data model:
 *  - POST /api/enquiries stores the actual contact address as a real,
 *    actionable lead (same `customerId`-as-typed-contact convention
 *    EnquiryForm already uses).
 *  - POST /api/consents records the compliance proof — channel, purpose,
 *    the exact consent wording shown, and a timestamp — per
 *    EMAIL_MARKETING.md's Audience Rules ("consent source, timestamp,
 *    wording, language, and withdrawal status must be retained").
 * No ESP is connected here; this only builds the list and the consent
 * record an owner-approved ESP would act on later.
 */
export function NewsletterForm({ t }: { t: Messages }) {
  const [contact, setContact] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = t.newsletter;

  function validate(): boolean {
    const errors: FieldErrors = {};
    if (!contact.trim()) errors.contact = form.validation.contact;
    if (!consentChecked) errors.consent = form.validation.consent;
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    setErrorMessage(null);

    const trimmedContact = contact.trim();
    const channel = trimmedContact.includes("@") ? "email" : "whatsapp";
    const recordedAt = new Date().toISOString();

    try {
      const [enquiryResponse, consentResponse] = await Promise.all([
        fetch("/api/enquiries", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            customerId: trimmedContact,
            need: "Newsletter signup",
            source: "website-newsletter-signup",
            actor: "website-visitor",
          }),
        }),
        fetch("/api/consents", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            channel,
            purpose: "newsletter",
            status: "granted",
            source: "website-newsletter-signup",
            evidence: form.consentLabel,
            recordedAt,
            actor: "website-visitor",
          }),
        }),
      ]);

      if (!enquiryResponse.ok || !consentResponse.ok) {
        const failed = !enquiryResponse.ok ? enquiryResponse : consentResponse;
        const body: unknown = await failed.json().catch(() => null);
        setErrorMessage(isApiErrorBody(body) ? body.error.message : form.errorGeneric);
        setStatus("error");
        return;
      }

      setStatus("success");
      setContact("");
      setConsentChecked(false);
      setFieldErrors({});
    } catch {
      setErrorMessage(form.errorGeneric);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-(--color-success) bg-(--color-surface) p-space-3">
        <p className="font-semibold text-(--color-success)">{form.successTitle}</p>
        <p className="mt-space-1 text-small text-(--color-text-secondary)">{form.successBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-space-2">
      <p className="text-small font-semibold text-(--color-text-primary)">{form.title}</p>

      <div className="flex flex-col gap-space-2 tablet:flex-row">
        <div className="flex-1">
          <label htmlFor="newsletter-contact" className="sr-only">
            {form.contactLabel}
          </label>
          <input
            id="newsletter-contact"
            name="contact"
            type="text"
            value={contact}
            onChange={(event) => setContact(event.target.value)}
            placeholder={form.contactPlaceholder}
            className="h-12 w-full rounded-xl border border-(--color-border) px-space-2 text-(--color-text-primary) focus:border-(--color-primary) focus:outline-none"
            aria-invalid={Boolean(fieldErrors.contact)}
            aria-describedby={fieldErrors.contact ? "newsletter-contact-error" : undefined}
          />
          {fieldErrors.contact ? (
            <p id="newsletter-contact-error" className="mt-space-1 text-small text-(--color-danger)">
              {fieldErrors.contact}
            </p>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="h-12 shrink-0 rounded-xl bg-(--color-primary) px-space-4 text-small font-semibold text-(--color-surface) disabled:opacity-60"
        >
          {status === "submitting" ? form.sending : form.submit}
        </button>
      </div>

      <label className="flex items-start gap-space-2 text-small text-(--color-text-secondary)">
        <input
          type="checkbox"
          checked={consentChecked}
          onChange={(event) => setConsentChecked(event.target.checked)}
          className="mt-1"
        />
        <span>{form.consentLabel}</span>
      </label>
      {fieldErrors.consent ? (
        <p className="text-small text-(--color-danger)">{fieldErrors.consent}</p>
      ) : null}

      {status === "error" && errorMessage ? (
        <p role="alert" className="text-small text-(--color-danger)">
          {errorMessage}
        </p>
      ) : null}
    </form>
  );
}
