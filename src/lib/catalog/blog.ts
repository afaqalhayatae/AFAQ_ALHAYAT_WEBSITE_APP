/**
 * Blog content registry (JOB-AGT-WEB-20260726-M4.1, extended M4.3).
 *
 * Architecture only — no canonical blog-content doc exists in the
 * knowledge base (re-confirmed during M4.3 planning), so categories
 * mirror the 3 approved service categories plus one general catch-all,
 * and the list itself stays empty until real, reviewed articles exist.
 * `/blog/[slug]` generates zero pages while this is empty; adding a post
 * here — with a full bilingual `body` — is the entire publishing step.
 *
 * Articles are never attributed to an invented person: there is no
 * `author` field. Bylines and schema authorship use the fixed
 * `COMPANY_NAME` constant (src/lib/brand/links.ts) instead, consistent
 * with the Hard Publication Block against fake identities/employees.
 */

import { SERVICE_CATEGORIES, type ServiceCategory } from "./services";

export type BlogCategory = ServiceCategory | "company-guides";

export const BLOG_CATEGORIES: BlogCategory[] = [...SERVICE_CATEGORIES, "company-guides"];

/**
 * Curated, cross-category sample shown in the sidebar's "Popular services"
 * section when an article (or the blog homepage) has no more specific
 * related services to surface — an editorial pick, not a popularity claim.
 */
export const POPULAR_SERVICE_SLUGS = [
  "ac-maintenance",
  "general-cleaning",
  "pest-control",
  "drain-unblocking",
];

/**
 * Structured article body. This is the single source for both the
 * rendered content and the auto-generated table of contents — headings
 * are extracted from the same array they're rendered from, never
 * maintained separately.
 */
export type ArticleBlock =
  | { type: "heading"; id: string; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

export type BlogPost = {
  slug: string;
  category: BlogCategory;
  title: { en: string; ar: string };
  excerpt: { en: string; ar: string };
  /** ISO date (e.g. "2026-08-01") — drives sitemap, schema, and the visible publish date. */
  publishDate: string;
  body: { en: ArticleBlock[]; ar: ArticleBlock[] };
  serviceSlugs?: string[];
  locationSlugs?: string[];
};

export const BLOG_POSTS: BlogPost[] = [];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

/**
 * Most recent posts first, optionally excluding the article currently
 * being read. `posts` defaults to the real registry but is injectable so
 * this pure sort/filter logic can be unit-tested with fixture data
 * without touching `BLOG_POSTS` itself.
 */
export function getLatestPosts(
  excludeSlug?: string,
  limit = 4,
  posts: BlogPost[] = BLOG_POSTS
): BlogPost[] {
  return posts
    .filter((post) => post.slug !== excludeSlug)
    .slice()
    .sort((a, b) => (a.publishDate < b.publishDate ? 1 : -1))
    .slice(0, limit);
}

/** Same-category posts first, then posts sharing at least one related service. */
export function getRelatedPosts(post: BlogPost, limit = 3, posts: BlogPost[] = BLOG_POSTS): BlogPost[] {
  const sameCategory = posts.filter(
    (candidate) => candidate.slug !== post.slug && candidate.category === post.category
  );
  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  const sharedService = posts.filter(
    (candidate) =>
      candidate.slug !== post.slug &&
      candidate.category !== post.category &&
      candidate.serviceSlugs?.some((slug) => post.serviceSlugs?.includes(slug))
  );

  return [...sameCategory, ...sharedService].slice(0, limit);
}
