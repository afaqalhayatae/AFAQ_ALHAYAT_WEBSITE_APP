import { HOMEPAGE_HERO_DIMENSIONS, HOMEPAGE_HERO_SRC } from "@/lib/media/homepage-hero";

type Bilingual = { en: string; ar: string };

export type LandingPageFaq = {
  id: string;
  question: Bilingual;
  answer: Bilingual;
};

export type LandingPageStep = {
  title: Bilingual;
  description: Bilingual;
};

export type LandingPageData = {
  /** Route segment — page lives at /{locale}/lp/{slug}. */
  slug: string;
  /** Real catalog service slug (services.ts) — powers the /book?service= prefill. */
  serviceSlug: string;

  seo: {
    title: Bilingual;
    description: Bilingual;
    keywords: { en: string[]; ar: string[] };
  };

  hero: {
    image: { src: string; width: number; height: number };
    alt: Bilingual;
    eyebrow: Bilingual;
    headline: Bilingual;
    subheadline: Bilingual;
    /** 4 short trust badges shown under the hero CTAs. */
    trustBadges: Bilingual[];
  };

  problem: {
    title: Bilingual;
    body: Bilingual[];
  };

  whyUs: {
    title: Bilingual;
    points: Bilingual[];
  };

  serviceDetails: {
    title: Bilingual;
    body: Bilingual[];
    included: Bilingual[];
  };

  process: {
    title: Bilingual;
    steps: LandingPageStep[];
  };

  standardOfWork: {
    title: Bilingual;
    description: Bilingual;
    image: { src: string; alt: Bilingual };
  };

  pricing: {
    title: Bilingual;
    body: Bilingual;
  };

  faqs: LandingPageFaq[];

  finalCta: {
    title: Bilingual;
    subtitle: Bilingual;
  };
};

function faqIds(slug: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => `${slug}-faq-${i + 1}`);
}

export const LANDING_PAGES: LandingPageData[] = [
  {
    slug: "pest-control",
    serviceSlug: "pest-control",
    seo: {
      title: {
        en: "Pest Control Dubai & UAE | Same-Week Visit | AFAQ AL HAYAT",
        ar: "مكافحة حشرات في دبي والإمارات | زيارة خلال نفس الأسبوع | آفاق الحياة",
      },
      description: {
        en: "Licensed pest control across the UAE — cockroaches, ants, termites, bed bugs, rodents. Real technicians, safe treatment, free quote. Book online or on WhatsApp.",
        ar: "مكافحة حشرات معتمدة في جميع أنحاء الإمارات — صراصير، نمل، نمل أبيض، بق فراش، قوارض. فنيون حقيقيون، علاج آمن، عرض سعر مجاني. احجز أونلاين أو عبر واتساب.",
      },
      keywords: {
        en: ["pest control Dubai", "pest control UAE", "cockroach treatment", "termite control", "bed bug treatment Dubai"],
        ar: ["مكافحة حشرات دبي", "مكافحة حشرات الإمارات", "علاج الصراصير", "مكافحة النمل الأبيض", "علاج بق الفراش دبي"],
      },
    },
    hero: {
      image: { src: "/brand/images/services/pest-control/pest-control-hero-banner-afaq-branded-21x9-v2.webp", width: 1915, height: 821 },
      alt: {
        en: "AFAQ AL HAYAT pest control technician in full protective gear treating a UAE home",
        ar: "فني مكافحة حشرات من آفاق الحياة بمعدات الحماية الكاملة أثناء معالجة منزل في الإمارات",
      },
      eyebrow: { en: "Pest Control", ar: "مكافحة الحشرات" },
      headline: {
        en: "Pest Control That Actually Solves the Problem",
        ar: "مكافحة حشرات تحل المشكلة فعلًا",
      },
      subheadline: {
        en: "Cockroaches, ants, termites, bed bugs, or rodents — licensed technicians, safe treatment for your family and pets, across all 7 emirates.",
        ar: "صراصير، نمل، نمل أبيض، بق فراش، أو قوارض — فنيون معتمدون، علاج آمن على عائلتك وحيواناتك الأليفة، في جميع الإمارات السبع.",
      },
      trustBadges: [
        { en: "UAE-wide service", ar: "خدمة في جميع الإمارات" },
        { en: "Trained technicians", ar: "فنيون مدربون" },
        { en: "Available 24/7", ar: "متاحون على مدار الساعة" },
        { en: "Safe for kids & pets", ar: "آمن على الأطفال والحيوانات" },
      ],
    },
    problem: {
      title: { en: "One Pest You See Usually Means More You Don't", ar: "الحشرة الواحدة التي تراها غالبًا تعني المزيد الذي لا تراه" },
      body: [
        {
          en: "By the time cockroaches, ants, or rodents are visible during the day, the hidden population behind walls, under cabinets, or in wall cavities is usually already established. Store-bought sprays kill what's visible and leave the source untouched — which is why the problem always seems to \"come back\" a few weeks later.",
          ar: "بحلول وقت ظهور الصراصير أو النمل أو القوارض نهارًا، تكون المستعمرة المخفية خلف الجدران أو تحت الخزائن أو في فراغات الجدران قد ترسخت غالبًا. البخاخات الجاهزة تقتل ما هو ظاهر فقط وتترك المصدر دون علاج — ولهذا تبدو المشكلة دائمًا وكأنها \"تعود\" بعد أسابيع قليلة.",
        },
        {
          en: "Termites are worse: they can damage wooden structures for months with zero visible signs until the damage is already serious. Waiting for certainty before acting almost always costs more than an early inspection would have.",
          ar: "النمل الأبيض أسوأ: يمكنه إتلاف الهياكل الخشبية لأشهر دون أي علامة ظاهرة حتى يصبح الضرر جسيمًا بالفعل. انتظار اليقين قبل التصرف يكلف دائمًا تقريبًا أكثر من فحص مبكر كان سيكلفه.",
        },
      ],
    },
    whyUs: {
      title: { en: "Why UAE Homeowners Choose AFAQ AL HAYAT", ar: "لماذا يختار أصحاب المنازل في الإمارات آفاق الحياة" },
      points: [
        { en: "Real inspection before treatment — not a guess, a plan based on what's actually found.", ar: "معاينة حقيقية قبل العلاج — ليست تخمينًا، بل خطة مبنية على ما تم اكتشافه فعليًا." },
        { en: "Trained, uniformed technicians who treat your home with the same care as their own.", ar: "فنيون مدربون بزي موحد يتعاملون مع منزلك بنفس العناية التي يعاملون بها منازلهم." },
        { en: "Fast response — WhatsApp or call, and our team follows up to confirm a visit.", ar: "استجابة سريعة — واتساب أو اتصال، وفريقنا يتابع معك لتأكيد الزيارة." },
        { en: "Coverage across all 7 emirates, from Dubai to the Northern Emirates.", ar: "تغطية في جميع الإمارات السبع، من دبي إلى الإمارات الشمالية." },
      ],
    },
    serviceDetails: {
      title: { en: "What Our Pest Control Service Covers", ar: "ما الذي تشمله خدمة مكافحة الحشرات لدينا" },
      body: [
        {
          en: "Every visit starts with identifying exactly which pest, how it's entering, and how far the problem has spread — then a treatment plan matched to that finding, not a one-size-fits-all spray.",
          ar: "كل زيارة تبدأ بتحديد نوع الحشرة بالضبط، وكيف تدخل، ومدى انتشار المشكلة — ثم خطة علاج مطابقة لهذا الاكتشاف، وليست رشة موحدة للجميع.",
        },
      ],
      included: [
        { en: "Cockroach, ant, termite, bed bug, and rodent treatment", ar: "علاج الصراصير والنمل والنمل الأبيض وبق الفراش والقوارض" },
        { en: "Full inspection and entry-point identification", ar: "فحص كامل وتحديد نقاط الدخول" },
        { en: "Treatment safe for children and pets once dry", ar: "علاج آمن للأطفال والحيوانات الأليفة بعد الجفاف" },
        { en: "Follow-up guidance to prevent the problem returning", ar: "إرشادات متابعة لمنع عودة المشكلة" },
      ],
    },
    process: {
      title: { en: "How It Works", ar: "كيف تسير الخدمة" },
      steps: [
        { title: { en: "1. Request", ar: "١. الطلب" }, description: { en: "Book online or message us on WhatsApp with what you're seeing.", ar: "احجز أونلاين أو راسلنا عبر واتساب بما تلاحظه." } },
        { title: { en: "2. Inspection", ar: "٢. المعاينة" }, description: { en: "A technician identifies the pest, entry points, and scale of the issue.", ar: "يحدد الفني نوع الحشرة ونقاط الدخول وحجم المشكلة." } },
        { title: { en: "3. Treatment", ar: "٣. العلاج" }, description: { en: "Targeted, safe treatment matched to what was actually found.", ar: "علاج مستهدف وآمن مطابق لما تم اكتشافه فعليًا." } },
        { title: { en: "4. Follow-up", ar: "٤. المتابعة" }, description: { en: "Prevention guidance so the problem doesn't come back.", ar: "إرشادات وقائية حتى لا تعود المشكلة." } },
      ],
    },
    standardOfWork: {
      title: { en: "The Standard You Can Expect", ar: "المستوى الذي يمكنك توقعه" },
      description: {
        en: "Every technician arrives in uniform, with proper protective equipment, and treats your home like it's the only job that matters that day.",
        ar: "كل فني يصل بزي موحد ومعدات حماية مناسبة، ويتعامل مع منزلك وكأنه المهمة الوحيدة التي تهم في ذلك اليوم.",
      },
      image: {
        src: "/brand/images/services/pest-control/004-cockroach-control-service-card.webp",
        alt: { en: "AFAQ AL HAYAT technician performing a careful, thorough pest treatment", ar: "فني آفاق الحياة يقوم بعلاج دقيق وشامل للحشرات" },
      },
    },
    pricing: {
      title: { en: "What Does It Cost?", ar: "كم التكلفة؟" },
      body: {
        en: "Pricing depends on the pest, the size of your home, and the scale of the infestation — there's no honest single number without a look at your specific case. Get a free, no-obligation quote after a quick chat with our team.",
        ar: "التكلفة تعتمد على نوع الحشرة، وحجم منزلك، ومدى انتشار الإصابة — لا يوجد رقم واحد صادق بدون معرفة حالتك تحديدًا. احصل على عرض سعر مجاني وبدون التزام بعد محادثة سريعة مع فريقنا.",
      },
    },
    faqs: [
      { question: { en: "How fast can you send a technician?", ar: "كم تحتاجون من الوقت لإرسال فني؟" }, answer: { en: "Message us on WhatsApp or call, and our team follows up right away to confirm the nearest available slot.", ar: "راسلنا عبر واتساب أو اتصل، وسيتابع فريقنا معك فورًا لتأكيد أقرب موعد متاح." } },
      { question: { en: "Is the treatment safe for children and pets?", ar: "هل العلاج آمن على الأطفال والحيوانات الأليفة؟" }, answer: { en: "Our technicians use treatment methods designed to be safe for the household once applied and dried, and will advise on any precautions for your specific home.", ar: "يستخدم فنيونا طرق علاج مصممة لتكون آمنة على أفراد المنزل بعد التطبيق والجفاف، وسيقدمون إرشادات لأي احتياطات خاصة بمنزلك." } },
      { question: { en: "Do I need to leave the house during treatment?", ar: "هل يجب أن أغادر المنزل أثناء العلاج؟" }, answer: { en: "This depends on the treatment type and pest — your technician will let you know exactly what to expect before starting.", ar: "يعتمد ذلك على نوع العلاج والحشرة — سيخبرك الفني بالضبط بما يجب توقعه قبل البدء." } },
      { question: { en: "What if the pests come back after treatment?", ar: "ماذا لو عادت الحشرات بعد العلاج؟" }, answer: { en: "We'll walk you through follow-up guidance to reduce the chance of recurrence, and you can always reach out again if the issue persists.", ar: "سنقدم لك إرشادات متابعة لتقليل احتمال العودة، ويمكنك دائمًا التواصل معنا مجددًا إذا استمرت المشكلة." } },
      { question: { en: "Do you treat termites too, not just insects like cockroaches?", ar: "هل تعالجون النمل الأبيض أيضًا، وليس فقط حشرات مثل الصراصير؟" }, answer: { en: "Yes — our pest control service covers cockroaches, ants, termites, bed bugs, and rodents.", ar: "نعم — تشمل خدمة مكافحة الحشرات لدينا الصراصير والنمل والنمل الأبيض وبق الفراش والقوارض." } },
      { question: { en: "How much does pest control cost?", ar: "كم تكلفة مكافحة الحشرات؟" }, answer: { en: "It depends on the pest, home size, and infestation scale — contact us for a free quote based on your actual situation.", ar: "تعتمد على نوع الحشرة وحجم المنزل ومدى انتشار الإصابة — تواصل معنا للحصول على عرض سعر مجاني بناءً على حالتك الفعلية." } },
      { question: { en: "Do you serve my emirate?", ar: "هل تقدمون الخدمة في إمارتي؟" }, answer: { en: "We cover all 7 UAE emirates — Dubai, Abu Dhabi, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, and Fujairah.", ar: "نغطي جميع إمارات الدولة السبع — دبي، أبوظبي، الشارقة، عجمان، أم القيوين، رأس الخيمة، والفجيرة." } },
      { question: { en: "How do I know if I need pest control or it's just a one-off?", ar: "كيف أعرف إذا كنت أحتاج مكافحة حشرات أم أنها حالة عابرة؟" }, answer: { en: "Daytime sightings, droppings, odd smells, or repeated appearances in the same spot usually point to an established problem worth a proper inspection.", ar: "المشاهدات النهارية، أو البراز، أو الروائح الغريبة، أو التكرار في نفس المكان تشير غالبًا لمشكلة راسخة تستحق فحصًا مناسبًا." } },
      { question: { en: "Can I book online without calling?", ar: "هل يمكنني الحجز أونلاين بدون اتصال؟" }, answer: { en: "Yes — use the booking form on this page, or message us on WhatsApp, whichever is easier for you.", ar: "نعم — استخدم نموذج الحجز في هذه الصفحة، أو راسلنا عبر واتساب، أيهما أسهل بالنسبة لك." } },
      { question: { en: "Is AFAQ AL HAYAT available for emergencies?", ar: "هل آفاق الحياة متاحة للحالات الطارئة؟" }, answer: { en: "We're available 24/7 — reach out any time and our team will confirm the earliest available visit.", ar: "نحن متاحون على مدار الساعة — تواصل معنا في أي وقت وسيؤكد فريقنا أقرب موعد متاح." } },
    ].map((faq, i) => ({ id: faqIds("pest-control", 10)[i], ...faq })),
    finalCta: {
      title: { en: "Get Rid of the Problem, Not Just the Symptoms", ar: "تخلص من المشكلة، لا من الأعراض فقط" },
      subtitle: { en: "Book online, call, or message us on WhatsApp — our team follows up to confirm your visit.", ar: "احجز أونلاين، أو اتصل، أو راسلنا عبر واتساب — يتابع فريقنا معك لتأكيد زيارتك." },
    },
  },
];

export function getLandingPage(slug: string): LandingPageData | undefined {
  return LANDING_PAGES.find((page) => page.slug === slug);
}
