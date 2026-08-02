import serviceDatabase from "@/data/SERVICE_DATABASE.json";
import { APPROVED_SERVICE_CONTENT_SLUGS } from "./service-content";

/**
 * FAQ content registry (JOB-AGT-WEB-20260726-M4.1).
 *
 * This is architecture, not content: every FAQ source in the knowledge
 * base (per-service FAQ.md files, GENERAL_SERVICE_FAQ_DRAFT.md) is marked
 * Draft / "Not Approved for Publication" today. Per SCHEMA_STRATEGY.md,
 * FAQPage structured data may only describe visible, approved content —
 * so this list stays empty until a specific Q&A is explicitly approved
 * for publication. The FAQ page and its JSON-LD both read from this
 * array directly, so adding an approved entry here is the entire
 * publishing step; no other code changes are needed.
 */

export type FaqCategory = "services" | "booking" | "locations";

export type FaqItem = {
  id: string;
  category: FaqCategory;
  /** Only set on `category: "services"` items — ties a Q&A to one service slug. */
  serviceSlug?: string;
  question: { en: string; ar: string };
  answer: { en: string; ar: string };
  /**
   * Temporary visual-testing content only (2026-07-28), same pattern as
   * `BlogPost.isDemo` — never a real, approved FAQ. Must be excluded from
   * FAQPage schema (a demo Q&A must never be indexed as real answered
   * content) and marked with a visible on-page notice. Real, approved
   * entries must omit this field.
   */
  isDemo?: boolean;
};

export const FAQ_CATEGORIES: FaqCategory[] = ["services", "booking", "locations"];

/**
 * First real batch (2026-08-04, final website completion pass): 30
 * Owner-facing FAQs across services, booking, and locations. Every fact
 * used (coverage across all 7 emirates, 24/7 hours, phone/WhatsApp/email
 * channels) is already Approved in CONTACT_INFORMATION.md / LOCAL_SEO_
 * PROFILE.md / SERVICE_AREAS.md. Anywhere a real fact would be required
 * but isn't yet confirmed (pricing, warranty terms, exact response
 * times), the answer uses the same "subject to company policy" /
 * "يخضع ذلك لسياسة الشركة" convention already established in
 * SERVICE_DATABASE.json rather than inventing a number or promise.
 */
export const APPROVED_FAQS: FaqItem[] = [
  {
    id: "faq-maintenance-services-offered",
    category: "services",
    question: {
      en: "What maintenance services does AFAQ AL HAYAT offer?",
      ar: "ما هي خدمات الصيانة التي تقدمها آفاق الحياة؟",
    },
    answer: {
      en: "We provide AC maintenance, plumbing, electrical maintenance, painting, handyman services, drain unblocking, waterproofing, and water leak detection for homes and businesses across the UAE.",
      ar: "نقدم خدمات صيانة المكيفات والسباكة والصيانة الكهربائية والدهان وأعمال الهاندي مان وتسليك المصارف والعزل المائي والكشف عن تسربات المياه للمنازل والمنشآت التجارية في جميع أنحاء الإمارات.",
    },
  },
  {
    id: "faq-ac-service-frequency",
    category: "services",
    serviceSlug: "ac-maintenance",
    question: {
      en: "How often should AC units be serviced?",
      ar: "كم مرة يجب صيانة وحدات التكييف؟",
    },
    answer: {
      en: "This depends on the unit, its usage, and its environment. A technician can recommend a schedule based on a real inspection rather than a fixed rule for every home.",
      ar: "يعتمد ذلك على الوحدة واستخدامها وبيئتها. يمكن للفني اقتراح جدول مناسب بناءً على فحص حقيقي بدلًا من قاعدة ثابتة لكل منزل.",
    },
  },
  {
    id: "faq-plumbing-callout",
    category: "services",
    serviceSlug: "plumbing",
    question: {
      en: "Do you provide plumbing repairs on short notice?",
      ar: "هل تقدمون إصلاحات سباكة خلال وقت قصير؟",
    },
    answer: {
      en: "Availability is confirmed at the time of booking. Contact us with your details and we'll advise on the earliest available slot.",
      ar: "يتم تأكيد الموعد المتاح عند الحجز. تواصل معنا بتفاصيل طلبك وسنوضح لك أقرب موعد متاح.",
    },
  },
  {
    id: "faq-electrical-work-covered",
    category: "services",
    serviceSlug: "electrical-maintenance",
    question: {
      en: "What electrical work can you help with?",
      ar: "ما هي الأعمال الكهربائية التي يمكنكم المساعدة فيها؟",
    },
    answer: {
      en: "Common requests include circuit breaker and distribution board checks, socket and switch repair or replacement, lighting installation, and tracing the cause of recurring trips or flickering.",
      ar: "تشمل الطلبات الشائعة فحص قواطع الدائرة ولوحات التوزيع، وإصلاح أو استبدال المقابس والمفاتيح، وتركيب الإضاءة، وتحديد سبب الانقطاعات المتكررة أو الوميض.",
    },
  },
  {
    id: "faq-painting-interior-exterior",
    category: "services",
    serviceSlug: "painting",
    question: {
      en: "Do you offer both interior and exterior painting?",
      ar: "هل تقدمون خدمات الدهان الداخلي والخارجي؟",
    },
    answer: {
      en: "Yes, we handle both interior and exterior painting, including surface preparation and repairs to cracks or damage before painting begins.",
      ar: "نعم، نقدم خدمات الدهان الداخلي والخارجي، بما في ذلك تجهيز السطح وإصلاح الشقوق أو الأضرار قبل بدء الدهان.",
    },
  },
  {
    id: "faq-handyman-scope",
    category: "services",
    serviceSlug: "handyman",
    question: {
      en: "What kind of small repairs does your handyman service cover?",
      ar: "ما نوع الإصلاحات الصغيرة التي تغطيها خدمة الهاندي مان؟",
    },
    answer: {
      en: "Loose hinges, door and lock adjustments, mounting and hanging items, minor fixture repairs, and similar small home fixes. If a job turns out to involve electrical, gas, or structural work, we'll advise on the right next step.",
      ar: "المفصلات المرتخية وضبط الأبواب والأقفال وتركيب الأشياء وتعليقها وإصلاحات بسيطة للتجهيزات وما شابه من إصلاحات منزلية صغيرة. إذا تبيّن أن العمل يتعلق بالكهرباء أو الغاز أو أمور إنشائية، سننصحك بالخطوة التالية المناسبة.",
    },
  },
  {
    id: "faq-general-cleaning-included",
    category: "services",
    serviceSlug: "general-cleaning",
    question: {
      en: "What's included in a general home cleaning visit?",
      ar: "ماذا يشمل تنظيف المنزل العام؟",
    },
    answer: {
      en: "Kitchens, bathrooms, floors, and general tidying across the home, on a schedule that fits your household.",
      ar: "المطابخ والحمامات والأرضيات والترتيب العام في المنزل، وفق جدول يناسب أسرتك.",
    },
  },
  {
    id: "faq-regular-vs-deep-cleaning",
    category: "services",
    serviceSlug: "deep-cleaning",
    question: {
      en: "What's the difference between regular cleaning and deep cleaning?",
      ar: "ما الفرق بين التنظيف المنتظم والتنظيف العميق؟",
    },
    answer: {
      en: "Regular cleaning covers everyday surfaces and tidiness. Deep cleaning goes further into areas that aren't part of a routine pass — behind appliances, inside cabinets, and grout lines.",
      ar: "يغطي التنظيف المنتظم الأسطح اليومية والترتيب، بينما يصل التنظيف العميق إلى مناطق ليست جزءًا من الجولة الروتينية — خلف الأجهزة وداخل الخزائن وخطوط الفواصل.",
    },
  },
  {
    id: "faq-water-tank-cleaning-frequency",
    category: "services",
    serviceSlug: "water-tank-cleaning",
    question: {
      en: "How often should water tanks be cleaned?",
      ar: "كم مرة يجب تنظيف خزانات المياه؟",
    },
    answer: {
      en: "This depends on the tank type and usage. A technician can recommend a suitable schedule after inspecting your specific tank.",
      ar: "يعتمد ذلك على نوع الخزان واستخدامه. يمكن للفني اقتراح جدول مناسب بعد فحص خزانك تحديدًا.",
    },
  },
  {
    id: "faq-pests-treated",
    category: "services",
    serviceSlug: "pest-control",
    question: {
      en: "What pests do you treat?",
      ar: "ما هي الآفات التي تعالجونها؟",
    },
    answer: {
      en: "Cockroaches, ants, termites, rodents, bed bugs, mosquitoes, wasps, geckos, and other common household pests, with treatment matched to the specific pest and property.",
      ar: "الصراصير والنمل والنمل الأبيض والقوارض وبق الفراش والبعوض والزنابير والبرص وغيرها من الآفات المنزلية الشائعة، مع علاج مخصص وفق نوع الآفة والعقار.",
    },
  },
  {
    id: "faq-pest-control-safe-for-family",
    category: "services",
    serviceSlug: "pest-control",
    question: {
      en: "Is pest control treatment safe for children and pets?",
      ar: "هل علاج مكافحة الحشرات آمن للأطفال والحيوانات الأليفة؟",
    },
    answer: {
      en: "Our technicians explain any precautions specific to your treatment before, during, and after the visit, so you know exactly what to do to keep family members and pets safe.",
      ar: "يشرح فنيونا أي احتياطات خاصة بعلاجك قبل الزيارة وأثناءها وبعدها، لتعرف بالضبط ما يجب فعله للحفاظ على سلامة أفراد الأسرة والحيوانات الأليفة.",
    },
  },
  {
    id: "faq-pest-control-leave-home",
    category: "services",
    serviceSlug: "pest-control",
    question: {
      en: "Do I need to leave my home during pest treatment?",
      ar: "هل يجب أن أغادر منزلي أثناء علاج مكافحة الحشرات؟",
    },
    answer: {
      en: "This depends on the type of treatment. Your technician will let you know beforehand if any precaution like this applies to your specific case.",
      ar: "يعتمد ذلك على نوع العلاج. سيخبرك الفني مسبقًا إذا كان أي احتياط من هذا النوع ينطبق على حالتك تحديدًا.",
    },
  },
  {
    id: "faq-drain-unblocking-scope",
    category: "services",
    serviceSlug: "drain-unblocking",
    question: {
      en: "Can you unblock a slow or fully blocked drain?",
      ar: "هل يمكنكم تسليك مصرف بطيء أو مسدود بالكامل؟",
    },
    answer: {
      en: "Yes, we handle both slow-draining and fully blocked drains, including identifying the cause so it doesn't quickly recur.",
      ar: "نعم، نتعامل مع المصارف البطيئة والمسدودة بالكامل، بما في ذلك تحديد السبب لمنع تكرار المشكلة سريعًا.",
    },
  },
  {
    id: "faq-water-leak-detection-scope",
    category: "services",
    serviceSlug: "water-leak-detection",
    question: {
      en: "Do you offer water leak detection for hidden leaks?",
      ar: "هل تقدمون خدمة الكشف عن تسربات المياه الخفية؟",
    },
    answer: {
      en: "Yes, we help trace leaks that aren't visible on the surface, such as those behind walls or under flooring.",
      ar: "نعم، نساعد في تتبع التسربات غير المرئية على السطح، مثل تلك الموجودة خلف الجدران أو تحت الأرضيات.",
    },
  },
  {
    id: "faq-how-to-book",
    category: "booking",
    question: {
      en: "How do I book a service?",
      ar: "كيف أحجز خدمة؟",
    },
    answer: {
      en: "You can reach us by phone, WhatsApp, or through the contact form on this website, and we'll help you arrange a visit.",
      ar: "يمكنك التواصل معنا عبر الهاتف أو واتساب أو من خلال نموذج التواصل على هذا الموقع، وسنساعدك في تحديد موعد الزيارة.",
    },
  },
  {
    id: "faq-same-day-booking",
    category: "booking",
    question: {
      en: "Can I book same-day service?",
      ar: "هل يمكنني حجز خدمة في نفس اليوم؟",
    },
    answer: {
      en: "This depends on current availability and is confirmed when you book, rather than guaranteed in advance.",
      ar: "يعتمد ذلك على التوفر الحالي، ويتم تأكيده عند الحجز وليس ضمانًا مسبقًا.",
    },
  },
  {
    id: "faq-service-areas-covered",
    category: "booking",
    question: {
      en: "What areas do you serve?",
      ar: "ما هي المناطق التي تخدمونها؟",
    },
    answer: {
      en: "We provide service across all seven emirates of the UAE: Dubai, Abu Dhabi, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, and Fujairah.",
      ar: "نقدم خدماتنا في جميع أنحاء الإمارات السبع: دبي وأبوظبي والشارقة وعجمان وأم القيوين ورأس الخيمة والفجيرة.",
    },
  },
  {
    id: "faq-how-to-get-a-quote",
    category: "booking",
    question: {
      en: "How do I get a quote?",
      ar: "كيف أحصل على عرض سعر؟",
    },
    answer: {
      en: "Contact us with details about the service you need, and our team will follow up with next steps.",
      ar: "تواصل معنا بتفاصيل الخدمة التي تحتاجها، وسيتابع فريقنا معك الخطوات التالية.",
    },
  },
  {
    id: "faq-payment-methods",
    category: "booking",
    question: {
      en: "What payment methods do you accept?",
      ar: "ما هي طرق الدفع التي تقبلونها؟",
    },
    answer: {
      en: "Payment methods are subject to company policy — our team will confirm what's available when you book.",
      ar: "طرق الدفع تخضع لسياسة الشركة — سيؤكد لك فريقنا الطرق المتاحة عند الحجز.",
    },
  },
  {
    id: "faq-reschedule-cancel",
    category: "booking",
    question: {
      en: "Can I reschedule or cancel a booking?",
      ar: "هل يمكنني تغيير موعد الحجز أو إلغاؤه؟",
    },
    answer: {
      en: "Yes, contact us as early as possible and we'll help you reschedule or cancel your booking.",
      ar: "نعم، تواصل معنا في أقرب وقت ممكن وسنساعدك في تغيير موعد حجزك أو إلغائه.",
    },
  },
  {
    id: "faq-service-warranty",
    category: "booking",
    question: {
      en: "Do you offer a warranty on your services?",
      ar: "هل تقدمون ضمانًا على خدماتكم؟",
    },
    answer: {
      en: "Warranty terms are subject to company policy and will be confirmed with you directly for your specific service.",
      ar: "شروط الضمان تخضع لسياسة الشركة وسيتم تأكيدها معك مباشرة وفق خدمتك المحددة.",
    },
  },
  {
    id: "faq-contact-support",
    category: "booking",
    question: {
      en: "How can I contact customer support?",
      ar: "كيف يمكنني التواصل مع خدمة العملاء؟",
    },
    answer: {
      en: "You can reach us by phone or WhatsApp at +971 58 543 1766, by email at Info@afaqalhayatae.com, or through the contact form on this website.",
      ar: "يمكنك التواصل معنا عبر الهاتف أو واتساب على +971 58 543 1766، أو عبر البريد الإلكتروني Info@afaqalhayatae.com، أو من خلال نموذج التواصل على هذا الموقع.",
    },
  },
  {
    id: "faq-24-7-availability",
    category: "booking",
    question: {
      en: "Is AFAQ AL HAYAT available 24/7?",
      ar: "هل آفاق الحياة متاحة على مدار الساعة؟",
    },
    answer: {
      en: "Yes, our support hours are 24/7.",
      ar: "نعم، ساعات دعمنا على مدار الساعة (24/7).",
    },
  },
  {
    id: "faq-residential-commercial",
    category: "booking",
    question: {
      en: "Do you serve both residential and commercial properties?",
      ar: "هل تخدمون العقارات السكنية والتجارية؟",
    },
    answer: {
      en: "Yes, we provide our services for both residential and commercial properties.",
      ar: "نعم، نقدم خدماتنا للعقارات السكنية والتجارية على حد سواء.",
    },
  },
  {
    id: "faq-locations-dubai",
    category: "locations",
    question: {
      en: "Do you provide services in Dubai?",
      ar: "هل تقدمون خدماتكم في دبي؟",
    },
    answer: {
      en: "Yes, we serve Dubai, including both villa communities and apartment buildings.",
      ar: "نعم، نخدم دبي، بما في ذلك مجتمعات الفلل ومباني الشقق.",
    },
  },
  {
    id: "faq-locations-abu-dhabi",
    category: "locations",
    question: {
      en: "Do you provide services in Abu Dhabi?",
      ar: "هل تقدمون خدماتكم في أبوظبي؟",
    },
    answer: {
      en: "Yes, we serve Abu Dhabi, from island communities to established districts across the emirate.",
      ar: "نعم، نخدم أبوظبي، من مجتمعات الجزر إلى الأحياء الراسخة في جميع أنحاء الإمارة.",
    },
  },
  {
    id: "faq-locations-all-emirates",
    category: "locations",
    question: {
      en: "Do you cover all seven emirates?",
      ar: "هل تغطون جميع الإمارات السبع؟",
    },
    answer: {
      en: "Yes — Dubai, Abu Dhabi, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, and Fujairah are all covered.",
      ar: "نعم — نغطي دبي وأبوظبي والشارقة وعجمان وأم القيوين ورأس الخيمة والفجيرة.",
    },
  },
  {
    id: "faq-locations-villas-apartments",
    category: "locations",
    question: {
      en: "Do you serve villas as well as apartments?",
      ar: "هل تخدمون الفلل بالإضافة إلى الشقق؟",
    },
    answer: {
      en: "Yes, our services are available for villas, apartments, and commercial properties alike.",
      ar: "نعم، خدماتنا متاحة للفلل والشقق والعقارات التجارية على حد سواء.",
    },
  },
  {
    id: "faq-locations-new-developments",
    category: "locations",
    question: {
      en: "Is service available in new communities and developments?",
      ar: "هل الخدمة متاحة في المجتمعات والتطويرات الجديدة؟",
    },
    answer: {
      en: "Yes, coverage extends to newer developments as well as established neighborhoods across the emirates we serve.",
      ar: "نعم، تمتد التغطية إلى التطويرات الأحدث بالإضافة إلى الأحياء الراسخة في الإمارات التي نخدمها.",
    },
  },
  {
    id: "faq-locations-check-my-area",
    category: "locations",
    question: {
      en: "How do I find out if you cover my specific area?",
      ar: "كيف أعرف إذا كنتم تغطون منطقتي تحديدًا؟",
    },
    answer: {
      en: "Contact us with your location and we'll confirm availability for your area when you book.",
      ar: "تواصل معنا بموقعك وسنؤكد لك مدى التوفر في منطقتك عند الحجز.",
    },
  },
];

/**
 * Per-service FAQs sourced from SERVICE_DATABASE.json (real knowledge-base
 * content, per service `sourceDocs`). Reuses
 * `APPROVED_SERVICE_CONTENT_SLUGS` (service-content.ts) as the single
 * approval gate for a service's content + FAQ together — a slug's FAQs
 * render normally and enter FAQPage JSON-LD once (and only once) its
 * content is Owner-approved there. Everything else stays `isDemo: true`
 * for exactly the same reason as `HOMEPAGE_DEMO_FAQS`: real but not yet
 * Owner-approved content must render with a visible notice and be
 * excluded from schema (see `ServiceFaqSection`'s filter).
 */
const DRAFT_SERVICE_FAQS: FaqItem[] = serviceDatabase.services.flatMap((service) =>
  (service.faqs ?? []).map((faq) => ({
    id: faq.id,
    category: "services" as const,
    serviceSlug: service.slug,
    question: faq.question,
    answer: faq.answer,
    isDemo: !APPROVED_SERVICE_CONTENT_SLUGS.includes(service.slug),
  })),
);

export function getServiceFaqs(slug: string): FaqItem[] {
  return [...APPROVED_FAQS, ...DRAFT_SERVICE_FAQS].filter(
    (item) => item.category === "services" && item.serviceSlug === slug,
  );
}
