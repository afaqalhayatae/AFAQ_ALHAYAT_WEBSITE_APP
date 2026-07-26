"use client";

import { useState, type FormEvent } from "react";
import type { getMessages } from "@/i18n/get-messages";
import type { User } from "@/types/identity";
import { isApiErrorBody } from "@/lib/validation/api-envelope";

type Messages = ReturnType<typeof getMessages>;
type Status = "idle" | "submitting" | "success" | "error";

export function ProfileForm({ t, user }: { t: Messages; user: User }) {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = t.account.profile;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!displayName.trim()) {
      setFieldError(form.validation.displayName);
      return;
    }
    setFieldError(undefined);
    setStatus("submitting");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/session", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ displayName: displayName.trim() }),
      });

      if (!response.ok) {
        const body: unknown = await response.json().catch(() => null);
        setErrorMessage(isApiErrorBody(body) ? body.error.message : form.errorGeneric);
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMessage(form.errorGeneric);
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-space-3">
      <div className="flex flex-col gap-space-1">
        <label htmlFor="profile-contact" className="text-small font-medium text-(--color-text-primary)">
          {form.contactLabel}
        </label>
        <input
          id="profile-contact"
          type="text"
          value={user.contact.value}
          disabled
          className="rounded-md border border-(--color-border) bg-(--color-surface-secondary) px-space-2 py-space-1 text-(--color-text-secondary)"
        />
        <p className="text-small text-(--color-text-muted)">{form.contactHint}</p>
      </div>

      <div className="flex flex-col gap-space-1">
        <label htmlFor="profile-name" className="text-small font-medium text-(--color-text-primary)">
          {form.displayNameLabel}
        </label>
        <input
          id="profile-name"
          type="text"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          className="rounded-md border border-(--color-border) px-space-2 py-space-1 text-(--color-text-primary) focus:border-(--color-primary) focus:outline-none"
          aria-invalid={Boolean(fieldError)}
          aria-describedby={fieldError ? "profile-name-error" : undefined}
        />
        {fieldError ? (
          <p id="profile-name-error" className="text-small text-(--color-danger)">
            {fieldError}
          </p>
        ) : null}
      </div>

      {status === "success" ? (
        <p className="text-small text-(--color-success)">{form.successMessage}</p>
      ) : null}
      {status === "error" && errorMessage ? (
        <p role="alert" className="text-small text-(--color-danger)">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="self-start rounded-md bg-(--color-primary) px-space-3 py-space-2 text-small font-semibold text-(--color-surface) disabled:opacity-60"
      >
        {status === "submitting" ? form.saving : form.save}
      </button>
    </form>
  );
}
