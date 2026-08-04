import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  /** Optional extra content below the description, e.g. CTA links (not-found.tsx). */
  children?: ReactNode;
};

export function EmptyState({ title, description, children }: EmptyStateProps) {
  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center gap-space-2 px-space-3 text-center">
      <h1 className="text-h2 font-semibold text-(--color-text-primary)">
        {title}
      </h1>
      {description ? (
        <p className="max-w-prose text-(--color-text-secondary)">
          {description}
        </p>
      ) : null}
      {children}
    </section>
  );
}
