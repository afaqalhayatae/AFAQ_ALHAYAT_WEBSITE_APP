import type { getMessages } from "@/i18n/get-messages";
import { PhoneIcon, MailIcon } from "./icons";
import { PHONE_E164 } from "@/lib/brand/links";

type Messages = ReturnType<typeof getMessages>;

/**
 * Closing contact line for legal pages (JOB-AGT-WEB-20260726-M4.4).
 * Reuses the same approved phone/email facts and `dir="ltr"`
 * bidi-isolation pattern already used in `contact/page.tsx` and
 * `footer.tsx` — no new contact detail is introduced.
 */
export function LegalContactLine({ t }: { t: Messages }) {
  return (
    <section className="border-t border-(--color-border) bg-(--color-surface-secondary)">
      <div className="mx-auto max-w-desktop px-space-3 py-space-6">
        <p className="font-semibold text-(--color-text-primary)">{t.legal.contactLine.title}</p>
        <div className="mt-space-2 flex flex-col gap-space-2 text-small text-(--color-text-secondary)">
          <a
            href={`tel:${PHONE_E164}`}
            className="flex items-center gap-space-1 hover:text-(--color-primary)"
          >
            <PhoneIcon className="h-4 w-4 shrink-0" />
            <span dir="ltr">{t.contact.info.phone}</span>
          </a>
          <a
            href={`mailto:${t.contact.info.email}`}
            className="flex items-center gap-space-1 hover:text-(--color-primary)"
          >
            <MailIcon className="h-4 w-4 shrink-0" />
            <span dir="ltr">{t.contact.info.email}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
