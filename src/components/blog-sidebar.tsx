import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getMessages, getServiceEntry } from "@/i18n/get-messages";
import { HomeIcon, WhatsAppIcon } from "./icons";
import { WHATSAPP_URL } from "@/lib/brand/links";
import type { BlogPost } from "@/lib/catalog/blog";
import type { ServiceEntry } from "@/lib/catalog/services";
import { SERVICE_ICONS } from "@/lib/catalog/service-visuals";

type Messages = ReturnType<typeof getMessages>;

/**
 * Reusable desktop blog sidebar (JOB-AGT-WEB-20260726-M4.3), used on both
 * the blog homepage and article pages. Purely presentational — like
 * ServiceFaqSection, all data (which posts/services to show, and which
 * label applies) is resolved by the calling page, not fetched here. Not
 * governed by SIDEBAR_NAVIGATION.md (that spec is scoped to authenticated
 * portals/dashboards, not the public blog). Mirrors correctly in RTL/LTR
 * because it relies on the same logical layout flow as the rest of the
 * app (no manual left/right positioning here).
 */
export function BlogSidebar({
  locale,
  t,
  latestPosts,
  services,
  servicesLabel,
}: {
  locale: Locale;
  t: Messages;
  latestPosts: BlogPost[];
  services: ServiceEntry[];
  servicesLabel: string;
}) {
  return (
    <aside className="flex flex-col gap-space-4">
      {latestPosts.length > 0 ? (
        <section className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-space-4">
          <h2 className="text-h6 font-semibold text-(--color-text-primary)">
            {t.blog.sidebar.latestArticles}
          </h2>
          <ul className="mt-space-3 flex flex-col gap-space-3">
            {latestPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/${locale}/blog/${post.slug}`}
                  className="block text-small font-semibold text-(--color-text-primary) hover:text-(--color-primary)"
                >
                  {post.title[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {services.length > 0 ? (
        <section className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-space-4">
          <h2 className="text-h6 font-semibold text-(--color-text-primary)">{servicesLabel}</h2>
          <ul className="mt-space-3 flex flex-col gap-space-2">
            {services.map((service) => {
              const entry = getServiceEntry(t, service.slug);
              const ServiceIcon = SERVICE_ICONS[service.slug] ?? HomeIcon;
              return (
                <li key={service.slug}>
                  <Link
                    href={`/${locale}/services/${service.slug}`}
                    className="flex items-center gap-space-2 text-small font-medium text-(--color-text-primary) hover:text-(--color-primary)"
                  >
                    <ServiceIcon className="h-5 w-5 shrink-0 text-(--color-primary)" />
                    {entry.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl bg-(--color-primary) p-space-4 text-(--color-surface)">
        <p className="text-small font-semibold">{t.home.cta.title}</p>
        <div className="mt-space-3 flex flex-col gap-space-2">
          <Link
            href={`/${locale}/contact`}
            className="flex items-center justify-center rounded-xl bg-(--color-surface) px-space-3 py-space-2 text-small font-semibold text-(--color-primary)"
          >
            {t.common.requestService}
          </Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-space-1 rounded-xl border border-(--color-surface) px-space-3 py-space-2 text-small font-semibold text-(--color-surface) transition-colors hover:bg-white/10"
          >
            <WhatsAppIcon className="h-5 w-5" />
            {t.common.whatsappCta}
          </a>
        </div>
      </section>
    </aside>
  );
}
