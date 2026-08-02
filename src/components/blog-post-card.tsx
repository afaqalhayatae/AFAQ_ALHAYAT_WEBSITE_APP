import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getBlogCategoryLabel, type getMessages } from "@/i18n/get-messages";
import { BrandPanel } from "./brand-panel";
import { BLOG_CATEGORY_ICONS, BLOG_CATEGORY_VISUAL } from "@/lib/catalog/blog-visuals";
import type { BlogPost } from "@/lib/catalog/blog";
import { DEMO_VISUAL_ALT, DEMO_VISUAL_SRC } from "@/lib/media/demo-visuals";

type Messages = ReturnType<typeof getMessages>;

/**
 * Shared article card — used on the blog homepage (latest/category/
 * service-related sections) and the article page (related articles), so
 * every article listing looks the same.
 */
export function BlogPostCard({
  post,
  locale,
  t,
}: {
  post: BlogPost;
  locale: Locale;
  t: Messages;
}) {
  const CategoryIcon = BLOG_CATEGORY_ICONS[post.category];

  return (
    <article className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface)">
      <Link href={`/${locale}/blog/${post.slug}`}>
        {post.isDemo ? (
          <BrandPanel
            variant="card"
            category={BLOG_CATEGORY_VISUAL[post.category]}
            icon={<CategoryIcon className="h-8 w-8" />}
            className="rounded-b-none"
            src={DEMO_VISUAL_SRC}
            alt={DEMO_VISUAL_ALT}
          />
        ) : post.image ? (
          <BrandPanel
            variant="card"
            category={BLOG_CATEGORY_VISUAL[post.category]}
            icon={<CategoryIcon className="h-8 w-8" />}
            className="rounded-b-none"
            src={post.image.src}
            alt={post.image.alt[locale]}
          />
        ) : (
          <BrandPanel
            variant="card"
            category={BLOG_CATEGORY_VISUAL[post.category]}
            icon={<CategoryIcon className="h-8 w-8" />}
            className="rounded-b-none"
          />
        )}
      </Link>
      <div className="flex flex-col gap-space-1 p-space-4">
        <p className="text-small font-semibold uppercase tracking-wide text-(--color-primary)">
          {getBlogCategoryLabel(t, post.category)}
        </p>
        <h3 className="text-h5 font-semibold text-(--color-text-primary)">
          <Link href={`/${locale}/blog/${post.slug}`}>{post.title[locale]}</Link>
        </h3>
        <p className="text-small text-(--color-text-secondary)">{post.excerpt[locale]}</p>
        <Link
          href={`/${locale}/blog/${post.slug}`}
          className="mt-space-2 text-small font-semibold text-(--color-primary)"
        >
          {t.blog.readArticle}
        </Link>
      </div>
    </article>
  );
}
