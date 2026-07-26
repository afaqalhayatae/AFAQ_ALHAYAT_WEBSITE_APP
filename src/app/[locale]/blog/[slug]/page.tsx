import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getMessages } from "@/i18n/get-messages";
import { BLOG_POSTS, getBlogPostBySlug } from "@/lib/catalog/blog";
import { buildAlternates } from "@/lib/seo/metadata";

export function generateStaticParams() {
  // Empty until a real, reviewed article exists — see blog.ts.
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const post = getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title[locale as Locale],
    description: post.excerpt[locale as Locale],
    alternates: buildAlternates(locale as Locale, `blog/${slug}`),
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const post = getBlogPostBySlug(slug);
  if (!post) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const t = getMessages(typedLocale);

  return (
    <section className="mx-auto max-w-desktop px-space-3 py-space-7">
      <Link
        href={`/${typedLocale}/blog`}
        className="text-small font-semibold text-(--color-primary)"
      >
        {t.blog.title}
      </Link>
      <h1 className="mt-space-3 text-h1 font-bold text-(--color-text-primary)">
        {post.title[typedLocale]}
      </h1>
      <p className="mt-space-3 max-w-2xl text-lead text-(--color-text-secondary)">
        {post.excerpt[typedLocale]}
      </p>
    </section>
  );
}
