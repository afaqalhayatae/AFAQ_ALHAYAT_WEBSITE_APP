import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getBlogCategoryLabel, getMessages, getServiceEntry } from "@/i18n/get-messages";
import { BrandPanel } from "@/components/brand-panel";
import { BlogPostCard } from "@/components/blog-post-card";
import { BlogSidebar } from "@/components/blog-sidebar";
import { DemoBanner } from "@/components/demo-banner";
import { ClockIcon, WhatsAppIcon } from "@/components/icons";
import {
  BLOG_POSTS,
  POPULAR_SERVICE_SLUGS,
  getBlogPostBySlug,
  getLatestPosts,
  getRelatedPosts,
} from "@/lib/catalog/blog";
import { BLOG_CATEGORY_ICONS, BLOG_CATEGORY_VISUAL } from "@/lib/catalog/blog-visuals";
import { getServiceBySlug } from "@/lib/catalog/services";
import { formatReadingTime, getReadingTimeMinutes } from "@/lib/catalog/reading-time";
import { buildAlternates, NOINDEX_FOLLOW } from "@/lib/seo/metadata";
import { COMPANY_NAME, WHATSAPP_URL } from "@/lib/brand/links";
import { DEMO_VISUAL_ALT, DEMO_VISUAL_SRC } from "@/lib/media/demo-visuals";

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

  const typedLocale = locale as Locale;

  return {
    title: post.title[typedLocale],
    description: post.excerpt[typedLocale],
    alternates: buildAlternates(typedLocale, `blog/${slug}`),
    openGraph: {
      type: "article",
      title: post.title[typedLocale],
      description: post.excerpt[typedLocale],
      publishedTime: post.publishDate,
    },
    // Temporary demo posts (M4.5 visual testing) are never indexable.
    ...(post.isDemo ? { robots: NOINDEX_FOLLOW } : {}),
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
  const body = post.body[typedLocale];
  const headings = body.filter((block) => block.type === "heading");
  const readingMinutes = getReadingTimeMinutes(body);
  const relatedPosts = getRelatedPosts(post);
  const relatedServices = (post.serviceSlugs ?? [])
    .map((serviceSlug) => getServiceBySlug(serviceSlug))
    .filter((service): service is NonNullable<typeof service> => Boolean(service));

  const hasRelatedServices = relatedServices.length > 0;
  const sidebarServices = (hasRelatedServices ? post.serviceSlugs! : POPULAR_SERVICE_SLUGS)
    .map((serviceSlug) => getServiceBySlug(serviceSlug))
    .filter((service): service is NonNullable<typeof service> => Boolean(service));
  const sidebarServicesLabel = hasRelatedServices
    ? t.blog.sidebar.relatedServices
    : t.blog.sidebar.popularServices;
  const sidebarLatestPosts = getLatestPosts(post.slug, 4);

  const CategoryIcon = BLOG_CATEGORY_ICONS[post.category];
  const publishedDate = new Intl.DateTimeFormat(typedLocale === "ar" ? "ar" : "en", {
    dateStyle: "long",
  }).format(new Date(post.publishDate));

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title[typedLocale],
    datePublished: post.publishDate,
    author: { "@type": "Organization", name: COMPANY_NAME },
    publisher: { "@type": "Organization", name: COMPANY_NAME },
    mainEntityOfPage: `/${typedLocale}/blog/${post.slug}`,
  };

  return (
    <>
      {/* Article schema is never emitted for temporary demo content. */}
      {post.isDemo ? null : (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}

      {post.isDemo ? <DemoBanner message={t.blog.demoNotice} /> : null}

      <section className="mx-auto max-w-desktop px-space-3 py-space-3 text-small text-(--color-text-secondary)">
        <Link href={`/${typedLocale}/blog`} className="hover:text-(--color-primary)">
          {t.blog.backToBlog}
        </Link>
      </section>

      <section className="mx-auto max-w-desktop px-space-3 pb-space-6">
        <p className="text-small font-semibold uppercase tracking-wide text-(--color-primary)">
          {getBlogCategoryLabel(t, post.category)}
        </p>
        <h1 className="mt-space-2 text-h1 font-bold text-(--color-text-primary)">
          {post.title[typedLocale]}
        </h1>
        <div className="mt-space-3 flex items-center gap-space-3 text-small text-(--color-text-secondary)">
          <span>
            {t.blog.article.publishedLabel} {publishedDate}
          </span>
          <span className="flex items-center gap-space-1">
            <ClockIcon className="h-4 w-4" />
            {formatReadingTime(readingMinutes, typedLocale)}
          </span>
        </div>
        <div className="mt-space-5">
          {post.isDemo ? (
            <BrandPanel
              variant="hero"
              category={BLOG_CATEGORY_VISUAL[post.category]}
              icon={<CategoryIcon className="h-10 w-10 tablet:h-12 tablet:w-12" />}
              src={DEMO_VISUAL_SRC}
              alt={DEMO_VISUAL_ALT}
            />
          ) : (
            <BrandPanel
              variant="hero"
              category={BLOG_CATEGORY_VISUAL[post.category]}
              icon={<CategoryIcon className="h-10 w-10 tablet:h-12 tablet:w-12" />}
            />
          )}
        </div>
      </section>

      <section className="mx-auto max-w-desktop px-space-3 pb-space-7">
        <div className="grid gap-space-6 desktop:grid-cols-[1fr_320px]">
          <div className="min-w-0">
            {headings.length > 0 ? (
              <nav
                aria-label={t.blog.article.tableOfContents}
                className="mb-space-5 rounded-2xl border border-(--color-border) bg-(--color-surface) p-space-4"
              >
                <p className="text-h6 font-semibold text-(--color-text-primary)">
                  {t.blog.article.tableOfContents}
                </p>
                <ul className="mt-space-2 flex flex-col gap-space-1 text-small">
                  {headings.map((heading) => (
                    <li key={heading.id}>
                      <a href={`#${heading.id}`} className="text-(--color-primary) hover:underline">
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}

            <div className="flex flex-col gap-space-4 text-(--color-text-secondary)">
              {body.map((block, index) => {
                if (block.type === "heading") {
                  return (
                    <h2
                      key={block.id}
                      id={block.id}
                      className="text-h3 font-bold text-(--color-text-primary)"
                    >
                      {block.text}
                    </h2>
                  );
                }
                if (block.type === "list") {
                  return (
                    <ul key={index} className="flex flex-col gap-space-1 ps-space-4">
                      {block.items.map((item) => (
                        <li key={item} className="list-disc text-small">
                          {item}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={index} className="text-lead">
                    {block.text}
                  </p>
                );
              })}
            </div>

            {relatedServices.length > 0 ? (
              <div className="mt-space-7">
                <h2 className="text-h4 font-bold text-(--color-text-primary)">
                  {t.blog.article.relatedServices}
                </h2>
                <ul className="mt-space-3 flex flex-wrap gap-space-2">
                  {relatedServices.map((service) => {
                    const entry = getServiceEntry(t, service.slug);
                    return (
                      <li key={service.slug}>
                        <Link
                          href={`/${typedLocale}/services/${service.slug}`}
                          className="rounded-xl border border-(--color-border) px-space-3 py-space-2 text-small font-semibold text-(--color-text-primary) hover:border-(--color-primary)"
                        >
                          {entry.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}

            <div className="mt-space-7 rounded-2xl bg-(--color-primary) p-space-5">
              <h2 className="text-h4 font-bold text-(--color-surface)">{t.home.cta.title}</h2>
              <p className="mt-space-1 text-(--color-surface)">{t.home.cta.subtitle}</p>
              <div className="mt-space-3 flex flex-wrap gap-space-2">
                <Link
                  href={`/${typedLocale}/contact`}
                  className="rounded-xl bg-(--color-surface) px-space-3 py-space-2 text-small font-semibold text-(--color-primary)"
                >
                  {t.home.cta.button}
                </Link>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-space-1 rounded-xl border border-(--color-surface) px-space-3 py-space-2 text-small font-semibold text-(--color-surface) transition-colors hover:bg-white/10"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  {t.common.whatsappCta}
                </a>
              </div>
            </div>

            {relatedPosts.length > 0 ? (
              <div className="mt-space-7">
                <h2 className="text-h4 font-bold text-(--color-text-primary)">
                  {t.blog.article.relatedArticles}
                </h2>
                <div className="mt-space-4 grid gap-space-4 tablet:grid-cols-2 desktop:grid-cols-3">
                  {relatedPosts.map((relatedPost) => (
                    <BlogPostCard
                      key={relatedPost.slug}
                      post={relatedPost}
                      locale={typedLocale}
                      t={t}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="hidden desktop:block">
            <BlogSidebar
              locale={typedLocale}
              t={t}
              latestPosts={sidebarLatestPosts}
              services={sidebarServices}
              servicesLabel={sidebarServicesLabel}
            />
          </div>
        </div>
      </section>
    </>
  );
}
