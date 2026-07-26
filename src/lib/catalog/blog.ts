/**
 * Blog content registry (JOB-AGT-WEB-20260726-M4.1).
 *
 * Architecture only — no canonical blog-content doc exists in the
 * knowledge base yet (confirmed by direct search during M4 planning), so
 * categories mirror the 3 approved service categories plus one general
 * catch-all, and the list itself stays empty until real, reviewed
 * articles exist. `/blog/[slug]` generates zero pages while this is
 * empty; adding a post here is the entire publishing step.
 */

import type { ServiceCategory } from "./services";

export type BlogCategory = ServiceCategory | "company-guides";

export type BlogPost = {
  slug: string;
  category: BlogCategory;
  title: { en: string; ar: string };
  excerpt: { en: string; ar: string };
  serviceSlugs?: string[];
  locationSlugs?: string[];
};

export const BLOG_POSTS: BlogPost[] = [];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
