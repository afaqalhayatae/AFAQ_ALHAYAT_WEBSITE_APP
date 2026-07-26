import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getMessages } from "@/i18n/get-messages";
import { EmptyState } from "@/components/empty-state";
import { BLOG_POSTS } from "@/lib/catalog/blog";
import { buildAlternates } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { alternates: buildAlternates(locale as Locale, "blog") };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const t = getMessages(typedLocale);

  if (BLOG_POSTS.length === 0) {
    return <EmptyState title={t.nav.blog} description={t.common.comingSoon} />;
  }

  const categoryLabel = (category: (typeof BLOG_POSTS)[number]["category"]) =>
    category === "company-guides"
      ? t.blog.categories.companyGuides
      : t.services.categories[category];

  return (
    <section className="mx-auto max-w-desktop px-space-3 py-space-7">
      <h1 className="text-h1 font-bold text-(--color-text-primary)">{t.blog.title}</h1>
      <div className="mt-space-5 grid gap-space-4 tablet:grid-cols-2 desktop:grid-cols-3">
        {BLOG_POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/${typedLocale}/blog/${post.slug}`}
            className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-space-4 transition-colors hover:border-(--color-primary)"
          >
            <p className="text-small font-semibold uppercase tracking-wide text-(--color-primary)">
              {categoryLabel(post.category)}
            </p>
            <h2 className="mt-space-1 text-h6 font-semibold text-(--color-text-primary)">
              {post.title[typedLocale]}
            </h2>
            <p className="mt-space-1 text-small text-(--color-text-secondary)">
              {post.excerpt[typedLocale]}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
