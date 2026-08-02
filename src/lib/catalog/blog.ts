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

export type BlogFaq = {
  id: string;
  question: { en: string; ar: string };
  answer: { en: string; ar: string };
};

export type BlogPost = {
  slug: string;
  category: BlogCategory;
  title: { en: string; ar: string };
  excerpt: { en: string; ar: string };
  /** ISO date (e.g. "2026-08-01") — drives sitemap, schema, and the visible publish date. */
  publishDate: string;
  body: { en: ArticleBlock[]; ar: ArticleBlock[] };
  /**
   * Real photography for the card/hero visual (2026-08-06, blog image
   * system pass) — from the same approved `public/brand/images/services/`
   * library already used on service pages, never a new/AI-generated
   * asset. Falls back to the BrandPanel illustration when absent (should
   * not happen for any real, non-demo post going forward).
   */
  image?: { src: string; alt: { en: string; ar: string } };
  /** SEO keywords for <head>, mirroring the pattern already used in service-content.ts. */
  keywords?: { en: string[]; ar: string[] };
  /** Rendered as an FAQ section + FAQPage JSON-LD on the article page when present. */
  faqs?: BlogFaq[];
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
 * First real batch (2026-08-02 content-integration execution pass): 1
 * article per completed major service, toward a 3-per-service target.
 * All copy is authored from general operational/industry knowledge, the
 * same authorship rule already applied to service pages — no invented
 * license, certification, warranty, guarantee, price, or response-time
 * claim anywhere below.
 */
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "signs-your-ac-needs-maintenance",
    image: {
      src: "/brand/images/services/maintenance/ac-maintenance-service-card-afaq-v1.webp",
      alt: { en: "AFAQ AL HAYAT technician servicing a wall-mounted AC unit's filter in a UAE villa", ar: "فني من آفاق الحياة يقوم بصيانة فلتر وحدة تكييف مثبتة على الحائط في فيلا بالإمارات" },
    },
    category: "general-maintenance",
    title: {
      en: "Signs Your AC Needs Maintenance Before Summer",
      ar: "علامات تدل على حاجة مكيفك إلى الصيانة قبل الصيف",
    },
    excerpt: {
      en: "Weak airflow, strange noises, and rising bills are early warning signs. Here's what to check before the peak-heat season puts real strain on your system.",
      ar: "ضعف تدفق الهواء والأصوات الغريبة وارتفاع الفواتير علامات تحذيرية مبكرة. إليك ما يجب فحصه قبل أن يضع موسم الحرارة القصوى ضغطًا حقيقيًا على نظامك.",
    },
    publishDate: "2026-07-29",
    keywords: {
      en: ["AC maintenance signs", "air conditioner not cooling", "AC service UAE"],
      ar: ["علامات صيانة المكيف", "المكيف لا يبرد", "صيانة تكييف الإمارات"],
    },
    serviceSlugs: ["ac-maintenance"],
    faqs: [
      {
        id: "ac-how-often",
        question: {
          en: "How often should an AC unit be serviced?",
          ar: "كم مرة يجب صيانة وحدة التكييف؟",
        },
        answer: {
          en: "This depends on the unit, its usage, and its environment — a technician can recommend a schedule based on a real inspection rather than a fixed rule for every home.",
          ar: "يعتمد ذلك على الوحدة واستخدامها وبيئتها — يمكن للفني اقتراح جدول مناسب بناءً على فحص حقيقي بدلًا من قاعدة ثابتة لكل منزل.",
        },
      },
      {
        id: "ac-warning-signs",
        question: {
          en: "What is the most common early warning sign of an AC problem?",
          ar: "ما هي أكثر العلامات التحذيرية المبكرة شيوعًا لمشكلة في المكيف؟",
        },
        answer: {
          en: "Reduced airflow or noticeably weaker cooling is usually the first sign, often followed by unusual noises or a rise in energy bills.",
          ar: "عادة ما يكون ضعف تدفق الهواء أو انخفاض ملحوظ في التبريد أول علامة، وغالبًا ما تليه أصوات غير معتادة أو ارتفاع في فواتير الطاقة.",
        },
      },
    ],
    body: {
      en: [
        { type: "paragraph", text: "Air conditioning systems in the UAE run for most of the year, which means small issues have less time to surface on their own before the next heat wave puts real load on the unit. Catching the early signs makes the difference between a routine service visit and an unexpected breakdown." },
        { type: "heading", id: "weak-airflow", text: "Weak or uneven airflow" },
        { type: "paragraph", text: "If some rooms cool slower than others, or airflow from the vents feels noticeably weaker than before, this often points to a blocked filter, dust buildup in the coil, or a duct issue — all things a documented inspection identifies before they get worse." },
        { type: "heading", id: "strange-noises", text: "Unusual noises" },
        { type: "paragraph", text: "A healthy AC unit runs quietly. Rattling, buzzing, or grinding sounds usually mean a loose part or a component under strain, and are worth having checked before the unit is running at full capacity every day." },
        { type: "heading", id: "rising-bills", text: "A rising electricity bill with no change in usage" },
        { type: "paragraph", text: "When a unit has to work harder to reach the same temperature — often due to a dirty coil or low refrigerant — energy use climbs even though nothing else in the home has changed." },
        { type: "heading", id: "water-around-unit", text: "Water pooling near the indoor unit" },
        { type: "paragraph", text: "This is usually a blocked condensate drain, which is a simple fix if caught early but can lead to water damage if left." },
        {
          type: "list",
          items: [
            "Check and clean or replace filters regularly.",
            "Keep outdoor units clear of dust, debris, and direct obstruction.",
            "Have coils and drainage inspected before the peak summer months.",
            "Don't wait for a full breakdown to schedule a check — early signs are easier and less disruptive to address.",
          ],
        },
      ],
      ar: [
        { type: "paragraph", text: "تعمل أنظمة تكييف الهواء في الإمارات معظم أيام السنة، ما يعني أن المشكلات الصغيرة لا يكون أمامها وقت طويل لتظهر من تلقائها قبل أن تضع موجة الحرارة التالية ضغطًا حقيقيًا على الوحدة. اكتشاف العلامات المبكرة يصنع الفرق بين زيارة صيانة روتينية وعطل غير متوقع." },
        { type: "heading", id: "weak-airflow", text: "ضعف أو تفاوت تدفق الهواء" },
        { type: "paragraph", text: "إذا كانت بعض الغرف تبرد بشكل أبطأ من غيرها، أو شعرت أن تدفق الهواء من الفتحات أضعف ملحوظًا من ذي قبل، فهذا غالبًا ما يشير إلى فلتر مسدود أو تراكم غبار في الملف أو مشكلة في مجاري الهواء — وكلها أمور يحددها الفحص الموثق قبل أن تتفاقم." },
        { type: "heading", id: "strange-noises", text: "أصوات غير معتادة" },
        { type: "paragraph", text: "تعمل وحدة التكييف السليمة بهدوء. الأصوات الخشخشة أو الطنين أو الطحن عادة ما تعني وجود جزء غير محكم أو مكون يعمل تحت ضغط، ويستحق الفحص قبل أن تعمل الوحدة بكامل طاقتها يوميًا." },
        { type: "heading", id: "rising-bills", text: "ارتفاع فاتورة الكهرباء دون تغيّر في الاستخدام" },
        { type: "paragraph", text: "عندما تضطر الوحدة للعمل بجهد أكبر للوصول إلى نفس درجة الحرارة — غالبًا بسبب ملف متسخ أو انخفاض غاز التبريد — يرتفع استهلاك الطاقة رغم عدم تغيّر أي شيء آخر في المنزل." },
        { type: "heading", id: "water-around-unit", text: "تجمّع المياه بالقرب من الوحدة الداخلية" },
        { type: "paragraph", text: "عادة ما يكون هذا بسبب انسداد مصرف التكثيف، وهو أمر سهل الإصلاح إذا اكتُشف مبكرًا لكنه قد يؤدي إلى أضرار مائية إذا تُرك دون معالجة." },
        {
          type: "list",
          items: [
            "افحص ونظّف أو استبدل الفلاتر بانتظام.",
            "حافظ على خلو الوحدات الخارجية من الغبار والحطام والعوائق المباشرة.",
            "افحص الملفات والصرف قبل أشهر الصيف الحارة.",
            "لا تنتظر حدوث عطل كامل لجدولة فحص — العلامات المبكرة أسهل وأقل تكلفة في المعالجة.",
          ],
        },
      ],
    },
  },
  {
    slug: "how-to-spot-a-hidden-water-leak",
    image: {
      src: "/brand/images/services/maintenance/water-leak-detection-service-card-afaq-v1.webp",
      alt: { en: "AFAQ AL HAYAT technician performing water leak detection in a home", ar: "فني من آفاق الحياة يقوم بالكشف عن تسرب المياه في المنزل" },
    },
    category: "general-maintenance",
    title: {
      en: "How to Spot a Hidden Water Leak at Home",
      ar: "كيف تكتشف تسرب المياه الخفي في منزلك",
    },
    excerpt: {
      en: "A leak behind a wall or under a floor can go unnoticed for weeks. These are the practical signs worth checking regularly.",
      ar: "قد يمر التسرب خلف الجدار أو تحت الأرضية دون ملاحظة لأسابيع. إليك العلامات العملية التي يستحق فحصها بانتظام.",
    },
    publishDate: "2026-07-30",
    keywords: {
      en: ["hidden water leak", "leak detection", "plumbing signs UAE"],
      ar: ["تسرب مياه خفي", "كشف التسريبات", "علامات سباكة الإمارات"],
    },
    serviceSlugs: ["plumbing"],
    faqs: [
      {
        id: "leak-bill",
        question: {
          en: "Can a water leak affect my utility bill before it's visible?",
          ar: "هل يمكن أن يؤثر تسرب المياه على فاتورة المرافق قبل أن يصبح ظاهرًا؟",
        },
        answer: {
          en: "Yes — a sudden, unexplained rise in water usage is one of the most reliable early indicators of a hidden leak, often before any visible sign appears.",
          ar: "نعم — الارتفاع المفاجئ وغير المبرر في استهلاك المياه من أكثر المؤشرات المبكرة موثوقية لوجود تسرب خفي، وغالبًا قبل ظهور أي علامة مرئية.",
        },
      },
    ],
    body: {
      en: [
        { type: "paragraph", text: "Not every leak announces itself with a puddle on the floor. Leaks behind walls, under flooring, or inside ceiling voids can develop slowly, and by the time they're visible, some damage has usually already happened. Knowing the early, less obvious signs helps catch a leak while it's still a simple repair." },
        { type: "heading", id: "water-bill", text: "An unexplained rise in your water bill" },
        { type: "paragraph", text: "If usage climbs without a clear reason — no extra guests, no new appliance, no obvious change in habits — a hidden leak is one of the most common causes." },
        { type: "heading", id: "damp-patches", text: "Damp patches, discoloration, or peeling paint" },
        { type: "paragraph", text: "A patch of wall or ceiling that looks slightly darker, feels damp to the touch, or has paint starting to bubble or peel is a strong sign of moisture building up behind the surface." },
        { type: "heading", id: "musty-smell", text: "A persistent musty smell" },
        { type: "paragraph", text: "A lingering damp or musty odor in one area of the home — even with no visible water — often means moisture is trapped somewhere it shouldn't be." },
        { type: "heading", id: "sound-of-water", text: "The sound of running water when nothing is on" },
        { type: "paragraph", text: "If you can hear water movement in the walls or floor when every tap and appliance is off, it's worth having a plumber trace the source rather than waiting for it to become visible." },
        {
          type: "list",
          items: [
            "Check under sinks and around toilet bases for slow, small drips.",
            "Watch for any unexplained increase in your water bill.",
            "Look for soft or warped flooring, especially near bathrooms and kitchens.",
            "Have a leak detection inspection done if any of these signs appear together.",
          ],
        },
      ],
      ar: [
        { type: "paragraph", text: "لا يُعلن كل تسرب عن نفسه ببركة ماء على الأرضية. يمكن أن تتطور التسريبات خلف الجدران أو تحت الأرضيات أو داخل فراغات السقف ببطء، وبحلول الوقت الذي تصبح فيه مرئية، يكون بعض الضرر قد وقع بالفعل عادة. معرفة العلامات المبكرة والأقل وضوحًا تساعد على اكتشاف التسرب وهو ما يزال إصلاحًا بسيطًا." },
        { type: "heading", id: "water-bill", text: "ارتفاع غير مبرر في فاتورة المياه" },
        { type: "paragraph", text: "إذا ارتفع الاستهلاك دون سبب واضح — لا ضيوف إضافيون، لا جهاز جديد، لا تغيّر ملحوظ في العادات — فإن التسرب الخفي من أكثر الأسباب شيوعًا." },
        { type: "heading", id: "damp-patches", text: "بقع رطبة أو تغيّر لون أو تقشّر الدهان" },
        { type: "paragraph", text: "بقعة على الجدار أو السقف تبدو أغمق قليلًا، أو تشعر بالرطوبة عند لمسها، أو بدأ الدهان فيها بالتقشّر، علامة قوية على تراكم الرطوبة خلف السطح." },
        { type: "heading", id: "musty-smell", text: "رائحة عفنة مستمرة" },
        { type: "paragraph", text: "رائحة رطوبة أو عفن مستمرة في منطقة واحدة من المنزل — حتى دون وجود ماء مرئي — غالبًا ما تعني احتباس الرطوبة في مكان لا ينبغي أن تكون فيه." },
        { type: "heading", id: "sound-of-water", text: "صوت جريان الماء دون تشغيل أي شيء" },
        { type: "paragraph", text: "إذا سمعت حركة ماء داخل الجدران أو الأرضية بينما كل الحنفيات والأجهزة مغلقة، يستحق الأمر الاستعانة بسباك لتتبّع المصدر بدلًا من انتظار ظهوره." },
        {
          type: "list",
          items: [
            "افحص أسفل المغاسل وحول قواعد المراحيض بحثًا عن تسرب بطيء وصغير.",
            "راقب أي ارتفاع غير مبرر في فاتورة المياه.",
            "ابحث عن أرضيات طرية أو متموجة، خاصة قرب الحمامات والمطابخ.",
            "اطلب فحص كشف تسرب إذا ظهرت أكثر من علامة من هذه العلامات معًا.",
          ],
        },
      ],
    },
  },
  {
    slug: "electrical-warning-signs-not-to-ignore",
    image: {
      src: "/brand/images/services/electrical-maintenance-service-card-afaq-v1.webp",
      alt: { en: "AFAQ AL HAYAT electrician inspecting a home electrical fixture", ar: "كهربائي من آفاق الحياة يفحص تجهيزًا كهربائيًا في المنزل" },
    },
    category: "general-maintenance",
    title: {
      en: "Electrical Warning Signs You Shouldn't Ignore at Home",
      ar: "علامات كهربائية تحذيرية يجب ألا تتجاهلها في منزلك",
    },
    excerpt: {
      en: "Flickering lights and warm outlets aren't just minor annoyances — they can point to a real electrical issue. Here's what to watch for.",
      ar: "الإضاءة المتذبذبة والمقابس الدافئة ليست مجرد إزعاج بسيط — قد تشير إلى مشكلة كهربائية حقيقية. إليك ما يجب مراقبته.",
    },
    publishDate: "2026-07-31",
    keywords: {
      en: ["electrical warning signs", "flickering lights", "electrical maintenance UAE"],
      ar: ["علامات كهربائية تحذيرية", "إضاءة متذبذبة", "صيانة كهربائية الإمارات"],
    },
    serviceSlugs: ["electrical-maintenance"],
    faqs: [
      {
        id: "breaker-trips",
        question: {
          en: "Is it normal for a circuit breaker to trip occasionally?",
          ar: "هل من الطبيعي أن ينقطع قاطع الدائرة أحيانًا؟",
        },
        answer: {
          en: "An occasional trip after an overloaded circuit can happen, but a breaker that trips repeatedly or without a clear cause should be inspected rather than simply reset each time.",
          ar: "قد يحدث انقطاع عرضي بعد تحميل زائد على الدائرة، لكن القاطع الذي ينقطع بشكل متكرر أو دون سبب واضح يجب فحصه بدلًا من إعادة تشغيله في كل مرة فقط.",
        },
      },
    ],
    body: {
      en: [
        { type: "paragraph", text: "Electrical issues rarely start as emergencies — they usually give small warnings first. Recognizing them early is mostly a matter of knowing what's normal and what isn't." },
        { type: "heading", id: "flickering-lights", text: "Flickering or dimming lights" },
        { type: "paragraph", text: "Occasional flickering when a large appliance switches on can be normal, but frequent or unexplained flickering across multiple rooms often points to a wiring or connection issue worth inspecting." },
        { type: "heading", id: "warm-outlets", text: "Warm switches or outlets" },
        { type: "paragraph", text: "A switch or outlet that feels warm to the touch — even when nothing is plugged in — should never be treated as normal. It's one of the more direct signs of a wiring problem." },
        { type: "heading", id: "frequent-trips", text: "A breaker that trips often" },
        { type: "paragraph", text: "One trip after plugging in too many devices at once is expected. A breaker that keeps tripping on its own, without an obvious overload, usually means something behind the panel needs a closer look." },
        { type: "heading", id: "burning-smell", text: "A faint burning smell with no clear source" },
        { type: "paragraph", text: "This should always be treated seriously — power to the affected area should be isolated and a professional inspection arranged." },
        {
          type: "list",
          items: [
            "Note which outlets or switches show a problem and when it happens.",
            "Never ignore a burning smell, even a faint one.",
            "Avoid using an outlet or switch that feels warm until it's checked.",
            "Have wiring and the distribution board inspected periodically, especially in older buildings.",
          ],
        },
      ],
      ar: [
        { type: "paragraph", text: "نادرًا ما تبدأ المشكلات الكهربائية كحالات طارئة — فهي عادة ما تعطي تحذيرات صغيرة أولًا. التعرف عليها مبكرًا هو في الغالب مسألة معرفة ما هو طبيعي وما ليس كذلك." },
        { type: "heading", id: "flickering-lights", text: "إضاءة متذبذبة أو خافتة" },
        { type: "paragraph", text: "قد يكون الوميض العرضي عند تشغيل جهاز كبير أمرًا طبيعيًا، لكن الوميض المتكرر أو غير المبرر في عدة غرف غالبًا ما يشير إلى مشكلة في الأسلاك أو التوصيلات تستحق الفحص." },
        { type: "heading", id: "warm-outlets", text: "مفاتيح أو مقابس دافئة" },
        { type: "paragraph", text: "المفتاح أو المقبس الذي يشعر بالدفء عند لمسه — حتى دون توصيل أي جهاز — لا يجب اعتباره أمرًا طبيعيًا أبدًا. إنه من أكثر العلامات المباشرة على وجود مشكلة في الأسلاك." },
        { type: "heading", id: "frequent-trips", text: "قاطع ينقطع بشكل متكرر" },
        { type: "paragraph", text: "انقطاع واحد بعد توصيل عدد كبير من الأجهزة دفعة واحدة أمر متوقع. أما القاطع الذي يستمر في الانقطاع من تلقاء نفسه، دون حمل زائد واضح، فهذا يعني عادة أن هناك ما يحتاج فحصًا أدق خلف اللوحة." },
        { type: "heading", id: "burning-smell", text: "رائحة احتراق خفيفة دون مصدر واضح" },
        { type: "paragraph", text: "يجب دائمًا التعامل مع هذا الأمر بجدية — يتم عزل التيار عن المنطقة المتأثرة ويُطلب فحص احترافي." },
        {
          type: "list",
          items: [
            "لاحظ أي المقابس أو المفاتيح تظهر مشكلة ومتى يحدث ذلك.",
            "لا تتجاهل أبدًا رائحة احتراق حتى لو كانت خفيفة.",
            "تجنّب استخدام مقبس أو مفتاح يشعر بالدفء حتى يتم فحصه.",
            "افحص الأسلاك ولوحة التوزيع بشكل دوري، خاصة في المباني الأقدم.",
          ],
        },
      ],
    },
  },
  {
    slug: "how-to-choose-the-right-paint-finish",
    image: {
      src: "/brand/images/services/maintenance/wall-decoration-ornamentation-maintenance-service-card-afaq-v1.webp",
      alt: { en: "AFAQ AL HAYAT technician applying a decorative wall finish in a luxury interior", ar: "فني من آفاق الحياة يطبق لمسة دهان زخرفية في تصميم داخلي فاخر" },
    },
    category: "general-maintenance",
    title: {
      en: "How to Choose the Right Paint Finish for Each Room",
      ar: "كيف تختار طلاء الدهان المناسب لكل غرفة",
    },
    excerpt: {
      en: "Matte, eggshell, satin, or gloss — the finish matters as much as the color. Here's how to match it to how each room is actually used.",
      ar: "مطفي أو نصف لامع أو ساتان أو لامع — اللمسة النهائية لا تقل أهمية عن اللون. إليك كيفية اختيارها بحسب استخدام كل غرفة فعليًا.",
    },
    publishDate: "2026-08-01",
    keywords: {
      en: ["paint finish guide", "interior painting UAE", "best paint for kitchen"],
      ar: ["دليل اختيار الدهان", "دهان داخلي الإمارات", "أفضل دهان للمطبخ"],
    },
    serviceSlugs: ["painting"],
    faqs: [
      {
        id: "kitchen-finish",
        question: {
          en: "What paint finish works best in a kitchen?",
          ar: "ما هي لمسة الدهان الأنسب للمطبخ؟",
        },
        answer: {
          en: "A satin or semi-gloss finish is generally easier to wipe down than a flat matte finish, which matters in areas exposed to grease, steam, and frequent cleaning.",
          ar: "عادة ما تكون لمسة الساتان أو نصف اللامعة أسهل في المسح مقارنة باللمسة المطفية الكاملة، وهو أمر مهم في المناطق المعرضة للدهون والبخار والتنظيف المتكرر.",
        },
      },
    ],
    body: {
      en: [
        { type: "paragraph", text: "Choosing a paint color gets most of the attention, but the finish — how the surface reflects light and how well it holds up — has just as much impact on how a room looks and how easy it is to maintain." },
        { type: "heading", id: "matte", text: "Matte / flat finish" },
        { type: "paragraph", text: "Matte finishes hide surface imperfections well and give a soft, non-reflective look, making them a common choice for ceilings and low-traffic bedrooms. They're generally harder to clean without marking, so they're less suited to high-touch areas." },
        { type: "heading", id: "eggshell-satin", text: "Eggshell and satin" },
        { type: "paragraph", text: "These sit between matte and gloss — enough sheen to wipe clean more easily, without looking overly shiny. They work well in living rooms, hallways, and other everyday spaces." },
        { type: "heading", id: "semi-gloss-gloss", text: "Semi-gloss and gloss" },
        { type: "paragraph", text: "The most durable and easiest to clean, which is why they're the usual choice for kitchens, bathrooms, and trim/doors — areas exposed to moisture, grease, or frequent contact." },
        {
          type: "list",
          items: [
            "Ceilings and low-traffic bedrooms: matte or flat.",
            "Living rooms and hallways: eggshell or satin.",
            "Kitchens and bathrooms: satin, semi-gloss, or gloss.",
            "Trim, doors, and skirting: semi-gloss or gloss for durability.",
          ],
        },
      ],
      ar: [
        { type: "paragraph", text: "يحظى اختيار لون الدهان بمعظم الاهتمام، لكن اللمسة النهائية — كيفية عكس السطح للضوء ومدى صموده — لها تأثير مماثل على مظهر الغرفة وسهولة صيانتها." },
        { type: "heading", id: "matte", text: "اللمسة المطفية" },
        { type: "paragraph", text: "تخفي اللمسة المطفية عيوب السطح بشكل جيد وتمنح مظهرًا ناعمًا غير عاكس، ما يجعلها خيارًا شائعًا للأسقف وغرف النوم قليلة الاستخدام. عادة ما يكون تنظيفها دون ترك أثر أصعب، لذا فهي أقل ملاءمة للمناطق كثيرة اللمس." },
        { type: "heading", id: "eggshell-satin", text: "لمسة قشر البيض والساتان" },
        { type: "paragraph", text: "تقع هذه اللمسات بين المطفية واللامعة — بلمعان كافٍ يسهّل المسح دون أن تبدو لامعة بشكل مبالغ فيه. تعمل بشكل جيد في غرف المعيشة والممرات والمساحات اليومية الأخرى." },
        { type: "heading", id: "semi-gloss-gloss", text: "نصف اللامعة واللامعة" },
        { type: "paragraph", text: "الأكثر متانة وسهولة في التنظيف، ولهذا فهي الخيار المعتاد للمطابخ والحمامات والإطارات والأبواب — المناطق المعرضة للرطوبة أو الدهون أو اللمس المتكرر." },
        {
          type: "list",
          items: [
            "الأسقف وغرف النوم قليلة الاستخدام: مطفية.",
            "غرف المعيشة والممرات: قشر بيض أو ساتان.",
            "المطابخ والحمامات: ساتان أو نصف لامعة أو لامعة.",
            "الإطارات والأبواب والألواح السفلية: نصف لامعة أو لامعة لمزيد من المتانة.",
          ],
        },
      ],
    },
  },
  {
    slug: "small-home-repairs-that-shouldnt-wait",
    image: {
      src: "/brand/images/services/maintenance/door-lock-repair-maintenance-service-card-afaq-v1.webp",
      alt: { en: "AFAQ AL HAYAT handyman repairing a door lock at a villa entrance", ar: "عامل صيانة من آفاق الحياة يصلح قفل باب عند مدخل فيلا" },
    },
    category: "general-maintenance",
    title: {
      en: "Small Home Repairs That Shouldn't Wait",
      ar: "إصلاحات منزلية صغيرة لا يجب تأجيلها",
    },
    excerpt: {
      en: "A loose hinge or a small crack rarely feels urgent — until it is. These are the small fixes worth handling before they turn into bigger ones.",
      ar: "المفصلة المرتخية أو الشق الصغير نادرًا ما يبدوان عاجلين — حتى يصبحا كذلك. إليك الإصلاحات الصغيرة التي تستحق المعالجة قبل أن تتحول إلى مشكلات أكبر.",
    },
    publishDate: "2026-08-01",
    keywords: {
      en: ["small home repairs", "handyman UAE", "home maintenance checklist"],
      ar: ["إصلاحات منزلية صغيرة", "هاندي مان الإمارات", "قائمة صيانة المنزل"],
    },
    serviceSlugs: ["handyman"],
    faqs: [
      {
        id: "small-repairs-why",
        question: {
          en: "Why do small repairs matter if they're not urgent?",
          ar: "لماذا تهم الإصلاحات الصغيرة إذا لم تكن عاجلة؟",
        },
        answer: {
          en: "Small issues like a loose door hinge or a dripping tap tend to get worse with continued use, and are usually far simpler and less disruptive to fix early than after they've caused further wear.",
          ar: "المشكلات الصغيرة مثل مفصلة الباب المرتخية أو الحنفية المتسربة تميل إلى التفاقم مع الاستخدام المستمر، وعادة ما يكون إصلاحها مبكرًا أبسط بكثير وأقل إزعاجًا من إصلاحها بعد أن تسبب مزيدًا من التآكل.",
        },
      },
    ],
    body: {
      en: [
        { type: "paragraph", text: "It's easy to put off small home repairs — nothing about a squeaky hinge or a loose cabinet handle feels like an emergency. But small, neglected issues tend to compound, and dealing with them early is almost always simpler than dealing with them later." },
        { type: "heading", id: "doors-hinges", text: "Doors, hinges, and locks" },
        { type: "paragraph", text: "A door that sticks, sags, or doesn't latch properly usually means a loose hinge or a frame that's shifted slightly — a quick adjustment now, or a bigger realignment job later." },
        { type: "heading", id: "dripping-taps", text: "Dripping taps and running toilets" },
        { type: "paragraph", text: "Beyond the wasted water, a small drip is often an early sign of a worn washer or seal that will only get harder to seal over time." },
        { type: "heading", id: "loose-fixtures", text: "Loose handles, hinges, and fittings" },
        { type: "paragraph", text: "Cabinet handles, towel rails, and curtain rods that have started to wobble are simple to tighten now, but repeated stress on a loosening fixture can eventually damage the wall or surface it's mounted to." },
        { type: "heading", id: "small-cracks", text: "Small cracks in walls or grout" },
        { type: "paragraph", text: "A hairline crack rarely means structural trouble, but leaving it open lets moisture in, which can turn a cosmetic fix into a larger repair." },
        {
          type: "list",
          items: [
            "Doors that stick or don't close properly.",
            "Dripping taps or a toilet that keeps running.",
            "Loose cabinet handles, towel rails, or curtain rods.",
            "Small cracks in grout or walls, especially in bathrooms.",
            "Squeaking or loose hinges on doors and cabinets.",
          ],
        },
      ],
      ar: [
        { type: "paragraph", text: "من السهل تأجيل الإصلاحات المنزلية الصغيرة — فلا شيء في مفصلة تصدر صريرًا أو مقبض خزانة مرتخٍ يبدو وكأنه حالة طارئة. لكن المشكلات الصغيرة المهملة تميل إلى التراكم، والتعامل معها مبكرًا يكون دائمًا تقريبًا أبسط من التعامل معها لاحقًا." },
        { type: "heading", id: "doors-hinges", text: "الأبواب والمفصلات والأقفال" },
        { type: "paragraph", text: "الباب الذي يعلق أو يترهل أو لا يُغلق بإحكام يعني عادة مفصلة مرتخية أو إطارًا تحرك قليلًا — تعديل سريع الآن، أو إعادة ضبط أكبر لاحقًا." },
        { type: "heading", id: "dripping-taps", text: "الحنفيات المتسربة والمراحيض التي تستمر بالتشغيل" },
        { type: "paragraph", text: "بعيدًا عن هدر المياه، غالبًا ما يكون التسرب الصغير علامة مبكرة على حلقة أو صمام متآكل سيصبح إغلاقه أصعب مع الوقت." },
        { type: "heading", id: "loose-fixtures", text: "المقابض والمفصلات والتجهيزات المرتخية" },
        { type: "paragraph", text: "مقابض الخزائن وحاملات المناشف وقضبان الستائر التي بدأت تتأرجح يسهل إحكامها الآن، لكن الضغط المتكرر على تجهيز مرتخٍ قد يتلف الجدار أو السطح المثبت عليه في النهاية." },
        { type: "heading", id: "small-cracks", text: "شقوق صغيرة في الجدران أو الفواصل" },
        { type: "paragraph", text: "نادرًا ما يعني الشق الشعري مشكلة إنشائية، لكن تركه مفتوحًا يسمح بدخول الرطوبة، ما قد يحوّل إصلاحًا تجميليًا إلى إصلاح أكبر." },
        {
          type: "list",
          items: [
            "الأبواب التي تعلق أو لا تُغلق بشكل صحيح.",
            "الحنفيات المتسربة أو المرحاض الذي يستمر بالتشغيل.",
            "مقابض الخزائن أو حاملات المناشف أو قضبان الستائر المرتخية.",
            "الشقوق الصغيرة في الفواصل أو الجدران، خاصة في الحمامات.",
            "المفصلات المصدرة للصرير أو المرتخية في الأبواب والخزائن.",
          ],
        },
      ],
    },
  },
  {
    slug: "how-often-to-deep-clean-your-home",
    image: {
      src: "/brand/images/services/cleaning/deep-cleaning-service-card-afaq-v1.webp",
      alt: { en: "AFAQ AL HAYAT cleaning team performing a deep clean in a luxury living room", ar: "فريق تنظيف من آفاق الحياة يقوم بتنظيف عميق في غرفة معيشة فاخرة" },
    },
    category: "cleaning-pest-control",
    title: {
      en: "How Often Should You Deep Clean Different Areas of Your Home",
      ar: "كم مرة يجب تنظيف مناطق منزلك تنظيفًا عميقًا",
    },
    excerpt: {
      en: "Regular cleaning keeps a home tidy, but deep cleaning reaches what daily routines miss. Here's a realistic frequency guide, room by room.",
      ar: "التنظيف المنتظم يبقي المنزل مرتبًا، لكن التنظيف العميق يصل إلى ما تفوته الروتينات اليومية. إليك دليل واقعي لمعدل التكرار، غرفة بغرفة.",
    },
    publishDate: "2026-08-02",
    keywords: {
      en: ["deep cleaning frequency", "home cleaning schedule", "deep cleaning UAE"],
      ar: ["تكرار التنظيف العميق", "جدول تنظيف المنزل", "تنظيف عميق الإمارات"],
    },
    serviceSlugs: ["general-cleaning", "deep-cleaning"],
    faqs: [
      {
        id: "deep-clean-difference",
        question: {
          en: "What's the difference between regular cleaning and deep cleaning?",
          ar: "ما الفرق بين التنظيف المنتظم والتنظيف العميق؟",
        },
        answer: {
          en: "Regular cleaning covers everyday surfaces and tidiness, while deep cleaning reaches areas that aren't part of a daily routine — behind appliances, inside vents, grout lines, and similar spots that build up over time.",
          ar: "يغطي التنظيف المنتظم الأسطح اليومية والترتيب، بينما يصل التنظيف العميق إلى المناطق التي ليست جزءًا من الروتين اليومي — خلف الأجهزة وداخل الفتحات وخطوط الفواصل وما شابه من الأماكن التي تتراكم فيها الأوساخ مع الوقت.",
        },
      },
    ],
    body: {
      en: [
        { type: "paragraph", text: "Everyday cleaning keeps a home looking tidy, but it rarely reaches everything. Deep cleaning targets the buildup that accumulates behind appliances, inside vents, and in grout lines — areas that don't get touched in a normal weekly routine." },
        { type: "heading", id: "kitchen", text: "Kitchen" },
        { type: "paragraph", text: "Grease and grime build up faster here than almost anywhere else in the home. A deep clean covering the oven, extractor fan, behind appliances, and cabinet interiors is generally worth doing every few months." },
        { type: "heading", id: "bathrooms", text: "Bathrooms" },
        { type: "paragraph", text: "Grout lines, extractor fans, and behind fittings are the areas regular cleaning tends to miss. Given constant moisture exposure, bathrooms benefit from a deep clean more frequently than most other rooms." },
        { type: "heading", id: "bedrooms-living", text: "Bedrooms and living areas" },
        { type: "paragraph", text: "Mattresses, upholstery, curtains, and carpets trap dust over time even with regular vacuuming. A seasonal deep clean of these surfaces makes a noticeable difference to air quality." },
        { type: "heading", id: "water-tanks", text: "Water tanks" },
        { type: "paragraph", text: "Often overlooked because they're out of sight, water tanks benefit from periodic cleaning to keep sediment and buildup from affecting water quality." },
        {
          type: "list",
          items: [
            "Kitchen deep clean: every 2–3 months.",
            "Bathroom deep clean: monthly to every 2 months.",
            "Upholstery, carpets, and curtains: seasonally.",
            "Water tank cleaning: periodically, as recommended for your tank type.",
            "Move-in / move-out or post-renovation: a full deep clean before use.",
          ],
        },
      ],
      ar: [
        { type: "paragraph", text: "يبقي التنظيف اليومي المنزل مرتبًا في المظهر، لكنه نادرًا ما يصل إلى كل شيء. يستهدف التنظيف العميق التراكمات التي تتجمع خلف الأجهزة وداخل الفتحات وفي خطوط الفواصل — مناطق لا يصلها الروتين الأسبوعي المعتاد." },
        { type: "heading", id: "kitchen", text: "المطبخ" },
        { type: "paragraph", text: "تتراكم الدهون والأوساخ هنا أسرع من أي مكان آخر تقريبًا في المنزل. يستحق التنظيف العميق الذي يشمل الفرن ومروحة الشفط وخلف الأجهزة وداخل الخزائن أن يُجرى كل بضعة أشهر." },
        { type: "heading", id: "bathrooms", text: "الحمامات" },
        { type: "paragraph", text: "خطوط الفواصل ومراوح الشفط وخلف التجهيزات مناطق يميل التنظيف المنتظم إلى تفويتها. نظرًا للتعرض المستمر للرطوبة، تستفيد الحمامات من تنظيف عميق أكثر تكرارًا من معظم الغرف الأخرى." },
        { type: "heading", id: "bedrooms-living", text: "غرف النوم ومناطق المعيشة" },
        { type: "paragraph", text: "تحبس المراتب والمفروشات والستائر والسجاد الغبار مع الوقت حتى مع الكنس المنتظم. يُحدث التنظيف العميق الموسمي لهذه الأسطح فرقًا ملحوظًا في جودة الهواء." },
        { type: "heading", id: "water-tanks", text: "خزانات المياه" },
        { type: "paragraph", text: "غالبًا ما تُهمل لأنها بعيدة عن الأنظار، لكن خزانات المياه تستفيد من التنظيف الدوري للحفاظ على جودة المياه من تأثير الترسبات والتراكمات." },
        {
          type: "list",
          items: [
            "تنظيف المطبخ العميق: كل 2-3 أشهر.",
            "تنظيف الحمام العميق: شهريًا إلى كل شهرين.",
            "المفروشات والسجاد والستائر: بشكل موسمي.",
            "تنظيف خزان المياه: بشكل دوري، حسب الموصى به لنوع الخزان.",
            "الانتقال إلى/من المنزل أو ما بعد التجديد: تنظيف عميق كامل قبل الاستخدام.",
          ],
        },
      ],
    },
  },
  {
    slug: "early-signs-of-a-pest-problem",
    image: {
      src: "/brand/images/services/pest-control/004-cockroach-control-service-card.webp",
      alt: { en: "AFAQ AL HAYAT pest control technician treating a kitchen for cockroach activity", ar: "فني مكافحة حشرات من آفاق الحياة يعالج مطبخًا من نشاط الصراصير" },
    },
    category: "cleaning-pest-control",
    title: {
      en: "Early Signs of a Pest Problem in Your Home",
      ar: "علامات مبكرة على وجود مشكلة آفات في منزلك",
    },
    excerpt: {
      en: "By the time pests are visible during the day, an infestation is often already established. These are the quieter signs worth watching for.",
      ar: "بحلول الوقت الذي تصبح فيه الآفات مرئية خلال النهار، يكون الانتشار غالبًا قد استقر بالفعل. إليك العلامات الأكثر هدوءًا التي يستحق الانتباه لها.",
    },
    publishDate: "2026-08-02",
    keywords: {
      en: ["early signs of pests", "pest control UAE", "how to detect pests early"],
      ar: ["علامات مبكرة للآفات", "مكافحة حشرات الإمارات", "كيفية اكتشاف الآفات مبكرًا"],
    },
    serviceSlugs: ["pest-control"],
    faqs: [
      {
        id: "day-visibility",
        question: {
          en: "Does seeing a pest during the day always mean a serious infestation?",
          ar: "هل رؤية آفة خلال النهار تعني دائمًا انتشارًا خطيرًا؟",
        },
        answer: {
          en: "Not always, but many common household pests are naturally more active at night, so daytime sightings can be a sign that the population has grown large enough to spill into visible hours — worth having inspected either way.",
          ar: "ليس دائمًا، لكن العديد من آفات المنازل الشائعة تكون أكثر نشاطًا ليلًا بطبيعتها، لذا فإن رؤيتها نهارًا قد تكون علامة على أن العدد قد نما بما يكفي ليمتد إلى الساعات المرئية — ويستحق الفحص في كلتا الحالتين.",
        },
      },
    ],
    body: {
      en: [
        { type: "paragraph", text: "Most common household pests are naturally more active at night and stay out of sight during the day, especially in the early stages of an infestation. Recognizing the quieter, indirect signs makes it possible to act before the problem grows." },
        { type: "heading", id: "droppings", text: "Droppings or shed skins" },
        { type: "paragraph", text: "Small droppings near food storage, along skirting boards, or in cabinets — or shed skins from insects like cockroaches — are one of the clearest indirect signs of activity, even without seeing the pest itself." },
        { type: "heading", id: "unusual-smells", text: "An unusual, persistent smell" },
        { type: "paragraph", text: "A musty or oily odor in cabinets or along walls can indicate cockroach activity, while a stale, sweetish smell in a specific area sometimes points to rodents." },
        { type: "heading", id: "damage-signs", text: "Small holes, gnaw marks, or damaged packaging" },
        { type: "paragraph", text: "Chewed food packaging, small holes in skirting or furniture, or fine sawdust-like material near wooden fittings are all signs worth investigating rather than dismissing." },
        { type: "heading", id: "night-activity", text: "Noises at night" },
        { type: "paragraph", text: "Faint scratching or scurrying sounds in walls, ceilings, or under flooring — especially at night when the home is quiet — often means activity that isn't yet visible during the day." },
        {
          type: "list",
          items: [
            "Check under sinks, behind appliances, and in cabinet corners for droppings.",
            "Note any unusual smell that doesn't have an obvious source.",
            "Look for small gnaw marks or holes in food packaging or skirting.",
            "Pay attention to faint sounds at night, not just daytime sightings.",
            "Have an inspection done early — the earlier a pest problem is caught, the simpler it is to treat.",
          ],
        },
      ],
      ar: [
        { type: "paragraph", text: "تكون معظم آفات المنازل الشائعة أكثر نشاطًا ليلًا بطبيعتها وتبقى بعيدة عن الأنظار خلال النهار، خاصة في المراحل المبكرة من الانتشار. التعرف على العلامات الأكثر هدوءًا وغير المباشرة يجعل من الممكن التصرف قبل أن تتفاقم المشكلة." },
        { type: "heading", id: "droppings", text: "فضلات أو جلود متساقطة" },
        { type: "paragraph", text: "الفضلات الصغيرة بالقرب من تخزين الطعام أو على طول الألواح السفلية أو في الخزائن — أو الجلود المتساقطة من حشرات مثل الصراصير — من أوضح العلامات غير المباشرة على النشاط، حتى دون رؤية الآفة نفسها." },
        { type: "heading", id: "unusual-smells", text: "رائحة غير معتادة ومستمرة" },
        { type: "paragraph", text: "قد تشير رائحة عفنة أو زيتية في الخزائن أو على طول الجدران إلى نشاط الصراصير، بينما تشير أحيانًا رائحة راكدة وحلوة قليلًا في منطقة معينة إلى القوارض." },
        { type: "heading", id: "damage-signs", text: "ثقوب صغيرة أو آثار قضم أو تلف في العبوات" },
        { type: "paragraph", text: "عبوات الطعام المقضومة، أو الثقوب الصغيرة في الألواح السفلية أو الأثاث، أو مادة دقيقة شبيهة بنشارة الخشب قرب التجهيزات الخشبية، كلها علامات تستحق التحقق منها بدلًا من تجاهلها." },
        { type: "heading", id: "night-activity", text: "أصوات ليلية" },
        { type: "paragraph", text: "أصوات خدش أو جريان خفيفة في الجدران أو الأسقف أو تحت الأرضية — خاصة ليلًا عندما يكون المنزل هادئًا — غالبًا ما تعني نشاطًا لم يظهر بعد خلال النهار." },
        {
          type: "list",
          items: [
            "افحص أسفل المغاسل وخلف الأجهزة وفي زوايا الخزائن بحثًا عن الفضلات.",
            "لاحظ أي رائحة غير معتادة ليس لها مصدر واضح.",
            "ابحث عن آثار قضم صغيرة أو ثقوب في عبوات الطعام أو الألواح السفلية.",
            "انتبه للأصوات الخفيفة ليلًا، وليس فقط المشاهدات النهارية.",
            "اطلب فحصًا مبكرًا — كلما اكتُشفت مشكلة الآفات مبكرًا، كان علاجها أبسط.",
          ],
        },
      ],
    },
  },
  // ---------------------------------------------------------------------
  // Second batch (2026-08-03, blog target completion pass): 14 more
  // articles — 2 per service — bringing every major service to the
  // 3-article target. Same authorship rule as the first batch: general
  // operational/industry knowledge only, no invented license,
  // certification, warranty, guarantee, price, or response-time claim.
  // ---------------------------------------------------------------------
  {
    slug: "ac-maintenance-checklist-villas-vs-apartments",
    image: {
      src: "/brand/images/services/maintenance/duct-central-ac-maintenance-service-card-afaq-v1.webp",
      alt: { en: "AFAQ AL HAYAT technician inspecting a central ducted AC system", ar: "فني من آفاق الحياة يفحص نظام تكييف مركزي بمجاري هواء" },
    },
    category: "general-maintenance",
    title: {
      en: "AC Maintenance Checklist: Villas vs. Apartments",
      ar: "قائمة صيانة المكيفات: الفلل مقابل الشقق",
    },
    excerpt: {
      en: "A villa's central system and an apartment's split units face different maintenance needs. Here's what to check for each.",
      ar: "يواجه النظام المركزي في الفلل احتياجات صيانة مختلفة عن وحدات السبليت في الشقق. إليك ما يجب فحصه لكل منهما.",
    },
    publishDate: "2026-08-03",
    keywords: {
      en: ["AC maintenance checklist", "villa AC vs apartment AC", "central AC maintenance"],
      ar: ["قائمة صيانة المكيفات", "مكيف الفلل مقابل الشقق", "صيانة التكييف المركزي"],
    },
    serviceSlugs: ["ac-maintenance"],
    faqs: [
      {
        id: "villa-central-check",
        question: {
          en: "What's different about maintaining a central AC system in a villa?",
          ar: "ما الذي يختلف في صيانة نظام التكييف المركزي في الفيلا؟",
        },
        answer: {
          en: "A central system has a larger outdoor unit, longer duct runs, and often multiple zones, so a full check covers ductwork and zone dampers in addition to the same filter, coil, and drainage checks used on a split unit.",
          ar: "يمتلك النظام المركزي وحدة خارجية أكبر ومسارات مجاري هواء أطول وغالبًا مناطق تحكم متعددة، لذا يشمل الفحص الكامل مجاري الهواء وصمامات المناطق إضافة إلى فحوصات الفلاتر والملفات والصرف نفسها المستخدمة في وحدة السبليت." ,
        },
      },
    ],
    body: {
      en: [
        { type: "paragraph", text: "Villas and apartments in the UAE often use different AC setups — a central ducted system in most villas, and one or more split units in apartments — and each type has its own maintenance priorities." },
        { type: "heading", id: "villa-checklist", text: "Villa (central / ducted systems)" },
        { type: "paragraph", text: "In addition to filter and coil cleaning, a villa system benefits from a check of duct connections for leaks, zone dampers for proper operation, and the outdoor condenser unit for clearance from garden debris or dust." },
        { type: "heading", id: "apartment-checklist", text: "Apartment (split units)" },
        { type: "paragraph", text: "Split units are more compact but still need regular filter cleaning, indoor coil checks, and condensate drain clearing — especially important in high-rise units where a blocked drain can affect the unit below." },
        { type: "heading", id: "shared-basics", text: "What both have in common" },
        { type: "paragraph", text: "Regardless of system type, consistent airflow, a clean filter, and a clear condensate drain are the three basics that prevent most avoidable breakdowns." },
        {
          type: "list",
          items: [
            "Villas: check duct connections, zone dampers, and outdoor unit clearance.",
            "Apartments: check split unit filters, indoor coils, and condensate drains.",
            "Both: clean filters regularly and don't ignore reduced airflow.",
            "Have a documented inspection done before peak summer months.",
          ],
        },
      ],
      ar: [
        { type: "paragraph", text: "غالبًا ما تستخدم الفلل والشقق في الإمارات أنظمة تكييف مختلفة — نظام مركزي بمجاري هواء في معظم الفلل، ووحدة أو أكثر من وحدات السبليت في الشقق — ولكل نوع أولويات صيانة خاصة به." },
        { type: "heading", id: "villa-checklist", text: "الفيلا (الأنظمة المركزية بمجاري الهواء)" },
        { type: "paragraph", text: "إضافة إلى تنظيف الفلاتر والملفات، يستفيد نظام الفيلا من فحص توصيلات مجاري الهواء بحثًا عن التسريبات، وصمامات التحكم بالمناطق للتأكد من عملها الصحيح، ووحدة التكثيف الخارجية للتأكد من خلوها من حطام الحديقة أو الغبار." },
        { type: "heading", id: "apartment-checklist", text: "الشقة (وحدات السبليت)" },
        { type: "paragraph", text: "وحدات السبليت أكثر إحكامًا لكنها لا تزال تحتاج إلى تنظيف الفلاتر بانتظام وفحص الملفات الداخلية وتنظيف مصرف التكثيف — وهو أمر مهم بشكل خاص في الوحدات السكنية العالية حيث قد يؤثر المصرف المسدود على الوحدة أسفلها." },
        { type: "heading", id: "shared-basics", text: "ما يشترك فيه النوعان" },
        { type: "paragraph", text: "بغض النظر عن نوع النظام، فإن تدفق الهواء المستقر والفلتر النظيف ومصرف التكثيف الخالي من الانسداد هي الأساسيات الثلاثة التي تمنع معظم الأعطال التي يمكن تجنبها." },
        {
          type: "list",
          items: [
            "الفلل: افحص توصيلات مجاري الهواء وصمامات المناطق وخلو الوحدة الخارجية من العوائق.",
            "الشقق: افحص فلاتر وحدة السبليت والملفات الداخلية ومصارف التكثيف.",
            "كلاهما: نظف الفلاتر بانتظام ولا تتجاهل ضعف تدفق الهواء.",
            "اطلب فحصًا موثقًا قبل أشهر الصيف الحارة.",
          ],
        },
      ],
    },
  },
  {
    slug: "why-your-ac-smells-bad",
    image: {
      src: "/brand/images/services/cleaning/ac-cleaning-service-card-afaq-v1.webp",
      alt: { en: "AFAQ AL HAYAT technician cleaning an AC unit to resolve odor and airflow issues", ar: "فني من آفاق الحياة ينظف وحدة تكييف لمعالجة الروائح ومشاكل تدفق الهواء" },
    },
    category: "general-maintenance",
    title: {
      en: "Why Your AC Smells Bad and What It Means",
      ar: "لماذا تفوح من مكيفك رائحة كريهة وماذا يعني ذلك",
    },
    excerpt: {
      en: "A musty, sour, or burning smell from your AC is never just cosmetic. Here's what each type of smell usually points to.",
      ar: "الرائحة العفنة أو الحامضة أو الاحتراق المنبعثة من المكيف ليست مجرد مسألة تجميلية أبدًا. إليك ما تشير إليه كل رائحة عادة.",
    },
    publishDate: "2026-08-03",
    keywords: {
      en: ["AC smells bad", "musty AC smell", "AC burning smell"],
      ar: ["رائحة المكيف كريهة", "رائحة عفنة من المكيف", "رائحة احتراق من المكيف"],
    },
    serviceSlugs: ["ac-maintenance"],
    faqs: [
      {
        id: "musty-vs-burning",
        question: {
          en: "Is a musty smell as serious as a burning smell?",
          ar: "هل الرائحة العفنة خطيرة بقدر رائحة الاحتراق؟",
        },
        answer: {
          en: "They point to different issues — a musty smell usually means moisture or mold buildup, while a burning smell can indicate an electrical or component issue and generally deserves faster attention.",
          ar: "تشير كل منهما إلى مشكلة مختلفة — الرائحة العفنة تعني عادة تراكم الرطوبة أو العفن، بينما قد تشير رائحة الاحتراق إلى مشكلة كهربائية أو في أحد المكونات وتستحق عمومًا اهتمامًا أسرع.",
        },
      },
    ],
    body: {
      en: [
        { type: "paragraph", text: "A working AC unit shouldn't produce any noticeable smell. When one appears, it's the system telling you something specific — the type of smell is actually a useful diagnostic clue." },
        { type: "heading", id: "musty-smell", text: "A musty or damp smell" },
        { type: "paragraph", text: "This usually points to moisture buildup or mold growth on the coil or in the drain pan, common in humid climates where condensation doesn't fully drain away between cycles." },
        { type: "heading", id: "burning-smell", text: "A burning or electrical smell" },
        { type: "paragraph", text: "This should be treated as urgent — turn the unit off and have it inspected, since it can point to a motor, wiring, or component issue." },
        { type: "heading", id: "sour-smell", text: "A sour or rotten smell" },
        { type: "paragraph", text: "Often linked to bacterial growth in condensate that has been sitting rather than draining properly, which is a maintenance issue rather than an emergency but shouldn't be left indefinitely." },
        {
          type: "list",
          items: [
            "Musty/damp: usually mold or moisture buildup — schedule a cleaning.",
            "Burning/electrical: turn off the unit and get it inspected promptly.",
            "Sour/rotten: usually stagnant condensate — check and clear the drain.",
            "Any smell that returns after cleaning deserves a closer inspection.",
          ],
        },
      ],
      ar: [
        { type: "paragraph", text: "لا ينبغي أن تنتج وحدة التكييف العاملة بشكل سليم أي رائحة ملحوظة. عندما تظهر رائحة، فإن النظام يخبرك بشيء محدد — ونوع الرائحة في الواقع دليل تشخيصي مفيد." },
        { type: "heading", id: "musty-smell", text: "رائحة عفنة أو رطبة" },
        { type: "paragraph", text: "تشير هذه عادة إلى تراكم الرطوبة أو نمو العفن على الملف أو في صينية الصرف، وهو أمر شائع في المناخات الرطبة حيث لا يتم تصريف التكثيف بالكامل بين الدورات." },
        { type: "heading", id: "burning-smell", text: "رائحة احتراق أو كهربائية" },
        { type: "paragraph", text: "يجب التعامل مع هذه الرائحة كأمر عاجل — أوقف تشغيل الوحدة واطلب فحصها، لأنها قد تشير إلى مشكلة في المحرك أو الأسلاك أو أحد المكونات." },
        { type: "heading", id: "sour-smell", text: "رائحة حامضة أو عفنة" },
        { type: "paragraph", text: "غالبًا ما ترتبط بنمو بكتيري في تكثيف راكد لم يُصرَّف بشكل صحيح، وهي مشكلة صيانة أكثر منها حالة طارئة، لكن لا ينبغي تركها دون حل." },
        {
          type: "list",
          items: [
            "عفنة/رطبة: عادة عفن أو تراكم رطوبة — اجدول تنظيفًا.",
            "احتراق/كهربائية: أوقف تشغيل الوحدة واطلب فحصها فورًا.",
            "حامضة/عفنة: عادة تكثيف راكد — افحص المصرف ونظفه.",
            "أي رائحة تعود بعد التنظيف تستحق فحصًا أدق.",
          ],
        },
      ],
    },
  },
  {
    slug: "common-causes-of-low-water-pressure",
    image: {
      src: "/brand/images/services/maintenance/plumbing-maintenance-service-card-afaq-v1.webp",
      alt: { en: "AFAQ AL HAYAT plumber repairing pipework under a bathroom sink", ar: "سباك من آفاق الحياة يصلح مواسير أسفل مغسلة الحمام" },
    },
    category: "general-maintenance",
    title: {
      en: "Common Causes of Low Water Pressure at Home",
      ar: "الأسباب الشائعة لضعف ضغط المياه في المنزل",
    },
    excerpt: {
      en: "Weak flow from a tap or shower has a handful of common causes. Here's how to narrow down what's actually happening.",
      ar: "لضعف تدفق المياه من الحنفية أو الدش عدد قليل من الأسباب الشائعة. إليك كيفية تحديد ما يحدث فعليًا.",
    },
    publishDate: "2026-08-04",
    keywords: {
      en: ["low water pressure causes", "weak water flow", "plumbing pressure issue UAE"],
      ar: ["أسباب ضعف ضغط المياه", "ضعف تدفق المياه", "مشكلة ضغط السباكة الإمارات"],
    },
    serviceSlugs: ["plumbing"],
    faqs: [
      {
        id: "one-tap-or-whole-house",
        question: {
          en: "Does it matter if only one tap is affected or the whole house?",
          ar: "هل يهم إذا كانت حنفية واحدة فقط متأثرة أم المنزل بأكمله؟",
        },
        answer: {
          en: "Yes — a single affected fixture usually points to a localized blockage or a faulty part at that fixture, while pressure loss across the whole home points to something further upstream, such as the main supply line or a shared valve.",
          ar: "نعم — الحنفية الواحدة المتأثرة تشير عادة إلى انسداد موضعي أو جزء معطل عند ذلك التجهيز، بينما يشير فقدان الضغط في المنزل بأكمله إلى شيء أبعد في المصدر، مثل خط التغذية الرئيسي أو صمام مشترك.",
        },
      },
    ],
    body: {
      en: [
        { type: "paragraph", text: "Low water pressure is one of the more common plumbing complaints, and while it can feel like a mystery, the cause is usually one of a few well-known issues." },
        { type: "heading", id: "mineral-buildup", text: "Mineral buildup in fixtures" },
        { type: "paragraph", text: "Showerheads and tap aerators can accumulate mineral deposits over time, gradually restricting flow — often the simplest cause to check and fix." },
        { type: "heading", id: "hidden-leak", text: "A hidden leak" },
        { type: "paragraph", text: "A leak elsewhere in the system reduces the pressure available at the fixture — this is one of the reasons a sudden, unexplained pressure drop is worth investigating rather than ignoring." },
        { type: "heading", id: "valve-or-supply-issue", text: "A partially closed valve or supply issue" },
        { type: "paragraph", text: "If pressure is low throughout the home, the main shutoff valve or the building's supply line is worth checking before assuming a fixture-level problem." },
        {
          type: "list",
          items: [
            "Check if the issue affects one fixture or the whole home — this narrows the likely cause.",
            "Clean or replace showerhead and tap aerators as a first, simple step.",
            "Watch for other signs of a leak, such as unexplained water bill increases.",
            "Have a plumber trace the source if the cause isn't obvious from the above.",
          ],
        },
      ],
      ar: [
        { type: "paragraph", text: "يُعد ضعف ضغط المياه من أكثر شكاوى السباكة شيوعًا، ورغم أنه قد يبدو لغزًا، فإن السبب عادة ما يكون أحد عدد قليل من المشكلات المعروفة." },
        { type: "heading", id: "mineral-buildup", text: "تراكم المعادن في التجهيزات" },
        { type: "paragraph", text: "يمكن أن تتراكم الرواسب المعدنية في رؤوس الدش وفلاتر الحنفيات مع الوقت، ما يحد تدريجيًا من التدفق — وغالبًا ما يكون هذا أبسط سبب يمكن فحصه وإصلاحه." },
        { type: "heading", id: "hidden-leak", text: "تسرب خفي" },
        { type: "paragraph", text: "يقلل التسرب في مكان آخر من النظام من الضغط المتاح عند التجهيز — وهذا أحد أسباب استحقاق انخفاض الضغط المفاجئ وغير المبرر للتحقيق بدلًا من تجاهله." },
        { type: "heading", id: "valve-or-supply-issue", text: "صمام مغلق جزئيًا أو مشكلة في التغذية" },
        { type: "paragraph", text: "إذا كان الضغط ضعيفًا في جميع أنحاء المنزل، يستحق فحص صمام الإغلاق الرئيسي أو خط تغذية المبنى قبل افتراض مشكلة على مستوى التجهيز." },
        {
          type: "list",
          items: [
            "افحص إن كانت المشكلة تؤثر على تجهيز واحد أم المنزل بأكمله — هذا يضيّق السبب المحتمل.",
            "نظّف أو استبدل رؤوس الدش وفلاتر الحنفيات كخطوة أولى بسيطة.",
            "راقب علامات التسرب الأخرى، مثل الارتفاع غير المبرر في فاتورة المياه.",
            "استعن بسباك لتتبّع المصدر إذا لم يكن السبب واضحًا مما سبق.",
          ],
        },
      ],
    },
  },
  {
    slug: "what-to-do-when-a-pipe-bursts",
    image: {
      src: "/brand/images/services/maintenance/plumbing-repair-service-card-afaq-v1.webp",
      alt: { en: "AFAQ AL HAYAT plumber carrying out an emergency pipe repair", ar: "سباك من آفاق الحياة يجري إصلاحًا عاجلاً لماسورة" },
    },
    category: "general-maintenance",
    title: {
      en: "What to Do When a Pipe Bursts at Home",
      ar: "ماذا تفعل عند انفجار أحد المواسير في المنزل",
    },
    excerpt: {
      en: "A burst pipe is one of the few plumbing issues that calls for immediate action. Here's what to do in the first few minutes.",
      ar: "انفجار الماسورة من مشكلات السباكة القليلة التي تستدعي تصرفًا فوريًا. إليك ما يجب فعله في الدقائق الأولى.",
    },
    publishDate: "2026-08-04",
    keywords: {
      en: ["burst pipe what to do", "pipe burst emergency steps", "water leak emergency UAE"],
      ar: ["ماسورة منفجرة ماذا أفعل", "خطوات طارئة لانفجار الماسورة", "طوارئ تسرب المياه الإمارات"],
    },
    serviceSlugs: ["plumbing"],
    faqs: [
      {
        id: "first-step",
        question: {
          en: "What's the very first thing to do when a pipe bursts?",
          ar: "ما هو أول شيء يجب فعله عند انفجار ماسورة؟",
        },
        answer: {
          en: "Shut off the main water supply valve immediately — stopping the source of water is more urgent than cleaning up, since every minute the supply stays on adds to the damage.",
          ar: "أغلق صمام تغذية المياه الرئيسي فورًا — إيقاف مصدر المياه أهم وأعجل من التنظيف، لأن كل دقيقة تبقى فيها التغذية مفتوحة تزيد من الضرر.",
        },
      },
    ],
    body: {
      en: [
        { type: "paragraph", text: "Most plumbing issues can wait for a scheduled visit. A burst pipe isn't one of them — the priority is stopping the water first, then addressing everything else." },
        { type: "heading", id: "shut-off-water", text: "Shut off the main water supply" },
        { type: "paragraph", text: "Locate and close the main shutoff valve as the first step — this stops the source rather than just managing the spill, and every household should know where this valve is before an emergency happens." },
        { type: "heading", id: "cut-power-if-needed", text: "Cut power to affected areas if water is near electrical outlets" },
        { type: "paragraph", text: "If water is pooling near outlets, switches, or appliances, switch off power to that area at the distribution board rather than risk contact with water." },
        { type: "heading", id: "limit-damage", text: "Limit damage while waiting for help" },
        { type: "paragraph", text: "Move furniture and valuables away from the affected area, and use towels or a wet vacuum to reduce standing water while a professional is on the way." },
        {
          type: "list",
          items: [
            "Shut off the main water valve immediately.",
            "Cut power to any area where water is near electrical points.",
            "Move furniture and valuables out of the affected area.",
            "Photograph the damage for your own records before cleanup begins.",
            "Call a plumber as soon as the water source is stopped.",
          ],
        },
      ],
      ar: [
        { type: "paragraph", text: "يمكن أن تنتظر معظم مشكلات السباكة زيارة مجدولة. انفجار الماسورة ليس واحدة منها — الأولوية هي إيقاف المياه أولًا، ثم معالجة كل شيء آخر." },
        { type: "heading", id: "shut-off-water", text: "أغلق تغذية المياه الرئيسية" },
        { type: "paragraph", text: "حدد وأغلق صمام الإغلاق الرئيسي كخطوة أولى — هذا يوقف المصدر بدلًا من الاكتفاء بمعالجة الانسكاب، ويجب أن يعرف كل منزل مكان هذا الصمام قبل حدوث أي طارئ." },
        { type: "heading", id: "cut-power-if-needed", text: "افصل الكهرباء عن المناطق المتأثرة إذا كانت المياه قريبة من المقابس" },
        { type: "paragraph", text: "إذا كانت المياه تتجمع بالقرب من المقابس أو المفاتيح أو الأجهزة، افصل الكهرباء عن تلك المنطقة من لوحة التوزيع بدلًا من المخاطرة بملامسة الماء." },
        { type: "heading", id: "limit-damage", text: "قلّل الضرر أثناء انتظار المساعدة" },
        { type: "paragraph", text: "انقل الأثاث والأشياء الثمينة بعيدًا عن المنطقة المتأثرة، واستخدم المناشف أو مكنسة سحب المياه لتقليل تجمع المياه أثناء تنقل الفني إلى الموقع." },
        {
          type: "list",
          items: [
            "أغلق صمام المياه الرئيسي فورًا.",
            "افصل الكهرباء عن أي منطقة تكون فيها المياه قريبة من نقاط كهربائية.",
            "انقل الأثاث والأشياء الثمينة خارج المنطقة المتأثرة.",
            "صوّر الضرر لسجلاتك الخاصة قبل بدء التنظيف.",
            "اتصل بسباك بمجرد إيقاف مصدر المياه.",
          ],
        },
      ],
    },
  },
  {
    slug: "childproofing-electrical-outlets-safely",
    image: {
      src: "/brand/images/services/maintenance/electrical-repair-maintenance-service-card-afaq-v1.webp",
      alt: { en: "AFAQ AL HAYAT electrician repairing an electrical outlet safely", ar: "كهربائي من آفاق الحياة يصلح مقبسًا كهربائيًا بأمان" },
    },
    category: "general-maintenance",
    title: {
      en: "How to Childproof Your Home's Electrical Outlets Safely",
      ar: "كيف تحمي مقابس منزلك الكهربائية من الأطفال بأمان",
    },
    excerpt: {
      en: "Childproofing outlets is one of the simplest home-safety upgrades. Here's what actually works, and what to avoid.",
      ar: "حماية المقابس من الأطفال من أبسط تحسينات السلامة المنزلية. إليك ما يجدي فعليًا وما يجب تجنبه.",
    },
    publishDate: "2026-08-05",
    keywords: {
      en: ["childproof electrical outlets", "home electrical safety", "outlet covers UAE"],
      ar: ["حماية المقابس من الأطفال", "السلامة الكهربائية المنزلية", "أغطية المقابس الإمارات"],
    },
    serviceSlugs: ["electrical-maintenance"],
    faqs: [
      {
        id: "plastic-caps-enough",
        question: {
          en: "Are plastic outlet caps enough on their own?",
          ar: "هل تكفي أغطية المقابس البلاستيكية بمفردها؟",
        },
        answer: {
          en: "They help, but they're easy for a curious toddler to remove and are best combined with tamper-resistant outlets or sliding-shutter covers for more reliable protection.",
          ar: "هي مفيدة، لكن يسهل على الطفل الفضولي إزالتها، ويُفضَّل الجمع بينها وبين مقابس مقاومة للعبث أو أغطية بمصاريع منزلقة لحماية أكثر موثوقية.",
        },
      },
    ],
    body: {
      en: [
        { type: "paragraph", text: "Electrical outlets are one of the most common curiosity points for young children, and childproofing them properly is a simple, worthwhile safety step." },
        { type: "heading", id: "tamper-resistant", text: "Tamper-resistant outlets" },
        { type: "paragraph", text: "These have an internal shutter mechanism that only opens when both prongs of a plug are inserted evenly, making them far more effective than a simple plastic cap that can be pried off." },
        { type: "heading", id: "sliding-covers", text: "Sliding-shutter covers" },
        { type: "paragraph", text: "For outlets that can't be replaced immediately, a sliding cover plate is a stronger option than loose plug-in caps, which small children can often remove." },
        { type: "heading", id: "cord-safety", text: "Don't forget cords and power strips" },
        { type: "paragraph", text: "Childproofing shouldn't stop at the outlet itself — loose cords and accessible power strips are just as worth securing or routing out of reach." },
        {
          type: "list",
          items: [
            "Prioritize tamper-resistant outlets in rooms where young children spend time.",
            "Use sliding-shutter covers rather than loose plastic caps where replacement isn't immediate.",
            "Secure loose cords and keep power strips out of easy reach.",
            "Have any outlet that feels loose or warm inspected — that's a separate safety issue, not just a childproofing one.",
          ],
        },
      ],
      ar: [
        { type: "paragraph", text: "تُعد المقابس الكهربائية من أكثر نقاط الفضول شيوعًا لدى الأطفال الصغار، وحمايتها بشكل صحيح خطوة سلامة بسيطة وتستحق العناء." },
        { type: "heading", id: "tamper-resistant", text: "المقابس المقاومة للعبث" },
        { type: "paragraph", text: "تحتوي هذه المقابس على آلية مصراع داخلية لا تُفتح إلا عند إدخال طرفي القابس معًا بالتساوي، ما يجعلها أكثر فعالية بكثير من الغطاء البلاستيكي البسيط الذي يمكن نزعه." },
        { type: "heading", id: "sliding-covers", text: "أغطية المصاريع المنزلقة" },
        { type: "paragraph", text: "بالنسبة للمقابس التي لا يمكن استبدالها فورًا، تُعد لوحة الغطاء المنزلق خيارًا أقوى من الأغطية البلاستيكية السائبة التي غالبًا ما يستطيع الأطفال الصغار إزالتها." },
        { type: "heading", id: "cord-safety", text: "لا تنسَ الأسلاك ومشتركات الكهرباء" },
        { type: "paragraph", text: "لا ينبغي أن تتوقف حماية الأطفال عند المقبس نفسه — فالأسلاك السائبة ومشتركات الكهرباء المتاحة تستحق التأمين أو التوجيه بعيدًا عن المتناول بنفس القدر." },
        {
          type: "list",
          items: [
            "أعطِ الأولوية للمقابس المقاومة للعبث في الغرف التي يقضي فيها الأطفال الصغار وقتهم.",
            "استخدم أغطية المصاريع المنزلقة بدلًا من الأغطية البلاستيكية السائبة حيث لا يمكن الاستبدال فورًا.",
            "أمّن الأسلاك السائبة وأبقِ مشتركات الكهرباء بعيدة عن المتناول السهل.",
            "اطلب فحص أي مقبس يشعر بالارتخاء أو الدفء — فهذه مسألة سلامة منفصلة، وليست مجرد حماية للأطفال.",
          ],
        },
      ],
    },
  },
  {
    slug: "understanding-your-distribution-board",
    image: {
      src: "/brand/images/services/maintenance/smart-home-system-installation-maintenance-service-card-afaq-v1.webp",
      alt: { en: "AFAQ AL HAYAT technician working on a home's smart electrical control panel", ar: "فني من آفاق الحياة يعمل على لوحة التحكم الكهربائية الذكية في المنزل" },
    },
    category: "general-maintenance",
    title: {
      en: "Understanding Your Home's Distribution Board",
      ar: "فهم لوحة توزيع الكهرباء في منزلك",
    },
    excerpt: {
      en: "The distribution board controls power to your entire home, but most homeowners never look inside it. Here's what it does and when it needs attention.",
      ar: "لوحة التوزيع تتحكم في الكهرباء لمنزلك بأكمله، لكن معظم أصحاب المنازل لا ينظرون داخلها أبدًا. إليك ما تفعله ومتى تحتاج إلى اهتمام.",
    },
    publishDate: "2026-08-05",
    keywords: {
      en: ["distribution board guide", "circuit breaker panel", "home electrical panel UAE"],
      ar: ["دليل لوحة التوزيع", "لوحة قواطع الدائرة", "لوحة الكهرباء المنزلية الإمارات"],
    },
    serviceSlugs: ["electrical-maintenance"],
    faqs: [
      {
        id: "labeling-important",
        question: {
          en: "Why does it matter if the breakers are labeled?",
          ar: "لماذا يهم أن تكون القواطع مُصنَّفة بوضوح؟",
        },
        answer: {
          en: "Clear labeling lets you or a technician quickly isolate power to a specific area during an emergency or repair, instead of guessing or shutting off the whole home unnecessarily.",
          ar: "يتيح التصنيف الواضح لك أو للفني عزل الكهرباء عن منطقة محددة بسرعة أثناء حالة طارئة أو إصلاح، بدلًا من التخمين أو إغلاق المنزل بأكمله دون داعٍ.",
        },
      },
    ],
    body: {
      en: [
        { type: "paragraph", text: "The distribution board — sometimes called the breaker panel — is the point where incoming power splits into the individual circuits that run through your home. Understanding the basics helps you know when something needs a professional look." },
        { type: "heading", id: "what-it-does", text: "What it actually does" },
        { type: "paragraph", text: "Each breaker in the panel protects one circuit, automatically cutting power if that circuit draws more current than it's rated for — this is a safety feature, not a fault, when it trips occasionally." },
        { type: "heading", id: "when-to-worry", text: "When it needs attention" },
        { type: "paragraph", text: "A breaker that trips repeatedly, a panel that feels warm to the touch, or a visible burn mark or smell near the panel are all signs that call for an inspection rather than repeated resetting." },
        { type: "heading", id: "labeling", text: "Why labeling matters" },
        { type: "paragraph", text: "A well-labeled panel — showing which breaker controls which room or appliance — makes it much faster to isolate power safely during a repair or emergency." },
        {
          type: "list",
          items: [
            "Know where your distribution board is and how to reach it quickly.",
            "Don't ignore a breaker that trips more than occasionally.",
            "Have a warm panel, burn smell, or visible damage inspected immediately.",
            "Ask for the panel to be labeled clearly if it isn't already.",
          ],
        },
      ],
      ar: [
        { type: "paragraph", text: "لوحة التوزيع — وتُعرف أحيانًا بلوحة القواطع — هي النقطة التي تنقسم فيها الكهرباء الواردة إلى الدوائر الفردية التي تمتد عبر منزلك. فهم الأساسيات يساعدك على معرفة متى يحتاج شيء ما إلى نظرة احترافية." },
        { type: "heading", id: "what-it-does", text: "ما الذي تفعله فعليًا" },
        { type: "paragraph", text: "يحمي كل قاطع في اللوحة دائرة واحدة، ويقطع الكهرباء تلقائيًا إذا سحبت تلك الدائرة تيارًا أكبر من قدرتها المصنَّفة — وهذه ميزة سلامة وليست عطلًا عندما تنقطع بشكل عرضي." },
        { type: "heading", id: "when-to-worry", text: "متى تحتاج إلى اهتمام" },
        { type: "paragraph", text: "القاطع الذي ينقطع بشكل متكرر، أو اللوحة التي تشعر بالدفء عند لمسها، أو وجود علامة احتراق مرئية أو رائحة بالقرب من اللوحة، كلها علامات تستدعي الفحص بدلًا من إعادة التشغيل المتكررة." },
        { type: "heading", id: "labeling", text: "لماذا يهم التصنيف" },
        { type: "paragraph", text: "اللوحة المُصنَّفة جيدًا — التي توضح أي قاطع يتحكم في أي غرفة أو جهاز — تجعل عزل الكهرباء بأمان أثناء الإصلاح أو الطوارئ أسرع بكثير." },
        {
          type: "list",
          items: [
            "اعرف مكان لوحة التوزيع لديك وكيفية الوصول إليها بسرعة.",
            "لا تتجاهل قاطعًا ينقطع أكثر من مرة عرضية.",
            "اطلب فحص اللوحة الدافئة أو رائحة الاحتراق أو أي ضرر مرئي فورًا.",
            "اطلب تصنيف اللوحة بوضوح إذا لم تكن كذلك بالفعل.",
          ],
        },
      ],
    },
  },
  {
    slug: "how-to-prepare-a-room-for-painting",
    image: {
      src: "/brand/images/services/maintenance/painting-wall-painting-maintenance-service-card-afaq-v1.webp",
      alt: { en: "AFAQ AL HAYAT technician painting an interior wall", ar: "فني من آفاق الحياة يدهن جدارًا داخليًا" },
    },
    category: "general-maintenance",
    title: {
      en: "How to Prepare a Room Before a Professional Paint Job",
      ar: "كيف تجهّز الغرفة قبل أعمال الدهان الاحترافية",
    },
    excerpt: {
      en: "A little preparation before the painters arrive makes the job faster and the result cleaner. Here's a simple pre-paint checklist.",
      ar: "القليل من التجهيز قبل وصول فريق الدهان يجعل العمل أسرع والنتيجة أنظف. إليك قائمة بسيطة للتجهيز قبل الدهان.",
    },
    publishDate: "2026-08-06",
    keywords: {
      en: ["prepare room for painting", "pre-paint checklist", "painting service UAE"],
      ar: ["تجهيز الغرفة للدهان", "قائمة التحضير قبل الدهان", "خدمة الدهان الإمارات"],
    },
    serviceSlugs: ["painting"],
    faqs: [
      {
        id: "furniture-stay",
        question: {
          en: "Do I need to remove all furniture from the room?",
          ar: "هل يجب إزالة كل الأثاث من الغرفة؟",
        },
        answer: {
          en: "Not always — large furniture can usually be moved to the center of the room and covered, but clearing what you can beforehand speeds up the job and reduces the chance of accidental damage.",
          ar: "ليس دائمًا — يمكن عادة نقل الأثاث الكبير إلى وسط الغرفة وتغطيته، لكن إخلاء ما يمكن إخلاؤه مسبقًا يسرّع العمل ويقلل من احتمال حدوث ضرر عرضي.",
        },
      },
    ],
    body: {
      en: [
        { type: "paragraph", text: "Painting crews can work faster and more cleanly when a room is prepared in advance. None of the steps below take long, but they make a noticeable difference." },
        { type: "heading", id: "clear-and-cover", text: "Clear and cover" },
        { type: "paragraph", text: "Remove small items and wall décor, and move furniture away from the walls or to the center of the room. Anything that can't be moved should be covered." },
        { type: "heading", id: "protect-fixtures", text: "Protect fixtures and floors" },
        { type: "paragraph", text: "Light switch and outlet covers, door handles, and flooring near the walls benefit from simple protection to avoid accidental marks." },
        { type: "heading", id: "note-repairs", text: "Point out any wall damage in advance" },
        { type: "paragraph", text: "Cracks, nail holes, or uneven patches are easier to address before painting begins — mentioning them ahead of time lets the crew plan for proper surface prep." },
        {
          type: "list",
          items: [
            "Remove small items, wall décor, and curtains where possible.",
            "Move or cover furniture away from the walls.",
            "Protect switches, outlets, and door handles.",
            "Point out cracks or damage you want addressed before painting starts.",
          ],
        },
      ],
      ar: [
        { type: "paragraph", text: "يمكن لفرق الدهان العمل بشكل أسرع وأنظف عندما تُجهَّز الغرفة مسبقًا. لا تستغرق أي من الخطوات التالية وقتًا طويلًا، لكنها تُحدث فرقًا ملحوظًا." },
        { type: "heading", id: "clear-and-cover", text: "أخلِ وغطِّ" },
        { type: "paragraph", text: "أزل القطع الصغيرة وديكورات الجدران، وانقل الأثاث بعيدًا عن الجدران أو إلى وسط الغرفة. يجب تغطية أي شيء لا يمكن نقله." },
        { type: "heading", id: "protect-fixtures", text: "احمِ التجهيزات والأرضيات" },
        { type: "paragraph", text: "تستفيد أغطية المفاتيح والمقابس ومقابض الأبواب والأرضيات القريبة من الجدران من حماية بسيطة لتجنب الآثار العرضية." },
        { type: "heading", id: "note-repairs", text: "أشِر إلى أي ضرر في الجدران مسبقًا" },
        { type: "paragraph", text: "الشقوق أو ثقوب المسامير أو الرقع غير المستوية أسهل معالجة قبل بدء الدهان — والإشارة إليها مسبقًا تتيح للفريق التخطيط للتحضير الصحيح للسطح." },
        {
          type: "list",
          items: [
            "أزل القطع الصغيرة وديكورات الجدران والستائر حيثما أمكن.",
            "انقل الأثاث بعيدًا عن الجدران أو غطّه.",
            "احمِ المفاتيح والمقابس ومقابض الأبواب.",
            "أشِر إلى الشقوق أو الأضرار التي تريد معالجتها قبل بدء الدهان.",
          ],
        },
      ],
    },
  },
  {
    slug: "signs-its-time-to-repaint-your-exterior",
    image: {
      src: "/brand/images/services/maintenance/exterior-marble-cladding-facade-installation-service-card-afaq-v1.webp",
      alt: { en: "AFAQ AL HAYAT technician working on an exterior building facade", ar: "فني من آفاق الحياة يعمل على واجهة خارجية لمبنى" },
    },
    category: "general-maintenance",
    title: {
      en: "Signs It's Time to Repaint Your Home's Exterior",
      ar: "علامات تشير إلى حاجة واجهة منزلك لإعادة الدهان",
    },
    excerpt: {
      en: "UAE sun and heat take a real toll on exterior paint. These are the visible signs that it's due for a refresh.",
      ar: "تترك شمس الإمارات وحرارتها أثرًا حقيقيًا على دهان الواجهات الخارجية. إليك العلامات المرئية التي تشير إلى حاجته لتجديد.",
    },
    publishDate: "2026-08-06",
    keywords: {
      en: ["repaint exterior signs", "exterior paint UAE", "when to repaint house"],
      ar: ["علامات إعادة دهان الواجهة", "دهان خارجي الإمارات", "متى تعيد دهان المنزل"],
    },
    serviceSlugs: ["painting"],
    faqs: [
      {
        id: "how-often-exterior",
        question: {
          en: "How often does exterior paint typically need refreshing in the UAE?",
          ar: "كم مرة يحتاج الدهان الخارجي عادة إلى التجديد في الإمارات؟",
        },
        answer: {
          en: "This varies with the paint quality used, sun exposure, and the building's orientation — a visible inspection for fading, chalking, or cracking is a more reliable guide than a fixed number of years.",
          ar: "يختلف هذا حسب جودة الدهان المستخدم والتعرض للشمس واتجاه المبنى — والفحص المرئي بحثًا عن التلاشي أو التطبشر أو التشقق دليل أكثر موثوقية من عدد سنوات ثابت.",
        },
      },
    ],
    body: {
      en: [
        { type: "paragraph", text: "Exterior paint in the UAE faces intense, prolonged sun exposure and high heat, both of which accelerate wear compared to milder climates. A few visible signs make it easy to tell when a refresh is due." },
        { type: "heading", id: "fading-chalking", text: "Fading or chalking" },
        { type: "paragraph", text: "A powdery residue on the surface (chalking) or noticeably faded color compared to protected areas, like under an overhang, both indicate UV damage to the paint layer." },
        { type: "heading", id: "cracking-peeling", text: "Cracking or peeling" },
        { type: "paragraph", text: "Fine cracks or peeling patches mean the paint's protective seal has broken down, which can let moisture reach the surface underneath." },
        { type: "heading", id: "visible-staining", text: "Persistent staining or discoloration" },
        { type: "paragraph", text: "Dark streaks or blotches that don't wash off, especially near window sills or drainage points, often mean the surface is no longer shedding water properly." },
        {
          type: "list",
          items: [
            "Chalky residue or visibly faded color compared to shaded areas.",
            "Cracking, bubbling, or peeling patches.",
            "Persistent staining that doesn't wash off.",
            "Visible bare patches where the paint has worn through completely.",
          ],
        },
      ],
      ar: [
        { type: "paragraph", text: "يواجه الدهان الخارجي في الإمارات تعرضًا شمسيًا مكثفًا وطويلًا وحرارة عالية، وكلاهما يسرّع التآكل مقارنة بالمناخات الأكثر اعتدالًا. تجعل بعض العلامات المرئية من السهل معرفة موعد التجديد." },
        { type: "heading", id: "fading-chalking", text: "التلاشي أو التطبشر" },
        { type: "paragraph", text: "بقايا مسحوقية على السطح (التطبشر) أو لون باهت ملحوظ مقارنة بالمناطق المحمية، مثل أسفل السقيفة، كلاهما يشير إلى ضرر الأشعة فوق البنفسجية بطبقة الدهان." },
        { type: "heading", id: "cracking-peeling", text: "التشقق أو التقشر" },
        { type: "paragraph", text: "الشقوق الدقيقة أو الرقع المتقشرة تعني أن طبقة الحماية للدهان قد تحللت، ما قد يسمح بوصول الرطوبة إلى السطح تحتها." },
        { type: "heading", id: "visible-staining", text: "بقع أو تغيّر لون مستمر" },
        { type: "paragraph", text: "الخطوط أو البقع الداكنة التي لا تُزال بالغسل، خاصة قرب حواف النوافذ أو نقاط الصرف، غالبًا ما تعني أن السطح لم يعد يصرّف الماء بشكل صحيح." },
        {
          type: "list",
          items: [
            "بقايا مسحوقية أو لون باهت ملحوظ مقارنة بالمناطق المظللة.",
            "تشقق أو تفقّع أو تقشر في رقع معينة.",
            "بقع مستمرة لا تُزال بالغسل.",
            "رقع عارية مرئية حيث تآكل الدهان بالكامل.",
          ],
        },
      ],
    },
  },
  {
    slug: "seasonal-home-maintenance-checklist-uae",
    image: {
      src: "/brand/images/services/maintenance/window-installation-maintenance-service-card-afaq-v1.webp",
      alt: { en: "AFAQ AL HAYAT technician inspecting a window in a UAE villa", ar: "فني من آفاق الحياة يفحص نافذة في فيلا بالإمارات" },
    },
    category: "general-maintenance",
    title: {
      en: "Seasonal Home Maintenance Checklist for UAE Homeowners",
      ar: "قائمة الصيانة الموسمية لأصحاب المنازل في الإمارات",
    },
    excerpt: {
      en: "A few small checks each season keep bigger repairs from sneaking up on you. Here's a simple, realistic checklist.",
      ar: "بضعة فحوصات صغيرة في كل موسم تمنع الإصلاحات الأكبر من مباغتتك. إليك قائمة بسيطة وواقعية.",
    },
    publishDate: "2026-08-07",
    keywords: {
      en: ["seasonal home maintenance UAE", "home maintenance checklist", "handyman checklist"],
      ar: ["الصيانة الموسمية للمنزل الإمارات", "قائمة صيانة المنزل", "قائمة هاندي مان"],
    },
    serviceSlugs: ["handyman"],
    faqs: [
      {
        id: "why-seasonal",
        question: {
          en: "Why does a seasonal checklist matter more in the UAE?",
          ar: "لماذا تهم القائمة الموسمية أكثر في الإمارات؟",
        },
        answer: {
          en: "The shift from intense summer heat to milder winter months puts different stress on different parts of a home — checking each season catches issues tied to that specific stress before they build up.",
          ar: "يفرض الانتقال من حرارة الصيف الشديدة إلى أشهر الشتاء الأكثر اعتدالًا ضغطًا مختلفًا على أجزاء مختلفة من المنزل — والفحص في كل موسم يكتشف المشكلات المرتبطة بذلك الضغط المحدد قبل أن تتراكم.",
        },
      },
    ],
    body: {
      en: [
        { type: "paragraph", text: "A short seasonal walk-through of the home catches small issues while they're still simple fixes, rather than letting them turn into bigger jobs." },
        { type: "heading", id: "before-summer", text: "Before summer" },
        { type: "paragraph", text: "Check AC systems ahead of peak heat, inspect outdoor fittings and paintwork for sun damage from the previous year, and test that any shading or ventilation fixtures are working properly." },
        { type: "heading", id: "during-summer", text: "During summer" },
        { type: "paragraph", text: "Keep an eye on water usage for sudden increases (a possible leak sign), and check that AC drains are clear given how hard the system is working." },
        { type: "heading", id: "cooler-months", text: "During cooler months" },
        { type: "paragraph", text: "This is a good window for exterior touch-ups, checking door and window seals, and addressing any small repairs that were deprioritized during peak summer." },
        {
          type: "list",
          items: [
            "Before summer: AC check, exterior inspection, ventilation test.",
            "During summer: watch water usage, keep AC drains clear.",
            "Cooler months: exterior touch-ups, seal checks, catch-up repairs.",
            "Any time: don't let small issues (loose fixtures, minor leaks) wait for the next season.",
          ],
        },
      ],
      ar: [
        { type: "paragraph", text: "جولة موسمية قصيرة في المنزل تكتشف المشكلات الصغيرة وهي لا تزال إصلاحات بسيطة، بدلًا من تركها تتحول إلى أعمال أكبر." },
        { type: "heading", id: "before-summer", text: "قبل الصيف" },
        { type: "paragraph", text: "افحص أنظمة التكييف قبل ذروة الحرارة، وتفقّد التجهيزات الخارجية والدهان بحثًا عن ضرر الشمس من العام السابق، واختبر عمل أي تجهيزات تظليل أو تهوية بشكل صحيح." },
        { type: "heading", id: "during-summer", text: "خلال الصيف" },
        { type: "paragraph", text: "راقب استهلاك المياه بحثًا عن ارتفاع مفاجئ (علامة محتملة على تسرب)، وتأكد من خلو مصارف التكييف من الانسداد نظرًا لعمل النظام بجهد كبير." },
        { type: "heading", id: "cooler-months", text: "خلال الأشهر الأكثر اعتدالًا" },
        { type: "paragraph", text: "هذه فترة جيدة للمسات التجميلية الخارجية، وفحص عوازل الأبواب والنوافذ، ومعالجة أي إصلاحات صغيرة تم تأجيلها خلال ذروة الصيف." },
        {
          type: "list",
          items: [
            "قبل الصيف: فحص التكييف، تفقّد الواجهة الخارجية، اختبار التهوية.",
            "خلال الصيف: راقب استهلاك المياه، حافظ على خلو مصارف التكييف.",
            "الأشهر الأكثر اعتدالًا: لمسات خارجية، فحص العوازل، إصلاحات متأخرة.",
            "في أي وقت: لا تترك المشكلات الصغيرة (تجهيزات مرتخية، تسريبات بسيطة) تنتظر الموسم التالي.",
          ],
        },
      ],
    },
  },
  {
    slug: "diy-vs-professional-handyman",
    image: {
      src: "/brand/images/services/maintenance/service-handyman-maintenance.webp",
      alt: { en: "AFAQ AL HAYAT handyman carrying out a general home repair", ar: "عامل صيانة من آفاق الحياة يقوم بإصلاح منزلي عام" },
    },
    category: "general-maintenance",
    title: {
      en: "DIY vs. Professional: When to Call a Handyman",
      ar: "الإصلاح الذاتي مقابل الاستعانة بمحترف: متى تتصل بهاندي مان",
    },
    excerpt: {
      en: "Some small fixes are genuinely fine to try yourself. Others carry more risk than they look like. Here's a practical way to tell the difference.",
      ar: "بعض الإصلاحات الصغيرة يمكن تجربتها بنفسك فعلًا. بينما تحمل أخرى مخاطر أكبر مما تبدو عليه. إليك طريقة عملية للتمييز بينهما.",
    },
    publishDate: "2026-08-07",
    keywords: {
      en: ["DIY vs professional repair", "when to call a handyman", "home repair guide UAE"],
      ar: ["الإصلاح الذاتي مقابل المحترف", "متى تتصل بهاندي مان", "دليل إصلاح المنزل الإمارات"],
    },
    serviceSlugs: ["handyman"],
    faqs: [
      {
        id: "electrical-plumbing-diy",
        question: {
          en: "Is it ever a good idea to DIY electrical or plumbing work?",
          ar: "هل من الجيد أبدًا إصلاح الأعمال الكهربائية أو السباكة بنفسك؟",
        },
        answer: {
          en: "Very minor tasks like replacing a lightbulb or a tap washer are generally fine, but anything involving wiring, the distribution board, or pipe connections is safer left to a professional given the risk involved.",
          ar: "المهام البسيطة جدًا مثل استبدال لمبة أو حلقة حنفية غالبًا ما تكون مقبولة، لكن أي شيء يتعلق بالأسلاك أو لوحة التوزيع أو توصيلات المواسير من الأسلم تركه لمحترف نظرًا للمخاطر المرتبطة به.",
        },
      },
    ],
    body: {
      en: [
        { type: "paragraph", text: "Not every small home fix needs a professional, but knowing where the line sits saves both wasted effort and avoidable risk." },
        { type: "heading", id: "usually-fine-diy", text: "Usually fine to DIY" },
        { type: "paragraph", text: "Tightening a loose handle, replacing a lightbulb, hanging a picture, or unclogging a simple drain with a plunger are all low-risk tasks most people can handle safely." },
        { type: "heading", id: "call-a-professional", text: "Better left to a professional" },
        { type: "paragraph", text: "Anything involving electrical wiring, gas connections, structural elements, or work at height carries real risk if done incorrectly — the cost of a mistake is usually much higher than the cost of the visit." },
        { type: "heading", id: "when-in-doubt", text: "When in doubt" },
        { type: "paragraph", text: "If a task requires opening an electrical panel, cutting into a wall, or you're not confident about what's behind a surface, it's worth a quick call before starting rather than after something goes wrong." },
        {
          type: "list",
          items: [
            "DIY-friendly: loose handles, lightbulbs, simple drain clogs, hanging light items.",
            "Call a professional: anything electrical, structural, or involving gas.",
            "When unsure what's behind a wall or panel, ask before you start.",
            "A failed DIY attempt often costs more to fix than the original issue.",
          ],
        },
      ],
      ar: [
        { type: "paragraph", text: "لا يحتاج كل إصلاح منزلي صغير إلى محترف، لكن معرفة أين يقع الخط الفاصل يوفر عليك جهدًا مهدرًا ومخاطر يمكن تجنبها." },
        { type: "heading", id: "usually-fine-diy", text: "عادة ما تكون مناسبة للإصلاح الذاتي" },
        { type: "paragraph", text: "إحكام مقبض مرتخٍ، أو استبدال لمبة، أو تعليق لوحة، أو تسليك مصرف بسيط باستخدام الكباس، كلها مهام منخفضة المخاطر يمكن لمعظم الناس التعامل معها بأمان." },
        { type: "heading", id: "call-a-professional", text: "من الأفضل تركها لمحترف" },
        { type: "paragraph", text: "أي شيء يتعلق بالأسلاك الكهربائية أو توصيلات الغاز أو العناصر الإنشائية أو العمل على ارتفاع يحمل مخاطر حقيقية إذا تم تنفيذه بشكل خاطئ — وتكلفة الخطأ عادة أعلى بكثير من تكلفة الزيارة." },
        { type: "heading", id: "when-in-doubt", text: "عند الشك" },
        { type: "paragraph", text: "إذا كانت المهمة تتطلب فتح لوحة كهربائية، أو قطع جزء من الجدار، أو لم تكن متأكدًا مما يوجد خلف السطح، يستحق الأمر اتصالًا سريعًا قبل البدء وليس بعد حدوث خطأ." },
        {
          type: "list",
          items: [
            "مناسب للإصلاح الذاتي: المقابض المرتخية، اللمبات، انسدادات المصرف البسيطة، تعليق الأشياء الخفيفة.",
            "استعن بمحترف: أي شيء كهربائي أو إنشائي أو يتعلق بالغاز.",
            "عند عدم اليقين مما يوجد خلف جدار أو لوحة، اسأل قبل البدء.",
            "محاولة الإصلاح الذاتي الفاشلة غالبًا ما تكلف إصلاحها أكثر من المشكلة الأصلية.",
          ],
        },
      ],
    },
  },
  {
    slug: "regular-cleaning-vs-deep-cleaning",
    image: {
      src: "/brand/images/services/cleaning/home-cleaning-service-card-afaq-v1.webp",
      alt: { en: "AFAQ AL HAYAT cleaning team performing regular home cleaning", ar: "فريق تنظيف من آفاق الحياة يقوم بالتنظيف المنتظم للمنزل" },
    },
    category: "cleaning-pest-control",
    title: {
      en: "Regular Cleaning vs. Deep Cleaning: What's the Difference",
      ar: "التنظيف المنتظم مقابل التنظيف العميق: ما الفرق",
    },
    excerpt: {
      en: "The two terms get used interchangeably, but they cover different work. Here's how to tell which one your home actually needs.",
      ar: "غالبًا ما يُستخدم المصطلحان بالتبادل، لكنهما يغطيان أعمالًا مختلفة. إليك كيفية معرفة ما يحتاجه منزلك فعليًا.",
    },
    publishDate: "2026-08-08",
    keywords: {
      en: ["regular cleaning vs deep cleaning", "cleaning types explained", "home cleaning UAE"],
      ar: ["التنظيف المنتظم مقابل العميق", "شرح أنواع التنظيف", "تنظيف المنزل الإمارات"],
    },
    serviceSlugs: ["general-cleaning", "deep-cleaning"],
    faqs: [
      {
        id: "which-one-first",
        question: {
          en: "Should a home get a deep clean before starting regular cleaning visits?",
          ar: "هل يجب أن يحصل المنزل على تنظيف عميق قبل بدء زيارات التنظيف المنتظم؟",
        },
        answer: {
          en: "It's a common starting point — a deep clean establishes a genuinely clean baseline, and regular cleaning is then far more effective at maintaining it than trying to catch up on months of buildup.",
          ar: "هذه نقطة بداية شائعة — يؤسس التنظيف العميق نقطة انطلاق نظيفة فعليًا، ويصبح التنظيف المنتظم بعدها أكثر فعالية بكثير في الحفاظ عليها بدلًا من محاولة تدارك أشهر من التراكم.",
        },
      },
    ],
    body: {
      en: [
        { type: "paragraph", text: "Both services keep a home clean, but they're not the same job, and knowing the difference helps set the right expectations for each visit." },
        { type: "heading", id: "regular-cleaning-covers", text: "What regular cleaning covers" },
        { type: "paragraph", text: "Regular cleaning focuses on everyday maintenance — surfaces, floors, bathrooms, kitchens, and general tidiness — done on a routine schedule to keep the home consistently presentable." },
        { type: "heading", id: "deep-cleaning-covers", text: "What deep cleaning covers" },
        { type: "paragraph", text: "Deep cleaning goes further into areas that aren't part of a routine pass — behind and under appliances, inside cabinets, grout lines, baseboards, and other buildup-prone spots." },
        { type: "heading", id: "how-they-work-together", text: "How they work together" },
        { type: "paragraph", text: "The two are complementary rather than a choice between one or the other — deep cleaning periodically resets the areas regular cleaning doesn't reach, so routine visits stay effective." },
        {
          type: "list",
          items: [
            "Regular cleaning: everyday surfaces, floors, and tidiness, on a routine schedule.",
            "Deep cleaning: appliances, cabinets, grout, and buildup-prone areas, less frequently.",
            "New home, post-renovation, or long-overdue cleaning: start with a deep clean.",
            "Ongoing upkeep after that: regular cleaning is usually enough.",
          ],
        },
      ],
      ar: [
        { type: "paragraph", text: "تحافظ كلتا الخدمتين على نظافة المنزل، لكنهما ليستا نفس العمل، ومعرفة الفرق تساعد في تحديد التوقعات الصحيحة لكل زيارة." },
        { type: "heading", id: "regular-cleaning-covers", text: "ما يغطيه التنظيف المنتظم" },
        { type: "paragraph", text: "يركز التنظيف المنتظم على الصيانة اليومية — الأسطح والأرضيات والحمامات والمطابخ والترتيب العام — ويتم وفق جدول دوري للحفاظ على مظهر المنزل مرتبًا باستمرار." },
        { type: "heading", id: "deep-cleaning-covers", text: "ما يغطيه التنظيف العميق" },
        { type: "paragraph", text: "يذهب التنظيف العميق أبعد إلى مناطق ليست جزءًا من الجولة الروتينية — خلف الأجهزة وتحتها وداخل الخزائن وخطوط الفواصل والألواح السفلية وغيرها من الأماكن المعرضة للتراكم." },
        { type: "heading", id: "how-they-work-together", text: "كيف يعملان معًا" },
        { type: "paragraph", text: "الخدمتان متكاملتان وليستا خيارًا بين إحداهما أو الأخرى — يعيد التنظيف العميق دوريًا ضبط المناطق التي لا يصلها التنظيف المنتظم، ما يبقي الزيارات الروتينية فعالة." },
        {
          type: "list",
          items: [
            "التنظيف المنتظم: الأسطح والأرضيات اليومية والترتيب، وفق جدول دوري.",
            "التنظيف العميق: الأجهزة والخزائن والفواصل والمناطق المعرضة للتراكم، بتكرار أقل.",
            "المنزل الجديد أو ما بعد التجديد أو التنظيف المتأخر طويلًا: ابدأ بتنظيف عميق.",
            "الصيانة المستمرة بعد ذلك: التنظيف المنتظم يكفي عادة.",
          ],
        },
      ],
    },
  },
  {
    slug: "how-to-maintain-a-clean-home-between-visits",
    image: {
      src: "/brand/images/services/cleaning/apartment-cleaning-service-card-afaq-v1.webp",
      alt: { en: "AFAQ AL HAYAT technician cleaning an apartment interior", ar: "فني من آفاق الحياة ينظف داخل شقة" },
    },
    category: "cleaning-pest-control",
    title: {
      en: "How to Maintain a Freshly Cleaned Home Between Visits",
      ar: "كيف تحافظ على نظافة منزلك بين الزيارات",
    },
    excerpt: {
      en: "A few daily habits can stretch the feeling of a fresh clean much further. Here's what actually makes a difference.",
      ar: "بعض العادات اليومية يمكن أن تُطيل شعور النظافة الطازجة كثيرًا. إليك ما يُحدث فرقًا فعليًا.",
    },
    publishDate: "2026-08-08",
    keywords: {
      en: ["maintain clean home", "cleaning tips between visits", "home cleaning habits"],
      ar: ["الحفاظ على نظافة المنزل", "نصائح تنظيف بين الزيارات", "عادات تنظيف المنزل"],
    },
    serviceSlugs: ["general-cleaning"],
    faqs: [
      {
        id: "minutes-a-day",
        question: {
          en: "How much daily effort actually makes a difference?",
          ar: "كم من الجهد اليومي يُحدث فرقًا فعليًا؟",
        },
        answer: {
          en: "Even 10–15 minutes of quick tidying — wiping counters, doing dishes, and a fast floor sweep in high-traffic areas — noticeably extends how long a home feels freshly cleaned.",
          ar: "حتى 10-15 دقيقة من الترتيب السريع — مسح الأسطح وغسل الأطباق وكنس سريع للأرضية في المناطق كثيرة الاستخدام — يُطيل بشكل ملحوظ شعور المنزل بالنظافة الطازجة.",
        },
      },
    ],
    body: {
      en: [
        { type: "paragraph", text: "A professional cleaning visit gives a home a genuine reset, but a few small daily habits make that clean feeling last noticeably longer." },
        { type: "heading", id: "daily-quick-wins", text: "Small daily habits" },
        { type: "paragraph", text: "Wiping kitchen counters after use, doing dishes the same day, and a quick end-of-day tidy of high-traffic areas prevent the small buildup that makes a home feel cluttered again quickly." },
        { type: "heading", id: "high-traffic-focus", text: "Focus on high-traffic areas" },
        { type: "paragraph", text: "Entryways, kitchens, and bathrooms show wear fastest — a little extra attention to these specific areas goes further than trying to maintain every room equally." },
        { type: "heading", id: "weekly-touchpoints", text: "A few weekly touchpoints" },
        { type: "paragraph", text: "A quick vacuum of main areas and wiping down surfaces that collect dust weekly keeps things from sliding backward between professional visits." },
        {
          type: "list",
          items: [
            "Wipe kitchen counters after use and do dishes the same day.",
            "Give extra daily attention to entryways, kitchens, and bathrooms.",
            "Do a quick weekly vacuum and dust pass on main living areas.",
            "Address spills and messes immediately rather than letting them set.",
          ],
        },
      ],
      ar: [
        { type: "paragraph", text: "تمنح زيارة التنظيف الاحترافية المنزل إعادة ضبط فعلية، لكن بعض العادات اليومية الصغيرة تجعل شعور النظافة يدوم لفترة أطول بشكل ملحوظ." },
        { type: "heading", id: "daily-quick-wins", text: "عادات يومية صغيرة" },
        { type: "paragraph", text: "مسح أسطح المطبخ بعد الاستخدام، وغسل الأطباق في نفس اليوم، وترتيب سريع للمناطق كثيرة الاستخدام في نهاية اليوم يمنع التراكم الصغير الذي يجعل المنزل يبدو فوضويًا مجددًا بسرعة." },
        { type: "heading", id: "high-traffic-focus", text: "ركّز على المناطق كثيرة الاستخدام" },
        { type: "paragraph", text: "المداخل والمطابخ والحمامات تُظهر التآكل أسرع — والاهتمام الإضافي القليل بهذه المناطق تحديدًا يجدي أكثر من محاولة الحفاظ على كل غرفة بالتساوي." },
        { type: "heading", id: "weekly-touchpoints", text: "بعض النقاط الأسبوعية" },
        { type: "paragraph", text: "كنس سريع بالمكنسة الكهربائية للمناطق الرئيسية ومسح الأسطح التي تجمع الغبار أسبوعيًا يمنع الأمور من التراجع بين الزيارات الاحترافية." },
        {
          type: "list",
          items: [
            "امسح أسطح المطبخ بعد الاستخدام واغسل الأطباق في نفس اليوم.",
            "أعطِ اهتمامًا يوميًا إضافيًا للمداخل والمطابخ والحمامات.",
            "قم بكنس أسبوعي سريع ومسح غبار للمناطق الرئيسية.",
            "عالج الانسكابات والفوضى فورًا بدلًا من تركها تستقر.",
          ],
        },
      ],
    },
  },
  {
    slug: "seasonal-pest-patterns-in-the-uae",
    image: {
      src: "/brand/images/services/pest-control/009-mosquito-control-service-card.webp",
      alt: { en: "AFAQ AL HAYAT pest control technician performing mosquito control treatment", ar: "فني مكافحة حشرات من آفاق الحياة يقوم بعلاج مكافحة البعوض" },
    },
    category: "cleaning-pest-control",
    title: {
      en: "Seasonal Pest Patterns in the UAE: What to Expect and When",
      ar: "أنماط الآفات الموسمية في الإمارات: ما يمكن توقعه ومتى",
    },
    excerpt: {
      en: "Pest activity shifts with the seasons. Knowing what's more common when helps you stay ahead of it.",
      ar: "يتغير نشاط الآفات مع تغير الفصول. معرفة ما هو أكثر شيوعًا ومتى يساعدك على الاستعداد المسبق.",
    },
    publishDate: "2026-08-09",
    keywords: {
      en: ["seasonal pests UAE", "pest control by season", "when pests are active UAE"],
      ar: ["الآفات الموسمية الإمارات", "مكافحة الآفات حسب الموسم", "متى تنشط الآفات الإمارات"],
    },
    serviceSlugs: ["pest-control"],
    faqs: [
      {
        id: "year-round-pests",
        question: {
          en: "Are any pests active year-round in the UAE?",
          ar: "هل هناك آفات نشطة على مدار السنة في الإمارات؟",
        },
        answer: {
          en: "Cockroaches and ants tend to stay active year-round indoors given the UAE's consistent indoor climate control, though outdoor activity for many pests still follows a seasonal pattern.",
          ar: "تميل الصراصير والنمل إلى البقاء نشطة على مدار السنة داخل المنازل نظرًا لثبات التحكم في المناخ الداخلي في الإمارات، رغم أن النشاط الخارجي للعديد من الآفات لا يزال يتبع نمطًا موسميًا.",
        },
      },
    ],
    body: {
      en: [
        { type: "paragraph", text: "Pest activity in the UAE doesn't stay constant throughout the year — temperature and humidity shifts change which pests are more active and when, which makes seasonal awareness useful for prevention." },
        { type: "heading", id: "hot-humid-months", text: "Hot, humid months" },
        { type: "paragraph", text: "Cockroaches and ants are typically more active as they seek water and cooler indoor spaces, and mosquito activity tends to rise with humidity, especially near standing water." },
        { type: "heading", id: "cooler-months", text: "Cooler months" },
        { type: "paragraph", text: "Rodents often become more noticeable as they seek shelter and food sources indoors, and this is also a common window for termite swarms in the region." },
        { type: "heading", id: "year-round-basics", text: "What stays constant" },
        { type: "paragraph", text: "Good sanitation, sealed entry points, and prompt attention to early signs matter in every season — seasonal patterns shift emphasis, but they don't replace year-round basics." },
        {
          type: "list",
          items: [
            "Hot, humid months: watch for cockroaches, ants, and mosquitoes.",
            "Cooler months: watch for rodents and termite swarms.",
            "Keep food storage sealed and drains clear regardless of season.",
            "Schedule a preventive inspection ahead of the season a pest type is typically more active in.",
          ],
        },
      ],
      ar: [
        { type: "paragraph", text: "لا يبقى نشاط الآفات في الإمارات ثابتًا طوال العام — إذ تغيّر تحولات درجة الحرارة والرطوبة أي الآفات أكثر نشاطًا ومتى، ما يجعل الوعي الموسمي مفيدًا للوقاية." },
        { type: "heading", id: "hot-humid-months", text: "الأشهر الحارة والرطبة" },
        { type: "paragraph", text: "عادة ما تكون الصراصير والنمل أكثر نشاطًا وهي تبحث عن الماء والمساحات الداخلية الأكثر برودة، ويميل نشاط البعوض إلى الارتفاع مع الرطوبة، خاصة قرب المياه الراكدة." },
        { type: "heading", id: "cooler-months", text: "الأشهر الأكثر اعتدالًا" },
        { type: "paragraph", text: "غالبًا ما تصبح القوارض أكثر وضوحًا وهي تبحث عن مأوى ومصادر طعام داخل المنازل، وهذه أيضًا فترة شائعة لأسراب النمل الأبيض في المنطقة." },
        { type: "heading", id: "year-round-basics", text: "ما يبقى ثابتًا" },
        { type: "paragraph", text: "النظافة الجيدة وإغلاق نقاط الدخول والاهتمام الفوري بالعلامات المبكرة أمور مهمة في كل موسم — تغيّر الأنماط الموسمية التركيز، لكنها لا تُغني عن الأساسيات على مدار السنة." },
        {
          type: "list",
          items: [
            "الأشهر الحارة والرطبة: راقب الصراصير والنمل والبعوض.",
            "الأشهر الأكثر اعتدالًا: راقب القوارض وأسراب النمل الأبيض.",
            "أبقِ تخزين الطعام مغلقًا والمصارف خالية من الانسداد بغض النظر عن الموسم.",
            "اجدول فحصًا وقائيًا قبل الموسم الذي ينشط فيه نوع معين من الآفات عادة.",
          ],
        },
      ],
    },
  },
  {
    slug: "how-to-pest-proof-your-home-after-treatment",
    image: {
      src: "/brand/images/services/pest-control/001-rodent-control-service-card.webp",
      alt: { en: "AFAQ AL HAYAT pest control technician performing rodent control and prevention", ar: "فني مكافحة حشرات من آفاق الحياة يقوم بمكافحة القوارض والوقاية منها" },
    },
    category: "cleaning-pest-control",
    title: {
      en: "How to Pest-Proof Your Home After Treatment",
      ar: "كيف تحمي منزلك من الآفات بعد العلاج",
    },
    excerpt: {
      en: "A treatment visit solves the current problem. These habits help keep it from coming back.",
      ar: "تحل زيارة العلاج المشكلة الحالية. تساعد هذه العادات على منع عودتها.",
    },
    publishDate: "2026-08-09",
    keywords: {
      en: ["pest proof your home", "prevent pests after treatment", "pest prevention tips UAE"],
      ar: ["حماية المنزل من الآفات", "منع عودة الآفات بعد العلاج", "نصائح الوقاية من الآفات الإمارات"],
    },
    serviceSlugs: ["pest-control"],
    faqs: [
      {
        id: "how-soon-results",
        question: {
          en: "Should I expect the problem to be gone immediately after treatment?",
          ar: "هل يجب أن أتوقع اختفاء المشكلة فورًا بعد العلاج؟",
        },
        answer: {
          en: "This varies by pest type and the extent of the original problem — the technician can explain what to expect for your specific situation and when a follow-up visit might be useful.",
          ar: "يختلف هذا حسب نوع الآفة ومدى المشكلة الأصلية — يمكن للفني توضيح ما يمكن توقعه لحالتك تحديدًا ومتى قد تكون زيارة المتابعة مفيدة.",
        },
      },
    ],
    body: {
      en: [
        { type: "paragraph", text: "Professional treatment addresses an active pest problem, but keeping it from returning depends partly on habits at home in the weeks and months after." },
        { type: "heading", id: "seal-entry-points", text: "Seal likely entry points" },
        { type: "paragraph", text: "Gaps around pipes, vents, door thresholds, and window frames are common entry points — sealing the ones you can identify reduces how easily pests get back in." },
        { type: "heading", id: "manage-food-and-waste", text: "Manage food storage and waste" },
        { type: "paragraph", text: "Keeping food in sealed containers, cleaning up crumbs and spills promptly, and taking out waste regularly removes the resources that attract most common household pests." },
        { type: "heading", id: "reduce-moisture", text: "Reduce standing moisture" },
        { type: "paragraph", text: "Fixing small leaks, keeping drains clear, and avoiding standing water in trays or planters removes a resource many pests specifically seek out." },
        {
          type: "list",
          items: [
            "Seal visible gaps around pipes, vents, and door or window frames.",
            "Store food in sealed containers and clean spills promptly.",
            "Take out household waste regularly and keep bins covered.",
            "Fix small leaks and avoid standing water around the home.",
            "Follow any specific preparation or follow-up guidance given by the technician.",
          ],
        },
      ],
      ar: [
        { type: "paragraph", text: "يعالج العلاج الاحترافي مشكلة الآفات النشطة، لكن منع عودتها يعتمد جزئيًا على العادات في المنزل خلال الأسابيع والأشهر التالية." },
        { type: "heading", id: "seal-entry-points", text: "أغلق نقاط الدخول المحتملة" },
        { type: "paragraph", text: "الفجوات حول المواسير وفتحات التهوية وعتبات الأبواب وإطارات النوافذ نقاط دخول شائعة — إغلاق ما يمكنك تحديده يقلل من سهولة عودة الآفات." },
        { type: "heading", id: "manage-food-and-waste", text: "أدِر تخزين الطعام والنفايات" },
        { type: "paragraph", text: "حفظ الطعام في حاويات مغلقة، وتنظيف الفتات والانسكابات فورًا، وإخراج النفايات بانتظام يزيل الموارد التي تجذب معظم آفات المنازل الشائعة." },
        { type: "heading", id: "reduce-moisture", text: "قلّل الرطوبة الراكدة" },
        { type: "paragraph", text: "إصلاح التسريبات الصغيرة، وإبقاء المصارف خالية من الانسداد، وتجنب المياه الراكدة في الأحواض أو أواني النباتات يزيل موردًا تبحث عنه العديد من الآفات تحديدًا." },
        {
          type: "list",
          items: [
            "أغلق الفجوات المرئية حول المواسير وفتحات التهوية وإطارات الأبواب والنوافذ.",
            "خزّن الطعام في حاويات مغلقة ونظّف الانسكابات فورًا.",
            "أخرج نفايات المنزل بانتظام وأبقِ الحاويات مغطاة.",
            "أصلح التسريبات الصغيرة وتجنب المياه الراكدة حول المنزل.",
            "اتبع أي إرشادات تحضير أو متابعة محددة يقدمها الفني.",
          ],
        },
      ],
    },
  },
];

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

/**
 * Posts for a service detail page's "Related articles" section: posts
 * directly tagged with this service slug first, then other posts in the
 * same catalog category, most recent first. Used by every service detail
 * page (src/app/[locale]/services/[slug]/page.tsx), not just one service.
 */
export function getPostsForService(
  slug: string,
  category: BlogCategory,
  limit = 3,
  posts: BlogPost[] = BLOG_POSTS
): BlogPost[] {
  const byDateDesc = (a: BlogPost, b: BlogPost) => (a.publishDate < b.publishDate ? 1 : -1);
  const direct = posts.filter((post) => post.serviceSlugs?.includes(slug)).sort(byDateDesc);
  const sameCategory = posts
    .filter((post) => post.category === category && !post.serviceSlugs?.includes(slug))
    .sort(byDateDesc);
  return [...direct, ...sameCategory].slice(0, limit);
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
