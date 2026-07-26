import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getBlogCategoryLabel, getMessages } from "@/i18n/get-messages";
import { EmptyState } from "@/components/empty-state";
import { BrandPanel } from "@/components/brand-panel";
import { BlogPostCard } from "@/components/blog-post-card";
import { BlogSidebar } from "@/components/blog-sidebar";
import { DemoBanner } from "@/components/demo-banner";
import {
  BLOG_CATEGORIES,
  BLOG_POSTS,
  POPULAR_SERVICE_SLUGS,
  getLatestPosts,
} from "@/lib/catalog/blog";
import { BLOG_CATEGORY_ICONS, BLOG_CATEGORY_VISUAL } from "@/lib/catalog/blog-visuals";
import { getServiceBySlug } from "@/lib/catalog/services";
import { buildAlternates } from "@/lib/seo/metadata";
import { DEMO_VISUAL_ALT, DEMO_VISUAL_SRC } from "@/lib/media/demo-visuals";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getMessages(locale as Locale);
  return {
    title: t.blog.hero.title,
    description: t.blog.hero.subtitle,
    alternates: buildAlternates(locale as Locale, "blog"),
  };
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

  const [featured, ...rest] = getLatestPosts();
  const latest = rest.slice(0, 6);
  const serviceRelated = BLOG_POSTS.filter((post) => (post.serviceSlugs?.length ?? 0) > 0).slice(
    0,
    3
  );
  const FeaturedIcon = featured ? BLOG_CATEGORY_ICONS[featured.category] : null;

  const sidebarLatestPosts = getLatestPosts(featured?.slug, 4);
  const sidebarServices = POPULAR_SERVICE_SLUGS.map((slug) => getServiceBySlug(slug)).filter(
    (service): service is NonNullable<typeof service> => Boolean(service)
  );

  const hasDemoContent = BLOG_POSTS.some((post) => post.isDemo);

  return (
    <>
      {hasDemoContent ? <DemoBanner message={t.blog.demoNotice} /> : null}

      <section className="mx-auto max-w-desktop px-space-3 py-space-7">
        <h1 className="text-h1 font-bold text-(--color-text-primary)">{t.blog.hero.title}</h1>
        <p className="mt-space-2 max-w-2xl text-lead text-(--color-text-secondary)">
          {t.blog.hero.subtitle}
        </p>
      </section>

      <section className="mx-auto max-w-desktop px-space-3 pb-space-7">
        <div className="grid gap-space-6 desktop:grid-cols-[1fr_320px]">
          <div className="min-w-0">
            {featured && FeaturedIcon ? (
              <div className="pb-space-7">
                <p className="text-small font-semibold uppercase tracking-wide text-(--color-primary)">
                  {t.blog.featuredLabel}
                </p>
                <div className="mt-space-3 grid gap-space-4 tablet:grid-cols-2 tablet:items-center">
                  <Link href={`/${typedLocale}/blog/${featured.slug}`}>
                    {featured.isDemo ? (
                      <BrandPanel
                        variant="hero"
                        category={BLOG_CATEGORY_VISUAL[featured.category]}
                        icon={<FeaturedIcon className="h-10 w-10 tablet:h-12 tablet:w-12" />}
                        src={DEMO_VISUAL_SRC}
                        alt={DEMO_VISUAL_ALT}
                      />
                    ) : (
                      <BrandPanel
                        variant="hero"
                        category={BLOG_CATEGORY_VISUAL[featured.category]}
                        icon={<FeaturedIcon className="h-10 w-10 tablet:h-12 tablet:w-12" />}
                      />
                    )}
                  </Link>
                  <div>
                    <p className="text-small font-semibold uppercase tracking-wide text-(--color-primary)">
                      {getBlogCategoryLabel(t, featured.category)}
                    </p>
                    <h2 className="mt-space-2 text-h2 font-bold text-(--color-text-primary)">
                      <Link href={`/${typedLocale}/blog/${featured.slug}`}>
                        {featured.title[typedLocale]}
                      </Link>
                    </h2>
                    <p className="mt-space-2 text-lead text-(--color-text-secondary)">
                      {featured.excerpt[typedLocale]}
                    </p>
                    <Link
                      href={`/${typedLocale}/blog/${featured.slug}`}
                      className="mt-space-3 inline-flex text-small font-semibold text-(--color-primary)"
                    >
                      {t.blog.readArticle}
                    </Link>
                  </div>
                </div>
              </div>
            ) : null}

            {latest.length > 0 ? (
              <div>
                <h2 className="text-h3 font-bold text-(--color-text-primary)">
                  {t.blog.sidebar.latestArticles}
                </h2>
                <div className="mt-space-4 grid gap-space-4 tablet:grid-cols-2">
                  {latest.map((post) => (
                    <BlogPostCard key={post.slug} post={post} locale={typedLocale} t={t} />
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
              servicesLabel={t.blog.sidebar.popularServices}
            />
          </div>
        </div>
      </section>

      {BLOG_CATEGORIES.map((category) => {
        const posts = BLOG_POSTS.filter((post) => post.category === category);
        if (posts.length === 0) return null;
        return (
          <section key={category} className="mx-auto max-w-desktop px-space-3 pb-space-7">
            <h2 className="text-h3 font-bold text-(--color-text-primary)">
              {getBlogCategoryLabel(t, category)}
            </h2>
            <div className="mt-space-4 grid gap-space-4 tablet:grid-cols-2 desktop:grid-cols-3">
              {posts.map((post) => (
                <BlogPostCard key={post.slug} post={post} locale={typedLocale} t={t} />
              ))}
            </div>
          </section>
        );
      })}

      {serviceRelated.length > 0 ? (
        <section className="bg-(--color-surface-secondary)">
          <div className="mx-auto max-w-desktop px-space-3 py-space-7">
            <h2 className="text-h3 font-bold text-(--color-text-primary)">
              {t.blog.article.relatedServices}
            </h2>
            <div className="mt-space-4 grid gap-space-4 tablet:grid-cols-2 desktop:grid-cols-3">
              {serviceRelated.map((post) => (
                <BlogPostCard key={post.slug} post={post} locale={typedLocale} t={t} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
