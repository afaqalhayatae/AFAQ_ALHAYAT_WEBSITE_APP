/**
 * Full-page content for pest-control sub-service pages
 * (JOB-AGT-WEB-20260730, Owner-requested SEO expansion).
 *
 * Content strategy: every SHARED block below (benefits, process,
 * preparation, safety) is the same already-approved language already
 * used for the parent Pest Control service (see
 * src/data/SERVICE_DATABASE.json's pest-control `content` and
 * `04_SERVICE_KNOWLEDGE/01_PEST_CONTROL/06_PAGE_CONTENT.md`/`04_FAQ.md`),
 * reused verbatim rather than rewritten per pest type. Per-entry fields
 * (name, description, keywords, FAQs) only vary in the pest name and
 * category framing — no pest-specific technical, chemical, or safety
 * claim is invented anywhere in this file. Owner approved this package's
 * content for publication 2026-07-31 (see `status` per entry) — the
 * Evidence Gate that previously blocked it is now cleared.
 *
 * Reconciliation note (2026-07-30, resolved 2026-07-31): the Owner's
 * "Required pest-control pages" list (10 items) differed from the 10
 * sub-service cards already live on /services/pest-control — it dropped
 * Gecko Control and added Bed Bug Control, and renamed three others
 * (Wasp & Bee -> Wasp, Pigeon -> Bird, House Fly & Light Trap -> Home
 * Pest Prevention & Installation). Flagged in the SERVICE_COMPLETION_MATRIX
 * audit rather than decided silently — Owner decision (2026-07-31): keep
 * Gecko Control as an 11th approved pest-control service alongside the
 * Owner's original 10. Bed Bug Control (already added as an eleventh
 * entry below) stays too — Bed Bug Treatment is itself an original
 * approved scope item (see CONTENT_EN.md/AR.md "Our Services") that
 * never got its own card.
 */

type Bilingual = { en: string; ar: string };
type BilingualList = { en: string[]; ar: string[] };

export type PestControlFaq = {
  id: string;
  question: Bilingual;
  answer: Bilingual;
};

export type PestControlSubServicePage = {
  id: string;
  name: Bilingual;
  seoTitle: Bilingual;
  metaDescription: Bilingual;
  overview: Bilingual;
  keywords: BilingualList;
  hashtags: BilingualList;
  faqs: PestControlFaq[];
  /** Filename under public/brand/images/services/pest-control/, or null if no real asset exists yet. */
  image: string | null;
  imageAlt: Bilingual | null;
  relatedIds: string[];
  status: string;
};

// ---------------------------------------------------------------------
// Shared, already-approved-draft blocks (reused across every sub-page)
// ---------------------------------------------------------------------

export const SHARED_BENEFITS: BilingualList = {
  en: [
    "A thorough, documented inspection and treatment process for every visit — never guesswork.",
    "No one-size-fits-all treatment: we assess your property's specific situation before recommending a plan.",
    "Clear guidance before, during, and after every visit, so you always know what to expect.",
    "Scheduled maintenance programs available for ongoing protection.",
    "Follow-up support if you have any questions after your visit.",
  ],
  ar: [
    "عملية معاينة وعلاج موثقة وواضحة في كل زيارة — بلا تخمين.",
    "لا حلول جاهزة موحدة: نقيّم وضع عقارك تحديدًا قبل اقتراح خطة العلاج.",
    "إرشادات واضحة قبل الزيارة وأثناءها وبعدها، لتعرف دائمًا ما يمكن توقعه.",
    "برامج صيانة دورية متاحة للحماية المستمرة.",
    "دعم للمتابعة إذا كانت لديك أي استفسارات بعد الزيارة.",
  ],
};

export const SHARED_PROCESS: BilingualList = {
  en: ["Book an appointment.", "Site inspection.", "Pest identification.", "Treatment execution.", "Customer guidance.", "Follow-up when required."],
  ar: ["حجز الموعد.", "معاينة الموقع.", "تحديد نوع الآفة.", "تنفيذ العلاج.", "تقديم التعليمات.", "المتابعة عند الحاجة."],
};

export const SHARED_PREPARATION: BilingualList = {
  en: [
    "Confirm your appointment before the visit.",
    "Keep children and pets away from the treatment area.",
    "Cover or store exposed food.",
    "Inform the technician of any allergies, pregnancy, or other sensitive conditions.",
    "Provide access to all affected areas.",
  ],
  ar: [
    "أكّد موعدك قبل الزيارة.",
    "أبعد الأطفال والحيوانات الأليفة عن منطقة العلاج.",
    "غطِّ أو خزّن الطعام المكشوف.",
    "أخبر الفني بأي حساسية أو حمل أو ظروف خاصة أخرى.",
    "وفّر إمكانية الوصول إلى جميع المناطق المتأثرة.",
  ],
};

export const SHARED_SAFETY: Bilingual = {
  en: "Safety depends on the specific pest, a site assessment, the approved product and method used, occupant conditions, and compliance with the product label and safety controls. AFAQ AL HAYAT does not give an unconditional safety assurance — customers must disclose children, pets, allergies, pregnancy, or other sensitive conditions before service.",
  ar: "تعتمد السلامة على نوع الآفة الفعلي، ومعاينة الموقع، والمنتج والطريقة المعتمدَين، وظروف المكان، والالتزام بتعليمات المنتج وضوابط السلامة. لا تقدم آفاق الحياة ضمان سلامة غير مشروط — يجب على العملاء الإفصاح عن وجود أطفال أو حيوانات أليفة أو حساسية أو حمل أو أي ظروف حساسة أخرى قبل الخدمة.",
};

const EMIRATES: Bilingual[] = [
  { en: "Abu Dhabi", ar: "أبوظبي" },
  { en: "Dubai", ar: "دبي" },
  { en: "Sharjah", ar: "الشارقة" },
  { en: "Ajman", ar: "عجمان" },
  { en: "Umm Al Quwain", ar: "أم القيوين" },
  { en: "Ras Al Khaimah", ar: "رأس الخيمة" },
  { en: "Fujairah", ar: "الفجيرة" },
];
export const ALL_EMIRATES_BILINGUAL = EMIRATES;

const STATUS = "Approved — Owner approved this package's content for publication 2026-07-31";

function commonFaqs(nameEn: string, nameAr: string, id: string): PestControlFaq[] {
  return [
    {
      id: `${id}-duration`,
      question: { en: `How long does ${nameEn.toLowerCase()} treatment take?`, ar: `كم تستغرق معالجة ${nameAr}؟` },
      answer: {
        en: "Duration depends on the property size and the extent of the issue. The technician provides an estimated time before starting.",
        ar: "تعتمد المدة على حجم العقار ومدى المشكلة. سيقدم الفني تقديرًا للوقت المتوقع قبل البدء.",
      },
    },
    {
      id: `${id}-one-visit`,
      question: { en: "Will one visit resolve the problem?", ar: "هل تحل زيارة واحدة المشكلة؟" },
      answer: {
        en: "Some cases are resolved with one visit; others may need follow-up treatments or a maintenance plan.",
        ar: "تُحل بعض الحالات بزيارة واحدة، بينما قد تتطلب حالات أخرى علاجات متابعة أو خطة صيانة دورية.",
      },
    },
    {
      id: `${id}-warranty`,
      question: { en: "Does AFAQ AL HAYAT offer a warranty?", ar: "هل تقدم آفاق الحياة ضمانًا؟" },
      answer: {
        en: "Warranty details are confirmed in your written quotation or service order, so you know exactly what's covered before work begins.",
        ar: "تُحدَّد تفاصيل الضمان في عرض السعر الكتابي أو أمر الخدمة الخاص بك، بحيث تعرف بالضبط ما هو مشمول قبل بدء العمل.",
      },
    },
    {
      id: `${id}-coverage`,
      question: { en: `Which areas does AFAQ AL HAYAT cover for ${nameEn.toLowerCase()}?`, ar: `ما هي المناطق التي تغطيها آفاق الحياة لـ${nameAr}؟` },
      answer: {
        en: "AFAQ AL HAYAT offers this service across all 7 UAE emirates. Coverage means the service is offered in that emirate; a booking still confirms the exact date, time, and scope.",
        ar: "تقدم آفاق الحياة هذه الخدمة في جميع إمارات الدولة السبع. يعني هذا التوفر تقديم الخدمة في الإمارة، ويبقى تأكيد الموعد والوقت والنطاق عبر الحجز.",
      },
    },
  ];
}

// ---------------------------------------------------------------------
// Per-page entries
// ---------------------------------------------------------------------

export const PEST_CONTROL_SUB_SERVICE_PAGES: PestControlSubServicePage[] = [
  {
    id: "cockroach-control",
    name: { en: "Cockroach Control", ar: "مكافحة الصراصير" },
    seoTitle: { en: "Cockroach Control in the UAE | AFAQ AL HAYAT", ar: "مكافحة الصراصير في الإمارات | آفاق الحياة" },
    metaDescription: {
      en: "Professional cockroach control across all 7 UAE emirates. Site inspection and safe, approved treatment from AFAQ AL HAYAT. Contact us to schedule a visit.",
      ar: "خدمة احترافية لمكافحة الصراصير في جميع إمارات الدولة السبع. معاينة ومعالجة آمنة ومعتمدة من آفاق الحياة. تواصل معنا لحجز الموعد.",
    },
    overview: {
      en: "Cockroaches are one of the most common pest problems in UAE homes, restaurants, and commercial kitchens. AFAQ AL HAYAT's cockroach control service starts with a site inspection to understand the extent of activity, followed by safe, approved treatment and clear guidance on keeping the property protected afterward.",
      ar: "تُعد الصراصير من أكثر مشاكل الآفات شيوعًا في المنازل والمطاعم والمطابخ التجارية في الإمارات. تبدأ خدمة مكافحة الصراصير من آفاق الحياة بمعاينة الموقع لفهم مدى الإصابة، تليها معالجة آمنة ومعتمدة وإرشادات واضحة للحفاظ على حماية العقار لاحقًا.",
    },
    keywords: {
      en: ["cockroach control UAE", "cockroach exterminator Dubai", "roach treatment Abu Dhabi", "cockroach pest control", "kitchen cockroach control"],
      ar: ["مكافحة الصراصير الإمارات", "مكافحة الصراصير دبي", "علاج الصراصير أبوظبي", "شركة مكافحة صراصير"],
    },
    hashtags: {
      en: ["#CockroachControl", "#PestControlUAE", "#AFAQAlHayat"],
      ar: ["#مكافحة_الصراصير", "#مكافحة_حشرات_الإمارات", "#آفاق_الحياة"],
    },
    faqs: [
      {
        id: "cockroach-pets-treated",
        question: { en: "What cockroach species does AFAQ AL HAYAT treat?", ar: "ما أنواع الصراصير التي تعالجها آفاق الحياة؟" },
        answer: {
          en: "Common household and commercial-kitchen cockroach species found across the UAE.",
          ar: "أنواع الصراصير الشائعة في المنازل والمطابخ التجارية في الإمارات.",
        },
      },
      ...commonFaqs("Cockroach Control", "مكافحة الصراصير", "cockroach"),
    ],
    image: "004-cockroach-control-service-card.webp",
    imageAlt: {
      en: "AFAQ AL HAYAT technician treating a cockroach near a kitchen cabinet base in the UAE",
      ar: "فني آفاق الحياة يعالج صرصورًا بالقرب من قاعدة خزانة مطبخ في الإمارات",
    },
    relatedIds: ["ant-control", "rodent-control", "bed-bug-control"],
    status: STATUS,
  },
  {
    id: "ant-control",
    name: { en: "Ant Control", ar: "مكافحة النمل" },
    seoTitle: { en: "Ant Control in the UAE | AFAQ AL HAYAT", ar: "مكافحة النمل في الإمارات | آفاق الحياة" },
    metaDescription: {
      en: "Professional ant control across all 7 UAE emirates. Trail inspection and safe, approved treatment from AFAQ AL HAYAT. Contact us to schedule a visit.",
      ar: "خدمة احترافية لمكافحة النمل في جميع إمارات الدولة السبع. معاينة مسارات النمل ومعالجة آمنة ومعتمدة من آفاق الحياة. تواصل معنا لحجز الموعد.",
    },
    overview: {
      en: "Ant trails inside kitchens, offices, and outdoor spaces are a frequent request across UAE households and businesses. AFAQ AL HAYAT inspects the trail and entry points, then applies safe, approved treatment to help clear ant activity from the property.",
      ar: "تُعد مسارات النمل داخل المطابخ والمكاتب والمساحات الخارجية طلبًا متكررًا لدى المنازل والمنشآت في الإمارات. تعاين آفاق الحياة مسار النمل ونقاط الدخول، ثم تطبق معالجة آمنة ومعتمدة للمساعدة في التخلص من النمل من العقار.",
    },
    keywords: {
      en: ["ant control UAE", "ant exterminator Dubai", "ant treatment Abu Dhabi", "kitchen ant control", "pest control ants"],
      ar: ["مكافحة النمل الإمارات", "مكافحة النمل دبي", "علاج النمل أبوظبي", "شركة مكافحة نمل"],
    },
    hashtags: { en: ["#AntControl", "#PestControlUAE", "#AFAQAlHayat"], ar: ["#مكافحة_النمل", "#مكافحة_حشرات_الإمارات", "#آفاق_الحياة"] },
    faqs: commonFaqs("Ant Control", "مكافحة النمل", "ant"),
    image: "002-ant-control-service-card.webp",
    imageAlt: {
      en: "AFAQ AL HAYAT technician treating an ant trail along a kitchen wall in the UAE",
      ar: "فني آفاق الحياة يعالج مسار نمل على جدار مطبخ في الإمارات",
    },
    relatedIds: ["cockroach-control", "termite-control", "rodent-control"],
    status: STATUS,
  },
  {
    id: "termite-control",
    name: { en: "White Ant / Termite Control", ar: "مكافحة النمل الأبيض" },
    seoTitle: { en: "Termite (White Ant) Control in the UAE | AFAQ AL HAYAT", ar: "مكافحة النمل الأبيض في الإمارات | آفاق الحياة" },
    metaDescription: {
      en: "Professional termite (white ant) control and inspection across all 7 UAE emirates. Safe, approved treatment from AFAQ AL HAYAT.",
      ar: "خدمة احترافية لمكافحة النمل الأبيض ومعاينته في جميع إمارات الدولة السبع. معالجة آمنة ومعتمدة من آفاق الحياة.",
    },
    overview: {
      en: "Termites — commonly called 'white ants' — can damage timber and structural elements before they're noticed. AFAQ AL HAYAT inspects affected wood and structures, then applies safe, approved treatment to help protect the property from further damage.",
      ar: "يمكن أن يتسبب النمل الأبيض بأضرار في الأخشاب والعناصر الإنشائية قبل ملاحظته. تعاين آفاق الحياة الأخشاب والمنشآت المتضررة، ثم تطبق معالجة آمنة ومعتمدة للمساعدة في حماية العقار من مزيد من الضرر.",
    },
    keywords: {
      en: ["termite control UAE", "white ant control Dubai", "termite treatment Abu Dhabi", "termite inspection UAE", "pest control termites"],
      ar: ["مكافحة النمل الأبيض الإمارات", "علاج النمل الأبيض دبي", "معاينة النمل الأبيض أبوظبي"],
    },
    hashtags: { en: ["#TermiteControl", "#WhiteAntControl", "#AFAQAlHayat"], ar: ["#مكافحة_النمل_الأبيض", "#مكافحة_حشرات_الإمارات", "#آفاق_الحياة"] },
    faqs: commonFaqs("Termite Control", "مكافحة النمل الأبيض", "termite"),
    image: "003-termite-control-service-card.webp",
    imageAlt: {
      en: "AFAQ AL HAYAT technician treating termite damage at a wall baseboard",
      ar: "فني آفاق الحياة يعالج أضرار النمل الأبيض عند حافة الجدار",
    },
    relatedIds: ["ant-control", "rodent-control", "cockroach-control"],
    status: STATUS,
  },
  {
    id: "bed-bug-control",
    name: { en: "Bed Bug Control", ar: "مكافحة بق الفراش" },
    seoTitle: { en: "Bed Bug Control in the UAE | AFAQ AL HAYAT", ar: "مكافحة بق الفراش في الإمارات | آفاق الحياة" },
    metaDescription: {
      en: "Professional bed bug control across all 7 UAE emirates. Site inspection and safe, approved treatment from AFAQ AL HAYAT. Contact us to schedule a visit.",
      ar: "خدمة احترافية لمكافحة بق الفراش في جميع إمارات الدولة السبع. معاينة ومعالجة آمنة ومعتمدة من آفاق الحياة. تواصل معنا لحجز الموعد.",
    },
    overview: {
      en: "Bed bug treatment is one of AFAQ AL HAYAT's original approved pest control services, covering homes, hotels, and furnished properties across the UAE. The service begins with an inspection of affected areas, followed by safe, approved treatment and clear guidance for occupants.",
      ar: "تُعد خدمة مكافحة بق الفراش من الخدمات المعتمدة الأصلية لدى آفاق الحياة، وتغطي المنازل والفنادق والعقارات المفروشة في الإمارات. تبدأ الخدمة بمعاينة المناطق المتأثرة، تليها معالجة آمنة ومعتمدة وإرشادات واضحة لشاغلي العقار.",
    },
    keywords: {
      en: ["bed bug control UAE", "bed bug treatment Dubai", "bed bug exterminator Abu Dhabi", "bed bug inspection UAE"],
      ar: ["مكافحة بق الفراش الإمارات", "علاج بق الفراش دبي", "مكافحة بق الفراش أبوظبي"],
    },
    hashtags: { en: ["#BedBugControl", "#PestControlUAE", "#AFAQAlHayat"], ar: ["#مكافحة_بق_الفراش", "#مكافحة_حشرات_الإمارات", "#آفاق_الحياة"] },
    faqs: commonFaqs("Bed Bug Control", "مكافحة بق الفراش", "bed-bug"),
    image: null,
    imageAlt: null,
    relatedIds: ["cockroach-control", "rodent-control"],
    status: `${STATUS}. No real image asset exists yet for this sub-service — displays without a photo (icon fallback) until one is delivered; not fabricated here.`,
  },
  {
    id: "rodent-control",
    name: { en: "Rodent Control", ar: "مكافحة القوارض" },
    seoTitle: { en: "Rodent Control in the UAE | AFAQ AL HAYAT", ar: "مكافحة القوارض في الإمارات | آفاق الحياة" },
    metaDescription: {
      en: "Professional rodent control across all 7 UAE emirates. Site inspection, bait-station placement, and follow-up guidance from AFAQ AL HAYAT.",
      ar: "خدمة احترافية لمكافحة القوارض في جميع إمارات الدولة السبع. معاينة الموقع وتركيب محطات الطعم وإرشادات المتابعة من آفاق الحياة.",
    },
    overview: {
      en: "Mice and rats can enter UAE homes and businesses through small gaps and cause damage beyond the nuisance itself. AFAQ AL HAYAT inspects entry points, places bait stations, and provides guidance to help keep the property protected.",
      ar: "يمكن للفئران والجرذان الدخول إلى المنازل والمنشآت في الإمارات عبر فتحات صغيرة، وتسبب أضرارًا تتجاوز الإزعاج نفسه. تعاين آفاق الحياة نقاط الدخول وتضع محطات الطعم وتقدم إرشادات للمساعدة في حماية العقار.",
    },
    keywords: {
      en: ["rodent control UAE", "mice control Dubai", "rat control Abu Dhabi", "rodent exterminator UAE", "pest control rodents"],
      ar: ["مكافحة القوارض الإمارات", "مكافحة الفئران دبي", "مكافحة الجرذان أبوظبي", "شركة مكافحة قوارض"],
    },
    hashtags: { en: ["#RodentControl", "#PestControlUAE", "#AFAQAlHayat"], ar: ["#مكافحة_القوارض", "#مكافحة_حشرات_الإمارات", "#آفاق_الحياة"] },
    faqs: commonFaqs("Rodent Control", "مكافحة القوارض", "rodent"),
    image: "001-rodent-control-service-card.webp",
    imageAlt: {
      en: "AFAQ AL HAYAT technician placing a rodent bait station beside a mouse entry point in a UAE kitchen",
      ar: "فني آفاق الحياة يضع محطة طعم للقوارض بجانب فتحة دخول فأر في مطبخ بالإمارات",
    },
    relatedIds: ["cockroach-control", "ant-control", "snake-control"],
    status: STATUS,
  },
  {
    id: "snake-control",
    name: { en: "Snake Control", ar: "مكافحة الثعابين" },
    seoTitle: { en: "Snake Control & Removal in the UAE | AFAQ AL HAYAT", ar: "مكافحة الثعابين وإخراجها في الإمارات | آفاق الحياة" },
    metaDescription: {
      en: "Snake capture and removal service across all 7 UAE emirates. Trained response from AFAQ AL HAYAT. Contact us if you spot a snake on your property.",
      ar: "خدمة الإمساك بالثعابين وإخراجها في جميع إمارات الدولة السبع. استجابة مدربة من آفاق الحياة. تواصل معنا في حال رصد ثعبان في عقارك.",
    },
    overview: {
      en: "A snake sighting on a UAE property calls for a careful, trained response rather than a DIY approach. AFAQ AL HAYAT uses appropriate capture equipment to safely remove the snake and advises on reducing future sightings.",
      ar: "يتطلب رصد ثعبان في عقار بالإمارات استجابة حذرة ومدربة بدلًا من التعامل الشخصي معه. تستخدم آفاق الحياة معدات الإمساك المناسبة لإخراج الثعبان بأمان وتقدم إرشادات لتقليل احتمال تكرار ذلك.",
    },
    keywords: {
      en: ["snake control UAE", "snake removal Dubai", "snake catcher Abu Dhabi", "snake control service"],
      ar: ["مكافحة الثعابين الإمارات", "إخراج الثعابين دبي", "صائد ثعابين أبوظبي"],
    },
    hashtags: { en: ["#SnakeControl", "#PestControlUAE", "#AFAQAlHayat"], ar: ["#مكافحة_الثعابين", "#مكافحة_حشرات_الإمارات", "#آفاق_الحياة"] },
    faqs: commonFaqs("Snake Control", "مكافحة الثعابين", "snake"),
    image: "005-snake-control-service-card.webp",
    imageAlt: {
      en: "AFAQ AL HAYAT technician safely capturing a snake indoors using capture tongs and a containment bag",
      ar: "فني آفاق الحياة يمسك بأمان بثعبان داخل المنزل باستخدام ملقط إمساك وكيس احتواء",
    },
    relatedIds: ["rodent-control", "bird-control"],
    status: `${STATUS} Not yet in SERVICE_CATALOG.md/03_BOOKING_OPTIONS.md's approved pest-type list.`,
  },
  {
    id: "mosquito-control",
    name: { en: "Mosquito Control", ar: "مكافحة البعوض والناموس" },
    seoTitle: { en: "Mosquito Control in the UAE | AFAQ AL HAYAT", ar: "مكافحة البعوض والناموس في الإمارات | آفاق الحياة" },
    metaDescription: {
      en: "Professional outdoor mosquito control across all 7 UAE emirates. Garden and vegetation treatment from AFAQ AL HAYAT.",
      ar: "خدمة احترافية لمكافحة البعوض والناموس في الحدائق والمساحات الخارجية بجميع إمارات الدولة السبع. من آفاق الحياة.",
    },
    overview: {
      en: "Mosquito activity around gardens, pools, and outdoor living spaces is common in the UAE climate. AFAQ AL HAYAT treats garden vegetation and standing-water risk areas to help reduce mosquito activity around the property.",
      ar: "يُعد نشاط البعوض حول الحدائق والمسابح والمساحات الخارجية أمرًا شائعًا في مناخ الإمارات. تعالج آفاق الحياة نباتات الحديقة ومناطق تجمع المياه الراكدة للمساعدة في تقليل نشاط البعوض حول العقار.",
    },
    keywords: {
      en: ["mosquito control UAE", "mosquito fogging Dubai", "garden mosquito treatment Abu Dhabi", "outdoor pest control UAE"],
      ar: ["مكافحة البعوض الإمارات", "مكافحة الناموس دبي", "رش البعوض أبوظبي"],
    },
    hashtags: { en: ["#MosquitoControl", "#PestControlUAE", "#AFAQAlHayat"], ar: ["#مكافحة_البعوض", "#مكافحة_الناموس", "#آفاق_الحياة"] },
    faqs: commonFaqs("Mosquito Control", "مكافحة البعوض", "mosquito"),
    image: "009-mosquito-control-service-card.webp",
    imageAlt: {
      en: "AFAQ AL HAYAT technician fogging garden vegetation for mosquito control beside a villa pool at dusk",
      ar: "فني آفاق الحياة يرش النباتات في الحديقة لمكافحة البعوض بجانب مسبح فيلا عند الغسق",
    },
    relatedIds: ["wasp-control", "bird-control"],
    status: STATUS,
  },
  {
    id: "wasp-control",
    name: { en: "Wasp Control", ar: "مكافحة الدبابير" },
    seoTitle: { en: "Wasp Control in the UAE | AFAQ AL HAYAT", ar: "مكافحة الدبابير في الإمارات | آفاق الحياة" },
    metaDescription: {
      en: "Wasp nest removal across all 7 UAE emirates. Trained response from AFAQ AL HAYAT. Contact us if you find a nest on your property.",
      ar: "إزالة أعشاش الدبابير في جميع إمارات الدولة السبع. استجابة مدربة من آفاق الحياة. تواصل معنا في حال وجود عش على عقارك.",
    },
    overview: {
      en: "Wasp nests under roof overhangs, balconies, and outdoor structures need careful handling. AFAQ AL HAYAT provides a trained response to remove nests using appropriate protective equipment — the same service also covers bee nests found on a property.",
      ar: "تحتاج أعشاش الدبابير أسفل الأسقف والشرفات والمنشآت الخارجية إلى تعامل حذر. تقدم آفاق الحياة استجابة مدربة لإزالة الأعشاش باستخدام معدات الحماية المناسبة — وتغطي الخدمة نفسها أيضًا أعشاش النحل الموجودة في العقار.",
    },
    keywords: {
      en: ["wasp control UAE", "wasp nest removal Dubai", "wasp exterminator Abu Dhabi", "bee removal UAE"],
      ar: ["مكافحة الدبابير الإمارات", "إزالة عش دبابير دبي", "مكافحة الدبابير أبوظبي"],
    },
    hashtags: { en: ["#WaspControl", "#PestControlUAE", "#AFAQAlHayat"], ar: ["#مكافحة_الدبابير", "#مكافحة_حشرات_الإمارات", "#آفاق_الحياة"] },
    faqs: commonFaqs("Wasp Control", "مكافحة الدبابير", "wasp"),
    image: "008-wasp-bee-control-service-card.webp",
    imageAlt: {
      en: "AFAQ AL HAYAT technician treating a wasp nest under a villa roof overhang in the UAE",
      ar: "فني آفاق الحياة يعالج عش دبابير أسفل سقف فيلا في الإمارات",
    },
    relatedIds: ["mosquito-control", "bird-control"],
    status: `${STATUS} Renamed from "Wasp & Bee Control" per Owner's 2026-07-30 request; same image and scope (bee nests still covered), primary name narrowed to match the request. Not yet in SERVICE_CATALOG.md/03_BOOKING_OPTIONS.md's approved pest-type list.`,
  },
  {
    id: "bird-control",
    name: { en: "Bird Control", ar: "مكافحة الطيور" },
    seoTitle: { en: "Bird Control in the UAE | AFAQ AL HAYAT", ar: "مكافحة الطيور في الإمارات | آفاق الحياة" },
    metaDescription: {
      en: "Bird and pigeon deterrent solutions across all 7 UAE emirates. Spike and netting installation from AFAQ AL HAYAT.",
      ar: "حلول ردع الطيور والحمام في جميع إمارات الدولة السبع. تركيب أشواك وشباك من آفاق الحياة.",
    },
    overview: {
      en: "Bird nesting on rooftops, balconies, and ledges is most commonly a pigeon problem in UAE properties. AFAQ AL HAYAT installs spikes and netting to deter roosting and keep exterior surfaces clear.",
      ar: "غالبًا ما يكون تعشيش الطيور على الأسطح والشرفات والحواف في عقارات الإمارات مرتبطًا بالحمام تحديدًا. تركّب آفاق الحياة أشواكًا وشباكًا لردع الاستيطان والحفاظ على الأسطح الخارجية نظيفة.",
    },
    keywords: {
      en: ["bird control UAE", "pigeon control Dubai", "bird spikes Abu Dhabi", "bird proofing UAE", "pigeon netting"],
      ar: ["مكافحة الطيور الإمارات", "مكافحة الحمام دبي", "أشواك طرد الطيور أبوظبي"],
    },
    hashtags: { en: ["#BirdControl", "#PigeonControl", "#AFAQAlHayat"], ar: ["#مكافحة_الطيور", "#مكافحة_الحمام", "#آفاق_الحياة"] },
    faqs: commonFaqs("Bird Control", "مكافحة الطيور", "bird"),
    image: "006-pigeon-control-service-card.webp",
    imageAlt: {
      en: "AFAQ AL HAYAT technician installing anti-roosting bird spikes and netting on a Dubai rooftop ledge",
      ar: "فني آفاق الحياة يركّب أشواك وشباك لمنع استيطان الحمام على حافة سطح في دبي",
    },
    relatedIds: ["wasp-control", "snake-control"],
    status: `${STATUS} Renamed/broadened from "Pigeon Control" per Owner's 2026-07-30 request; the only real image and prior content are pigeon-specific, so the page stays honest about that while using the broader requested name. Not yet in SERVICE_CATALOG.md/03_BOOKING_OPTIONS.md's approved pest-type list.`,
  },
  {
    id: "home-pest-prevention-installation",
    name: { en: "Home Pest Prevention & Installation Services", ar: "خدمات الوقاية من الآفات وتركيب المصائد المنزلية" },
    seoTitle: {
      en: "Home Pest Prevention & Light Trap Installation UAE | AFAQ AL HAYAT",
      ar: "الوقاية من الآفات وتركيب المصائد الضوئية المنزلية في الإمارات | آفاق الحياة",
    },
    metaDescription: {
      en: "House fly control and UV light-trap installation across all 7 UAE emirates. Preventive pest solutions for homes, restaurants, and commercial kitchens from AFAQ AL HAYAT.",
      ar: "مكافحة الذباب المنزلي وتركيب المصائد الضوئية في جميع إمارات الدولة السبع. حلول وقائية للمنازل والمطاعم والمطابخ التجارية من آفاق الحياة.",
    },
    overview: {
      en: "Beyond one-time treatment, AFAQ AL HAYAT installs UV light traps to help prevent house fly activity on an ongoing basis — a common request for homes, restaurants, and commercial kitchens. This page currently covers fly control and light-trap installation specifically; broader preventive-installation services will be added here as they're approved.",
      ar: "بالإضافة إلى العلاج لمرة واحدة، تركّب آفاق الحياة مصائد ضوئية بالأشعة فوق البنفسجية للمساعدة في الوقاية من نشاط الذباب المنزلي بشكل مستمر — وهو طلب شائع للمنازل والمطاعم والمطابخ التجارية. تغطي هذه الصفحة حاليًا مكافحة الذباب وتركيب المصائد الضوئية تحديدًا؛ وستُضاف خدمات وقائية أوسع هنا عند اعتمادها.",
    },
    keywords: {
      en: ["fly control UAE", "light trap installation Dubai", "restaurant fly control Abu Dhabi", "UV fly trap UAE", "pest prevention UAE"],
      ar: ["مكافحة الذباب الإمارات", "تركيب مصيدة ضوئية دبي", "مكافحة الذباب للمطاعم أبوظبي"],
    },
    hashtags: { en: ["#FlyControl", "#LightTrap", "#PestPrevention", "#AFAQAlHayat"], ar: ["#مكافحة_الذباب", "#مصيدة_ضوئية", "#آفاق_الحياة"] },
    faqs: commonFaqs("Home Pest Prevention", "الوقاية من الآفات", "home-pest-prevention"),
    image: "010-house-fly-control-light-trap-installation.webp",
    imageAlt: {
      en: "AFAQ AL HAYAT technician installing a UV fly light trap on a restaurant wall in the UAE",
      ar: "فني آفاق الحياة يركّب مصيدة ضوئية للذباب بالأشعة فوق البنفسجية على جدار مطعم في الإمارات",
    },
    relatedIds: ["cockroach-control", "ant-control"],
    status: `${STATUS} Renamed/broadened from "House Fly Control & Light Trap Installation" per Owner's 2026-07-30 request. Kept deliberately scoped to fly control + light-trap installation in the overview text — the only service this page has real evidence for — rather than inventing other "installation service" types the broader name might imply.`,
  },
  {
    id: "gecko-control",
    name: { en: "Gecko Control", ar: "مكافحة الوزغ" },
    seoTitle: { en: "Gecko Control in the UAE | AFAQ AL HAYAT", ar: "مكافحة الوزغ في الإمارات | آفاق الحياة" },
    metaDescription: {
      en: "Professional gecko inspection and treatment across all 7 UAE emirates. Safe, approved methods from AFAQ AL HAYAT.",
      ar: "معاينة ومعالجة احترافية للوزغ (أبو بريص) في جميع إمارات الدولة السبع. طرق آمنة ومعتمدة من آفاق الحياة.",
    },
    overview: {
      en: "Geckos (also known locally as 'abu breis') are a frequent indoor sighting in UAE homes and businesses. AFAQ AL HAYAT inspects the property and applies safe, approved methods to help reduce gecko activity indoors.",
      ar: "يُعد الوزغ (المعروف محليًا باسم أبو بريص) من الآفات التي يتكرر رصدها داخل المنازل والمنشآت في الإمارات. تعاين آفاق الحياة العقار وتطبق طرقًا آمنة ومعتمدة للمساعدة في تقليل تواجده داخل المنزل.",
    },
    keywords: {
      en: ["gecko control UAE", "gecko removal Dubai", "house lizard control Abu Dhabi", "gecko treatment UAE"],
      ar: ["مكافحة الوزغ الإمارات", "مكافحة أبو بريص دبي", "التخلص من أبو بريص أبوظبي"],
    },
    hashtags: { en: ["#GeckoControl", "#PestControlUAE", "#AFAQAlHayat"], ar: ["#مكافحة_الوزغ", "#مكافحة_أبو_بريص", "#آفاق_الحياة"] },
    faqs: commonFaqs("Gecko Control", "مكافحة الوزغ", "gecko"),
    image: "007-gecko-control-service-card.webp",
    imageAlt: {
      en: "AFAQ AL HAYAT technician inspecting a wall with a flashlight to treat a gecko sighting indoors",
      ar: "فني آفاق الحياة يفحص الجدار بمصباح يدوي لمعالجة وجود وزغ (أبو بريص) داخل المنزل",
    },
    relatedIds: ["cockroach-control", "ant-control"],
    status: `${STATUS} Not in the Owner's 2026-07-30 "Required pest-control pages" list, but kept because it's an already-approved, already-live card on /services/pest-control — see reconciliation note at the top of this file. Not yet in SERVICE_CATALOG.md/03_BOOKING_OPTIONS.md's approved pest-type list.`,
  },
];

export function getPestControlSubServicePage(id: string): PestControlSubServicePage | undefined {
  return PEST_CONTROL_SUB_SERVICE_PAGES.find((page) => page.id === id);
}

export function getRelatedPestControlPages(page: PestControlSubServicePage): PestControlSubServicePage[] {
  return page.relatedIds
    .map((id) => getPestControlSubServicePage(id))
    .filter((related): related is PestControlSubServicePage => Boolean(related));
}
