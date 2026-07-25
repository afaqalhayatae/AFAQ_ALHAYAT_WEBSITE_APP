type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
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
    </section>
  );
}
