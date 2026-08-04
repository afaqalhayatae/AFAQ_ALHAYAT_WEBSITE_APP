/**
 * City-SEO content contract (2026-07-30 strategic instruction): every
 * section and every service needs its own dedicated page per emirate, to
 * target local search ("AC maintenance in Dubai", "cockroach control in
 * Sharjah", etc.). CITY_SERVICE_CONTENT now holds 57 real entries (added
 * 2026-08-02 through 2026-08-05); CITY_SECTION_CONTENT is still empty.
 * Every route built on top of this file already derives its
 * generateStaticParams from these keys, so adding a city here is the
 * entire publishing step for that page's *existence* — no route or
 * component change needed. See docs/CITY_PAGES_STRUCTURE.md for the full
 * system (URL scheme, internal-linking flow, and the rule that each
 * city's copy must be genuinely unique — never a templated find/replace
 * of the city name into shared boilerplate).
 *
 * Existence and indexability are two separate questions — see
 * isCityPagePublishReady()/isCitySectionPublishReady() below (2026-08-04,
 * Phase 1 conversion-fix pass, SEO_REALITY_MAP.md §5 Priority 1 and 3).
 */

import { APPROVED_SERVICE_CONTENT_SLUGS } from "./service-content";
import { getPestControlSubServicePage } from "./pest-control-pages";
import type { FaqItem } from "./faq";

export type CityContentBlock = {
  title: { en: string; ar: string };
  h1: { en: string; ar: string };
  metaDescription: { en: string; ar: string };
  intro: { en: string; ar: string };
  /** Real, city-specific body paragraphs — never copy-pasted across cities. */
  body: { en: string; ar: string }[];
  /**
   * City-specific FAQ content (2026-08-04, Phase 2 — SEO_CONTENT_QUALITY_AUDIT.md
   * §2). Structure only: reuses the exact FaqItem shape and
   * ServiceFaqSection/FAQPage-schema rendering already used sitewide
   * (faq.ts, service-content-sections.tsx) rather than a new type or
   * component. Deliberately unset on every existing entry — real,
   * genuinely city-specific FAQ content (never a templated repeat of the
   * same 2-3 questions across all 57 pages) is separate writing work,
   * not something this structural pass fabricates. `category: "locations"`
   * is the correct FaqCategory value for this content type.
   */
  faqs?: FaqItem[];
  /**
   * Image SEO fields (2026-08-04, Phase 2 — SEO_CONTENT_QUALITY_AUDIT.md
   * §5). Same optional, nullable pattern already used for pest-control
   * sub-service pages (pest-control-pages.ts's `image`/`imageAlt`) —
   * `null`/unset renders the existing brand illustration fallback
   * (BrandPanel with no `src`), a real filename + real alt text renders
   * the actual photo. Deliberately unset on every existing entry: the
   * lowest-effort real fix is reusing each service's already-approved
   * card image (SERVICE_CATALOG.md), not commissioning new city-specific
   * photography — a follow-up content decision, not this structural pass.
   */
  image?: string | null;
  imageAlt?: { en: string; ar: string } | null;
  /** Publication gate, e.g. "Pending Owner Input — no page generated". */
  status: string;
};

/**
 * Service-level city pages. Keyed by `${serviceSlug}:${citySlug}` where
 * `serviceSlug` is either a src/lib/catalog/services.ts slug (Maintenance,
 * Cleaning) or a pest-control-pages.ts sub-service id (e.g.
 * "cockroach-control") — the two id spaces don't collide, so one flat
 * registry covers every section.
 */
/**
 * First real batch (2026-08-02 content-integration execution pass):
 * 3 service+city pages and 4 pest-type+city pages, chosen as the named
 * example set for this phase rather than the full 8x7 / 11x7 matrix —
 * each entry below is genuinely unique copy, not a city-name
 * find/replace of shared boilerplate, per this file's own rule. The
 * remaining combinations stay unpublished (empty) until written the
 * same way.
 */
export const CITY_SERVICE_CONTENT: Record<string, CityContentBlock> = {
  "ac-maintenance:dubai": {
    title: {
      en: "AC Maintenance in Dubai | AFAQ AL HAYAT",
      ar: "صيانة المكيفات في دبي | آفاق الحياة",
    },
    h1: {
      en: "AC Maintenance in Dubai",
      ar: "صيانة المكيفات في دبي",
    },
    metaDescription: {
      en: "Professional AC maintenance in Dubai from AFAQ AL HAYAT — inspection, cleaning, and repair for homes and offices across the city.",
      ar: "صيانة احترافية للمكيفات في دبي من آفاق الحياة — فحص وتنظيف وإصلاح للمنازل والمكاتب في جميع أنحاء المدينة.",
    },
    intro: {
      en: "Dubai's long, high-humidity summers put continuous strain on air conditioning systems, from villas in Arabian Ranches to apartment towers in Dubai Marina and Downtown Dubai. AFAQ AL HAYAT provides professional AC maintenance across the city to help keep units running efficiently through the season.",
      ar: "يفرض صيف دبي الطويل والمرتفع الرطوبة ضغطًا مستمرًا على أنظمة تكييف الهواء، من الفلل في المرابع العربية إلى أبراج الشقق في دبي مارينا ووسط مدينة دبي. تقدم آفاق الحياة خدمات صيانة احترافية للمكيفات في جميع أنحاء المدينة للمساعدة في الحفاظ على كفاءة عمل الوحدات طوال الموسم.",
    },
    body: [
      {
        en: "A documented inspection covers filters, coils, drainage, and refrigerant performance, so problems are identified before they cause a breakdown during peak heat.",
        ar: "تشمل عملية الفحص الموثقة الفلاتر والملفات والصرف وأداء غاز التبريد، لتحديد المشكلات قبل أن تتسبب في عطل خلال ذروة الحرارة.",
      },
      {
        en: "Regular servicing addresses common Dubai-climate issues such as clogged condensate drains, dust buildup from construction-adjacent areas, and reduced cooling efficiency in high-rise units exposed to direct sun.",
        ar: "تعالج الصيانة الدورية المشكلات الشائعة في مناخ دبي مثل انسداد مصارف التكثيف، وتراكم الغبار في المناطق القريبة من مواقع البناء، وانخفاض كفاءة التبريد في الوحدات السكنية العالية المعرضة لأشعة الشمس المباشرة.",
      },
      {
        en: "Whether it's a single split unit in an apartment or a central system in a villa, our technicians follow the same clear, explained process before, during, and after every visit.",
        ar: "سواء كانت وحدة سبليت مفردة في شقة أو نظام مركزي في فيلا، يتبع فنيونا نفس العملية الواضحة والمشروحة قبل كل زيارة وأثناءها وبعدها.",
      },
    ],
    status: "Content added 2026-08-02 (content-integration execution pass) — no price, warranty, or response-time claim included.",
  },
  "plumbing:sharjah": {
    title: {
      en: "Plumbing Services in Sharjah | AFAQ AL HAYAT",
      ar: "خدمات السباكة في الشارقة | آفاق الحياة",
    },
    h1: {
      en: "Plumbing Services in Sharjah",
      ar: "خدمات السباكة في الشارقة",
    },
    metaDescription: {
      en: "Professional plumbing services in Sharjah from AFAQ AL HAYAT — leak repair, fixture installation, and maintenance for homes and offices.",
      ar: "خدمات سباكة احترافية في الشارقة من آفاق الحياة — إصلاح التسريبات وتركيب التجهيزات والصيانة للمنازل والمكاتب.",
    },
    intro: {
      en: "From established neighborhoods to newer communities such as Aljada and Al Zahia, Sharjah's mix of building ages means plumbing systems face different pressures — from aging pipework to fittings in newly handed-over units. AFAQ AL HAYAT provides professional plumbing services across the emirate.",
      ar: "من الأحياء الراسخة إلى المجتمعات الأحدث مثل الجادة والزاهية، يعني تنوع أعمار المباني في الشارقة أن أنظمة السباكة تواجه ضغوطًا مختلفة — من مواسير قديمة إلى تجهيزات في وحدات حديثة التسليم. تقدم آفاق الحياة خدمات سباكة احترافية في جميع أنحاء الإمارة.",
    },
    body: [
      {
        en: "Common requests include leak detection and repair, fixing low or inconsistent water pressure, unblocking drains, and installing or replacing taps, valves, and sanitary fittings.",
        ar: "تشمل الطلبات الشائعة الكشف عن التسريبات وإصلاحها، ومعالجة ضعف أو تذبذب ضغط المياه، وتسليك المصارف، وتركيب أو استبدال الحنفيات والصمامات والتجهيزات الصحية.",
      },
      {
        en: "Coastal humidity can accelerate corrosion in exposed metal fittings, which is why a documented inspection checks connection points, not just the visible fixture.",
        ar: "يمكن أن تسرّع الرطوبة الساحلية من تآكل التجهيزات المعدنية المكشوفة، ولهذا يشمل الفحص الموثق نقاط التوصيل وليس فقط التجهيز الظاهر.",
      },
      {
        en: "Every visit follows a clear inspection-then-repair workflow, with guidance given before any work begins.",
        ar: "تتبع كل زيارة منهجية واضحة تبدأ بالفحص ثم الإصلاح، مع تقديم الإرشادات قبل بدء أي عمل.",
      },
    ],
    status: "Content added 2026-08-02 (content-integration execution pass) — no price, warranty, or response-time claim included.",
  },
  "electrical-maintenance:abu-dhabi": {
    title: {
      en: "Electrical Maintenance in Abu Dhabi | AFAQ AL HAYAT",
      ar: "الصيانة الكهربائية في أبوظبي | آفاق الحياة",
    },
    h1: {
      en: "Electrical Maintenance in Abu Dhabi",
      ar: "الصيانة الكهربائية في أبوظبي",
    },
    metaDescription: {
      en: "Professional electrical maintenance in Abu Dhabi from AFAQ AL HAYAT — inspections, repairs, and fixture work for homes and offices.",
      ar: "صيانة كهربائية احترافية في أبوظبي من آفاق الحياة — فحوصات وإصلاحات وأعمال تجهيزات للمنازل والمكاتب.",
    },
    intro: {
      en: "From island communities such as Saadiyat Island and Yas Island to established districts like Al Bateen, Abu Dhabi properties range from new-build villas to older apartment buildings, each with different electrical maintenance needs. AFAQ AL HAYAT provides professional electrical services across the emirate.",
      ar: "من مجتمعات الجزر مثل جزيرة السعديات وجزيرة ياس إلى أحياء راسخة مثل البطين، تتراوح عقارات أبوظبي بين الفلل حديثة البناء ومباني الشقق الأقدم، ولكل منها احتياجات صيانة كهربائية مختلفة. تقدم آفاق الحياة خدمات كهربائية احترافية في جميع أنحاء الإمارة.",
    },
    body: [
      {
        en: "Typical work includes circuit breaker and distribution board checks, socket and switch repair or replacement, lighting fixture installation, and tracing the cause of recurring trips or flickering.",
        ar: "تشمل الأعمال المعتادة فحص قواطع الدائرة ولوحات التوزيع، وإصلاح أو استبدال المقابس والمفاتيح، وتركيب تجهيزات الإضاءة، وتحديد سبب الانقطاعات المتكررة أو الوميض.",
      },
      {
        en: "A documented inspection checks wiring condition and connection points rather than just the visible symptom, which matters most in older buildings where wiring may not match current usage load.",
        ar: "يفحص التفتيش الموثق حالة الأسلاك ونقاط التوصيل وليس فقط العرض الظاهر، وهو أمر مهم بشكل خاص في المباني الأقدم حيث قد لا تتناسب الأسلاك مع حمل الاستخدام الحالي.",
      },
      {
        en: "Safety comes first on every visit: power is isolated before any panel or fitting is opened, and clear guidance is given on what was found and what was done.",
        ar: "السلامة أولاً في كل زيارة: يتم فصل التيار الكهربائي قبل فتح أي لوحة أو تجهيز، مع تقديم إرشادات واضحة حول ما تم اكتشافه وما تم تنفيذه.",
      },
    ],
    status: "Content added 2026-08-02 (content-integration execution pass) — no price, warranty, or response-time claim included.",
  },
  "cockroach-control:sharjah": {
    title: {
      en: "Cockroach Control in Sharjah | AFAQ AL HAYAT",
      ar: "مكافحة الصراصير في الشارقة | آفاق الحياة",
    },
    h1: {
      en: "Cockroach Control in Sharjah",
      ar: "مكافحة الصراصير في الشارقة",
    },
    metaDescription: {
      en: "Professional cockroach control in Sharjah from AFAQ AL HAYAT — inspection, treatment, and prevention guidance for homes and businesses.",
      ar: "مكافحة احترافية للصراصير في الشارقة من آفاق الحياة — فحص وعلاج وإرشادات وقائية للمنازل والمنشآت التجارية.",
    },
    intro: {
      en: "Sharjah's warm, humid climate — especially near the coast and in kitchens and utility areas — creates favorable conditions for cockroach activity. AFAQ AL HAYAT provides professional cockroach control across communities from Al Zahia and Aljada to Tilal City.",
      ar: "يهيئ مناخ الشارقة الدافئ والرطب — لا سيما بالقرب من الساحل وفي المطابخ ومناطق الخدمات — بيئة مناسبة لنشاط الصراصير. تقدم آفاق الحياة خدمات مكافحة احترافية للصراصير في مجتمعات تمتد من الزاهية والجادة إلى مدينة تلال.",
    },
    body: [
      {
        en: "Every visit starts with a site inspection to identify entry points and activity areas before any treatment is applied — never a one-size-fits-all approach.",
        ar: "تبدأ كل زيارة بمعاينة الموقع لتحديد نقاط الدخول ومناطق النشاط قبل تطبيق أي علاج — دون اعتماد حل موحد للجميع.",
      },
      {
        en: "Kitchens, waste areas, and shared building risers are common focus points in apartment buildings, while gardens and drainage areas are typically checked in villas.",
        ar: "تُعد المطابخ ومناطق النفايات وقنوات الصرف المشتركة نقاط تركيز شائعة في مباني الشقق، بينما تُفحص عادة الحدائق ومناطق الصرف في الفلل.",
      },
      {
        en: "Clear guidance is given before, during, and after treatment, with scheduled maintenance programs available for ongoing protection.",
        ar: "تُقدَّم إرشادات واضحة قبل العلاج وأثناءه وبعده، مع توفر برامج صيانة دورية للحماية المستمرة.",
      },
    ],
    status: "Content added 2026-08-02 (content-integration execution pass) — no price, warranty, or response-time claim included.",
  },
  "ant-control:dubai": {
    title: {
      en: "Ant Control in Dubai | AFAQ AL HAYAT",
      ar: "مكافحة النمل في دبي | آفاق الحياة",
    },
    h1: {
      en: "Ant Control in Dubai",
      ar: "مكافحة النمل في دبي",
    },
    metaDescription: {
      en: "Professional ant control in Dubai from AFAQ AL HAYAT — inspection, treatment, and prevention for villas and apartments across the city.",
      ar: "مكافحة احترافية للنمل في دبي من آفاق الحياة — فحص وعلاج ووقاية للفلل والشقق في جميع أنحاء المدينة.",
    },
    intro: {
      en: "Ant activity in Dubai is common in villa communities with irrigated gardens, such as Arabian Ranches and Dubai Hills Estate, as well as in kitchens and pantries across apartment buildings. AFAQ AL HAYAT provides professional ant control across the city.",
      ar: "يُعد نشاط النمل شائعًا في مجتمعات الفلل ذات الحدائق المروية في دبي، مثل المرابع العربية ودبي هيلز استيت، وكذلك في المطابخ والمخازن عبر مباني الشقق. تقدم آفاق الحياة خدمات مكافحة احترافية للنمل في جميع أنحاء المدينة.",
    },
    body: [
      {
        en: "A site inspection traces trails back to entry points and nesting areas — often near irrigation lines, skirting, or kitchen units — rather than treating only the visible trail.",
        ar: "يتتبع فحص الموقع مسارات النمل للوصول إلى نقاط الدخول ومناطق التعشيش — غالبًا بالقرب من خطوط الري أو الألواح السفلية أو وحدات المطبخ — بدلًا من الاكتفاء بمعالجة المسار الظاهر فقط.",
      },
      {
        en: "Treatment is matched to the property type: garden and perimeter treatment for villas, and targeted indoor treatment for apartments.",
        ar: "يُخصَّص العلاج وفق نوع العقار: معالجة الحديقة والمحيط الخارجي للفلل، ومعالجة داخلية مركّزة للشقق.",
      },
      {
        en: "Follow-up support is available if activity continues after the initial visit.",
        ar: "تتوفر متابعة دعم إضافية في حال استمرار النشاط بعد الزيارة الأولى.",
      },
    ],
    status: "Content added 2026-08-02 (content-integration execution pass) — no price, warranty, or response-time claim included.",
  },
  "bed-bug-control:abu-dhabi": {
    title: {
      en: "Bed Bug Control in Abu Dhabi | AFAQ AL HAYAT",
      ar: "مكافحة بق الفراش في أبوظبي | آفاق الحياة",
    },
    h1: {
      en: "Bed Bug Control in Abu Dhabi",
      ar: "مكافحة بق الفراش في أبوظبي",
    },
    metaDescription: {
      en: "Professional bed bug control in Abu Dhabi from AFAQ AL HAYAT — inspection and treatment for homes and furnished units.",
      ar: "مكافحة احترافية لبق الفراش في أبوظبي من آفاق الحياة — فحص وعلاج للمنازل والوحدات المفروشة.",
    },
    intro: {
      en: "Bed bugs typically enter a home through travel, secondhand furniture, or shared building risers, making them a concern in both hotel-adjacent communities and long-term residential buildings across Abu Dhabi. AFAQ AL HAYAT provides professional bed bug control across the emirate.",
      ar: "عادة ما يدخل بق الفراش إلى المنزل عبر السفر أو الأثاث المستعمل أو المشتركات بين الوحدات، ما يجعله مصدر قلق في كل من المجتمعات القريبة من الفنادق والمباني السكنية طويلة الأمد في أبوظبي. تقدم آفاق الحياة خدمات مكافحة احترافية لبق الفراش في جميع أنحاء الإمارة.",
    },
    body: [
      {
        en: "A thorough inspection checks mattress seams, bed frames, upholstery, and skirting — the areas bed bugs most commonly hide — before any treatment plan is proposed.",
        ar: "يفحص التفتيش الدقيق حواف المراتب وهياكل الأسرة والمفروشات والألواح السفلية — وهي الأماكن الأكثر شيوعًا لاختباء بق الفراش — قبل اقتراح أي خطة علاج.",
      },
      {
        en: "Clear preparation guidance is given before the visit, since how a room is prepared directly affects treatment effectiveness.",
        ar: "تُقدَّم إرشادات تحضير واضحة قبل الزيارة، لأن طريقة تجهيز الغرفة تؤثر مباشرة على فعالية العلاج.",
      },
      {
        en: "Follow-up support is available after the initial visit, given how persistent an active bed bug infestation can be.",
        ar: "تتوفر متابعة دعم بعد الزيارة الأولى، نظرًا لما قد يتسم به انتشار بق الفراش النشط من استمرارية.",
      },
    ],
    status: "Content added 2026-08-02 (content-integration execution pass) — card image still pending by prior Owner decision; no price, warranty, or response-time claim included.",
  },
  "termite-control:ajman": {
    title: {
      en: "Termite Control in Ajman | AFAQ AL HAYAT",
      ar: "مكافحة النمل الأبيض في عجمان | آفاق الحياة",
    },
    h1: {
      en: "Termite Control in Ajman",
      ar: "مكافحة النمل الأبيض في عجمان",
    },
    metaDescription: {
      en: "Professional termite control in Ajman from AFAQ AL HAYAT — inspection and treatment for villas and buildings across the emirate.",
      ar: "مكافحة احترافية للنمل الأبيض في عجمان من آفاق الحياة — فحص وعلاج للفلل والمباني في جميع أنحاء الإمارة.",
    },
    intro: {
      en: "Coastal humidity in areas such as Ajman Corniche and Al Zorah, combined with irrigated landscaping around villas, can create conditions termites are drawn to, particularly where timber structures or fittings are present. AFAQ AL HAYAT provides professional termite control across Ajman.",
      ar: "يمكن أن تخلق الرطوبة الساحلية في مناطق مثل كورنيش عجمان والزوراء، إلى جانب المساحات الخضراء المروية حول الفلل، بيئة يميل إليها النمل الأبيض، خاصة في وجود هياكل أو تجهيزات خشبية. تقدم آفاق الحياة خدمات مكافحة احترافية للنمل الأبيض في جميع أنحاء عجمان.",
    },
    body: [
      {
        en: "A documented inspection checks foundations, timber fittings, garden beds, and points where soil meets the structure — the areas most relevant to termite activity.",
        ar: "يفحص التفتيش الموثق الأساسات والتجهيزات الخشبية وأحواض الحدائق ونقاط التقاء التربة بالهيكل — وهي المناطق الأكثر صلة بنشاط النمل الأبيض.",
      },
      {
        en: "Because termite damage often isn't visible until it's advanced, early inspection matters more than with most other pests — especially for villas with mature landscaping.",
        ar: "نظرًا لأن أضرار النمل الأبيض غالبًا لا تظهر إلا بعد تفاقمها، يكتسب الفحص المبكر أهمية أكبر مقارنة بمعظم الآفات الأخرى — خاصة في الفلل ذات المساحات الخضراء الناضجة.",
      },
      {
        en: "Guidance is provided on the inspection findings and recommended next steps before any treatment begins.",
        ar: "تُقدَّم إرشادات حول نتائج الفحص والخطوات التالية الموصى بها قبل بدء أي علاج.",
      },
    ],
    status: "Content added 2026-08-02 (content-integration execution pass) — no price, warranty, or response-time claim included.",
  },
  // ---------------------------------------------------------------------
  // Second batch (2026-08-03, local-SEO expansion pass): 9 more combos —
  // one Maintenance, one Cleaning, and one Pest Control page for each of
  // Dubai, Abu Dhabi, and Sharjah — so every priority city now has real
  // coverage across all 3 sections. Each entry below is genuinely unique
  // copy, not a city-name find/replace of shared boilerplate.
  // ---------------------------------------------------------------------
  "plumbing:dubai": {
    title: {
      en: "Plumbing Services in Dubai | AFAQ AL HAYAT",
      ar: "خدمات السباكة في دبي | آفاق الحياة",
    },
    h1: { en: "Plumbing Services in Dubai", ar: "خدمات السباكة في دبي" },
    metaDescription: {
      en: "Professional plumbing services in Dubai from AFAQ AL HAYAT — leak repair, fixture installation, and maintenance for villas and apartments.",
      ar: "خدمات سباكة احترافية في دبي من آفاق الحياة — إصلاح التسريبات وتركيب التجهيزات والصيانة للفلل والشقق.",
    },
    intro: {
      en: "From high-rise apartments in Dubai Marina and Downtown Dubai to villas in Arabian Ranches and Dubai Hills Estate, plumbing needs vary widely across Dubai's building types. AFAQ AL HAYAT provides professional plumbing services across the city.",
      ar: "من الشقق في الأبراج العالية بدبي مارينا ووسط مدينة دبي إلى الفلل في المرابع العربية ودبي هيلز استيت، تتفاوت احتياجات السباكة بشكل كبير عبر أنواع المباني في دبي. تقدم آفاق الحياة خدمات سباكة احترافية في جميع أنحاء المدينة.",
    },
    body: [
      {
        en: "High-rise apartments often deal with water pressure inconsistencies tied to building-wide systems, while villas more commonly need garden irrigation line and outdoor tap repairs alongside standard indoor plumbing.",
        ar: "غالبًا ما تواجه الشقق في الأبراج العالية تفاوتًا في ضغط المياه مرتبطًا بأنظمة المبنى بأكمله، بينما تحتاج الفلل بشكل أكثر شيوعًا إلى إصلاح خطوط ري الحدائق والحنفيات الخارجية إلى جانب السباكة الداخلية المعتادة.",
      },
      {
        en: "A documented inspection identifies the actual source of an issue — a fixture, a connection point, or a building-level factor — rather than treating only the visible symptom.",
        ar: "يحدد الفحص الموثق المصدر الفعلي للمشكلة — تجهيز أو نقطة توصيل أو عامل على مستوى المبنى — بدلًا من معالجة العرض الظاهر فقط.",
      },
      {
        en: "Clear guidance is given before any work begins, whether the job is a quick fixture repair or a more involved leak trace.",
        ar: "تُقدَّم إرشادات واضحة قبل بدء أي عمل، سواء كانت المهمة إصلاح تجهيز سريعًا أو تتبع تسرب أكثر تعقيدًا.",
      },
    ],
    status: "Content added 2026-08-03 (local-SEO expansion pass) — no price, warranty, or response-time claim included.",
  },
  "general-cleaning:dubai": {
    title: {
      en: "Home Cleaning Services in Dubai | AFAQ AL HAYAT",
      ar: "خدمات تنظيف المنازل في دبي | آفاق الحياة",
    },
    h1: { en: "Home Cleaning Services in Dubai", ar: "خدمات تنظيف المنازل في دبي" },
    metaDescription: {
      en: "Professional home cleaning in Dubai from AFAQ AL HAYAT — regular cleaning for villas and apartments across the city.",
      ar: "تنظيف منازل احترافي في دبي من آفاق الحياة — تنظيف منتظم للفلل والشقق في جميع أنحاء المدينة.",
    },
    intro: {
      en: "Dubai's mix of high-rise apartments and larger villa communities means cleaning needs differ by property type — a compact apartment in Downtown Dubai has different upkeep demands than a multi-level villa in Dubai Hills Estate. AFAQ AL HAYAT provides professional cleaning across the city.",
      ar: "يعني تنوع دبي بين الشقق في الأبراج العالية ومجتمعات الفلل الأكبر أن احتياجات التنظيف تختلف حسب نوع العقار — فالشقة المدمجة في وسط مدينة دبي لها متطلبات صيانة مختلفة عن فيلا متعددة الطوابق في دبي هيلز استيت. تقدم آفاق الحياة خدمات تنظيف احترافية في جميع أنحاء المدينة.",
    },
    body: [
      {
        en: "Regular cleaning covers kitchens, bathrooms, floors, and general tidiness on a schedule that fits the household, whether weekly, biweekly, or another routine.",
        ar: "يغطي التنظيف المنتظم المطابخ والحمامات والأرضيات والترتيب العام وفق جدول يناسب المنزل، سواء أسبوعيًا أو كل أسبوعين أو بروتين آخر.",
      },
      {
        en: "Villas typically require more time given their larger floor area and additional rooms, while apartments benefit from a more targeted, efficient pass.",
        ar: "تتطلب الفلل عادة وقتًا أطول نظرًا لمساحتها الأكبر وغرفها الإضافية، بينما تستفيد الشقق من جولة أكثر تركيزًا وكفاءة.",
      },
      {
        en: "Every visit follows the same clear standard regardless of property size, with guidance given on anything that comes up during the clean.",
        ar: "تتبع كل زيارة نفس المعيار الواضح بغض النظر عن حجم العقار، مع تقديم إرشادات حول أي أمر يظهر أثناء التنظيف.",
      },
    ],
    status: "Content added 2026-08-03 (local-SEO expansion pass) — no price, warranty, or response-time claim included.",
  },
  "termite-control:dubai": {
    title: {
      en: "Termite Control in Dubai | AFAQ AL HAYAT",
      ar: "مكافحة النمل الأبيض في دبي | آفاق الحياة",
    },
    h1: { en: "Termite Control in Dubai", ar: "مكافحة النمل الأبيض في دبي" },
    metaDescription: {
      en: "Professional termite control in Dubai from AFAQ AL HAYAT — inspection and treatment for villas and buildings across the city.",
      ar: "مكافحة احترافية للنمل الأبيض في دبي من آفاق الحياة — فحص وعلاج للفلل والمباني في جميع أنحاء المدينة.",
    },
    intro: {
      en: "Villa communities with mature, irrigated landscaping — such as Arabian Ranches, Al Barari, and Jumeirah Islands — can create conditions termites are drawn to, particularly where timber fittings or structures are present. AFAQ AL HAYAT provides professional termite control across Dubai.",
      ar: "يمكن أن تخلق مجتمعات الفلل ذات المساحات الخضراء المروية الناضجة — مثل المرابع العربية والبراري وجزر جميرا — بيئة يميل إليها النمل الأبيض، خاصة في وجود تجهيزات أو هياكل خشبية. تقدم آفاق الحياة خدمات مكافحة احترافية للنمل الأبيض في جميع أنحاء دبي.",
    },
    body: [
      {
        en: "A documented inspection checks foundations, timber fittings, garden beds, and points where soil meets the structure — the areas most relevant to termite activity in villa properties.",
        ar: "يفحص التفتيش الموثق الأساسات والتجهيزات الخشبية وأحواض الحدائق ونقاط التقاء التربة بالهيكل — وهي المناطق الأكثر صلة بنشاط النمل الأبيض في عقارات الفلل.",
      },
      {
        en: "Because termite damage often stays hidden until it's advanced, an early inspection is worth prioritizing for villas with established gardens or older timber fittings.",
        ar: "نظرًا لأن أضرار النمل الأبيض غالبًا ما تبقى مخفية حتى تتفاقم، يستحق الفحص المبكر الأولوية في الفلل ذات الحدائق الراسخة أو التجهيزات الخشبية الأقدم.",
      },
      {
        en: "Findings and recommended next steps are explained clearly before any treatment begins.",
        ar: "تُشرح النتائج والخطوات التالية الموصى بها بوضوح قبل بدء أي علاج.",
      },
    ],
    status: "Content added 2026-08-03 (local-SEO expansion pass) — no price, warranty, or response-time claim included.",
  },
  "ac-maintenance:abu-dhabi": {
    title: {
      en: "AC Maintenance in Abu Dhabi | AFAQ AL HAYAT",
      ar: "صيانة المكيفات في أبوظبي | آفاق الحياة",
    },
    h1: { en: "AC Maintenance in Abu Dhabi", ar: "صيانة المكيفات في أبوظبي" },
    metaDescription: {
      en: "Professional AC maintenance in Abu Dhabi from AFAQ AL HAYAT — inspection, cleaning, and repair for homes and offices across the emirate.",
      ar: "صيانة احترافية للمكيفات في أبوظبي من آفاق الحياة — فحص وتنظيف وإصلاح للمنازل والمكاتب في جميع أنحاء الإمارة.",
    },
    intro: {
      en: "Abu Dhabi's island communities such as Saadiyat Island and Yas Island, along with established districts like Al Bateen, see AC systems under sustained load through the emirate's long, humid summers. AFAQ AL HAYAT provides professional AC maintenance across Abu Dhabi.",
      ar: "تشهد مجتمعات الجزر في أبوظبي مثل جزيرة السعديات وجزيرة ياس، إلى جانب أحياء راسخة مثل البطين، ضغطًا مستمرًا على أنظمة التكييف خلال أشهر الصيف الطويلة والرطبة في الإمارة. تقدم آفاق الحياة خدمات صيانة احترافية للمكيفات في جميع أنحاء أبوظبي.",
    },
    body: [
      {
        en: "A documented inspection covers filters, coils, drainage, and refrigerant performance, identifying issues before they cause a breakdown during peak heat.",
        ar: "يشمل الفحص الموثق الفلاتر والملفات والصرف وأداء غاز التبريد، لتحديد المشكلات قبل أن تتسبب في عطل خلال ذروة الحرارة.",
      },
      {
        en: "Coastal humidity near island communities can accelerate dust and moisture buildup in outdoor units, making regular servicing especially useful in these areas.",
        ar: "يمكن أن تسرّع الرطوبة الساحلية بالقرب من مجتمعات الجزر من تراكم الغبار والرطوبة في الوحدات الخارجية، ما يجعل الصيانة الدورية مفيدة بشكل خاص في هذه المناطق.",
      },
      {
        en: "The same clear, explained process applies whether the system is a central setup in a villa or a split unit in an apartment.",
        ar: "تنطبق نفس العملية الواضحة والمشروحة سواء كان النظام مركزيًا في فيلا أو وحدة سبليت في شقة.",
      },
    ],
    status: "Content added 2026-08-03 (local-SEO expansion pass) — no price, warranty, or response-time claim included.",
  },
  "general-cleaning:abu-dhabi": {
    title: {
      en: "Home Cleaning Services in Abu Dhabi | AFAQ AL HAYAT",
      ar: "خدمات تنظيف المنازل في أبوظبي | آفاق الحياة",
    },
    h1: { en: "Home Cleaning Services in Abu Dhabi", ar: "خدمات تنظيف المنازل في أبوظبي" },
    metaDescription: {
      en: "Professional home cleaning in Abu Dhabi from AFAQ AL HAYAT — regular cleaning for villas and apartments across the emirate.",
      ar: "تنظيف منازل احترافي في أبوظبي من آفاق الحياة — تنظيف منتظم للفلل والشقق في جميع أنحاء الإمارة.",
    },
    intro: {
      en: "From apartments in Al Reem Island and Khalifa City to villas in Saadiyat Island and Al Raha Beach, AFAQ AL HAYAT provides professional home cleaning across Abu Dhabi, matched to each property's size and layout.",
      ar: "من الشقق في جزيرة الريم ومدينة خليفة إلى الفلل في جزيرة السعديات وشاطئ الراحة، تقدم آفاق الحياة خدمات تنظيف منزلي احترافية في جميع أنحاء أبوظبي، بما يتناسب مع حجم كل عقار وتصميمه.",
    },
    body: [
      {
        en: "A regular cleaning visit covers kitchens, bathrooms, floors, and general tidiness, scheduled to fit the household's routine.",
        ar: "تغطي زيارة التنظيف المنتظم المطابخ والحمامات والأرضيات والترتيب العام، وتُجدول بما يتناسب مع روتين المنزل.",
      },
      {
        en: "Coastal humidity in island communities can make bathrooms and kitchens require more frequent attention than in drier inland areas.",
        ar: "يمكن أن تجعل الرطوبة الساحلية في مجتمعات الجزر الحمامات والمطابخ بحاجة إلى اهتمام أكثر تكرارًا مقارنة بالمناطق الداخلية الأكثر جفافًا.",
      },
      {
        en: "The same clear cleaning standard is applied on every visit, with any additional concerns flagged directly to the customer.",
        ar: "يُطبَّق نفس معيار التنظيف الواضح في كل زيارة، مع الإشارة إلى أي مخاوف إضافية مباشرة للعميل.",
      },
    ],
    status: "Content added 2026-08-03 (local-SEO expansion pass) — no price, warranty, or response-time claim included.",
  },
  "cockroach-control:abu-dhabi": {
    title: {
      en: "Cockroach Control in Abu Dhabi | AFAQ AL HAYAT",
      ar: "مكافحة الصراصير في أبوظبي | آفاق الحياة",
    },
    h1: { en: "Cockroach Control in Abu Dhabi", ar: "مكافحة الصراصير في أبوظبي" },
    metaDescription: {
      en: "Professional cockroach control in Abu Dhabi from AFAQ AL HAYAT — inspection, treatment, and prevention guidance for homes and businesses.",
      ar: "مكافحة احترافية للصراصير في أبوظبي من آفاق الحياة — فحص وعلاج وإرشادات وقائية للمنازل والمنشآت التجارية.",
    },
    intro: {
      en: "Abu Dhabi's coastal humidity, especially around island communities like Al Reem Island and Saadiyat Island, creates favorable conditions for cockroach activity in kitchens and utility areas. AFAQ AL HAYAT provides professional cockroach control across the emirate.",
      ar: "تخلق الرطوبة الساحلية في أبوظبي، خاصة حول مجتمعات الجزر مثل جزيرة الريم وجزيرة السعديات، بيئة مناسبة لنشاط الصراصير في المطابخ ومناطق الخدمات. تقدم آفاق الحياة خدمات مكافحة احترافية للصراصير في جميع أنحاء الإمارة.",
    },
    body: [
      {
        en: "A site inspection identifies entry points and activity areas before any treatment is applied, rather than a one-size-fits-all approach.",
        ar: "يحدد فحص الموقع نقاط الدخول ومناطق النشاط قبل تطبيق أي علاج، بدلًا من اعتماد حل موحد للجميع.",
      },
      {
        en: "High-rise apartment buildings often need attention to shared risers and waste areas in addition to individual units, while villas typically require checks around gardens and drainage points as well.",
        ar: "غالبًا ما تحتاج مباني الشقق العالية إلى اهتمام بقنوات الصرف المشتركة ومناطق النفايات إضافة إلى الوحدات الفردية، بينما تتطلب الفلل عادة فحوصات حول الحدائق ونقاط الصرف أيضًا.",
      },
      {
        en: "Clear guidance is given before, during, and after treatment, with scheduled maintenance programs available for ongoing protection.",
        ar: "تُقدَّم إرشادات واضحة قبل العلاج وأثناءه وبعده، مع توفر برامج صيانة دورية للحماية المستمرة.",
      },
    ],
    status: "Content added 2026-08-03 (local-SEO expansion pass) — no price, warranty, or response-time claim included.",
  },
  "electrical-maintenance:sharjah": {
    title: {
      en: "Electrical Maintenance in Sharjah | AFAQ AL HAYAT",
      ar: "الصيانة الكهربائية في الشارقة | آفاق الحياة",
    },
    h1: { en: "Electrical Maintenance in Sharjah", ar: "الصيانة الكهربائية في الشارقة" },
    metaDescription: {
      en: "Professional electrical maintenance in Sharjah from AFAQ AL HAYAT — inspections, repairs, and fixture work for homes and offices.",
      ar: "صيانة كهربائية احترافية في الشارقة من آفاق الحياة — فحوصات وإصلاحات وأعمال تجهيزات للمنازل والمكاتب.",
    },
    intro: {
      en: "Sharjah's mix of established neighborhoods and newer developments such as Aljada and Al Zahia means electrical systems range from older wiring that may not match current usage to newly installed panels in freshly handed-over units. AFAQ AL HAYAT provides professional electrical services across the emirate.",
      ar: "يعني تنوع الشارقة بين الأحياء الراسخة والتطويرات الأحدث مثل الجادة والزاهية أن الأنظمة الكهربائية تتراوح بين أسلاك أقدم قد لا تتناسب مع الاستخدام الحالي ولوحات حديثة التركيب في وحدات حديثة التسليم. تقدم آفاق الحياة خدمات كهربائية احترافية في جميع أنحاء الإمارة.",
    },
    body: [
      {
        en: "Typical work includes circuit breaker and distribution board checks, socket and switch repair or replacement, and tracing the cause of recurring trips or flickering lights.",
        ar: "تشمل الأعمال المعتادة فحص قواطع الدائرة ولوحات التوزيع، وإصلاح أو استبدال المقابس والمفاتيح، وتحديد سبب الانقطاعات المتكررة أو وميض الإضاءة.",
      },
      {
        en: "A documented inspection checks wiring condition rather than just the visible symptom, which matters most in older buildings where usage has grown beyond the original electrical design.",
        ar: "يفحص التفتيش الموثق حالة الأسلاك وليس فقط العرض الظاهر، وهو أمر مهم بشكل خاص في المباني الأقدم حيث نما الاستخدام بما يتجاوز التصميم الكهربائي الأصلي.",
      },
      {
        en: "Power is always isolated before any panel or fitting is opened, with clear guidance given on what was found and what was done.",
        ar: "يتم دائمًا فصل التيار الكهربائي قبل فتح أي لوحة أو تجهيز، مع تقديم إرشادات واضحة حول ما تم اكتشافه وما تم تنفيذه.",
      },
    ],
    status: "Content added 2026-08-03 (local-SEO expansion pass) — no price, warranty, or response-time claim included.",
  },
  "general-cleaning:sharjah": {
    title: {
      en: "Home Cleaning Services in Sharjah | AFAQ AL HAYAT",
      ar: "خدمات تنظيف المنازل في الشارقة | آفاق الحياة",
    },
    h1: { en: "Home Cleaning Services in Sharjah", ar: "خدمات تنظيف المنازل في الشارقة" },
    metaDescription: {
      en: "Professional home cleaning in Sharjah from AFAQ AL HAYAT — regular cleaning for homes and offices across the emirate.",
      ar: "تنظيف منازل احترافي في الشارقة من آفاق الحياة — تنظيف منتظم للمنازل والمكاتب في جميع أنحاء الإمارة.",
    },
    intro: {
      en: "From newer communities such as Aljada and Al Zahia to established neighborhoods across Sharjah, AFAQ AL HAYAT provides professional home cleaning matched to each property's needs.",
      ar: "من المجتمعات الأحدث مثل الجادة والزاهية إلى الأحياء الراسخة في جميع أنحاء الشارقة، تقدم آفاق الحياة خدمات تنظيف منزلي احترافية بما يتناسب مع احتياجات كل عقار.",
    },
    body: [
      {
        en: "Regular cleaning covers kitchens, bathrooms, floors, and general tidiness, on a schedule that fits the household.",
        ar: "يغطي التنظيف المنتظم المطابخ والحمامات والأرضيات والترتيب العام، وفق جدول يناسب المنزل.",
      },
      {
        en: "Newly handed-over units in developments like Aljada often need a more thorough initial clean to remove construction dust before switching to a regular routine.",
        ar: "غالبًا ما تحتاج الوحدات حديثة التسليم في تطويرات مثل الجادة إلى تنظيف أولي أكثر شمولًا لإزالة غبار البناء قبل الانتقال إلى روتين منتظم.",
      },
      {
        en: "Every visit follows the same clear standard, with guidance given on anything that comes up during the clean.",
        ar: "تتبع كل زيارة نفس المعيار الواضح، مع تقديم إرشادات حول أي أمر يظهر أثناء التنظيف.",
      },
    ],
    status: "Content added 2026-08-03 (local-SEO expansion pass) — no price, warranty, or response-time claim included.",
  },
  "ant-control:sharjah": {
    title: {
      en: "Ant Control in Sharjah | AFAQ AL HAYAT",
      ar: "مكافحة النمل في الشارقة | آفاق الحياة",
    },
    h1: { en: "Ant Control in Sharjah", ar: "مكافحة النمل في الشارقة" },
    metaDescription: {
      en: "Professional ant control in Sharjah from AFAQ AL HAYAT — inspection, treatment, and prevention for homes across the emirate.",
      ar: "مكافحة احترافية للنمل في الشارقة من آفاق الحياة — فحص وعلاج ووقاية للمنازل في جميع أنحاء الإمارة.",
    },
    intro: {
      en: "Ant activity in Sharjah is common in kitchens and pantries across apartment buildings, as well as in villa gardens in communities such as Tilal City and Al Zahia. AFAQ AL HAYAT provides professional ant control across the emirate.",
      ar: "يُعد نشاط النمل شائعًا في المطابخ والمخازن عبر مباني الشقق في الشارقة، وكذلك في حدائق الفلل في مجتمعات مثل مدينة تلال والزاهية. تقدم آفاق الحياة خدمات مكافحة احترافية للنمل في جميع أنحاء الإمارة.",
    },
    body: [
      {
        en: "A site inspection traces trails back to entry points and nesting areas rather than treating only the visible trail.",
        ar: "يتتبع فحص الموقع مسارات النمل للوصول إلى نقاط الدخول ومناطق التعشيش بدلًا من الاكتفاء بمعالجة المسار الظاهر فقط.",
      },
      {
        en: "Treatment is matched to the property type: garden and perimeter treatment for villas, and targeted indoor treatment for apartments.",
        ar: "يُخصَّص العلاج وفق نوع العقار: معالجة الحديقة والمحيط الخارجي للفلل، ومعالجة داخلية مركّزة للشقق.",
      },
      {
        en: "Follow-up support is available if activity continues after the initial visit.",
        ar: "تتوفر متابعة دعم إضافية في حال استمرار النشاط بعد الزيارة الأولى.",
      },
    ],
    status: "Content added 2026-08-03 (local-SEO expansion pass) — no price, warranty, or response-time claim included.",
  },
  // ---------------------------------------------------------------------
  // Third batch (2026-08-04, final website completion pass): 11 more
  // combos, closing the gap for the 4 emirates that had zero Service+City
  // coverage (Ajman had only Termite Control; Umm Al Quwain, Ras Al
  // Khaimah, and Fujairah had none). Every emirate now has real coverage
  // across all 3 sections (Maintenance, Cleaning, Pest Control).
  // ---------------------------------------------------------------------
  "plumbing:ajman": {
    title: { en: "Plumbing Services in Ajman | AFAQ AL HAYAT", ar: "خدمات السباكة في عجمان | آفاق الحياة" },
    h1: { en: "Plumbing Services in Ajman", ar: "خدمات السباكة في عجمان" },
    metaDescription: {
      en: "Professional plumbing services in Ajman from AFAQ AL HAYAT — leak repair, fixture installation, and maintenance for homes and offices.",
      ar: "خدمات سباكة احترافية في عجمان من آفاق الحياة — إصلاح التسريبات وتركيب التجهيزات والصيانة للمنازل والمكاتب.",
    },
    intro: {
      en: "From Ajman Corniche to waterfront communities such as Al Zorah, AFAQ AL HAYAT provides professional plumbing services across Ajman for homes and businesses.",
      ar: "من كورنيش عجمان إلى المجتمعات الساحلية مثل الزوراء، تقدم آفاق الحياة خدمات سباكة احترافية في جميع أنحاء عجمان للمنازل والمنشآت التجارية.",
    },
    body: [
      { en: "Common requests include leak detection and repair, fixing low water pressure, unblocking drains, and installing or replacing taps and fittings.", ar: "تشمل الطلبات الشائعة الكشف عن التسريبات وإصلاحها، ومعالجة ضعف ضغط المياه، وتسليك المصارف، وتركيب أو استبدال الحنفيات والتجهيزات." },
      { en: "Waterfront properties near the Corniche and Al Zorah can see faster corrosion in exposed fittings, so a documented inspection checks connection points, not just the visible fixture.", ar: "قد تشهد العقارات القريبة من الكورنيش والزوراء تآكلًا أسرع في التجهيزات المكشوفة، لذا يفحص التفتيش الموثق نقاط التوصيل وليس فقط التجهيز الظاهر." },
      { en: "Clear guidance is given before any work begins.", ar: "تُقدَّم إرشادات واضحة قبل بدء أي عمل." },
    ],
    status: "Content added 2026-08-04 (final website completion pass) — no price, warranty, or response-time claim included.",
  },
  "general-cleaning:ajman": {
    title: { en: "Home Cleaning Services in Ajman | AFAQ AL HAYAT", ar: "خدمات تنظيف المنازل في عجمان | آفاق الحياة" },
    h1: { en: "Home Cleaning Services in Ajman", ar: "خدمات تنظيف المنازل في عجمان" },
    metaDescription: {
      en: "Professional home cleaning in Ajman from AFAQ AL HAYAT — regular cleaning for villas and apartments across the emirate.",
      ar: "تنظيف منازل احترافي في عجمان من آفاق الحياة — تنظيف منتظم للفلل والشقق في جميع أنحاء الإمارة.",
    },
    intro: {
      en: "From apartments near Ajman Corniche to villas in communities such as Al Zorah, AFAQ AL HAYAT provides professional home cleaning across Ajman.",
      ar: "من الشقق القريبة من كورنيش عجمان إلى الفلل في مجتمعات مثل الزوراء، تقدم آفاق الحياة خدمات تنظيف منزلي احترافية في جميع أنحاء عجمان.",
    },
    body: [
      { en: "Regular cleaning covers kitchens, bathrooms, floors, and general tidiness, scheduled to fit the household.", ar: "يغطي التنظيف المنتظم المطابخ والحمامات والأرضيات والترتيب العام، وفق جدول يناسب المنزل." },
      { en: "Coastal humidity near the Corniche can make bathrooms need more frequent attention than inland areas.", ar: "يمكن أن تجعل الرطوبة الساحلية قرب الكورنيش الحمامات بحاجة إلى اهتمام أكثر تكرارًا مقارنة بالمناطق الداخلية." },
      { en: "Every visit follows the same clear standard, with any additional concerns flagged directly to the customer.", ar: "تتبع كل زيارة نفس المعيار الواضح، مع الإشارة إلى أي مخاوف إضافية مباشرة للعميل." },
    ],
    status: "Content added 2026-08-04 (final website completion pass) — no price, warranty, or response-time claim included.",
  },
  "ac-maintenance:umm-al-quwain": {
    title: { en: "AC Maintenance in Umm Al Quwain | AFAQ AL HAYAT", ar: "صيانة المكيفات في أم القيوين | آفاق الحياة" },
    h1: { en: "AC Maintenance in Umm Al Quwain", ar: "صيانة المكيفات في أم القيوين" },
    metaDescription: {
      en: "Professional AC maintenance in Umm Al Quwain from AFAQ AL HAYAT — inspection, cleaning, and repair for homes and businesses.",
      ar: "صيانة احترافية للمكيفات في أم القيوين من آفاق الحياة — فحص وتنظيف وإصلاح للمنازل والمنشآت.",
    },
    intro: {
      en: "From the marina area to Al Khor, AFAQ AL HAYAT provides professional AC maintenance across Umm Al Quwain, helping units run efficiently through the UAE's long summer.",
      ar: "من منطقة المرسى إلى الخور، تقدم آفاق الحياة خدمات صيانة احترافية للمكيفات في جميع أنحاء أم القيوين، للمساعدة في كفاءة عمل الوحدات طوال صيف الإمارات الطويل.",
    },
    body: [
      { en: "A documented inspection covers filters, coils, drainage, and refrigerant performance, identifying issues before they cause a breakdown during peak heat.", ar: "يشمل الفحص الموثق الفلاتر والملفات والصرف وأداء غاز التبريد، لتحديد المشكلات قبل أن تتسبب في عطل خلال ذروة الحرارة." },
      { en: "Coastal humidity near the marina can accelerate dust and moisture buildup in outdoor units.", ar: "يمكن أن تسرّع الرطوبة الساحلية قرب المرسى من تراكم الغبار والرطوبة في الوحدات الخارجية." },
      { en: "The same clear, explained process applies to both central and split-unit systems.", ar: "تنطبق نفس العملية الواضحة والمشروحة على الأنظمة المركزية ووحدات السبليت." },
    ],
    status: "Content added 2026-08-04 (final website completion pass) — no price, warranty, or response-time claim included.",
  },
  "general-cleaning:umm-al-quwain": {
    title: { en: "Home Cleaning Services in Umm Al Quwain | AFAQ AL HAYAT", ar: "خدمات تنظيف المنازل في أم القيوين | آفاق الحياة" },
    h1: { en: "Home Cleaning Services in Umm Al Quwain", ar: "خدمات تنظيف المنازل في أم القيوين" },
    metaDescription: {
      en: "Professional home cleaning in Umm Al Quwain from AFAQ AL HAYAT — regular cleaning for homes across the emirate.",
      ar: "تنظيف منازل احترافي في أم القيوين من آفاق الحياة — تنظيف منتظم للمنازل في جميع أنحاء الإمارة.",
    },
    intro: {
      en: "AFAQ AL HAYAT provides professional home cleaning across Umm Al Quwain, from the marina area to Al Khor, matched to each property's size and layout.",
      ar: "تقدم آفاق الحياة خدمات تنظيف منزلي احترافية في جميع أنحاء أم القيوين، من منطقة المرسى إلى الخور، بما يتناسب مع حجم كل عقار وتصميمه.",
    },
    body: [
      { en: "A regular cleaning visit covers kitchens, bathrooms, floors, and general tidiness, scheduled to fit the household's routine.", ar: "تغطي زيارة التنظيف المنتظم المطابخ والحمامات والأرضيات والترتيب العام، وتُجدول بما يتناسب مع روتين المنزل." },
      { en: "Villas with gardens typically need more time than compact apartments, and scheduling reflects that difference.", ar: "تحتاج الفلل ذات الحدائق عادة إلى وقت أطول من الشقق المدمجة، وتعكس الجدولة ذلك الفرق." },
      { en: "The same clear cleaning standard is applied on every visit.", ar: "يُطبَّق نفس معيار التنظيف الواضح في كل زيارة." },
    ],
    status: "Content added 2026-08-04 (final website completion pass) — no price, warranty, or response-time claim included.",
  },
  "rodent-control:umm-al-quwain": {
    title: { en: "Rodent Control in Umm Al Quwain | AFAQ AL HAYAT", ar: "مكافحة القوارض في أم القيوين | آفاق الحياة" },
    h1: { en: "Rodent Control in Umm Al Quwain", ar: "مكافحة القوارض في أم القيوين" },
    metaDescription: {
      en: "Professional rodent control in Umm Al Quwain from AFAQ AL HAYAT — inspection, treatment, and prevention guidance for homes and businesses.",
      ar: "مكافحة احترافية للقوارض في أم القيوين من آفاق الحياة — فحص وعلاج وإرشادات وقائية للمنازل والمنشآت.",
    },
    intro: {
      en: "Rodents are typically drawn to properties with easy access to food and shelter, from waterfront areas near the marina to inland homes across Umm Al Quwain. AFAQ AL HAYAT provides professional rodent control across the emirate.",
      ar: "ينجذب القوارض عادة إلى العقارات التي يسهل الوصول فيها إلى الطعام والمأوى، من المناطق الساحلية قرب المرسى إلى المنازل الداخلية في أم القيوين. تقدم آفاق الحياة خدمات مكافحة احترافية للقوارض في جميع أنحاء الإمارة.",
    },
    body: [
      { en: "A site inspection identifies entry points, nesting areas, and activity signs before any treatment is applied.", ar: "يحدد فحص الموقع نقاط الدخول ومناطق التعشيش وعلامات النشاط قبل تطبيق أي علاج." },
      { en: "Garden areas, garages, and roof spaces are common focus points in villas, while shared risers and waste areas matter most in apartment buildings.", ar: "تُعد مناطق الحدائق والمرائب وفراغات السقف نقاط تركيز شائعة في الفلل، بينما تهم قنوات الصرف المشتركة ومناطق النفايات أكثر في مباني الشقق." },
      { en: "Clear guidance is given on prevention alongside the treatment itself.", ar: "تُقدَّم إرشادات وقائية واضحة إلى جانب العلاج نفسه." },
    ],
    status: "Content added 2026-08-04 (final website completion pass) — no price, warranty, or response-time claim included.",
  },
  "electrical-maintenance:ras-al-khaimah": {
    title: { en: "Electrical Maintenance in Ras Al Khaimah | AFAQ AL HAYAT", ar: "الصيانة الكهربائية في رأس الخيمة | آفاق الحياة" },
    h1: { en: "Electrical Maintenance in Ras Al Khaimah", ar: "الصيانة الكهربائية في رأس الخيمة" },
    metaDescription: {
      en: "Professional electrical maintenance in Ras Al Khaimah from AFAQ AL HAYAT — inspections, repairs, and fixture work for homes and offices.",
      ar: "صيانة كهربائية احترافية في رأس الخيمة من آفاق الحياة — فحوصات وإصلاحات وأعمال تجهيزات للمنازل والمكاتب.",
    },
    intro: {
      en: "From island communities like Al Marjan Island and Mina Al Arab to villages such as Al Hamra Village, AFAQ AL HAYAT provides professional electrical services across Ras Al Khaimah.",
      ar: "من مجتمعات الجزر مثل جزيرة المرجان وميناء العرب إلى قرى مثل قرية الحمراء، تقدم آفاق الحياة خدمات كهربائية احترافية في جميع أنحاء رأس الخيمة.",
    },
    body: [
      { en: "Typical work includes circuit breaker and distribution board checks, socket and switch repair, and tracing the cause of recurring trips or flickering.", ar: "تشمل الأعمال المعتادة فحص قواطع الدائرة ولوحات التوزيع، وإصلاح المقابس والمفاتيح، وتحديد سبب الانقطاعات المتكررة أو الوميض." },
      { en: "A documented inspection checks wiring condition rather than just the visible symptom.", ar: "يفحص التفتيش الموثق حالة الأسلاك وليس فقط العرض الظاهر." },
      { en: "Power is always isolated before any panel or fitting is opened, with clear guidance given on findings.", ar: "يتم دائمًا فصل التيار الكهربائي قبل فتح أي لوحة أو تجهيز، مع تقديم إرشادات واضحة حول النتائج." },
    ],
    status: "Content added 2026-08-04 (final website completion pass) — no price, warranty, or response-time claim included.",
  },
  "general-cleaning:ras-al-khaimah": {
    title: { en: "Home Cleaning Services in Ras Al Khaimah | AFAQ AL HAYAT", ar: "خدمات تنظيف المنازل في رأس الخيمة | آفاق الحياة" },
    h1: { en: "Home Cleaning Services in Ras Al Khaimah", ar: "خدمات تنظيف المنازل في رأس الخيمة" },
    metaDescription: {
      en: "Professional home cleaning in Ras Al Khaimah from AFAQ AL HAYAT — regular cleaning for villas and apartments across the emirate.",
      ar: "تنظيف منازل احترافي في رأس الخيمة من آفاق الحياة — تنظيف منتظم للفلل والشقق في جميع أنحاء الإمارة.",
    },
    intro: {
      en: "From beachfront communities like Al Marjan Island to inland villages such as Al Hamra Village, AFAQ AL HAYAT provides professional home cleaning across Ras Al Khaimah.",
      ar: "من المجتمعات الساحلية مثل جزيرة المرجان إلى القرى الداخلية مثل قرية الحمراء، تقدم آفاق الحياة خدمات تنظيف منزلي احترافية في جميع أنحاء رأس الخيمة.",
    },
    body: [
      { en: "Regular cleaning covers kitchens, bathrooms, floors, and general tidiness on a schedule that fits the household.", ar: "يغطي التنظيف المنتظم المطابخ والحمامات والأرضيات والترتيب العام وفق جدول يناسب المنزل." },
      { en: "Beachfront properties can see more sand and salt residue tracked indoors, which regular cleaning keeps on top of.", ar: "قد تشهد العقارات الساحلية تراكمًا أكبر للرمل والأملاح داخل المنزل، ويحافظ التنظيف المنتظم على السيطرة عليه." },
      { en: "Every visit follows the same clear standard regardless of property type.", ar: "تتبع كل زيارة نفس المعيار الواضح بغض النظر عن نوع العقار." },
    ],
    status: "Content added 2026-08-04 (final website completion pass) — no price, warranty, or response-time claim included.",
  },
  "cockroach-control:ras-al-khaimah": {
    title: { en: "Cockroach Control in Ras Al Khaimah | AFAQ AL HAYAT", ar: "مكافحة الصراصير في رأس الخيمة | آفاق الحياة" },
    h1: { en: "Cockroach Control in Ras Al Khaimah", ar: "مكافحة الصراصير في رأس الخيمة" },
    metaDescription: {
      en: "Professional cockroach control in Ras Al Khaimah from AFAQ AL HAYAT — inspection, treatment, and prevention guidance for homes and businesses.",
      ar: "مكافحة احترافية للصراصير في رأس الخيمة من آفاق الحياة — فحص وعلاج وإرشادات وقائية للمنازل والمنشآت.",
    },
    intro: {
      en: "Coastal humidity around Al Marjan Island and Mina Al Arab creates favorable conditions for cockroach activity in kitchens and utility areas. AFAQ AL HAYAT provides professional cockroach control across Ras Al Khaimah.",
      ar: "تخلق الرطوبة الساحلية حول جزيرة المرجان وميناء العرب بيئة مناسبة لنشاط الصراصير في المطابخ ومناطق الخدمات. تقدم آفاق الحياة خدمات مكافحة احترافية للصراصير في جميع أنحاء رأس الخيمة.",
    },
    body: [
      { en: "A site inspection identifies entry points and activity areas before any treatment is applied.", ar: "يحدد فحص الموقع نقاط الدخول ومناطق النشاط قبل تطبيق أي علاج." },
      { en: "Kitchens and shared building risers are common focus points in apartments, while gardens and drainage areas matter more in villas.", ar: "تُعد المطابخ وقنوات الصرف المشتركة نقاط تركيز شائعة في الشقق، بينما تهم الحدائق ومناطق الصرف أكثر في الفلل." },
      { en: "Clear guidance is given before, during, and after treatment, with scheduled maintenance programs available for ongoing protection.", ar: "تُقدَّم إرشادات واضحة قبل العلاج وأثناءه وبعده، مع توفر برامج صيانة دورية للحماية المستمرة." },
    ],
    status: "Content added 2026-08-04 (final website completion pass) — no price, warranty, or response-time claim included.",
  },
  "plumbing:fujairah": {
    title: { en: "Plumbing Services in Fujairah | AFAQ AL HAYAT", ar: "خدمات السباكة في الفجيرة | آفاق الحياة" },
    h1: { en: "Plumbing Services in Fujairah", ar: "خدمات السباكة في الفجيرة" },
    metaDescription: {
      en: "Professional plumbing services in Fujairah from AFAQ AL HAYAT — leak repair, fixture installation, and maintenance for homes and offices.",
      ar: "خدمات سباكة احترافية في الفجيرة من آفاق الحياة — إصلاح التسريبات وتركيب التجهيزات والصيانة للمنازل والمكاتب.",
    },
    intro: {
      en: "From coastal areas like Al Aqah to inland districts such as Al Faseel, AFAQ AL HAYAT provides professional plumbing services across Fujairah.",
      ar: "من المناطق الساحلية مثل العقة إلى الأحياء الداخلية مثل الفصيل، تقدم آفاق الحياة خدمات سباكة احترافية في جميع أنحاء الفجيرة.",
    },
    body: [
      { en: "Common requests include leak detection and repair, fixing low water pressure, unblocking drains, and installing or replacing fixtures.", ar: "تشمل الطلبات الشائعة الكشف عن التسريبات وإصلاحها، ومعالجة ضعف ضغط المياه، وتسليك المصارف، وتركيب أو استبدال التجهيزات." },
      { en: "A documented inspection identifies the actual source of an issue rather than treating only the visible symptom.", ar: "يحدد الفحص الموثق المصدر الفعلي للمشكلة بدلًا من معالجة العرض الظاهر فقط." },
      { en: "Clear guidance is given before any work begins.", ar: "تُقدَّم إرشادات واضحة قبل بدء أي عمل." },
    ],
    status: "Content added 2026-08-04 (final website completion pass) — no price, warranty, or response-time claim included.",
  },
  "general-cleaning:fujairah": {
    title: { en: "Home Cleaning Services in Fujairah | AFAQ AL HAYAT", ar: "خدمات تنظيف المنازل في الفجيرة | آفاق الحياة" },
    h1: { en: "Home Cleaning Services in Fujairah", ar: "خدمات تنظيف المنازل في الفجيرة" },
    metaDescription: {
      en: "Professional home cleaning in Fujairah from AFAQ AL HAYAT — regular cleaning for homes across the emirate.",
      ar: "تنظيف منازل احترافي في الفجيرة من آفاق الحياة — تنظيف منتظم للمنازل في جميع أنحاء الإمارة.",
    },
    intro: {
      en: "From coastal areas like Al Aqah to inland districts such as Al Faseel, AFAQ AL HAYAT provides professional home cleaning across Fujairah.",
      ar: "من المناطق الساحلية مثل العقة إلى الأحياء الداخلية مثل الفصيل، تقدم آفاق الحياة خدمات تنظيف منزلي احترافية في جميع أنحاء الفجيرة.",
    },
    body: [
      { en: "Regular cleaning covers kitchens, bathrooms, floors, and general tidiness on a schedule that fits the household.", ar: "يغطي التنظيف المنتظم المطابخ والحمامات والأرضيات والترتيب العام وفق جدول يناسب المنزل." },
      { en: "Coastal properties near Al Aqah can see more sand tracked indoors, which a regular routine keeps on top of.", ar: "قد تشهد العقارات الساحلية قرب العقة تراكمًا أكبر للرمل داخل المنزل، ويحافظ الروتين المنتظم على السيطرة عليه." },
      { en: "Every visit follows the same clear standard.", ar: "تتبع كل زيارة نفس المعيار الواضح." },
    ],
    status: "Content added 2026-08-04 (final website completion pass) — no price, warranty, or response-time claim included.",
  },
  "ant-control:fujairah": {
    title: { en: "Ant Control in Fujairah | AFAQ AL HAYAT", ar: "مكافحة النمل في الفجيرة | آفاق الحياة" },
    h1: { en: "Ant Control in Fujairah", ar: "مكافحة النمل في الفجيرة" },
    metaDescription: {
      en: "Professional ant control in Fujairah from AFAQ AL HAYAT — inspection, treatment, and prevention for homes across the emirate.",
      ar: "مكافحة احترافية للنمل في الفجيرة من آفاق الحياة — فحص وعلاج ووقاية للمنازل في جميع أنحاء الإمارة.",
    },
    intro: {
      en: "Ant activity in Fujairah is common in kitchens and pantries, as well as in gardens across villa communities near Al Aqah and Al Faseel. AFAQ AL HAYAT provides professional ant control across the emirate.",
      ar: "يُعد نشاط النمل شائعًا في المطابخ والمخازن في الفجيرة، وكذلك في حدائق مجتمعات الفلل قرب العقة والفصيل. تقدم آفاق الحياة خدمات مكافحة احترافية للنمل في جميع أنحاء الإمارة.",
    },
    body: [
      { en: "A site inspection traces trails back to entry points and nesting areas rather than treating only the visible trail.", ar: "يتتبع فحص الموقع مسارات النمل للوصول إلى نقاط الدخول ومناطق التعشيش بدلًا من الاكتفاء بمعالجة المسار الظاهر فقط." },
      { en: "Treatment is matched to the property type: garden and perimeter treatment for villas, and targeted indoor treatment for apartments.", ar: "يُخصَّص العلاج وفق نوع العقار: معالجة الحديقة والمحيط الخارجي للفلل، ومعالجة داخلية مركّزة للشقق." },
      { en: "Follow-up support is available if activity continues after the initial visit.", ar: "تتوفر متابعة دعم إضافية في حال استمرار النشاط بعد الزيارة الأولى." },
    ],
    status: "Content added 2026-08-04 (final website completion pass) — no price, warranty, or response-time claim included.",
  },
  // ---------------------------------------------------------------------
  // Fourth batch (2026-08-05, local SEO expansion phase): 30 more combos,
  // completing full 7-emirate coverage for AC Maintenance, Plumbing,
  // Electrical Maintenance, Cockroach Control, Ant Control, Bed Bug
  // Control, and Termite Control. Each entry is genuinely unique copy —
  // different angle, different referenced community — never a city-name
  // find/replace of shared boilerplate.
  // ---------------------------------------------------------------------
  "ac-maintenance:sharjah": {
    title: { en: "AC Maintenance in Sharjah | AFAQ AL HAYAT", ar: "صيانة المكيفات في الشارقة | آفاق الحياة" },
    h1: { en: "AC Maintenance in Sharjah", ar: "صيانة المكيفات في الشارقة" },
    metaDescription: {
      en: "Professional AC maintenance in Sharjah from AFAQ AL HAYAT — inspection, cleaning, and repair for homes and offices.",
      ar: "صيانة احترافية للمكيفات في الشارقة من آفاق الحياة — فحص وتنظيف وإصلاح للمنازل والمكاتب.",
    },
    intro: {
      en: "From newer communities like Aljada and Al Zahia to older buildings across Sharjah, AC systems face different loads depending on the building's age and insulation. AFAQ AL HAYAT provides professional AC maintenance across the emirate.",
      ar: "من المجتمعات الأحدث مثل الجادة والزاهية إلى المباني الأقدم في الشارقة، تواجه أنظمة التكييف أحمالًا مختلفة حسب عمر المبنى وعزله. تقدم آفاق الحياة خدمات صيانة احترافية للمكيفات في جميع أنحاء الإمارة.",
    },
    body: [
      { en: "Older buildings often need closer attention to duct condition and insulation, while newly handed-over units in developments like Aljada mainly need routine filter and coil care.", ar: "غالبًا ما تحتاج المباني الأقدم إلى اهتمام أدق بحالة مجاري الهواء والعزل، بينما تحتاج الوحدات حديثة التسليم في تطويرات مثل الجادة بشكل أساسي إلى عناية روتينية بالفلاتر والملفات." },
      { en: "A documented inspection identifies the specific cause of reduced cooling rather than assuming the same fix applies everywhere.", ar: "يحدد الفحص الموثق السبب المحدد لضعف التبريد بدلًا من افتراض أن نفس الحل ينطبق على الجميع." },
    ],
    status: "Content added 2026-08-05 (local SEO expansion phase) — no price, warranty, or response-time claim included.",
  },
  "ac-maintenance:ajman": {
    title: { en: "AC Maintenance in Ajman | AFAQ AL HAYAT", ar: "صيانة المكيفات في عجمان | آفاق الحياة" },
    h1: { en: "AC Maintenance in Ajman", ar: "صيانة المكيفات في عجمان" },
    metaDescription: {
      en: "Professional AC maintenance in Ajman from AFAQ AL HAYAT — inspection, cleaning, and repair for homes and businesses.",
      ar: "صيانة احترافية للمكيفات في عجمان من آفاق الحياة — فحص وتنظيف وإصلاح للمنازل والمنشآت.",
    },
    intro: {
      en: "From apartments near Ajman Corniche to villas in Al Zorah, AFAQ AL HAYAT provides professional AC maintenance across Ajman, keeping units running efficiently through the summer.",
      ar: "من الشقق القريبة من كورنيش عجمان إلى الفلل في الزوراء، تقدم آفاق الحياة خدمات صيانة احترافية للمكيفات في جميع أنحاء عجمان، للحفاظ على كفاءة عمل الوحدات طوال الصيف.",
    },
    body: [
      { en: "Coastal humidity near the Corniche can accelerate moisture buildup in coils and drains, making regular servicing especially useful for waterfront properties.", ar: "يمكن أن تسرّع الرطوبة الساحلية قرب الكورنيش من تراكم الرطوبة في الملفات والمصارف، ما يجعل الصيانة الدورية مفيدة بشكل خاص للعقارات الساحلية." },
      { en: "A documented inspection covers filters, coils, drainage, and refrigerant performance before problems cause a breakdown.", ar: "يشمل الفحص الموثق الفلاتر والملفات والصرف وأداء غاز التبريد قبل أن تتسبب المشكلات في عطل." },
    ],
    status: "Content added 2026-08-05 (local SEO expansion phase) — no price, warranty, or response-time claim included.",
  },
  "ac-maintenance:ras-al-khaimah": {
    title: { en: "AC Maintenance in Ras Al Khaimah | AFAQ AL HAYAT", ar: "صيانة المكيفات في رأس الخيمة | آفاق الحياة" },
    h1: { en: "AC Maintenance in Ras Al Khaimah", ar: "صيانة المكيفات في رأس الخيمة" },
    metaDescription: {
      en: "Professional AC maintenance in Ras Al Khaimah from AFAQ AL HAYAT — inspection, cleaning, and repair for villas and apartments.",
      ar: "صيانة احترافية للمكيفات في رأس الخيمة من آفاق الحياة — فحص وتنظيف وإصلاح للفلل والشقق.",
    },
    intro: {
      en: "From beachfront communities like Al Marjan Island to villages such as Al Hamra Village, AFAQ AL HAYAT provides professional AC maintenance across Ras Al Khaimah.",
      ar: "من المجتمعات الساحلية مثل جزيرة المرجان إلى قرى مثل قرية الحمراء، تقدم آفاق الحياة خدمات صيانة احترافية للمكيفات في جميع أنحاء رأس الخيمة.",
    },
    body: [
      { en: "Beachfront units near Al Marjan Island and Mina Al Arab face sustained salt-air exposure, which can affect outdoor unit components faster than inland properties.", ar: "تواجه الوحدات الساحلية قرب جزيرة المرجان وميناء العرب تعرضًا مستمرًا للهواء المالح، ما قد يؤثر على مكونات الوحدة الخارجية أسرع من العقارات الداخلية." },
      { en: "Regular filter and coil care, plus a clear condensate drain, remain the basics that prevent most avoidable breakdowns.", ar: "تبقى العناية المنتظمة بالفلاتر والملفات، إلى جانب مصرف تكثيف خالٍ من الانسداد، الأساسيات التي تمنع معظم الأعطال التي يمكن تجنبها." },
    ],
    status: "Content added 2026-08-05 (local SEO expansion phase) — no price, warranty, or response-time claim included.",
  },
  "ac-maintenance:fujairah": {
    title: { en: "AC Maintenance in Fujairah | AFAQ AL HAYAT", ar: "صيانة المكيفات في الفجيرة | آفاق الحياة" },
    h1: { en: "AC Maintenance in Fujairah", ar: "صيانة المكيفات في الفجيرة" },
    metaDescription: {
      en: "Professional AC maintenance in Fujairah from AFAQ AL HAYAT — inspection, cleaning, and repair for homes across the emirate.",
      ar: "صيانة احترافية للمكيفات في الفجيرة من آفاق الحياة — فحص وتنظيف وإصلاح للمنازل في جميع أنحاء الإمارة.",
    },
    intro: {
      en: "From coastal areas like Al Aqah to inland districts such as Al Faseel, AFAQ AL HAYAT provides professional AC maintenance across Fujairah.",
      ar: "من المناطق الساحلية مثل العقة إلى الأحياء الداخلية مثل الفصيل، تقدم آفاق الحياة خدمات صيانة احترافية للمكيفات في جميع أنحاء الفجيرة.",
    },
    body: [
      { en: "Fujairah's mountainous inland areas can see different dust conditions than coastal spots, both of which affect how often a filter needs attention.", ar: "قد تشهد مناطق الفجيرة الداخلية الجبلية ظروف غبار مختلفة عن المناطق الساحلية، وكلاهما يؤثر على مدى تكرار حاجة الفلتر للعناية." },
      { en: "A documented inspection identifies the actual issue — filter, coil, or drainage — before it causes a breakdown during peak heat.", ar: "يحدد الفحص الموثق المشكلة الفعلية — الفلتر أو الملف أو الصرف — قبل أن تتسبب في عطل خلال ذروة الحرارة." },
    ],
    status: "Content added 2026-08-05 (local SEO expansion phase) — no price, warranty, or response-time claim included.",
  },
  "plumbing:abu-dhabi": {
    title: { en: "Plumbing Services in Abu Dhabi | AFAQ AL HAYAT", ar: "خدمات السباكة في أبوظبي | آفاق الحياة" },
    h1: { en: "Plumbing Services in Abu Dhabi", ar: "خدمات السباكة في أبوظبي" },
    metaDescription: {
      en: "Professional plumbing services in Abu Dhabi from AFAQ AL HAYAT — leak repair, fixture installation, and maintenance.",
      ar: "خدمات سباكة احترافية في أبوظبي من آفاق الحياة — إصلاح التسريبات وتركيب التجهيزات والصيانة.",
    },
    intro: {
      en: "From high-rise apartments in Al Reem Island to villas in Saadiyat Island and Al Raha Beach, AFAQ AL HAYAT provides professional plumbing services across Abu Dhabi.",
      ar: "من الشقق في الأبراج العالية بجزيرة الريم إلى الفلل في جزيرة السعديات وشاطئ الراحة، تقدم آفاق الحياة خدمات سباكة احترافية في جميع أنحاء أبوظبي.",
    },
    body: [
      { en: "High-rise buildings often deal with pressure inconsistencies tied to building-wide systems, while villas more commonly need garden irrigation and outdoor tap repairs.", ar: "غالبًا ما تواجه المباني العالية تفاوتًا في الضغط مرتبطًا بأنظمة المبنى بأكمله، بينما تحتاج الفلل بشكل أكثر شيوعًا إلى إصلاح ري الحدائق والحنفيات الخارجية." },
      { en: "A documented inspection identifies the actual source of an issue rather than treating only the visible symptom.", ar: "يحدد الفحص الموثق المصدر الفعلي للمشكلة بدلًا من معالجة العرض الظاهر فقط." },
    ],
    status: "Content added 2026-08-05 (local SEO expansion phase) — no price, warranty, or response-time claim included.",
  },
  "plumbing:umm-al-quwain": {
    title: { en: "Plumbing Services in Umm Al Quwain | AFAQ AL HAYAT", ar: "خدمات السباكة في أم القيوين | آفاق الحياة" },
    h1: { en: "Plumbing Services in Umm Al Quwain", ar: "خدمات السباكة في أم القيوين" },
    metaDescription: {
      en: "Professional plumbing services in Umm Al Quwain from AFAQ AL HAYAT — leak repair, fixture installation, and maintenance.",
      ar: "خدمات سباكة احترافية في أم القيوين من آفاق الحياة — إصلاح التسريبات وتركيب التجهيزات والصيانة.",
    },
    intro: {
      en: "From the marina area to Al Khor, AFAQ AL HAYAT provides professional plumbing services across Umm Al Quwain for homes and businesses.",
      ar: "من منطقة المرسى إلى الخور، تقدم آفاق الحياة خدمات سباكة احترافية في جميع أنحاء أم القيوين للمنازل والمنشآت.",
    },
    body: [
      { en: "Common requests include leak detection and repair, fixing low water pressure, and installing or replacing taps and fittings.", ar: "تشمل الطلبات الشائعة الكشف عن التسريبات وإصلاحها، ومعالجة ضعف ضغط المياه، وتركيب أو استبدال الحنفيات والتجهيزات." },
      { en: "Every visit follows a clear inspection-then-repair workflow, with guidance given before any work begins.", ar: "تتبع كل زيارة منهجية واضحة تبدأ بالفحص ثم الإصلاح، مع تقديم الإرشادات قبل بدء أي عمل." },
    ],
    status: "Content added 2026-08-05 (local SEO expansion phase) — no price, warranty, or response-time claim included.",
  },
  "plumbing:ras-al-khaimah": {
    title: { en: "Plumbing Services in Ras Al Khaimah | AFAQ AL HAYAT", ar: "خدمات السباكة في رأس الخيمة | آفاق الحياة" },
    h1: { en: "Plumbing Services in Ras Al Khaimah", ar: "خدمات السباكة في رأس الخيمة" },
    metaDescription: {
      en: "Professional plumbing services in Ras Al Khaimah from AFAQ AL HAYAT — leak repair, fixture installation, and maintenance.",
      ar: "خدمات سباكة احترافية في رأس الخيمة من آفاق الحياة — إصلاح التسريبات وتركيب التجهيزات والصيانة.",
    },
    intro: {
      en: "From island communities like Al Marjan Island to villages such as Al Hamra Village, AFAQ AL HAYAT provides professional plumbing services across Ras Al Khaimah.",
      ar: "من مجتمعات الجزر مثل جزيرة المرجان إلى قرى مثل قرية الحمراء، تقدم آفاق الحياة خدمات سباكة احترافية في جميع أنحاء رأس الخيمة.",
    },
    body: [
      { en: "Waterfront properties can see faster corrosion in exposed metal fittings, so a documented inspection checks connection points, not just the visible fixture.", ar: "قد تشهد العقارات الساحلية تآكلًا أسرع في التجهيزات المعدنية المكشوفة، لذا يفحص التفتيش الموثق نقاط التوصيل وليس فقط التجهيز الظاهر." },
      { en: "Clear guidance is given before any work begins, whether it's a quick fixture repair or a more involved leak trace.", ar: "تُقدَّم إرشادات واضحة قبل بدء أي عمل، سواء كانت المهمة إصلاح تجهيز سريعًا أو تتبع تسرب أكثر تعقيدًا." },
    ],
    status: "Content added 2026-08-05 (local SEO expansion phase) — no price, warranty, or response-time claim included.",
  },
  "electrical-maintenance:dubai": {
    title: { en: "Electrical Maintenance in Dubai | AFAQ AL HAYAT", ar: "الصيانة الكهربائية في دبي | آفاق الحياة" },
    h1: { en: "Electrical Maintenance in Dubai", ar: "الصيانة الكهربائية في دبي" },
    metaDescription: {
      en: "Professional electrical maintenance in Dubai from AFAQ AL HAYAT — inspections, repairs, and fixture work for homes and offices.",
      ar: "صيانة كهربائية احترافية في دبي من آفاق الحياة — فحوصات وإصلاحات وأعمال تجهيزات للمنازل والمكاتب.",
    },
    intro: {
      en: "From high-rise towers in Dubai Marina to villas in Jumeirah Islands and Dubai Hills Estate, AFAQ AL HAYAT provides professional electrical services across the city.",
      ar: "من الأبراج العالية في دبي مارينا إلى الفلل في جزر جميرا ودبي هيلز استيت، تقدم آفاق الحياة خدمات كهربائية احترافية في جميع أنحاء المدينة.",
    },
    body: [
      { en: "Typical work includes circuit breaker and distribution board checks, socket and switch repair, and tracing the cause of recurring trips or flickering lights.", ar: "تشمل الأعمال المعتادة فحص قواطع الدائرة ولوحات التوزيع، وإصلاح المقابس والمفاتيح، وتحديد سبب الانقطاعات المتكررة أو وميض الإضاءة." },
      { en: "Power is always isolated before any panel or fitting is opened, with clear guidance given on what was found and what was done.", ar: "يتم دائمًا فصل التيار الكهربائي قبل فتح أي لوحة أو تجهيز، مع تقديم إرشادات واضحة حول ما تم اكتشافه وما تم تنفيذه." },
    ],
    status: "Content added 2026-08-05 (local SEO expansion phase) — no price, warranty, or response-time claim included.",
  },
  "electrical-maintenance:ajman": {
    title: { en: "Electrical Maintenance in Ajman | AFAQ AL HAYAT", ar: "الصيانة الكهربائية في عجمان | آفاق الحياة" },
    h1: { en: "Electrical Maintenance in Ajman", ar: "الصيانة الكهربائية في عجمان" },
    metaDescription: {
      en: "Professional electrical maintenance in Ajman from AFAQ AL HAYAT — inspections, repairs, and fixture work for homes and businesses.",
      ar: "صيانة كهربائية احترافية في عجمان من آفاق الحياة — فحوصات وإصلاحات وأعمال تجهيزات للمنازل والمنشآت.",
    },
    intro: {
      en: "From Ajman Corniche to waterfront communities such as Al Zorah, AFAQ AL HAYAT provides professional electrical services across the emirate.",
      ar: "من كورنيش عجمان إلى المجتمعات الساحلية مثل الزوراء، تقدم آفاق الحياة خدمات كهربائية احترافية في جميع أنحاء الإمارة.",
    },
    body: [
      { en: "A documented inspection checks wiring condition and connection points rather than just the visible symptom.", ar: "يفحص التفتيش الموثق حالة الأسلاك ونقاط التوصيل وليس فقط العرض الظاهر." },
      { en: "Common requests include lighting installation, socket and switch repair, and identifying the cause of a breaker that trips repeatedly.", ar: "تشمل الطلبات الشائعة تركيب الإضاءة، وإصلاح المقابس والمفاتيح، وتحديد سبب انقطاع القاطع بشكل متكرر." },
    ],
    status: "Content added 2026-08-05 (local SEO expansion phase) — no price, warranty, or response-time claim included.",
  },
  "electrical-maintenance:umm-al-quwain": {
    title: { en: "Electrical Maintenance in Umm Al Quwain | AFAQ AL HAYAT", ar: "الصيانة الكهربائية في أم القيوين | آفاق الحياة" },
    h1: { en: "Electrical Maintenance in Umm Al Quwain", ar: "الصيانة الكهربائية في أم القيوين" },
    metaDescription: {
      en: "Professional electrical maintenance in Umm Al Quwain from AFAQ AL HAYAT — inspections, repairs, and fixture work.",
      ar: "صيانة كهربائية احترافية في أم القيوين من آفاق الحياة — فحوصات وإصلاحات وأعمال تجهيزات.",
    },
    intro: {
      en: "AFAQ AL HAYAT provides professional electrical maintenance across Umm Al Quwain, from the marina area to Al Khor, for homes and businesses.",
      ar: "تقدم آفاق الحياة خدمات صيانة كهربائية احترافية في جميع أنحاء أم القيوين، من منطقة المرسى إلى الخور، للمنازل والمنشآت.",
    },
    body: [
      { en: "Typical work includes distribution board checks, socket and switch repair or replacement, and lighting fixture installation.", ar: "تشمل الأعمال المعتادة فحص لوحة التوزيع، وإصلاح أو استبدال المقابس والمفاتيح، وتركيب تجهيزات الإضاءة." },
      { en: "Safety comes first on every visit — power is isolated before any panel is opened.", ar: "السلامة أولاً في كل زيارة — يتم فصل التيار الكهربائي قبل فتح أي لوحة." },
    ],
    status: "Content added 2026-08-05 (local SEO expansion phase) — no price, warranty, or response-time claim included.",
  },
  "electrical-maintenance:fujairah": {
    title: { en: "Electrical Maintenance in Fujairah | AFAQ AL HAYAT", ar: "الصيانة الكهربائية في الفجيرة | آفاق الحياة" },
    h1: { en: "Electrical Maintenance in Fujairah", ar: "الصيانة الكهربائية في الفجيرة" },
    metaDescription: {
      en: "Professional electrical maintenance in Fujairah from AFAQ AL HAYAT — inspections, repairs, and fixture work for homes and offices.",
      ar: "صيانة كهربائية احترافية في الفجيرة من آفاق الحياة — فحوصات وإصلاحات وأعمال تجهيزات للمنازل والمكاتب.",
    },
    intro: {
      en: "From coastal areas like Al Aqah to inland districts such as Al Faseel, AFAQ AL HAYAT provides professional electrical services across Fujairah.",
      ar: "من المناطق الساحلية مثل العقة إلى الأحياء الداخلية مثل الفصيل، تقدم آفاق الحياة خدمات كهربائية احترافية في جميع أنحاء الفجيرة.",
    },
    body: [
      { en: "A documented inspection checks wiring condition and connection points rather than just the visible symptom.", ar: "يفحص التفتيش الموثق حالة الأسلاك ونقاط التوصيل وليس فقط العرض الظاهر." },
      { en: "Clear guidance is given on what was found and what was done after every visit.", ar: "تُقدَّم إرشادات واضحة حول ما تم اكتشافه وما تم تنفيذه بعد كل زيارة." },
    ],
    status: "Content added 2026-08-05 (local SEO expansion phase) — no price, warranty, or response-time claim included.",
  },
  "cockroach-control:dubai": {
    title: { en: "Cockroach Control in Dubai | AFAQ AL HAYAT", ar: "مكافحة الصراصير في دبي | آفاق الحياة" },
    h1: { en: "Cockroach Control in Dubai", ar: "مكافحة الصراصير في دبي" },
    metaDescription: {
      en: "Professional cockroach control in Dubai from AFAQ AL HAYAT — inspection, treatment, and prevention guidance.",
      ar: "مكافحة احترافية للصراصير في دبي من آفاق الحياة — فحص وعلاج وإرشادات وقائية.",
    },
    intro: {
      en: "Cockroach activity in Dubai is common in kitchens across both high-rise apartments in Downtown Dubai and villas in communities like Arabian Ranches. AFAQ AL HAYAT provides professional cockroach control across the city.",
      ar: "يُعد نشاط الصراصير شائعًا في مطابخ كل من الشقق في الأبراج العالية بوسط مدينة دبي والفلل في مجتمعات مثل المرابع العربية. تقدم آفاق الحياة خدمات مكافحة احترافية للصراصير في جميع أنحاء المدينة.",
    },
    body: [
      { en: "A site inspection identifies entry points and activity areas before any treatment is applied — never a one-size-fits-all approach.", ar: "يحدد فحص الموقع نقاط الدخول ومناطق النشاط قبل تطبيق أي علاج — دون اعتماد حل موحد للجميع." },
      { en: "Shared risers and waste areas are common focus points in apartment towers, while gardens and drainage points matter more in villas.", ar: "تُعد قنوات الصرف المشتركة ومناطق النفايات نقاط تركيز شائعة في أبراج الشقق، بينما تهم الحدائق ونقاط الصرف أكثر في الفلل." },
    ],
    status: "Content added 2026-08-05 (local SEO expansion phase) — no price, warranty, or response-time claim included.",
  },
  "cockroach-control:ajman": {
    title: { en: "Cockroach Control in Ajman | AFAQ AL HAYAT", ar: "مكافحة الصراصير في عجمان | آفاق الحياة" },
    h1: { en: "Cockroach Control in Ajman", ar: "مكافحة الصراصير في عجمان" },
    metaDescription: {
      en: "Professional cockroach control in Ajman from AFAQ AL HAYAT — inspection, treatment, and prevention guidance.",
      ar: "مكافحة احترافية للصراصير في عجمان من آفاق الحياة — فحص وعلاج وإرشادات وقائية.",
    },
    intro: {
      en: "Coastal humidity around Ajman Corniche and Al Zorah creates favorable conditions for cockroach activity in kitchens and utility areas. AFAQ AL HAYAT provides professional cockroach control across Ajman.",
      ar: "تخلق الرطوبة الساحلية حول كورنيش عجمان والزوراء بيئة مناسبة لنشاط الصراصير في المطابخ ومناطق الخدمات. تقدم آفاق الحياة خدمات مكافحة احترافية للصراصير في جميع أنحاء عجمان.",
    },
    body: [
      { en: "Every visit starts with a site inspection to identify entry points and activity areas before any treatment is applied.", ar: "تبدأ كل زيارة بمعاينة الموقع لتحديد نقاط الدخول ومناطق النشاط قبل تطبيق أي علاج." },
      { en: "Clear guidance is given before, during, and after treatment, with scheduled maintenance programs available for ongoing protection.", ar: "تُقدَّم إرشادات واضحة قبل العلاج وأثناءه وبعده، مع توفر برامج صيانة دورية للحماية المستمرة." },
    ],
    status: "Content added 2026-08-05 (local SEO expansion phase) — no price, warranty, or response-time claim included.",
  },
  "cockroach-control:umm-al-quwain": {
    title: { en: "Cockroach Control in Umm Al Quwain | AFAQ AL HAYAT", ar: "مكافحة الصراصير في أم القيوين | آفاق الحياة" },
    h1: { en: "Cockroach Control in Umm Al Quwain", ar: "مكافحة الصراصير في أم القيوين" },
    metaDescription: {
      en: "Professional cockroach control in Umm Al Quwain from AFAQ AL HAYAT — inspection, treatment, and prevention guidance.",
      ar: "مكافحة احترافية للصراصير في أم القيوين من آفاق الحياة — فحص وعلاج وإرشادات وقائية.",
    },
    intro: {
      en: "AFAQ AL HAYAT provides professional cockroach control across Umm Al Quwain, from the marina area to Al Khor, for homes and businesses.",
      ar: "تقدم آفاق الحياة خدمات مكافحة احترافية للصراصير في جميع أنحاء أم القيوين، من منطقة المرسى إلى الخور، للمنازل والمنشآت.",
    },
    body: [
      { en: "A site inspection identifies entry points and activity areas before any treatment is applied, rather than a one-size-fits-all approach.", ar: "يحدد فحص الموقع نقاط الدخول ومناطق النشاط قبل تطبيق أي علاج، بدلًا من اعتماد حل موحد للجميع." },
      { en: "Follow-up support and scheduled maintenance programs are available for ongoing protection.", ar: "تتوفر متابعة الدعم وبرامج الصيانة الدورية للحماية المستمرة." },
    ],
    status: "Content added 2026-08-05 (local SEO expansion phase) — no price, warranty, or response-time claim included.",
  },
  "cockroach-control:fujairah": {
    title: { en: "Cockroach Control in Fujairah | AFAQ AL HAYAT", ar: "مكافحة الصراصير في الفجيرة | آفاق الحياة" },
    h1: { en: "Cockroach Control in Fujairah", ar: "مكافحة الصراصير في الفجيرة" },
    metaDescription: {
      en: "Professional cockroach control in Fujairah from AFAQ AL HAYAT — inspection, treatment, and prevention guidance.",
      ar: "مكافحة احترافية للصراصير في الفجيرة من آفاق الحياة — فحص وعلاج وإرشادات وقائية.",
    },
    intro: {
      en: "From coastal areas like Al Aqah to inland districts such as Al Faseel, AFAQ AL HAYAT provides professional cockroach control across Fujairah.",
      ar: "من المناطق الساحلية مثل العقة إلى الأحياء الداخلية مثل الفصيل، تقدم آفاق الحياة خدمات مكافحة احترافية للصراصير في جميع أنحاء الفجيرة.",
    },
    body: [
      { en: "A site inspection identifies entry points and activity areas — kitchens, waste areas, and drainage points — before any treatment is applied.", ar: "يحدد فحص الموقع نقاط الدخول ومناطق النشاط — المطابخ ومناطق النفايات ونقاط الصرف — قبل تطبيق أي علاج." },
      { en: "Clear guidance is given before, during, and after treatment.", ar: "تُقدَّم إرشادات واضحة قبل العلاج وأثناءه وبعده." },
    ],
    status: "Content added 2026-08-05 (local SEO expansion phase) — no price, warranty, or response-time claim included.",
  },
  "ant-control:abu-dhabi": {
    title: { en: "Ant Control in Abu Dhabi | AFAQ AL HAYAT", ar: "مكافحة النمل في أبوظبي | آفاق الحياة" },
    h1: { en: "Ant Control in Abu Dhabi", ar: "مكافحة النمل في أبوظبي" },
    metaDescription: {
      en: "Professional ant control in Abu Dhabi from AFAQ AL HAYAT — inspection, treatment, and prevention for villas and apartments.",
      ar: "مكافحة احترافية للنمل في أبوظبي من آفاق الحياة — فحص وعلاج ووقاية للفلل والشقق.",
    },
    intro: {
      en: "Ant activity in Abu Dhabi is common in villa gardens across communities like Saadiyat Island and Al Raha Beach, as well as kitchens in apartment buildings on Al Reem Island. AFAQ AL HAYAT provides professional ant control across the emirate.",
      ar: "يُعد نشاط النمل شائعًا في حدائق الفلل عبر مجتمعات مثل جزيرة السعديات وشاطئ الراحة، وكذلك في مطابخ مباني الشقق في جزيرة الريم. تقدم آفاق الحياة خدمات مكافحة احترافية للنمل في جميع أنحاء الإمارة.",
    },
    body: [
      { en: "A site inspection traces trails back to entry points and nesting areas — often near irrigation lines or kitchen units — rather than treating only the visible trail.", ar: "يتتبع فحص الموقع مسارات النمل للوصول إلى نقاط الدخول ومناطق التعشيش — غالبًا قرب خطوط الري أو وحدات المطبخ — بدلًا من الاكتفاء بمعالجة المسار الظاهر فقط." },
      { en: "Treatment is matched to the property type: garden and perimeter treatment for villas, and targeted indoor treatment for apartments.", ar: "يُخصَّص العلاج وفق نوع العقار: معالجة الحديقة والمحيط الخارجي للفلل، ومعالجة داخلية مركّزة للشقق." },
    ],
    status: "Content added 2026-08-05 (local SEO expansion phase) — no price, warranty, or response-time claim included.",
  },
  "ant-control:ajman": {
    title: { en: "Ant Control in Ajman | AFAQ AL HAYAT", ar: "مكافحة النمل في عجمان | آفاق الحياة" },
    h1: { en: "Ant Control in Ajman", ar: "مكافحة النمل في عجمان" },
    metaDescription: {
      en: "Professional ant control in Ajman from AFAQ AL HAYAT — inspection, treatment, and prevention for homes.",
      ar: "مكافحة احترافية للنمل في عجمان من آفاق الحياة — فحص وعلاج ووقاية للمنازل.",
    },
    intro: {
      en: "AFAQ AL HAYAT provides professional ant control across Ajman, from apartments near the Corniche to villas in Al Zorah with irrigated gardens.",
      ar: "تقدم آفاق الحياة خدمات مكافحة احترافية للنمل في جميع أنحاء عجمان، من الشقق القريبة من الكورنيش إلى الفلل في الزوراء ذات الحدائق المروية.",
    },
    body: [
      { en: "A site inspection traces trails back to entry points and nesting areas rather than treating only the visible trail.", ar: "يتتبع فحص الموقع مسارات النمل للوصول إلى نقاط الدخول ومناطق التعشيش بدلًا من الاكتفاء بمعالجة المسار الظاهر فقط." },
      { en: "Follow-up support is available if activity continues after the initial visit.", ar: "تتوفر متابعة دعم إضافية في حال استمرار النشاط بعد الزيارة الأولى." },
    ],
    status: "Content added 2026-08-05 (local SEO expansion phase) — no price, warranty, or response-time claim included.",
  },
  "ant-control:ras-al-khaimah": {
    title: { en: "Ant Control in Ras Al Khaimah | AFAQ AL HAYAT", ar: "مكافحة النمل في رأس الخيمة | آفاق الحياة" },
    h1: { en: "Ant Control in Ras Al Khaimah", ar: "مكافحة النمل في رأس الخيمة" },
    metaDescription: {
      en: "Professional ant control in Ras Al Khaimah from AFAQ AL HAYAT — inspection, treatment, and prevention for villas and apartments.",
      ar: "مكافحة احترافية للنمل في رأس الخيمة من آفاق الحياة — فحص وعلاج ووقاية للفلل والشقق.",
    },
    intro: {
      en: "From gardens in Al Hamra Village to apartments near Mina Al Arab, AFAQ AL HAYAT provides professional ant control across Ras Al Khaimah.",
      ar: "من حدائق قرية الحمراء إلى الشقق قرب ميناء العرب، تقدم آفاق الحياة خدمات مكافحة احترافية للنمل في جميع أنحاء رأس الخيمة.",
    },
    body: [
      { en: "Treatment is matched to the property type: garden and perimeter treatment for villas, and targeted indoor treatment for apartments.", ar: "يُخصَّص العلاج وفق نوع العقار: معالجة الحديقة والمحيط الخارجي للفلل، ومعالجة داخلية مركّزة للشقق." },
      { en: "A site inspection identifies the actual entry points rather than treating only the visible trail.", ar: "يحدد فحص الموقع نقاط الدخول الفعلية بدلًا من معالجة المسار الظاهر فقط." },
    ],
    status: "Content added 2026-08-05 (local SEO expansion phase) — no price, warranty, or response-time claim included.",
  },
  "ant-control:umm-al-quwain": {
    title: { en: "Ant Control in Umm Al Quwain | AFAQ AL HAYAT", ar: "مكافحة النمل في أم القيوين | آفاق الحياة" },
    h1: { en: "Ant Control in Umm Al Quwain", ar: "مكافحة النمل في أم القيوين" },
    metaDescription: {
      en: "Professional ant control in Umm Al Quwain from AFAQ AL HAYAT — inspection, treatment, and prevention for homes.",
      ar: "مكافحة احترافية للنمل في أم القيوين من آفاق الحياة — فحص وعلاج ووقاية للمنازل.",
    },
    intro: {
      en: "AFAQ AL HAYAT provides professional ant control across Umm Al Quwain, from the marina area to Al Khor.",
      ar: "تقدم آفاق الحياة خدمات مكافحة احترافية للنمل في جميع أنحاء أم القيوين، من منطقة المرسى إلى الخور.",
    },
    body: [
      { en: "A site inspection traces trails back to entry points and nesting areas rather than treating only the visible trail.", ar: "يتتبع فحص الموقع مسارات النمل للوصول إلى نقاط الدخول ومناطق التعشيش بدلًا من الاكتفاء بمعالجة المسار الظاهر فقط." },
      { en: "Follow-up support is available if activity continues after the initial visit.", ar: "تتوفر متابعة دعم إضافية في حال استمرار النشاط بعد الزيارة الأولى." },
    ],
    status: "Content added 2026-08-05 (local SEO expansion phase) — no price, warranty, or response-time claim included.",
  },
  "bed-bug-control:dubai": {
    title: { en: "Bed Bug Control in Dubai | AFAQ AL HAYAT", ar: "مكافحة بق الفراش في دبي | آفاق الحياة" },
    h1: { en: "Bed Bug Control in Dubai", ar: "مكافحة بق الفراش في دبي" },
    metaDescription: {
      en: "Professional bed bug control in Dubai from AFAQ AL HAYAT — inspection and treatment for homes and furnished units.",
      ar: "مكافحة احترافية لبق الفراش في دبي من آفاق الحياة — فحص وعلاج للمنازل والوحدات المفروشة.",
    },
    intro: {
      en: "Bed bugs typically enter a home through travel, secondhand furniture, or shared building risers — a concern in both short-let apartment towers and long-term villa communities across Dubai. AFAQ AL HAYAT provides professional bed bug control across the city.",
      ar: "عادة ما يدخل بق الفراش إلى المنزل عبر السفر أو الأثاث المستعمل أو المشتركات بين الوحدات — وهو مصدر قلق في كل من أبراج الشقق المؤجرة قصيرة الأجل ومجتمعات الفلل طويلة الأمد في دبي. تقدم آفاق الحياة خدمات مكافحة احترافية لبق الفراش في جميع أنحاء المدينة.",
    },
    body: [
      { en: "A thorough inspection checks mattress seams, bed frames, upholstery, and skirting before any treatment plan is proposed.", ar: "يفحص التفتيش الدقيق حواف المراتب وهياكل الأسرة والمفروشات والألواح السفلية قبل اقتراح أي خطة علاج." },
      { en: "Clear preparation guidance is given before the visit, since how a room is prepared directly affects treatment effectiveness.", ar: "تُقدَّم إرشادات تحضير واضحة قبل الزيارة، لأن طريقة تجهيز الغرفة تؤثر مباشرة على فعالية العلاج." },
    ],
    status: "Content added 2026-08-05 (local SEO expansion phase) — no price, warranty, or response-time claim included.",
  },
  "bed-bug-control:sharjah": {
    title: { en: "Bed Bug Control in Sharjah | AFAQ AL HAYAT", ar: "مكافحة بق الفراش في الشارقة | آفاق الحياة" },
    h1: { en: "Bed Bug Control in Sharjah", ar: "مكافحة بق الفراش في الشارقة" },
    metaDescription: {
      en: "Professional bed bug control in Sharjah from AFAQ AL HAYAT — inspection and treatment for homes and furnished units.",
      ar: "مكافحة احترافية لبق الفراش في الشارقة من آفاق الحياة — فحص وعلاج للمنازل والوحدات المفروشة.",
    },
    intro: {
      en: "AFAQ AL HAYAT provides professional bed bug control across Sharjah, from newer communities like Aljada to established neighborhoods across the emirate.",
      ar: "تقدم آفاق الحياة خدمات مكافحة احترافية لبق الفراش في جميع أنحاء الشارقة، من المجتمعات الأحدث مثل الجادة إلى الأحياء الراسخة في الإمارة.",
    },
    body: [
      { en: "A thorough inspection checks mattress seams, bed frames, upholstery, and skirting — the areas bed bugs most commonly hide.", ar: "يفحص التفتيش الدقيق حواف المراتب وهياكل الأسرة والمفروشات والألواح السفلية — وهي الأماكن الأكثر شيوعًا لاختباء بق الفراش." },
      { en: "Follow-up support is available after the initial visit, given how persistent an active infestation can be.", ar: "تتوفر متابعة دعم بعد الزيارة الأولى، نظرًا لما قد يتسم به انتشار بق الفراش النشط من استمرارية." },
    ],
    status: "Content added 2026-08-05 (local SEO expansion phase) — no price, warranty, or response-time claim included.",
  },
  "bed-bug-control:ajman": {
    title: { en: "Bed Bug Control in Ajman | AFAQ AL HAYAT", ar: "مكافحة بق الفراش في عجمان | آفاق الحياة" },
    h1: { en: "Bed Bug Control in Ajman", ar: "مكافحة بق الفراش في عجمان" },
    metaDescription: {
      en: "Professional bed bug control in Ajman from AFAQ AL HAYAT — inspection and treatment for homes and furnished units.",
      ar: "مكافحة احترافية لبق الفراش في عجمان من آفاق الحياة — فحص وعلاج للمنازل والوحدات المفروشة.",
    },
    intro: {
      en: "AFAQ AL HAYAT provides professional bed bug control across Ajman, for homes near the Corniche and villa communities such as Al Zorah alike.",
      ar: "تقدم آفاق الحياة خدمات مكافحة احترافية لبق الفراش في جميع أنحاء عجمان، للمنازل قرب الكورنيش ومجتمعات الفلل مثل الزوراء على حد سواء.",
    },
    body: [
      { en: "A thorough inspection checks mattress seams, bed frames, and upholstery before any treatment plan is proposed.", ar: "يفحص التفتيش الدقيق حواف المراتب وهياكل الأسرة والمفروشات قبل اقتراح أي خطة علاج." },
      { en: "Clear preparation guidance is given before the visit, since it directly affects treatment effectiveness.", ar: "تُقدَّم إرشادات تحضير واضحة قبل الزيارة، لأنها تؤثر مباشرة على فعالية العلاج." },
    ],
    status: "Content added 2026-08-05 (local SEO expansion phase) — no price, warranty, or response-time claim included.",
  },
  "bed-bug-control:umm-al-quwain": {
    title: { en: "Bed Bug Control in Umm Al Quwain | AFAQ AL HAYAT", ar: "مكافحة بق الفراش في أم القيوين | آفاق الحياة" },
    h1: { en: "Bed Bug Control in Umm Al Quwain", ar: "مكافحة بق الفراش في أم القيوين" },
    metaDescription: {
      en: "Professional bed bug control in Umm Al Quwain from AFAQ AL HAYAT — inspection and treatment for homes.",
      ar: "مكافحة احترافية لبق الفراش في أم القيوين من آفاق الحياة — فحص وعلاج للمنازل.",
    },
    intro: {
      en: "AFAQ AL HAYAT provides professional bed bug control across Umm Al Quwain, from the marina area to Al Khor.",
      ar: "تقدم آفاق الحياة خدمات مكافحة احترافية لبق الفراش في جميع أنحاء أم القيوين، من منطقة المرسى إلى الخور.",
    },
    body: [
      { en: "A thorough inspection checks the areas bed bugs most commonly hide before any treatment plan is proposed.", ar: "يفحص التفتيش الدقيق الأماكن الأكثر شيوعًا لاختباء بق الفراش قبل اقتراح أي خطة علاج." },
      { en: "Follow-up support is available after the initial visit.", ar: "تتوفر متابعة دعم بعد الزيارة الأولى." },
    ],
    status: "Content added 2026-08-05 (local SEO expansion phase) — no price, warranty, or response-time claim included.",
  },
  "bed-bug-control:ras-al-khaimah": {
    title: { en: "Bed Bug Control in Ras Al Khaimah | AFAQ AL HAYAT", ar: "مكافحة بق الفراش في رأس الخيمة | آفاق الحياة" },
    h1: { en: "Bed Bug Control in Ras Al Khaimah", ar: "مكافحة بق الفراش في رأس الخيمة" },
    metaDescription: {
      en: "Professional bed bug control in Ras Al Khaimah from AFAQ AL HAYAT — inspection and treatment for homes and furnished units.",
      ar: "مكافحة احترافية لبق الفراش في رأس الخيمة من آفاق الحياة — فحص وعلاج للمنازل والوحدات المفروشة.",
    },
    intro: {
      en: "AFAQ AL HAYAT provides professional bed bug control across Ras Al Khaimah, from beachfront communities like Al Marjan Island to villages such as Al Hamra Village.",
      ar: "تقدم آفاق الحياة خدمات مكافحة احترافية لبق الفراش في جميع أنحاء رأس الخيمة، من المجتمعات الساحلية مثل جزيرة المرجان إلى قرى مثل قرية الحمراء.",
    },
    body: [
      { en: "A thorough inspection checks mattress seams, bed frames, upholstery, and skirting before any treatment plan is proposed.", ar: "يفحص التفتيش الدقيق حواف المراتب وهياكل الأسرة والمفروشات والألواح السفلية قبل اقتراح أي خطة علاج." },
      { en: "Clear preparation guidance is given before the visit, since it directly affects treatment effectiveness.", ar: "تُقدَّم إرشادات تحضير واضحة قبل الزيارة، لأنها تؤثر مباشرة على فعالية العلاج." },
    ],
    status: "Content added 2026-08-05 (local SEO expansion phase) — no price, warranty, or response-time claim included.",
  },
  "bed-bug-control:fujairah": {
    title: { en: "Bed Bug Control in Fujairah | AFAQ AL HAYAT", ar: "مكافحة بق الفراش في الفجيرة | آفاق الحياة" },
    h1: { en: "Bed Bug Control in Fujairah", ar: "مكافحة بق الفراش في الفجيرة" },
    metaDescription: {
      en: "Professional bed bug control in Fujairah from AFAQ AL HAYAT — inspection and treatment for homes and furnished units.",
      ar: "مكافحة احترافية لبق الفراش في الفجيرة من آفاق الحياة — فحص وعلاج للمنازل والوحدات المفروشة.",
    },
    intro: {
      en: "AFAQ AL HAYAT provides professional bed bug control across Fujairah, from coastal areas like Al Aqah to inland districts such as Al Faseel.",
      ar: "تقدم آفاق الحياة خدمات مكافحة احترافية لبق الفراش في جميع أنحاء الفجيرة، من المناطق الساحلية مثل العقة إلى الأحياء الداخلية مثل الفصيل.",
    },
    body: [
      { en: "A thorough inspection checks the areas bed bugs most commonly hide — mattress seams, bed frames, and upholstery — before any treatment plan is proposed.", ar: "يفحص التفتيش الدقيق الأماكن الأكثر شيوعًا لاختباء بق الفراش — حواف المراتب وهياكل الأسرة والمفروشات — قبل اقتراح أي خطة علاج." },
      { en: "Follow-up support is available after the initial visit.", ar: "تتوفر متابعة دعم بعد الزيارة الأولى." },
    ],
    status: "Content added 2026-08-05 (local SEO expansion phase) — no price, warranty, or response-time claim included.",
  },
  "termite-control:abu-dhabi": {
    title: { en: "Termite Control in Abu Dhabi | AFAQ AL HAYAT", ar: "مكافحة النمل الأبيض في أبوظبي | آفاق الحياة" },
    h1: { en: "Termite Control in Abu Dhabi", ar: "مكافحة النمل الأبيض في أبوظبي" },
    metaDescription: {
      en: "Professional termite control in Abu Dhabi from AFAQ AL HAYAT — inspection and treatment for villas and buildings.",
      ar: "مكافحة احترافية للنمل الأبيض في أبوظبي من آفاق الحياة — فحص وعلاج للفلل والمباني.",
    },
    intro: {
      en: "Villa communities with irrigated landscaping, such as Saadiyat Island and Al Raha Beach, can create conditions termites are drawn to. AFAQ AL HAYAT provides professional termite control across Abu Dhabi.",
      ar: "يمكن أن تخلق مجتمعات الفلل ذات المساحات الخضراء المروية، مثل جزيرة السعديات وشاطئ الراحة، بيئة يميل إليها النمل الأبيض. تقدم آفاق الحياة خدمات مكافحة احترافية للنمل الأبيض في جميع أنحاء أبوظبي.",
    },
    body: [
      { en: "A documented inspection checks foundations, timber fittings, garden beds, and points where soil meets the structure.", ar: "يفحص التفتيش الموثق الأساسات والتجهيزات الخشبية وأحواض الحدائق ونقاط التقاء التربة بالهيكل." },
      { en: "Because termite damage often isn't visible until it's advanced, early inspection matters more than with most other pests.", ar: "نظرًا لأن أضرار النمل الأبيض غالبًا لا تظهر إلا بعد تفاقمها، يكتسب الفحص المبكر أهمية أكبر مقارنة بمعظم الآفات الأخرى." },
    ],
    status: "Content added 2026-08-05 (local SEO expansion phase) — no price, warranty, or response-time claim included.",
  },
  "termite-control:sharjah": {
    title: { en: "Termite Control in Sharjah | AFAQ AL HAYAT", ar: "مكافحة النمل الأبيض في الشارقة | آفاق الحياة" },
    h1: { en: "Termite Control in Sharjah", ar: "مكافحة النمل الأبيض في الشارقة" },
    metaDescription: {
      en: "Professional termite control in Sharjah from AFAQ AL HAYAT — inspection and treatment for villas and buildings.",
      ar: "مكافحة احترافية للنمل الأبيض في الشارقة من آفاق الحياة — فحص وعلاج للفلل والمباني.",
    },
    intro: {
      en: "Older buildings and villa communities with established gardens across Sharjah, including areas like Tilal City, can be more prone to termite activity where timber fittings are present. AFAQ AL HAYAT provides professional termite control across the emirate.",
      ar: "قد تكون المباني الأقدم ومجتمعات الفلل ذات الحدائق الراسخة في الشارقة، بما في ذلك مناطق مثل مدينة تلال، أكثر عرضة لنشاط النمل الأبيض في وجود تجهيزات خشبية. تقدم آفاق الحياة خدمات مكافحة احترافية للنمل الأبيض في جميع أنحاء الإمارة.",
    },
    body: [
      { en: "A documented inspection checks foundations, timber fittings, and points where soil meets the structure.", ar: "يفحص التفتيش الموثق الأساسات والتجهيزات الخشبية ونقاط التقاء التربة بالهيكل." },
      { en: "Findings and recommended next steps are explained clearly before any treatment begins.", ar: "تُشرح النتائج والخطوات التالية الموصى بها بوضوح قبل بدء أي علاج." },
    ],
    status: "Content added 2026-08-05 (local SEO expansion phase) — no price, warranty, or response-time claim included.",
  },
  "termite-control:umm-al-quwain": {
    title: { en: "Termite Control in Umm Al Quwain | AFAQ AL HAYAT", ar: "مكافحة النمل الأبيض في أم القيوين | آفاق الحياة" },
    h1: { en: "Termite Control in Umm Al Quwain", ar: "مكافحة النمل الأبيض في أم القيوين" },
    metaDescription: {
      en: "Professional termite control in Umm Al Quwain from AFAQ AL HAYAT — inspection and treatment for villas and buildings.",
      ar: "مكافحة احترافية للنمل الأبيض في أم القيوين من آفاق الحياة — فحص وعلاج للفلل والمباني.",
    },
    intro: {
      en: "AFAQ AL HAYAT provides professional termite control across Umm Al Quwain, from the marina area to Al Khor, for villas and buildings alike.",
      ar: "تقدم آفاق الحياة خدمات مكافحة احترافية للنمل الأبيض في جميع أنحاء أم القيوين، من منطقة المرسى إلى الخور، للفلل والمباني على حد سواء.",
    },
    body: [
      { en: "A documented inspection checks foundations, timber fittings, and garden beds — the areas most relevant to termite activity.", ar: "يفحص التفتيش الموثق الأساسات والتجهيزات الخشبية وأحواض الحدائق — وهي المناطق الأكثر صلة بنشاط النمل الأبيض." },
      { en: "Guidance is provided on the inspection findings and recommended next steps before any treatment begins.", ar: "تُقدَّم إرشادات حول نتائج الفحص والخطوات التالية الموصى بها قبل بدء أي علاج." },
    ],
    status: "Content added 2026-08-05 (local SEO expansion phase) — no price, warranty, or response-time claim included.",
  },
  "termite-control:ras-al-khaimah": {
    title: { en: "Termite Control in Ras Al Khaimah | AFAQ AL HAYAT", ar: "مكافحة النمل الأبيض في رأس الخيمة | آفاق الحياة" },
    h1: { en: "Termite Control in Ras Al Khaimah", ar: "مكافحة النمل الأبيض في رأس الخيمة" },
    metaDescription: {
      en: "Professional termite control in Ras Al Khaimah from AFAQ AL HAYAT — inspection and treatment for villas and buildings.",
      ar: "مكافحة احترافية للنمل الأبيض في رأس الخيمة من آفاق الحياة — فحص وعلاج للفلل والمباني.",
    },
    intro: {
      en: "Villages with established landscaping, such as Al Hamra Village, along with waterfront communities like Al Marjan Island, can create conditions termites are drawn to. AFAQ AL HAYAT provides professional termite control across Ras Al Khaimah.",
      ar: "يمكن أن تخلق القرى ذات المساحات الخضراء الراسخة، مثل قرية الحمراء، إلى جانب المجتمعات الساحلية مثل جزيرة المرجان، بيئة يميل إليها النمل الأبيض. تقدم آفاق الحياة خدمات مكافحة احترافية للنمل الأبيض في جميع أنحاء رأس الخيمة.",
    },
    body: [
      { en: "A documented inspection checks foundations, timber fittings, garden beds, and points where soil meets the structure.", ar: "يفحص التفتيش الموثق الأساسات والتجهيزات الخشبية وأحواض الحدائق ونقاط التقاء التربة بالهيكل." },
      { en: "Because termite damage often isn't visible until it's advanced, early inspection is worth prioritizing.", ar: "نظرًا لأن أضرار النمل الأبيض غالبًا لا تظهر إلا بعد تفاقمها، يستحق الفحص المبكر الأولوية." },
    ],
    status: "Content added 2026-08-05 (local SEO expansion phase) — no price, warranty, or response-time claim included.",
  },
  "termite-control:fujairah": {
    title: { en: "Termite Control in Fujairah | AFAQ AL HAYAT", ar: "مكافحة النمل الأبيض في الفجيرة | آفاق الحياة" },
    h1: { en: "Termite Control in Fujairah", ar: "مكافحة النمل الأبيض في الفجيرة" },
    metaDescription: {
      en: "Professional termite control in Fujairah from AFAQ AL HAYAT — inspection and treatment for villas and buildings.",
      ar: "مكافحة احترافية للنمل الأبيض في الفجيرة من آفاق الحياة — فحص وعلاج للفلل والمباني.",
    },
    intro: {
      en: "Fujairah's mountainous inland areas and coastal communities like Al Aqah both see villa properties where timber fittings and garden landscaping can attract termites. AFAQ AL HAYAT provides professional termite control across the emirate.",
      ar: "تشهد كل من مناطق الفجيرة الداخلية الجبلية والمجتمعات الساحلية مثل العقة عقارات فلل حيث يمكن أن تجذب التجهيزات الخشبية وتنسيق الحدائق النمل الأبيض. تقدم آفاق الحياة خدمات مكافحة احترافية للنمل الأبيض في جميع أنحاء الإمارة.",
    },
    body: [
      { en: "A documented inspection checks foundations, timber fittings, and points where soil meets the structure.", ar: "يفحص التفتيش الموثق الأساسات والتجهيزات الخشبية ونقاط التقاء التربة بالهيكل." },
      { en: "Guidance is provided on the inspection findings and recommended next steps before any treatment begins.", ar: "تُقدَّم إرشادات حول نتائج الفحص والخطوات التالية الموصى بها قبل بدء أي علاج." },
    ],
    status: "Content added 2026-08-05 (local SEO expansion phase) — no price, warranty, or response-time claim included.",
  },
};

/**
 * Section-level city pages (e.g. "Home Maintenance in Dubai", one level
 * above any specific service). Keyed by `${section}:${citySlug}` using
 * src/lib/catalog/service-sections.ts's ServiceSection values.
 */
export const CITY_SECTION_CONTENT: Record<string, CityContentBlock> = {};

export function getCityServiceContent(
  serviceSlug: string,
  citySlug: string
): CityContentBlock | undefined {
  return CITY_SERVICE_CONTENT[`${serviceSlug}:${citySlug}`];
}

export function getCitySectionContent(
  section: string,
  citySlug: string
): CityContentBlock | undefined {
  return CITY_SECTION_CONTENT[`${section}:${citySlug}`];
}

/**
 * Index-readiness gate for the city-SEO system (2026-08-04, Phase 1
 * conversion-fix pass — see AFAQ_ALHAYAT_ENTERPRISE_KNOWLEDGE/
 * 10_MARKETING_AND_SEO/SEO_REALITY_MAP.md §1 and §5 Priority 1/3). A
 * service+city page having real copy (getCityServiceContent above) only
 * ever meant the page could *exist* — city-page-metadata.ts previously
 * marked every one of them NOINDEX_FOLLOW regardless, which put all 57
 * real pages in sitemap.xml while telling search engines not to index
 * them. This function is the fix: a combination is index-ready only when
 * real copy exists here AND the underlying service/sub-service has
 * already cleared its own, separate, pre-existing approval gate —
 * APPROVED_SERVICE_CONTENT_SLUGS (service-content.ts) for a Maintenance/
 * Cleaning catalog service, getPestControlSubServicePage()
 * (pest-control-pages.ts) for a pest sub-service. No new approval
 * standard is introduced; this only connects the city-page robots
 * decision to the one that already exists. A future entry added to
 * CITY_SERVICE_CONTENT for a service or sub-service that hasn't cleared
 * that gate stays NOINDEX_FOLLOW automatically — this function, not a
 * manual per-entry flag, is what a new addition must pass.
 */
export function isCityPagePublishReady(serviceSlug: string, citySlug: string): boolean {
  if (!getCityServiceContent(serviceSlug, citySlug)) return false;
  return (
    APPROVED_SERVICE_CONTENT_SLUGS.includes(serviceSlug) ||
    Boolean(getPestControlSubServicePage(serviceSlug))
  );
}

/** Same gate for section-level city pages — see isCityPagePublishReady() above. */
export function isCitySectionPublishReady(section: string, citySlug: string): boolean {
  return Boolean(getCitySectionContent(section, citySlug));
}
