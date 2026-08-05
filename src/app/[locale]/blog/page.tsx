import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getBlogCategoryLabel, getMessages } from "@/i18n/get-messages";
import { EmptyState } from "@/components/empty-state";
import { UnifiedHero } from "@/components/unified-hero";
import { BrandPanel } from "@/components/brand-panel";
import { BlogPostCard } from "@/components/blog-post-card";
import { BlogSidebar } from "@/components/blog-sidebar";
import { DemoBanner } from "@/components/demo-banner";
import {
  BLOG_POSTS,
  POPULAR_SERVICE_SLUGS,
  getLatestPosts,
} from "@/lib/catalog/blog";
import { BLOG_CATEGORY_ICONS, BLOG_CATEGORY_VISUAL } from "@/lib/catalog/blog-visuals";
import { getServiceBySlug } from "@/lib/catalog/services";
import { buildAlternates } from "@/lib/seo/metadata";
import { DEMO_VISUAL_ALT, DEMO_VISUAL_SRC } from "@/lib/media/demo-visuals";
import {
  HOMEPAGE_HERO_ALT,
  HOMEPAGE_HERO_DIMENSIONS,
  HOMEPAGE_HERO_MOBILE_DIMENSIONS,
  HOMEPAGE_HERO_SRC,
  HOMEPAGE_HERO_SRC_MOBILE,
} from "@/lib/media/homepage-hero";

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

  // No limit — the old default (4) is fine for the truncated "latest"
  // widgets elsewhere, but this page's whole redesign point is one grid
  // holding every article exactly once, so every post must come through.
  const [featured, ...remaining] = getLatestPosts(undefined, BLOG_POSTS.length);
  const FeaturedIcon = featured ? BLOG_CATEGORY_ICONS[featured.category] : null;

  const sidebarLatestPosts = getLatestPosts(featured?.slug, 4);
  const sidebarServices = POPULAR_SERVICE_SLUGS.map((slug) => getServiceBySlug(slug)).filter(
    (service): service is NonNullable<typeof service> => Boolean(service)
  );

  const hasDemoContent = BLOG_POSTS.some((post) => post.isDemo);

  return (
    <>
      {hasDemoContent ? <DemoBanner message={t.blog.demoNotice} /> : null}

      {/* Hero — Unified Hero Design System, same real approved homepage
          photo the blog's hero already reused in a small card before this
          pass, now given the full-bleed premium treatment every other
          real-photo page gets instead of standing out as a smaller,
          boxed-in banner. Not a new asset. */}
      <UnifiedHero
        locale={typedLocale}
        image={{ src: HOMEPAGE_HERO_SRC, ...HOMEPAGE_HERO_DIMENSIONS }}
        mobileImage={{ src: HOMEPAGE_HERO_SRC_MOBILE, ...HOMEPAGE_HERO_MOBILE_DIMENSIONS }}
        alt={HOMEPAGE_HERO_ALT[typedLocale]}
        align="physical-left"
        title={t.blog.hero.title}
        description={t.blog.hero.subtitle}
      />

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
                    ) : featured.image ? (
                      <BrandPanel
                        variant="hero"
                        category={BLOG_CATEGORY_VISUAL[featured.category]}
                        icon={<FeaturedIcon className="h-10 w-10 tablet:h-12 tablet:w-12" />}
                        src={featured.image.src}
                        alt={featured.image.alt[typedLocale]}
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

            {remaining.length > 0 ? (
              <div>
                <h2 className="text-h3 font-bold text-(--color-text-primary)">
                  {t.blog.sidebar.latestArticles}
                </h2>
                {/* Single clean 3-column grid — replaces the old stacked
                    "latest" + per-category + "related services" sections,
                    which repeated the same 21 cards across the page. Every
                    article now appears exactly once. */}
                <div className="mt-space-4 grid gap-space-4 tablet:grid-cols-2 desktop:grid-cols-3">
                  {remaining.map((post) => (
                    <BlogPostCard key={post.slug} post={post} locale={typedLocale} t={t} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-space-7 desktop:mt-0">
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
    </>
  );
}
