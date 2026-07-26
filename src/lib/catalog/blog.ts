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
  /**
   * Temporary visual-testing content only (JOB-AGT-WEB-20260726-M4.5 prep)
   * — never a real, approved article. Excluded from the sitemap
   * (src/app/sitemap.ts) and from Article schema (blog/[slug]/page.tsx),
   * and marked with a visible on-page banner (DemoBanner) so it can never
   * be mistaken for published content. Real posts must omit this field.
   */
  isDemo?: boolean;
};

/**
 * ============================================================
 * TEMPORARY DEMO DATA — FOR VISUAL TESTING ONLY, NOT REAL CONTENT
 * ============================================================
 * These 9 bilingual posts exist solely to exercise the blog homepage,
 * featured article, sidebar, TOC, related services, and related
 * articles UI end-to-end before real content exists. Every entry has
 * `isDemo: true`. Delete this entire block (and leave `BLOG_POSTS = []`)
 * before any real article is added — do not mix demo and real posts.
 */
const DEMO_BLOG_POSTS: BlogPost[] = [
  {
    slug: "demo-ac-maintenance-schedule",
    category: "general-maintenance",
    isDemo: true,
    publishDate: "2026-07-20",
    serviceSlugs: ["ac-maintenance"],
    title: {
      en: "How Often Should You Service Your AC?",
      ar: "كم مرة يجب صيانة مكيف الهواء؟",
    },
    excerpt: {
      en: "A practical guide to keeping your air conditioning running smoothly through every season.",
      ar: "دليل عملي للحفاظ على عمل مكيف الهواء بسلاسة خلال كل فصل.",
    },
    body: {
      en: [
        { type: "heading", id: "overview", text: "Overview" },
        {
          type: "paragraph",
          text: "Regular AC maintenance helps keep your home comfortable and your system running efficiently throughout the year.",
        },
        { type: "heading", id: "signs", text: "Signs to watch for" },
        {
          type: "list",
          items: [
            "Reduced airflow from vents",
            "Unusual noises during operation",
            "Higher than usual energy bills",
          ],
        },
        { type: "heading", id: "how-often", text: "How often to schedule a visit" },
        {
          type: "paragraph",
          text: "Most homes benefit from a routine check twice a year, with more frequent visits during peak summer months.",
        },
      ],
      ar: [
        { type: "heading", id: "overview", text: "نظرة عامة" },
        {
          type: "paragraph",
          text: "تساعد الصيانة الدورية لمكيف الهواء في الحفاظ على راحة منزلك وكفاءة النظام على مدار العام.",
        },
        { type: "heading", id: "signs", text: "علامات يجب ملاحظتها" },
        {
          type: "list",
          items: [
            "ضعف تدفق الهواء من الفتحات",
            "أصوات غير معتادة أثناء التشغيل",
            "ارتفاع فواتير الطاقة عن المعتاد",
          ],
        },
        { type: "heading", id: "how-often", text: "كم مرة يجب جدولة زيارة" },
        {
          type: "paragraph",
          text: "تستفيد معظم المنازل من فحص دوري مرتين في السنة، مع زيارات أكثر تكرارًا خلال أشهر الصيف الذروة.",
        },
      ],
    },
  },
  {
    slug: "demo-plumbing-warning-signs",
    category: "general-maintenance",
    isDemo: true,
    publishDate: "2026-07-15",
    serviceSlugs: ["plumbing"],
    title: {
      en: "5 Plumbing Warning Signs Not to Ignore",
      ar: "5 علامات تحذيرية للسباكة لا يجب تجاهلها",
    },
    excerpt: {
      en: "Small plumbing issues can turn into bigger problems — here's what to look out for.",
      ar: "يمكن أن تتحول مشاكل السباكة الصغيرة إلى مشاكل أكبر — إليك ما يجب مراقبته.",
    },
    body: {
      en: [
        { type: "heading", id: "why-it-matters", text: "Why it matters" },
        {
          type: "paragraph",
          text: "Catching plumbing issues early can save time, water, and unnecessary repair costs.",
        },
        { type: "heading", id: "warning-signs", text: "Common warning signs" },
        {
          type: "list",
          items: [
            "Slow-draining sinks or showers",
            "Unexplained increases in your water bill",
            "Water stains on walls or ceilings",
            "Low water pressure",
          ],
        },
      ],
      ar: [
        { type: "heading", id: "why-it-matters", text: "لماذا يهم الأمر" },
        {
          type: "paragraph",
          text: "يمكن أن يوفر اكتشاف مشاكل السباكة مبكرًا الوقت والماء وتكاليف الإصلاح غير الضرورية.",
        },
        { type: "heading", id: "warning-signs", text: "علامات تحذيرية شائعة" },
        {
          type: "list",
          items: [
            "بطء تصريف المياه من الأحواض أو الدش",
            "زيادة غير مبررة في فاتورة المياه",
            "بقع مياه على الجدران أو الأسقف",
            "ضعف ضغط المياه",
          ],
        },
      ],
    },
  },
  {
    slug: "demo-painting-prep-guide",
    category: "general-maintenance",
    isDemo: true,
    publishDate: "2026-07-10",
    serviceSlugs: ["painting"],
    title: {
      en: "Preparing Your Walls Before a Repaint",
      ar: "تجهيز جدرانك قبل إعادة الطلاء",
    },
    excerpt: {
      en: "A little preparation goes a long way toward a clean, long-lasting paint finish.",
      ar: "القليل من التحضير يقطع شوطًا طويلاً نحو طلاء نظيف وطويل الأمد.",
    },
    body: {
      en: [
        { type: "heading", id: "before-you-start", text: "Before you start" },
        {
          type: "paragraph",
          text: "Clearing furniture, covering floors, and cleaning surfaces all help the final result look sharper.",
        },
        { type: "heading", id: "checklist", text: "Preparation checklist" },
        {
          type: "list",
          items: [
            "Move or cover furniture",
            "Clean walls of dust and grease",
            "Fill small cracks or holes",
            "Tape edges and fixtures",
          ],
        },
      ],
      ar: [
        { type: "heading", id: "before-you-start", text: "قبل أن تبدأ" },
        {
          type: "paragraph",
          text: "يساعد إخلاء الأثاث وتغطية الأرضيات وتنظيف الأسطح على ظهور نتيجة نهائية أكثر وضوحًا.",
        },
        { type: "heading", id: "checklist", text: "قائمة التحضير" },
        {
          type: "list",
          items: [
            "نقل الأثاث أو تغطيته",
            "تنظيف الجدران من الغبار والدهون",
            "سد الشقوق أو الثقوب الصغيرة",
            "لصق الحواف والتجهيزات",
          ],
        },
      ],
    },
  },
  {
    slug: "demo-deep-cleaning-checklist",
    category: "cleaning-pest-control",
    isDemo: true,
    publishDate: "2026-07-22",
    serviceSlugs: ["deep-cleaning"],
    title: {
      en: "A Deep Cleaning Checklist for Your Home",
      ar: "قائمة تحقق للتنظيف العميق لمنزلك",
    },
    excerpt: {
      en: "What a thorough deep clean typically covers, room by room.",
      ar: "ما يشمله التنظيف العميق الشامل، غرفة بغرفة.",
    },
    body: {
      en: [
        { type: "heading", id: "kitchen", text: "Kitchen" },
        {
          type: "paragraph",
          text: "Deep cleaning the kitchen covers surfaces, appliances, and hard-to-reach areas behind and under fixtures.",
        },
        { type: "heading", id: "bathroom", text: "Bathroom" },
        {
          type: "paragraph",
          text: "Tiles, grout, and fixtures get focused attention that a routine clean often skips.",
        },
        { type: "heading", id: "living-areas", text: "Living areas" },
        {
          type: "list",
          items: [
            "Baseboards and skirting",
            "Light switches and door handles",
            "Under and behind furniture",
          ],
        },
      ],
      ar: [
        { type: "heading", id: "kitchen", text: "المطبخ" },
        {
          type: "paragraph",
          text: "يشمل التنظيف العميق للمطبخ الأسطح والأجهزة والمناطق التي يصعب الوصول إليها خلف التجهيزات وتحتها.",
        },
        { type: "heading", id: "bathroom", text: "الحمام" },
        {
          type: "paragraph",
          text: "تحظى البلاط والفواصل والتجهيزات باهتمام مركّز غالبًا ما يتم تخطيه في التنظيف الروتيني.",
        },
        { type: "heading", id: "living-areas", text: "مناطق المعيشة" },
        {
          type: "list",
          items: ["حواف الجدران السفلية", "مفاتيح الإضاءة ومقابض الأبواب", "أسفل الأثاث وخلفه"],
        },
      ],
    },
  },
  {
    slug: "demo-pest-control-prevention",
    category: "cleaning-pest-control",
    isDemo: true,
    publishDate: "2026-07-18",
    serviceSlugs: ["pest-control"],
    title: {
      en: "Simple Habits That Help Prevent Pests",
      ar: "عادات بسيطة تساعد في منع الحشرات",
    },
    excerpt: {
      en: "Everyday habits that make your home less inviting to common household pests.",
      ar: "عادات يومية تجعل منزلك أقل جاذبية للحشرات المنزلية الشائعة.",
    },
    body: {
      en: [
        { type: "heading", id: "kitchen-habits", text: "Kitchen habits" },
        {
          type: "paragraph",
          text: "Sealed containers and prompt cleanup after meals reduce the food sources pests look for.",
        },
        { type: "heading", id: "around-the-home", text: "Around the home" },
        {
          type: "list",
          items: [
            "Seal visible gaps around doors and windows",
            "Keep bins covered and emptied regularly",
            "Reduce standing water",
          ],
        },
      ],
      ar: [
        { type: "heading", id: "kitchen-habits", text: "عادات المطبخ" },
        {
          type: "paragraph",
          text: "تقلل الحاويات المغلقة والتنظيف الفوري بعد الوجبات من مصادر الطعام التي تبحث عنها الحشرات.",
        },
        { type: "heading", id: "around-the-home", text: "حول المنزل" },
        {
          type: "list",
          items: [
            "سد الفجوات الظاهرة حول الأبواب والنوافذ",
            "إبقاء صناديق القمامة مغطاة وإفراغها بانتظام",
            "تقليل تجمع المياه الراكدة",
          ],
        },
      ],
    },
  },
  {
    slug: "demo-water-tank-cleaning-why",
    category: "cleaning-pest-control",
    isDemo: true,
    publishDate: "2026-07-05",
    serviceSlugs: ["water-tank-cleaning"],
    title: {
      en: "Why Water Tank Cleaning Matters",
      ar: "لماذا يهم تنظيف خزان المياه",
    },
    excerpt: {
      en: "Clean, well-maintained water tanks support healthier water throughout your home.",
      ar: "خزانات المياه النظيفة والمصانة جيدًا تدعم مياهًا أكثر صحة في جميع أنحاء منزلك.",
    },
    body: {
      en: [
        { type: "heading", id: "overview", text: "Overview" },
        {
          type: "paragraph",
          text: "Water tanks can accumulate sediment and residue over time, even with a well-maintained system.",
        },
        { type: "heading", id: "what-to-expect", text: "What a cleaning visit covers" },
        {
          type: "list",
          items: ["Inspection of the tank interior", "Removal of sediment and residue", "A final rinse and check"],
        },
      ],
      ar: [
        { type: "heading", id: "overview", text: "نظرة عامة" },
        {
          type: "paragraph",
          text: "يمكن أن تتراكم الرواسب والبقايا في خزانات المياه بمرور الوقت، حتى مع نظام مصان جيدًا.",
        },
        { type: "heading", id: "what-to-expect", text: "ما تشمله زيارة التنظيف" },
        {
          type: "list",
          items: ["فحص داخل الخزان", "إزالة الرواسب والبقايا", "شطف نهائي وفحص"],
        },
      ],
    },
  },
  {
    slug: "demo-drain-unblocking-signs",
    category: "drainage-water-protection",
    isDemo: true,
    publishDate: "2026-07-12",
    serviceSlugs: ["drain-unblocking"],
    title: {
      en: "Early Signs of a Blocked Drain",
      ar: "علامات مبكرة لانسداد المجاري",
    },
    excerpt: {
      en: "Catching a slow drain early can prevent a more disruptive blockage later.",
      ar: "اكتشاف بطء التصريف مبكرًا يمكن أن يمنع انسدادًا أكثر إزعاجًا لاحقًا.",
    },
    body: {
      en: [
        { type: "heading", id: "signs", text: "Signs to notice" },
        {
          type: "list",
          items: [
            "Water draining more slowly than usual",
            "Gurgling sounds from pipes",
            "Unpleasant odors near drains",
          ],
        },
        { type: "heading", id: "next-steps", text: "What to do next" },
        {
          type: "paragraph",
          text: "If a drain is slow or making unusual sounds, it's worth having it checked before it blocks completely.",
        },
      ],
      ar: [
        { type: "heading", id: "signs", text: "علامات يجب ملاحظتها" },
        {
          type: "list",
          items: [
            "تصريف المياه بشكل أبطأ من المعتاد",
            "أصوات غرغرة من الأنابيب",
            "روائح كريهة بالقرب من المصارف",
          ],
        },
        { type: "heading", id: "next-steps", text: "ما يجب فعله بعد ذلك" },
        {
          type: "paragraph",
          text: "إذا كان المصرف بطيئًا أو يصدر أصواتًا غير معتادة، فمن الأفضل فحصه قبل أن ينسد بالكامل.",
        },
      ],
    },
  },
  {
    slug: "demo-waterproofing-basics",
    category: "drainage-water-protection",
    isDemo: true,
    publishDate: "2026-07-08",
    serviceSlugs: ["waterproofing", "water-leak-detection"],
    title: {
      en: "Waterproofing Basics for Homeowners",
      ar: "أساسيات العزل المائي لأصحاب المنازل",
    },
    excerpt: {
      en: "A general introduction to why waterproofing matters and where it's commonly needed.",
      ar: "مقدمة عامة حول أهمية العزل المائي والأماكن التي يحتاجها غالبًا.",
    },
    body: {
      en: [
        { type: "heading", id: "why-it-matters", text: "Why it matters" },
        {
          type: "paragraph",
          text: "Protecting a property from water intrusion helps preserve its structure and interior finishes over time.",
        },
        { type: "heading", id: "common-areas", text: "Commonly affected areas" },
        {
          type: "list",
          items: ["Roofs and terraces", "Bathrooms and wet areas", "Basements and foundations"],
        },
      ],
      ar: [
        { type: "heading", id: "why-it-matters", text: "لماذا يهم الأمر" },
        {
          type: "paragraph",
          text: "تساعد حماية العقار من تسرب المياه في الحفاظ على هيكله وتشطيباته الداخلية مع مرور الوقت.",
        },
        { type: "heading", id: "common-areas", text: "المناطق المتأثرة غالبًا" },
        {
          type: "list",
          items: ["الأسطح والشرفات", "الحمامات والمناطق الرطبة", "الطوابق السفلية والأساسات"],
        },
      ],
    },
  },
  {
    slug: "demo-choosing-a-home-services-company",
    category: "company-guides",
    isDemo: true,
    publishDate: "2026-07-25",
    title: {
      en: "What to Look for When Choosing a Home Services Company",
      ar: "ما الذي تبحث عنه عند اختيار شركة خدمات منزلية",
    },
    excerpt: {
      en: "A few practical questions to ask before booking any home maintenance or cleaning service.",
      ar: "بعض الأسئلة العملية التي يجب طرحها قبل حجز أي خدمة صيانة أو تنظيف منزلية.",
    },
    body: {
      en: [
        { type: "heading", id: "communication", text: "Clear communication" },
        {
          type: "paragraph",
          text: "A good provider confirms details with you before any work begins, rather than leaving you guessing.",
        },
        { type: "heading", id: "questions-to-ask", text: "Questions worth asking" },
        {
          type: "list",
          items: [
            "What exactly is included in the visit?",
            "How will you be updated on progress?",
            "Who can you contact with follow-up questions?",
          ],
        },
      ],
      ar: [
        { type: "heading", id: "communication", text: "تواصل واضح" },
        {
          type: "paragraph",
          text: "يقوم مزود الخدمة الجيد بتأكيد التفاصيل معك قبل بدء أي عمل، بدلاً من تركك في حيرة.",
        },
        { type: "heading", id: "questions-to-ask", text: "أسئلة تستحق أن تُطرح" },
        {
          type: "list",
          items: [
            "ما الذي تشمله الزيارة بالضبط؟",
            "كيف سيتم إطلاعك على سير العمل؟",
            "من يمكنك التواصل معه لأي أسئلة لاحقة؟",
          ],
        },
      ],
    },
  },
];

export const BLOG_POSTS: BlogPost[] = [...DEMO_BLOG_POSTS];

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
