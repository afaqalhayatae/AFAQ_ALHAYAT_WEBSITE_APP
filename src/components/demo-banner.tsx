/**
 * Visible marker for temporary demo/preview content (M4.5 prep). Renders
 * whenever a page is showing at least one post with `isDemo: true` from
 * src/lib/catalog/blog.ts, so demo articles are never mistaken for
 * published content while visually testing the blog system. Remove
 * naturally once the demo posts are deleted — no other code depends on
 * this component's presence.
 */
export function DemoBanner({ message }: { message: string }) {
  return (
    <div className="border-b border-(--color-danger) bg-(--color-surface)">
      <p className="mx-auto max-w-desktop px-space-3 py-space-2 text-center text-small font-semibold text-(--color-danger)">
        {message}
      </p>
    </div>
  );
}
