"use client";

import { useState, type FormEvent } from "react";
import type { getMessages } from "@/i18n/get-messages";
import { isApiErrorBody } from "@/lib/validation/api-envelope";

type Messages = ReturnType<typeof getMessages>;
type Status = "idle" | "submitting" | "success" | "error";
type FieldErrors = { name?: string; contact?: string; message?: string };

export function EnquiryForm({ t, source = "website" }: { t: Messages; source?: string }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = t.contact.form;

  function validate(): boolean {
    const errors: FieldErrors = {};
    if (!name.trim()) errors.name = form.validation.name;
    if (!contact.trim()) errors.contact = form.validation.contact;
    if (!message.trim()) errors.message = form.validation.message;
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          customerId: contact.trim(),
          need: `${name.trim()}: ${message.trim()}`,
          source,
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
      setName("");
      setContact("");
      setMessage("");
      setFieldErrors({});
    } catch {
      setErrorMessage(form.errorGeneric);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-(--color-success) bg-(--color-surface) p-space-3">
        <p className="text-h6 font-semibold text-(--color-success)">{form.successTitle}</p>
        <p className="mt-space-1 text-small text-(--color-text-secondary)">{form.successBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-space-3">
      <h2 className="text-h5 font-semibold text-(--color-text-primary)">{form.title}</h2>

      <div className="flex flex-col gap-space-1">
        <label htmlFor="enquiry-name" className="text-small font-medium text-(--color-text-primary)">
          {form.nameLabel}
        </label>
        <input
          id="enquiry-name"
          name="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={form.namePlaceholder}
          className="h-12 rounded-xl border border-(--color-border) px-space-2 text-(--color-text-primary) focus:border-(--color-primary) focus:outline-none"
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? "enquiry-name-error" : undefined}
        />
        {fieldErrors.name ? (
          <p id="enquiry-name-error" className="text-small text-(--color-danger)">
            {fieldErrors.name}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-space-1">
        <label htmlFor="enquiry-contact" className="text-small font-medium text-(--color-text-primary)">
          {form.contactLabel}
        </label>
        <input
          id="enquiry-contact"
          name="contact"
          type="tel"
          value={contact}
          onChange={(event) => setContact(event.target.value)}
          placeholder={form.contactPlaceholder}
          className="h-12 rounded-xl border border-(--color-border) px-space-2 text-(--color-text-primary) focus:border-(--color-primary) focus:outline-none"
          aria-invalid={Boolean(fieldErrors.contact)}
          aria-describedby={fieldErrors.contact ? "enquiry-contact-error" : undefined}
        />
        {fieldErrors.contact ? (
          <p id="enquiry-contact-error" className="text-small text-(--color-danger)">
            {fieldErrors.contact}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-space-1">
        <label htmlFor="enquiry-message" className="text-small font-medium text-(--color-text-primary)">
          {form.messageLabel}
        </label>
        <textarea
          id="enquiry-message"
          name="message"
          rows={4}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={form.messagePlaceholder}
          className="rounded-xl border border-(--color-border) px-space-2 py-space-2 text-(--color-text-primary) focus:border-(--color-primary) focus:outline-none"
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? "enquiry-message-error" : undefined}
        />
        {fieldErrors.message ? (
          <p id="enquiry-message-error" className="text-small text-(--color-danger)">
            {fieldErrors.message}
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
        className="h-12 rounded-xl bg-(--color-primary) px-space-3 text-small font-semibold text-(--color-surface) disabled:opacity-60"
      >
        {status === "submitting" ? form.sending : form.submit}
      </button>
    </form>
  );
}
