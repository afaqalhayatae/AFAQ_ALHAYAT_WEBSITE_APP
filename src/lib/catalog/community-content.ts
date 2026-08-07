/**
 * Community-level content (2026-08-06 local SEO expansion, Phase 2).
 * Same contract as city-content.ts, one level more specific: keyed by
 * `${serviceSlug}:${communitySlug}` instead of `${serviceSlug}:${emirateSlug}`.
 * A route only ever renders a combo that has a real entry here —
 * generateStaticParams + dynamicParams = false guarantee that, exactly
 * like the emirate-level system.
 *
 * Real competitor research (2026-08-06) confirmed each community has a
 * genuinely distinct property/pest/service profile (Palm Jumeirah's
 * waterfront canal layout vs. Arabian Ranches' mature villa gardens vs.
 * Dubai Marina's high-density towers) — content here is written from
 * that real character (communities.ts's `archetype`/`characteristic`),
 * never a name-swapped template.
 */
import { APPROVED_SERVICE_CONTENT_SLUGS } from "./service-content";
import { getPestControlSubServicePage } from "./pest-control-pages";
import type { FaqItem } from "./faq";

export type CommunityContentBlock = {
  title: { en: string; ar: string };
  h1: { en: string; ar: string };
  metaDescription: { en: string; ar: string };
  intro: { en: string; ar: string };
  body: { en: string; ar: string }[];
  faqs?: FaqItem[];
  image?: string | null;
  imageAlt?: { en: string; ar: string } | null;
  status: string;
};

export const COMMUNITY_SERVICE_CONTENT: Record<string, CommunityContentBlock> = {
  "villa-cleaning:arabian-ranches": {
    title: {
      en: "Villa Cleaning in Arabian Ranches | AFAQ AL HAYAT",
      ar: "تنظيف الفلل في المرابع العربية | آفاق الحياة",
    },
    h1: { en: "Villa Cleaning in Arabian Ranches", ar: "تنظيف الفلل في المرابع العربية" },
    metaDescription: {
      en: "Professional villa cleaning in Arabian Ranches from AFAQ AL HAYAT — a cleaning plan built for large plots and multi-floor villas.",
      ar: "تنظيف احترافي للفلل في المرابع العربية من آفاق الحياة — خطة تنظيف مصممة للمساحات الواسعة والفلل متعددة الطوابق.",
    },
    intro: {
      en: "Arabian Ranches is mature villa territory — large plots, multiple floors, and established gardens that bring their own maintenance needs. AFAQ AL HAYAT provides villa cleaning built around exactly that kind of property, not a generic apartment routine.",
      ar: "المرابع العربية منطقة فلل راسخة — مساحات واسعة وطوابق متعددة وحدائق ناضجة لها احتياجات صيانة خاصة بها. تقدم آفاق الحياة تنظيفًا للفلل مصممًا لهذا النوع من العقارات تحديدًا، لا روتين شقة عام.",
    },
    body: [
      {
        en: "Larger plots typically mean more entry points for outdoor dust, which shows up fastest on ground-floor living areas and window sills — these get particular attention on every visit.",
        ar: "المساحات الأوسع تعني عادة نقاط دخول أكثر لغبار الخارج، ويظهر ذلك أسرع في مناطق المعيشة بالطابق الأرضي وحواف النوافذ — تحظى هذه المناطق باهتمام خاص في كل زيارة.",
      },
      {
        en: "Multi-floor villas with several bedrooms and bathrooms need a team sized and scheduled for the property, not a fixed time slot regardless of size.",
        ar: "الفلل متعددة الطوابق ذات الغرف والحمامات المتعددة تحتاج فريقًا بحجم وجدولة تناسب العقار، لا موعدًا ثابتًا بغض النظر عن الحجم.",
      },
      {
        en: "One-time or recurring scheduling is available, matched to how the household actually uses the space.",
        ar: "تتوفر جدولة لمرة واحدة أو بشكل دوري، بما يتناسب مع كيفية استخدام الأسرة للمساحة فعليًا.",
      },
    ],
    status: "Content added 2026-08-06 (Phase 2 community SEO expansion) — no price, warranty, or response-time claim included.",
  },
  "deep-cleaning:dubai-marina": {
    title: {
      en: "Deep Cleaning in Dubai Marina | AFAQ AL HAYAT",
      ar: "تنظيف عميق في دبي مارينا | آفاق الحياة",
    },
    h1: { en: "Deep Cleaning in Dubai Marina", ar: "تنظيف عميق في دبي مارينا" },
    metaDescription: {
      en: "Professional deep cleaning in Dubai Marina from AFAQ AL HAYAT — thorough cleaning for apartments, including short-term rental turnovers.",
      ar: "تنظيف عميق احترافي في دبي مارينا من آفاق الحياة — تنظيف شامل للشقق، بما في ذلك تجهيز الإيجار قصير المدى.",
    },
    intro: {
      en: "Dubai Marina's dense high-rise towers include many apartments used as short-term holiday rentals, where a fast, thorough reset between guests matters as much as a one-off deep clean. AFAQ AL HAYAT provides both across the community.",
      ar: "أبراج دبي مارينا السكنية الكثيفة تضم شققًا كثيرة تُستخدم للإيجار السياحي قصير المدى، حيث تكون إعادة الضبط السريعة والشاملة بين الضيوف مهمة بقدر أهمية التنظيف العميق لمرة واحدة. تقدم آفاق الحياة كلا الخدمتين في المجتمع.",
    },
    body: [
      {
        en: "A deep clean covers behind and under appliances, grout lines, and vents — the buildup a standard turnover clean doesn't reach.",
        ar: "يشمل التنظيف العميق خلف الأجهزة وتحتها وفواصل البلاط وفتحات التهوية — التراكمات التي لا يصلها تنظيف التجهيز المعتاد."
      },
      {
        en: "High-rise units facing direct sun and sea air can show faster dust and salt residue buildup on balconies and window tracks.",
        ar: "الوحدات العالية المعرضة لأشعة الشمس المباشرة وهواء البحر قد تظهر عليها تراكمات أسرع للغبار وبقايا الملح على الشرفات ومسارات النوافذ.",
      },
      {
        en: "Move-ins, post-event resets, and pre-listing cleans for short-term rentals are among the most common reasons customers book this service here.",
        ar: "الانتقال لشقة جديدة، وإعادة الضبط بعد المناسبات، والتنظيف قبل إدراج العقار للإيجار قصير المدى، من أكثر الأسباب شيوعًا لحجز هذه الخدمة هنا.",
      },
    ],
    status: "Content added 2026-08-06 (Phase 2 community SEO expansion) — no price, warranty, or response-time claim included.",
  },
  "cockroach-control:palm-jumeirah": {
    title: {
      en: "Cockroach Control in Palm Jumeirah | AFAQ AL HAYAT",
      ar: "مكافحة الصراصير في نخلة جميرا | آفاق الحياة",
    },
    h1: { en: "Cockroach Control in Palm Jumeirah", ar: "مكافحة الصراصير في نخلة جميرا" },
    metaDescription: {
      en: "Professional cockroach control in Palm Jumeirah from AFAQ AL HAYAT — treatment suited to waterfront villas and the community's canal layout.",
      ar: "مكافحة احترافية للصراصير في نخلة جميرا من آفاق الحياة — علاج يناسب الفلل الساحلية وتخطيط القنوات في المجتمع.",
    },
    intro: {
      en: "Palm Jumeirah's pest profile is genuinely different from an inland community — waterfront exposure on every frond, a canal layout between villas, and a growing number of villas now 15+ years old. AFAQ AL HAYAT provides cockroach control matched to those specific conditions.",
      ar: "الوضع الوبائي في نخلة جميرا مختلف فعليًا عن أي مجتمع داخلي — التعرض المائي على كل سعفة، وتخطيط القنوات بين الفلل، وعدد متزايد من الفلل التي تجاوز عمرها الآن 15 عامًا. تقدم آفاق الحياة مكافحة صراصير تراعي هذه الظروف تحديدًا.",
    },
    body: [
      {
        en: "Waterfront proximity and shared drainage between neighboring villas both create moisture-rich conditions cockroaches are drawn to — inspection focuses heavily on plumbing runs and drain access points.",
        ar: "القرب من الماء والصرف المشترك بين الفلل المتجاورة يخلقان بيئة غنية بالرطوبة تنجذب إليها الصراصير — يركز الفحص بشكل كبير على مسارات السباكة ونقاط الوصول للصرف.",
      },
      {
        en: "Older villas in the community may have more small gaps around pipework and fittings than newer construction elsewhere, which is where a documented inspection matters most.",
        ar: "الفلل الأقدم في المجتمع قد تحتوي فجوات صغيرة أكثر حول خطوط الأنابيب والتجهيزات مقارنة بالإنشاءات الأحدث في أماكن أخرى، وهنا يصبح الفحص الموثق أكثر أهمية.",
      },
      {
        en: "Treatment is followed by prevention guidance specific to villa layouts with garden and pool-adjacent areas.",
        ar: "يُتبع العلاج بإرشادات وقائية خاصة بتصميمات الفلل ذات الحدائق والمناطق المجاورة لحمامات السباحة.",
      },
    ],
    status: "Content added 2026-08-06 (Phase 2 community SEO expansion) — no price, warranty, or response-time claim included.",
  },
  "cockroach-control:al-reem-island": {
    title: {
      en: "Cockroach Control in Al Reem Island | AFAQ AL HAYAT",
      ar: "مكافحة الصراصير في جزيرة الريم | آفاق الحياة",
    },
    h1: { en: "Cockroach Control in Al Reem Island", ar: "مكافحة الصراصير في جزيرة الريم" },
    metaDescription: {
      en: "Professional cockroach control in Al Reem Island from AFAQ AL HAYAT — treatment built for dense residential towers, not a villa routine.",
      ar: "مكافحة احترافية للصراصير في جزيرة الريم من آفاق الحياة — علاج مصمم للأبراج السكنية الكثيفة، لا روتين فلل.",
    },
    intro: {
      en: "Al Reem Island is a dense cluster of residential towers close to the mainland — a completely different pest environment from a villa community. Shared walls, common corridors, and building-wide waste and drainage risers mean cockroach activity in one unit is rarely isolated from its neighbors. AFAQ AL HAYAT treats accordingly.",
      ar: "جزيرة الريم تجمع كثيف من الأبراج السكنية قريب من البر الرئيسي — بيئة آفات مختلفة تمامًا عن مجتمع الفلل. الجدران المشتركة والممرات العامة ومواسير الصرف والنفايات المشتركة عبر المبنى تعني أن نشاط الصراصير في وحدة واحدة نادرًا ما يكون معزولاً عن الجيران. تعالج آفاق الحياة وفق ذلك.",
    },
    body: [
      {
        en: "In a high-rise tower, cockroaches travel between units through shared plumbing risers, waste chutes, and wall penetrations far more easily than they cross a villa's open garden — treatment focuses on sealing and monitoring these shared access points, not just the unit itself.",
        ar: "في البرج السكني، تنتقل الصراصير بين الوحدات عبر مواسير الصرف المشتركة وفتحات النفايات وثقوب الجدران بسهولة أكبر بكثير من عبورها لحديقة فيلا مفتوحة — يركز العلاج على إغلاق ومراقبة نقاط الوصول المشتركة هذه، لا الوحدة وحدها.",
      },
      {
        en: "Kitchens in compact apartment layouts sit closer to shared service ducts than in a villa, so duct and riser inspection gets particular attention on every visit.",
        ar: "المطابخ في تصميمات الشقق المدمجة تقع أقرب لمجاري الخدمات المشتركة مقارنة بالفيلا، لذا يحظى فحص المجاري والمواسير باهتمام خاص في كل زيارة.",
      },
      {
        en: "Coordinating treatment timing with building management is often the most effective way to prevent re-infestation from an untreated neighboring unit — a step that simply doesn't apply to standalone villas.",
        ar: "تنسيق توقيت العلاج مع إدارة المبنى غالبًا ما يكون الطريقة الأكثر فعالية لمنع عودة الإصابة من وحدة مجاورة غير معالجة — خطوة لا تنطبق أصلاً على الفلل المستقلة.",
      },
    ],
    status: "Content added 2026-08-07 (Phase 2 community SEO expansion, run 2) — no price, warranty, or response-time claim included.",
  },
  "general-cleaning:saadiyat-island": {
    title: {
      en: "General Cleaning in Saadiyat Island | AFAQ AL HAYAT",
      ar: "تنظيف منزلي عام في جزيرة السعديات | آفاق الحياة",
    },
    h1: { en: "General Cleaning in Saadiyat Island", ar: "تنظيف منزلي عام في جزيرة السعديات" },
    metaDescription: {
      en: "Professional general cleaning in Saadiyat Island from AFAQ AL HAYAT — recurring cleaning suited to newer villas and low-rise coastal residences.",
      ar: "تنظيف منزلي عام احترافي في جزيرة السعديات من آفاق الحياة — تنظيف دوري يناسب الفلل الحديثة والمساكن الساحلية منخفضة الارتفاع.",
    },
    intro: {
      en: "Saadiyat Island is a newer island community mixing villas and low-rise residences near the coast, much of it still under active development. AFAQ AL HAYAT provides general cleaning matched to that mix — sea-facing units and homes near ongoing construction each bring their own upkeep pattern.",
      ar: "جزيرة السعديات مجتمع جزيرة أحدث يجمع بين الفلل والمساكن منخفضة الارتفاع قرب الساحل، وجزء كبير منها لا يزال قيد التطوير الفعلي. تقدم آفاق الحياة تنظيفًا منزليًا عامًا يراعي هذا المزيج — فالوحدات المطلة على البحر والمنازل القريبة من الإنشاءات الجارية لكل منها نمط صيانة مختلف.",
      /* Grounded in the community's real archetype/characteristic (communities.ts) — mixed villa/low-rise, coastal, newer island development — never a name-swapped template. */
    },
    body: [
      {
        en: "Homes near ongoing island construction tend to collect fine dust faster than fully built-out communities, which shows up first on window sills, outdoor terraces, and hard flooring — these get closer attention on a recurring visit.",
        ar: "المنازل القريبة من الإنشاءات الجارية في الجزيرة تتجمع عليها الأتربة الدقيقة أسرع من المجتمعات المكتملة البناء، ويظهر ذلك أولاً على حواف النوافذ والشرفات الخارجية والأرضيات الصلبة — تحظى هذه المناطق باهتمام أقرب في الزيارة الدورية.",
      },
      {
        en: "Sea-facing low-rise units can pick up salt residue on glass and outdoor surfaces faster than inland properties, a factor worth flagging when setting a cleaning frequency.",
        ar: "الوحدات منخفضة الارتفاع المطلة على البحر قد تتراكم عليها بقايا الملح على الزجاج والأسطح الخارجية أسرع من العقارات الداخلية، وهو عامل يستحق مراعاته عند تحديد وتيرة التنظيف.",
      },
      {
        en: "As a newer community with a mix of finished villas and recently handed-over low-rise units, scheduling is set per property rather than assuming one routine fits every home on the island.",
        ar: "بصفتها مجتمعًا أحدث يجمع بين فلل مكتملة ووحدات منخفضة الارتفاع سُلمت مؤخرًا، تُحدد الجدولة حسب كل عقار بدلاً من افتراض أن روتينًا واحدًا يناسب كل منزل في الجزيرة.",
      },
    ],
    status: "Content added 2026-08-07 (Phase 2 community SEO expansion, run 2) — no price, warranty, or response-time claim included.",
  },
};

export function getCommunityServiceContent(
  serviceSlug: string,
  communitySlug: string
): CommunityContentBlock | undefined {
  return COMMUNITY_SERVICE_CONTENT[`${serviceSlug}:${communitySlug}`];
}

/** Same index-readiness gate as city-content.ts's isCityPagePublishReady(). */
export function isCommunityPagePublishReady(serviceSlug: string, communitySlug: string): boolean {
  if (!getCommunityServiceContent(serviceSlug, communitySlug)) return false;
  return (
    APPROVED_SERVICE_CONTENT_SLUGS.includes(serviceSlug) ||
    Boolean(getPestControlSubServicePage(serviceSlug))
  );
}
