import type { LegalPageContent } from "@/lib/legal/policies";

/**
 * Shared legal-page renderer (JOB-AGT-WEB-20260726-M4.4) — used by the
 * Privacy Policy, Terms & Conditions, and Cookie Policy routes. Kept
 * deliberately simple and non-promotional (no CTA bands): an intro
 * paragraph, an anchor-linked table of contents, then each section as a
 * heading + paragraphs + optional list — the same "derive the TOC from
 * the same content being rendered" pattern already used for blog articles.
 */
export function LegalPageContent({ content }: { content: LegalPageContent }) {
  return (
    <div className="mx-auto max-w-desktop px-space-3 py-space-7">
      <p className="text-small text-(--color-text-secondary)">
        {content.lastUpdated}
      </p>
      <h1 className="mt-space-2 text-h1 font-bold text-(--color-text-primary)">
        {content.title}
      </h1>
      <p className="mt-space-3 max-w-2xl text-lead text-(--color-text-secondary)">
        {content.intro}
      </p>

      <nav
        aria-label={content.title}
        className="mt-space-5 max-w-2xl rounded-2xl border border-(--color-border) bg-(--color-surface) p-space-4"
      >
        <ul className="flex flex-col gap-space-1 text-small">
          {content.sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`} className="text-(--color-primary) hover:underline">
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-space-6 flex max-w-2xl flex-col gap-space-6">
        {content.sections.map((section) => (
          <section key={section.id} id={section.id}>
            <h2 className="text-h4 font-bold text-(--color-text-primary)">{section.title}</h2>
            <div className="mt-space-2 flex flex-col gap-space-2 text-(--color-text-secondary)">
              {section.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
              {section.list ? (
                <ul className="flex flex-col gap-space-1 ps-space-4">
                  {section.list.map((item) => (
                    <li key={item} className="list-disc text-small">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
