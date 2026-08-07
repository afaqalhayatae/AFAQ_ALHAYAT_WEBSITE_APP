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
  {
    slug: "deep-cleaning",
    serviceSlug: "deep-cleaning",
    seo: {
      title: { en: "Deep Cleaning Dubai & UAE | Full-Home Deep Clean | AFAQ AL HAYAT", ar: "تنظيف عميق في دبي والإمارات | تنظيف شامل للمنزل | آفاق الحياة" },
      description: { en: "Professional deep cleaning across the UAE — kitchens, bathrooms, behind appliances, every detail daily cleaning misses. Free quote, book online.", ar: "تنظيف عميق احترافي في جميع أنحاء الإمارات — المطابخ والحمامات وخلف الأجهزة وكل التفاصيل التي يفوتها التنظيف اليومي. عرض سعر مجاني، احجز أونلاين." },
      keywords: { en: ["deep cleaning Dubai", "deep cleaning UAE", "full home deep clean", "move-in deep cleaning"], ar: ["تنظيف عميق دبي", "تنظيف عميق الإمارات", "تنظيف شامل للمنزل", "تنظيف عميق قبل الانتقال"] },
    },
    hero: {
      image: { src: "/brand/images/services/cleaning/cleaning-services-hero-banner-afaq-branded-21x9-v1.webp", width: 1693, height: 929 },
      alt: { en: "AFAQ AL HAYAT cleaning technician performing a thorough deep clean in a UAE home", ar: "فني تنظيف من آفاق الحياة يقوم بتنظيف عميق شامل في منزل بالإمارات" },
      eyebrow: { en: "Deep Cleaning", ar: "التنظيف العميق" },
      headline: { en: "A Deep Clean That Reaches What Daily Cleaning Misses", ar: "تنظيف عميق يصل إلى ما يفوته التنظيف اليومي" },
      subheadline: { en: "Kitchens, bathrooms, behind appliances, every corner — a thorough one-time clean for move-ins, events, or a fresh start.", ar: "المطابخ والحمامات وخلف الأجهزة وكل زاوية — تنظيف شامل لمرة واحدة عند الانتقال أو المناسبات أو بداية جديدة." },
      trustBadges: [
        { en: "UAE-wide service", ar: "خدمة في جميع الإمارات" },
        { en: "Trained cleaning teams", ar: "فرق تنظيف مدربة" },
        { en: "Flexible scheduling", ar: "جدولة مرنة" },
        { en: "Quality-focused", ar: "التركيز على الجودة" },
      ],
    },
    problem: {
      title: { en: "Regular Cleaning Keeps Up — It Doesn't Reset", ar: "التنظيف المعتاد يحافظ على النظافة — لكنه لا يعيد الضبط من الصفر" },
      body: [
        { en: "Daily or weekly cleaning handles floors, surfaces, and visible dust — but grease behind the stove, soap buildup in grout, and dust inside vents accumulate for months without a deep clean ever touching them.", ar: "التنظيف اليومي أو الأسبوعي يتعامل مع الأرضيات والأسطح والغبار الظاهر — لكن الدهون خلف الموقد، وتراكم الصابون في فواصل البلاط، والغبار داخل فتحات التهوية تتراكم لأشهر دون أن يصلها أي تنظيف عميق." },
        { en: "Moving into a new home, preparing for guests, or just feeling like the house needs a genuine reset are all good reasons to book one — it's not a luxury, it's maintenance that regular cleaning structurally can't cover.", ar: "الانتقال لمنزل جديد، أو التحضير لضيوف، أو مجرد الشعور بأن المنزل يحتاج إعادة ضبط حقيقية، كلها أسباب وجيهة لحجزه — إنه ليس رفاهية، بل صيانة لا يستطيع التنظيف المعتاد تغطيتها من حيث المبدأ." },
      ],
    },
    whyUs: {
      title: { en: "Why UAE Homeowners Choose AFAQ AL HAYAT", ar: "لماذا يختار أصحاب المنازل في الإمارات آفاق الحياة" },
      points: [
        { en: "A real checklist covering the areas daily cleaning structurally skips.", ar: "قائمة فحص حقيقية تغطي المناطق التي يتخطاها التنظيف اليومي من حيث المبدأ." },
        { en: "Trained, uniformed teams who treat your home with care.", ar: "فرق مدربة بزي موحد تتعامل مع منزلك بعناية." },
        { en: "Flexible scheduling around your move-in date or event.", ar: "جدولة مرنة حول موعد انتقالك أو مناسبتك." },
        { en: "Coverage across all 7 emirates.", ar: "تغطية في جميع الإمارات السبع." },
      ],
    },
    serviceDetails: {
      title: { en: "What Our Deep Cleaning Service Covers", ar: "ما الذي تشمله خدمة التنظيف العميق" },
      body: [{ en: "A deep clean targets the buildup regular cleaning never reaches — grease, grout, vents, behind and under appliances — room by room, not a quick surface pass.", ar: "التنظيف العميق يستهدف التراكمات التي لا يصلها التنظيف المعتاد أبدًا — الدهون، فواصل البلاط، فتحات التهوية، خلف الأجهزة وتحتها — غرفة بغرفة، وليس مرورًا سطحيًا سريعًا." }],
      included: [
        { en: "Kitchen deep clean, including behind and under appliances", ar: "تنظيف عميق للمطبخ، بما في ذلك خلف الأجهزة وتحتها" },
        { en: "Bathroom deep clean, grout and fixtures included", ar: "تنظيف عميق للحمامات، بما في ذلك الفواصل والتجهيزات" },
        { en: "Dust removal from vents, skirting, and hard-to-reach spots", ar: "إزالة الغبار من فتحات التهوية والوزرات والأماكن صعبة الوصول" },
        { en: "Full-home floor and surface deep clean", ar: "تنظيف عميق شامل للأرضيات والأسطح" },
      ],
    },
    process: {
      title: { en: "How It Works", ar: "كيف تسير الخدمة" },
      steps: [
        { title: { en: "1. Request", ar: "١. الطلب" }, description: { en: "Book online or message us with your home size and timing.", ar: "احجز أونلاين أو راسلنا بحجم منزلك والتوقيت المناسب." } },
        { title: { en: "2. Confirm", ar: "٢. التأكيد" }, description: { en: "Our team follows up to confirm the scope and schedule.", ar: "يتابع فريقنا معك لتأكيد نطاق العمل والموعد." } },
        { title: { en: "3. Deep Clean", ar: "٣. التنظيف العميق" }, description: { en: "A full checklist clean, room by room, top to bottom.", ar: "تنظيف شامل وفق قائمة فحص، غرفة بغرفة، من الأعلى للأسفل." } },
        { title: { en: "4. Walkthrough", ar: "٤. المراجعة" }, description: { en: "A final check together before the team leaves.", ar: "مراجعة أخيرة معًا قبل مغادرة الفريق." } },
      ],
    },
    standardOfWork: {
      title: { en: "The Standard You Can Expect", ar: "المستوى الذي يمكنك توقعه" },
      description: { en: "A real checklist, followed room by room — not a rushed once-over.", ar: "قائمة فحص حقيقية، تُتبع غرفة بغرفة — وليست مرورًا سريعًا." },
      image: { src: "/brand/images/services/cleaning/deep-cleaning-service-card-afaq-v1.webp", alt: { en: "AFAQ AL HAYAT technician deep-cleaning a kitchen surface", ar: "فني آفاق الحياة يقوم بتنظيف عميق لسطح المطبخ" } },
    },
    pricing: {
      title: { en: "What Does It Cost?", ar: "كم التكلفة؟" },
      body: { en: "Pricing depends on your home's size and condition — get a free, no-obligation quote after a quick chat with our team.", ar: "التكلفة تعتمد على حجم منزلك وحالته — احصل على عرض سعر مجاني وبدون التزام بعد محادثة سريعة مع فريقنا." },
    },
    faqs: [
      { question: { en: "How long does a deep clean take?", ar: "كم تستغرق عملية التنظيف العميق؟" }, answer: { en: "It depends on your home's size and condition — our team will give you a realistic estimate before booking.", ar: "يعتمد ذلك على حجم منزلك وحالته — سيقدم فريقنا تقديرًا واقعيًا قبل الحجز." } },
      { question: { en: "What's the difference between regular and deep cleaning?", ar: "ما الفرق بين التنظيف العادي والعميق؟" }, answer: { en: "Regular cleaning maintains day-to-day tidiness; deep cleaning targets buildup in areas daily cleaning doesn't reach, like behind appliances and inside grout.", ar: "التنظيف العادي يحافظ على النظافة اليومية؛ أما العميق فيستهدف التراكمات في مناطق لا يصلها التنظيف اليومي، مثل خلف الأجهزة وداخل فواصل البلاط." } },
      { question: { en: "Do I need to provide cleaning supplies?", ar: "هل يجب أن أوفر مواد التنظيف؟" }, answer: { en: "Our team brings the equipment and supplies needed — just let us know about any specific preferences beforehand.", ar: "فريقنا يحضر المعدات والمواد اللازمة — فقط أخبرنا بأي تفضيلات خاصة مسبقًا." } },
      { question: { en: "Can I book a deep clean before moving in?", ar: "هل يمكنني حجز تنظيف عميق قبل الانتقال؟" }, answer: { en: "Yes — move-in deep cleans are one of the most common reasons customers book this service.", ar: "نعم — تنظيف ما قبل الانتقال من أكثر الأسباب شيوعًا لحجز هذه الخدمة." } },
      { question: { en: "Do you clean behind and under appliances?", ar: "هل تنظفون خلف الأجهزة وتحتها؟" }, answer: { en: "Yes, that's a core part of what makes a deep clean different from a regular one.", ar: "نعم، هذا جزء أساسي مما يجعل التنظيف العميق مختلفًا عن العادي." } },
      { question: { en: "How much does deep cleaning cost?", ar: "كم تكلفة التنظيف العميق؟" }, answer: { en: "It depends on your home's size and condition — contact us for a free quote.", ar: "تعتمد على حجم منزلك وحالته — تواصل معنا للحصول على عرض سعر مجاني." } },
      { question: { en: "Do you serve my emirate?", ar: "هل تقدمون الخدمة في إمارتي؟" }, answer: { en: "We cover all 7 UAE emirates — Dubai, Abu Dhabi, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, and Fujairah.", ar: "نغطي جميع إمارات الدولة السبع — دبي، أبوظبي، الشارقة، عجمان، أم القيوين، رأس الخيمة، والفجيرة." } },
      { question: { en: "Is deep cleaning suitable for offices too?", ar: "هل يناسب التنظيف العميق المكاتب أيضًا؟" }, answer: { en: "Our deep cleaning focuses on homes — for commercial spaces, see our dedicated office cleaning service.", ar: "تنظيفنا العميق مخصص للمنازل — للمساحات التجارية، راجع خدمة تنظيف المكاتب المخصصة لدينا." } },
      { question: { en: "Can I book online without calling?", ar: "هل يمكنني الحجز أونلاين بدون اتصال؟" }, answer: { en: "Yes — use the booking form on this page, or message us on WhatsApp.", ar: "نعم — استخدم نموذج الحجز في هذه الصفحة، أو راسلنا عبر واتساب." } },
      { question: { en: "How far in advance should I book?", ar: "قبل كم يجب أن أحجز؟" }, answer: { en: "Reach out as early as you can, especially around move-in dates — our team will confirm the earliest available slot.", ar: "تواصل معنا في أقرب وقت ممكن، خاصة حول مواعيد الانتقال — سيؤكد فريقنا أقرب موعد متاح." } },
    ].map((faq, i) => ({ id: faqIds("deep-cleaning", 10)[i], ...faq })),
    finalCta: {
      title: { en: "Give Your Home a Genuine Reset", ar: "امنح منزلك إعادة ضبط حقيقية" },
      subtitle: { en: "Book online, call, or message us on WhatsApp — our team follows up to confirm your visit.", ar: "احجز أونلاين، أو اتصل، أو راسلنا عبر واتساب — يتابع فريقنا معك لتأكيد زيارتك." },
    },
  },
  {
    slug: "home-cleaning",
    serviceSlug: "general-cleaning",
    seo: {
      title: { en: "Home Cleaning Dubai & UAE | Trusted Cleaning Teams | AFAQ AL HAYAT", ar: "تنظيف منازل في دبي والإمارات | فرق تنظيف موثوقة | آفاق الحياة" },
      description: { en: "Reliable home cleaning across the UAE — one-time or recurring. Trained, uniformed teams. Free quote, book online or on WhatsApp.", ar: "تنظيف منازل موثوق في جميع أنحاء الإمارات — لمرة واحدة أو دوري. فرق مدربة بزي موحد. عرض سعر مجاني، احجز أونلاين أو عبر واتساب." },
      keywords: { en: ["home cleaning Dubai", "house cleaning UAE", "cleaning service near me", "recurring home cleaning"], ar: ["تنظيف منازل دبي", "تنظيف منزلي الإمارات", "خدمة تنظيف قريبة مني", "تنظيف منزلي دوري"] },
    },
    hero: {
      image: { src: "/brand/images/services/cleaning/home-cleaning-service-card-afaq-v1.webp", width: 1536, height: 1024 },
      alt: { en: "AFAQ AL HAYAT cleaning technician tidying a modern UAE living room", ar: "فني تنظيف من آفاق الحياة يرتب صالة معيشة عصرية بالإمارات" },
      eyebrow: { en: "Home Cleaning", ar: "تنظيف المنازل" },
      headline: { en: "A Clean Home, On Your Schedule", ar: "منزل نظيف، حسب جدولك" },
      subheadline: { en: "One-time or recurring cleaning from trained, uniformed teams — across all 7 emirates.", ar: "تنظيف لمرة واحدة أو دوري من فرق مدربة بزي موحد — في جميع الإمارات السبع." },
      trustBadges: [
        { en: "UAE-wide service", ar: "خدمة في جميع الإمارات" },
        { en: "Trained cleaning teams", ar: "فرق تنظيف مدربة" },
        { en: "Flexible scheduling", ar: "جدولة مرنة" },
        { en: "Quality-focused", ar: "التركيز على الجودة" },
      ],
    },
    problem: {
      title: { en: "Keeping a Home Clean Takes Time You May Not Have", ar: "الحفاظ على نظافة المنزل يحتاج وقتًا قد لا تملكه" },
      body: [
        { en: "Between work, family, and everything else, regular cleaning is often the first thing that slips — and once it does, catching back up feels like a bigger job than it should be.", ar: "بين العمل والعائلة وكل شيء آخر، التنظيف المعتاد غالبًا ما يكون أول شيء يتراجع — وبمجرد أن يحدث ذلك، تصبح مواكبته مهمة أكبر مما ينبغي." },
        { en: "A dependable cleaning routine — set once, handled consistently — removes that recurring decision from your week entirely.", ar: "روتين تنظيف موثوق — يُحدد مرة واحدة ويُنفذ باستمرار — يزيل هذا القرار المتكرر من أسبوعك تمامًا." },
      ],
    },
    whyUs: {
      title: { en: "Why UAE Homeowners Choose AFAQ AL HAYAT", ar: "لماذا يختار أصحاب المنازل في الإمارات آفاق الحياة" },
      points: [
        { en: "Trained, uniformed technicians who treat your home with care.", ar: "فنيون مدربون بزي موحد يتعاملون مع منزلك بعناية." },
        { en: "One-time or recurring — whichever fits your routine.", ar: "لمرة واحدة أو دوري — أيهما يناسب روتينك." },
        { en: "Fast response on WhatsApp or by phone.", ar: "استجابة سريعة عبر واتساب أو الهاتف." },
        { en: "Coverage across all 7 emirates.", ar: "تغطية في جميع الإمارات السبع." },
      ],
    },
    serviceDetails: {
      title: { en: "What Our Home Cleaning Service Covers", ar: "ما الذي تشمله خدمة تنظيف المنازل" },
      body: [{ en: "Dusting, floors, kitchen, and bathrooms every visit, with the option to add deep-clean tasks as needed.", ar: "الغبار والأرضيات والمطبخ والحمامات في كل زيارة، مع إمكانية إضافة مهام تنظيف عميق حسب الحاجة." }],
      included: [
        { en: "Dusting and surface cleaning throughout the home", ar: "إزالة الغبار وتنظيف الأسطح في جميع أنحاء المنزل" },
        { en: "Kitchen and bathroom cleaning", ar: "تنظيف المطبخ والحمامات" },
        { en: "Floor cleaning across all rooms", ar: "تنظيف الأرضيات في جميع الغرف" },
        { en: "Flexible one-time or recurring scheduling", ar: "جدولة مرنة لمرة واحدة أو بشكل دوري" },
      ],
    },
    process: {
      title: { en: "How It Works", ar: "كيف تسير الخدمة" },
      steps: [
        { title: { en: "1. Request", ar: "١. الطلب" }, description: { en: "Book online or message us with your home size and preferred schedule.", ar: "احجز أونلاين أو راسلنا بحجم منزلك والجدول المفضل." } },
        { title: { en: "2. Confirm", ar: "٢. التأكيد" }, description: { en: "Our team follows up to confirm timing and scope.", ar: "يتابع فريقنا معك لتأكيد التوقيت والنطاق." } },
        { title: { en: "3. Clean", ar: "٣. التنظيف" }, description: { en: "A trained team handles the visit, room by room.", ar: "فريق مدرب يتولى الزيارة، غرفة بغرفة." } },
        { title: { en: "4. Repeat or Done", ar: "٤. التكرار أو الانتهاء" }, description: { en: "Set it as recurring, or book again whenever you need it.", ar: "اجعلها دورية، أو احجز مجددًا كلما احتجت." } },
      ],
    },
    standardOfWork: {
      title: { en: "The Standard You Can Expect", ar: "المستوى الذي يمكنك توقعه" },
      description: { en: "Consistent, careful work — the same standard whether it's your first visit or your fiftieth.", ar: "عمل متسق ودقيق — بنفس المستوى سواء كانت زيارتك الأولى أو الخمسين." },
      image: { src: "/brand/images/services/cleaning/apartment-cleaning-service-card-afaq-v1.webp", alt: { en: "AFAQ AL HAYAT technician cleaning an apartment living space", ar: "فني آفاق الحياة يقوم بتنظيف مساحة معيشة في شقة" } },
    },
    pricing: {
      title: { en: "What Does It Cost?", ar: "كم التكلفة؟" },
      body: { en: "Pricing depends on your home's size and how often you'd like a visit — get a free, no-obligation quote after a quick chat with our team.", ar: "التكلفة تعتمد على حجم منزلك وعدد مرات الزيارة المطلوبة — احصل على عرض سعر مجاني وبدون التزام بعد محادثة سريعة مع فريقنا." },
    },
    faqs: [
      { question: { en: "Can I set up a recurring cleaning schedule?", ar: "هل يمكنني إعداد جدول تنظيف دوري؟" }, answer: { en: "Yes — weekly, bi-weekly, or monthly, whichever fits your routine.", ar: "نعم — أسبوعي، أو كل أسبوعين، أو شهري، أيهما يناسب روتينك." } },
      { question: { en: "Do I need to be home during the cleaning?", ar: "هل يجب أن أكون في المنزل أثناء التنظيف؟" }, answer: { en: "Not necessarily — many customers arrange access in advance. Discuss what works for you with our team.", ar: "ليس بالضرورة — يرتب العديد من العملاء الدخول مسبقًا. ناقش ما يناسبك مع فريقنا." } },
      { question: { en: "What's included in a standard visit?", ar: "ماذا تشمل الزيارة القياسية؟" }, answer: { en: "Dusting, floors, kitchen, and bathrooms — with deep-clean tasks available as an add-on.", ar: "الغبار والأرضيات والمطبخ والحمامات — مع إمكانية إضافة مهام تنظيف عميق." } },
      { question: { en: "Do you bring your own cleaning supplies?", ar: "هل تحضرون مواد التنظيف الخاصة بكم؟" }, answer: { en: "Yes, our team brings the equipment and supplies needed for the visit.", ar: "نعم، يحضر فريقنا المعدات والمواد اللازمة للزيارة." } },
      { question: { en: "Can I change or cancel a scheduled visit?", ar: "هل يمكنني تغيير أو إلغاء زيارة مجدولة؟" }, answer: { en: "Yes — reach out to our team as early as you can and they'll help adjust the schedule.", ar: "نعم — تواصل مع فريقنا في أقرب وقت ممكن وسيساعدونك على تعديل الجدول." } },
      { question: { en: "How much does home cleaning cost?", ar: "كم تكلفة تنظيف المنزل؟" }, answer: { en: "It depends on your home's size and visit frequency — contact us for a free quote.", ar: "تعتمد على حجم منزلك وتكرار الزيارات — تواصل معنا للحصول على عرض سعر مجاني." } },
      { question: { en: "Do you serve my emirate?", ar: "هل تقدمون الخدمة في إمارتي؟" }, answer: { en: "We cover all 7 UAE emirates — Dubai, Abu Dhabi, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, and Fujairah.", ar: "نغطي جميع إمارات الدولة السبع — دبي، أبوظبي، الشارقة، عجمان، أم القيوين، رأس الخيمة، والفجيرة." } },
      { question: { en: "What's the difference between this and deep cleaning?", ar: "ما الفرق بين هذه الخدمة والتنظيف العميق؟" }, answer: { en: "Home cleaning maintains day-to-day tidiness; deep cleaning is a thorough, one-time reset covering areas regular cleaning doesn't reach.", ar: "تنظيف المنازل يحافظ على النظافة اليومية؛ أما التنظيف العميق فهو إعادة ضبط شاملة لمرة واحدة تغطي مناطق لا يصلها التنظيف المعتاد." } },
      { question: { en: "Can I book online without calling?", ar: "هل يمكنني الحجز أونلاين بدون اتصال؟" }, answer: { en: "Yes — use the booking form on this page, or message us on WhatsApp.", ar: "نعم — استخدم نموذج الحجز في هذه الصفحة، أو راسلنا عبر واتساب." } },
      { question: { en: "Is AFAQ AL HAYAT available for emergencies?", ar: "هل آفاق الحياة متاحة للحالات الطارئة؟" }, answer: { en: "We're available 24/7 — reach out any time and our team will confirm the earliest available visit.", ar: "نحن متاحون على مدار الساعة — تواصل معنا في أي وقت وسيؤكد فريقنا أقرب موعد متاح." } },
    ].map((faq, i) => ({ id: faqIds("home-cleaning", 10)[i], ...faq })),
    finalCta: {
      title: { en: "A Clean Home Shouldn't Be a Chore", ar: "المنزل النظيف لا يجب أن يكون عبئًا" },
      subtitle: { en: "Book online, call, or message us on WhatsApp — our team follows up to confirm your visit.", ar: "احجز أونلاين، أو اتصل، أو راسلنا عبر واتساب — يتابع فريقنا معك لتأكيد زيارتك." },
    },
  },
  {
    slug: "ac-maintenance",
    serviceSlug: "ac-maintenance",
    seo: {
      title: { en: "AC Maintenance Dubai & UAE | Fast Technician Visit | AFAQ AL HAYAT", ar: "صيانة مكيفات في دبي والإمارات | زيارة فنية سريعة | آفاق الحياة" },
      description: { en: "AC maintenance and repair across the UAE — cleaning, gas check, common faults fixed. Trained technicians, free quote, book online or on WhatsApp.", ar: "صيانة وإصلاح مكيفات في جميع أنحاء الإمارات — تنظيف، فحص الغاز، إصلاح الأعطال الشائعة. فنيون مدربون، عرض سعر مجاني، احجز أونلاين أو عبر واتساب." },
      keywords: { en: ["AC maintenance Dubai", "AC repair UAE", "AC service near me", "AC not cooling"], ar: ["صيانة مكيفات دبي", "إصلاح تكييف الإمارات", "خدمة تكييف قريبة مني", "المكيف لا يبرد"] },
    },
    hero: {
      image: { src: "/brand/images/services/maintenance/ac-maintenance-service-card-afaq-v1.webp", width: 1314, height: 1197 },
      alt: { en: "AFAQ AL HAYAT technician servicing a wall-mounted AC unit in a UAE home", ar: "فني آفاق الحياة يقوم بصيانة وحدة تكييف مثبتة على الحائط في منزل بالإمارات" },
      eyebrow: { en: "AC Maintenance", ar: "صيانة المكيفات" },
      headline: { en: "AC Maintenance Before It Becomes an AC Emergency", ar: "صيانة المكيفات قبل أن تتحول إلى حالة طارئة" },
      subheadline: { en: "Cleaning, gas check, and fault diagnosis from trained technicians — across all 7 emirates.", ar: "تنظيف، فحص غاز، وتشخيص الأعطال من فنيين مدربين — في جميع الإمارات السبع." },
      trustBadges: [
        { en: "UAE-wide service", ar: "خدمة في جميع الإمارات" },
        { en: "Trained technicians", ar: "فنيون مدربون" },
        { en: "Available 24/7", ar: "متاحون على مدار الساعة" },
        { en: "Quality-focused", ar: "التركيز على الجودة" },
      ],
    },
    problem: {
      title: { en: "A Weak AC Rarely Fixes Itself", ar: "التكييف الضعيف نادرًا ما يصلح نفسه" },
      body: [
        { en: "Reduced cooling, odd noises, or a musty smell usually mean something specific — low gas, a blocked filter, or a failing part — not something that improves by waiting.", ar: "ضعف التبريد، أو الأصوات الغريبة، أو الرائحة العفنة تعني عادة شيئًا محددًا — نقص الغاز، فلتر مسدود، أو قطعة معطلة — وليس شيئًا يتحسن بالانتظار." },
        { en: "In UAE summers, AC runs almost constantly — which means small issues compound faster than in milder climates, and a full breakdown at the wrong time is far more disruptive.", ar: "في صيف الإمارات، يعمل التكييف شبه المستمر — ما يعني أن المشاكل الصغيرة تتفاقم أسرع من المناخات المعتدلة، والعطل الكامل في الوقت الخطأ أكثر إزعاجًا بكثير." },
      ],
    },
    whyUs: {
      title: { en: "Why UAE Homeowners Choose AFAQ AL HAYAT", ar: "لماذا يختار أصحاب المنازل في الإمارات آفاق الحياة" },
      points: [
        { en: "Real diagnosis before any part is touched.", ar: "تشخيص حقيقي قبل لمس أي قطعة." },
        { en: "Trained, uniformed technicians for every visit.", ar: "فنيون مدربون بزي موحد لكل زيارة." },
        { en: "Fast response — WhatsApp or call.", ar: "استجابة سريعة — واتساب أو اتصال." },
        { en: "Coverage across all 7 emirates.", ar: "تغطية في جميع الإمارات السبع." },
      ],
    },
    serviceDetails: {
      title: { en: "What Our AC Maintenance Service Covers", ar: "ما الذي تشمله خدمة صيانة المكيفات" },
      body: [{ en: "A proper inspection identifies the actual cause — filter, gas level, drainage, or a failing part — before any work starts.", ar: "الفحص المناسب يحدد السبب الفعلي — الفلتر، مستوى الغاز، الصرف، أو قطعة معطلة — قبل بدء أي عمل." }],
      included: [
        { en: "Filter and coil cleaning", ar: "تنظيف الفلتر والملف" },
        { en: "Refrigerant (gas) level check", ar: "فحص مستوى غاز التبريد" },
        { en: "Drainage and airflow check", ar: "فحص الصرف وتدفق الهواء" },
        { en: "Fault diagnosis and repair", ar: "تشخيص الأعطال وإصلاحها" },
      ],
    },
    process: {
      title: { en: "How It Works", ar: "كيف تسير الخدمة" },
      steps: [
        { title: { en: "1. Request", ar: "١. الطلب" }, description: { en: "Book online or message us with what you're noticing.", ar: "احجز أونلاين أو راسلنا بما تلاحظه." } },
        { title: { en: "2. Inspection", ar: "٢. المعاينة" }, description: { en: "A technician diagnoses the actual cause.", ar: "يقوم الفني بتشخيص السبب الفعلي." } },
        { title: { en: "3. Service", ar: "٣. الصيانة" }, description: { en: "Cleaning, gas top-up, or repair as needed.", ar: "تنظيف، إضافة غاز، أو إصلاح حسب الحاجة." } },
        { title: { en: "4. Test", ar: "٤. الاختبار" }, description: { en: "A cooling check before the technician leaves.", ar: "فحص التبريد قبل مغادرة الفني." } },
      ],
    },
    standardOfWork: {
      title: { en: "The Standard You Can Expect", ar: "المستوى الذي يمكنك توقعه" },
      description: { en: "A proper diagnosis first, then the actual fix — not a guess.", ar: "تشخيص مناسب أولًا، ثم الإصلاح الفعلي — وليس تخمينًا." },
      image: { src: "/brand/images/services/maintenance/duct-central-ac-maintenance-service-card-afaq-v1.webp", alt: { en: "AFAQ AL HAYAT technician inspecting a central AC system", ar: "فني آفاق الحياة يفحص نظام تكييف مركزي" } },
    },
    pricing: {
      title: { en: "What Does It Cost?", ar: "كم التكلفة؟" },
      body: { en: "Pricing depends on the fault and unit type — get a free, no-obligation quote after a quick chat with our team.", ar: "التكلفة تعتمد على نوع العطل والوحدة — احصل على عرض سعر مجاني وبدون التزام بعد محادثة سريعة مع فريقنا." },
    },
    faqs: [
      { question: { en: "How often should AC be serviced?", ar: "كم مرة يجب صيانة التكييف؟" }, answer: { en: "It depends on the unit and usage — a technician can suggest a schedule based on a real inspection rather than a fixed rule.", ar: "يعتمد ذلك على الوحدة والاستخدام — يمكن للفني اقتراح جدول بناءً على فحص حقيقي بدلًا من قاعدة ثابتة." } },
      { question: { en: "Why is my AC not cooling properly?", ar: "لماذا لا يبرد المكيف بشكل جيد؟" }, answer: { en: "Common causes include low refrigerant, a blocked filter, or a drainage issue — a technician can identify the exact cause during inspection.", ar: "الأسباب الشائعة تشمل نقص غاز التبريد، أو فلتر مسدود، أو مشكلة في الصرف — يمكن للفني تحديد السبب الدقيق أثناء المعاينة." } },
      { question: { en: "How fast can you send a technician?", ar: "كم تحتاجون من الوقت لإرسال فني؟" }, answer: { en: "Message us on WhatsApp or call, and our team follows up right away to confirm the nearest available slot.", ar: "راسلنا عبر واتساب أو اتصل، وسيتابع فريقنا معك فورًا لتأكيد أقرب موعد متاح." } },
      { question: { en: "Do you service central AC as well as split units?", ar: "هل تصونون التكييف المركزي بالإضافة للوحدات المنفصلة؟" }, answer: { en: "Yes, our technicians service both central and split AC systems.", ar: "نعم، يقوم فنيونا بصيانة أنظمة التكييف المركزية والمنفصلة." } },
      { question: { en: "What if the problem isn't fixed after the visit?", ar: "ماذا لو لم يُحل المشكلة بعد الزيارة؟" }, answer: { en: "Reach out again and our team will follow up to make it right.", ar: "تواصل معنا مجددًا وسيتابع فريقنا لحل الأمر." } },
      { question: { en: "How much does AC maintenance cost?", ar: "كم تكلفة صيانة المكيفات؟" }, answer: { en: "It depends on the fault and unit type — contact us for a free quote.", ar: "تعتمد على نوع العطل والوحدة — تواصل معنا للحصول على عرض سعر مجاني." } },
      { question: { en: "Do you serve my emirate?", ar: "هل تقدمون الخدمة في إمارتي؟" }, answer: { en: "We cover all 7 UAE emirates — Dubai, Abu Dhabi, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, and Fujairah.", ar: "نغطي جميع إمارات الدولة السبع — دبي، أبوظبي، الشارقة، عجمان، أم القيوين، رأس الخيمة، والفجيرة." } },
      { question: { en: "Can I book a routine seasonal check?", ar: "هل يمكنني حجز فحص موسمي دوري؟" }, answer: { en: "Yes — many customers book a check before summer to avoid mid-season breakdowns.", ar: "نعم — يحجز العديد من العملاء فحصًا قبل الصيف لتجنب الأعطال في منتصف الموسم." } },
      { question: { en: "Can I book online without calling?", ar: "هل يمكنني الحجز أونلاين بدون اتصال؟" }, answer: { en: "Yes — use the booking form on this page, or message us on WhatsApp.", ar: "نعم — استخدم نموذج الحجز في هذه الصفحة، أو راسلنا عبر واتساب." } },
      { question: { en: "Is AFAQ AL HAYAT available for emergencies?", ar: "هل آفاق الحياة متاحة للحالات الطارئة؟" }, answer: { en: "We're available 24/7 — reach out any time and our team will confirm the earliest available visit.", ar: "نحن متاحون على مدار الساعة — تواصل معنا في أي وقت وسيؤكد فريقنا أقرب موعد متاح." } },
    ].map((faq, i) => ({ id: faqIds("ac-maintenance", 10)[i], ...faq })),
    finalCta: {
      title: { en: "Don't Wait for a Full Breakdown", ar: "لا تنتظر عطلًا كاملاً" },
      subtitle: { en: "Book online, call, or message us on WhatsApp — our team follows up to confirm your visit.", ar: "احجز أونلاين، أو اتصل، أو راسلنا عبر واتساب — يتابع فريقنا معك لتأكيد زيارتك." },
    },
  },
  {
    slug: "home-maintenance",
    serviceSlug: "handyman",
    seo: {
      title: { en: "Home Maintenance Dubai & UAE | AC, Plumbing, Electrical | AFAQ AL HAYAT", ar: "صيانة منزلية في دبي والإمارات | تكييف وسباكة وكهرباء | آفاق الحياة" },
      description: { en: "One team for all your home maintenance — AC, plumbing, electrical, and handyman work across the UAE. Free quote, book online or on WhatsApp.", ar: "فريق واحد لكل صيانتك المنزلية — تكييف وسباكة وكهرباء وأعمال هاندي مان في جميع أنحاء الإمارات. عرض سعر مجاني، احجز أونلاين أو عبر واتساب." },
      keywords: { en: ["home maintenance Dubai", "home maintenance UAE", "handyman service near me", "villa maintenance"], ar: ["صيانة منزلية دبي", "صيانة منزلية الإمارات", "خدمة هاندي مان قريبة مني", "صيانة فلل"] },
    },
    hero: {
      image: { src: HOMEPAGE_HERO_SRC, ...HOMEPAGE_HERO_DIMENSIONS },
      alt: { en: "AFAQ AL HAYAT maintenance technician at a luxury UAE villa with the Dubai skyline in the background", ar: "فني صيانة من آفاق الحياة عند فيلا فاخرة في الإمارات وفي الخلفية أفق دبي" },
      eyebrow: { en: "Home Maintenance", ar: "الصيانة المنزلية" },
      headline: { en: "One Team for Everything Your Home Needs", ar: "فريق واحد لكل ما يحتاجه منزلك" },
      subheadline: { en: "AC, plumbing, electrical, and general handyman work — one call instead of juggling separate contractors.", ar: "تكييف وسباكة وكهرباء وأعمال هاندي مان عامة — اتصال واحد بدل التعامل مع مقاولين منفصلين." },
      trustBadges: [
        { en: "UAE-wide service", ar: "خدمة في جميع الإمارات" },
        { en: "Trained technicians", ar: "فنيون مدربون" },
        { en: "Available 24/7", ar: "متاحون على مدار الساعة" },
        { en: "One team, every trade", ar: "فريق واحد لكل التخصصات" },
      ],
    },
    problem: {
      title: { en: "Different Problems, Different Contractors, Constant Coordination", ar: "مشاكل مختلفة، مقاولون مختلفون، تنسيق مستمر" },
      body: [
        { en: "A dripping tap, a flickering light, and a squeaky door usually mean three separate calls, three separate schedules, and three separate people to trust with your home.", ar: "صنبور يقطر، إضاءة تومض، وباب يصدر صريرًا تعني عادة ثلاث مكالمات منفصلة، وثلاثة جداول منفصلة، وثلاثة أشخاص منفصلين يجب الوثوق بهم داخل منزلك." },
        { en: "A single reliable maintenance partner removes that coordination overhead entirely — one number, one team, accountable for the whole home.", ar: "شريك صيانة موثوق واحد يزيل عبء التنسيق هذا تمامًا — رقم واحد، فريق واحد، مسؤول عن المنزل بالكامل." },
      ],
    },
    whyUs: {
      title: { en: "Why UAE Homeowners Choose AFAQ AL HAYAT", ar: "لماذا يختار أصحاب المنازل في الإمارات آفاق الحياة" },
      points: [
        { en: "AC, plumbing, electrical, painting, and handyman — under one roof.", ar: "تكييف وسباكة وكهرباء ودهان وهاندي مان — تحت سقف واحد." },
        { en: "Trained, uniformed technicians for every visit.", ar: "فنيون مدربون بزي موحد لكل زيارة." },
        { en: "Fast response — WhatsApp or call.", ar: "استجابة سريعة — واتساب أو اتصال." },
        { en: "Coverage across all 7 emirates.", ar: "تغطية في جميع الإمارات السبع." },
      ],
    },
    serviceDetails: {
      title: { en: "What Our Home Maintenance Service Covers", ar: "ما الذي تشمله خدمة الصيانة المنزلية" },
      body: [{ en: "From a single repair to a full maintenance plan, our team handles the core trades every home eventually needs.", ar: "من إصلاح واحد إلى خطة صيانة كاملة، يتولى فريقنا التخصصات الأساسية التي يحتاجها كل منزل عاجلاً أم آجلاً." }],
      included: [
        { en: "AC servicing and repair", ar: "صيانة وإصلاح التكييف" },
        { en: "Plumbing repairs and installation", ar: "إصلاح وتركيب السباكة" },
        { en: "Electrical fixes and installation", ar: "إصلاح وتركيب الكهرباء" },
        { en: "General handyman and small repairs", ar: "أعمال هاندي مان عامة وإصلاحات صغيرة" },
      ],
    },
    process: {
      title: { en: "How It Works", ar: "كيف تسير الخدمة" },
      steps: [
        { title: { en: "1. Request", ar: "١. الطلب" }, description: { en: "Book online or message us with what needs attention.", ar: "احجز أونلاين أو راسلنا بما يحتاج للمعالجة." } },
        { title: { en: "2. Confirm", ar: "٢. التأكيد" }, description: { en: "Our team follows up to confirm the visit and scope.", ar: "يتابع فريقنا معك لتأكيد الزيارة والنطاق." } },
        { title: { en: "3. Fix", ar: "٣. الإصلاح" }, description: { en: "The right technician handles the job properly.", ar: "الفني المناسب يتولى المهمة بشكل صحيح." } },
        { title: { en: "4. Follow-up", ar: "٤. المتابعة" }, description: { en: "Reach out again any time something new comes up.", ar: "تواصل معنا مجددًا كلما ظهر أمر جديد." } },
      ],
    },
    standardOfWork: {
      title: { en: "The Standard You Can Expect", ar: "المستوى الذي يمكنك توقعه" },
      description: { en: "The right specialist for each job, coordinated by one team.", ar: "المتخصص المناسب لكل مهمة، ينسقه فريق واحد." },
      image: { src: "/brand/images/services/maintenance/service-handyman-maintenance.webp", alt: { en: "AFAQ AL HAYAT handyman technician completing a home repair", ar: "فني هاندي مان من آفاق الحياة يقوم بإتمام إصلاح منزلي" } },
    },
    pricing: {
      title: { en: "What Does It Cost?", ar: "كم التكلفة؟" },
      body: { en: "Pricing depends on the job — get a free, no-obligation quote after a quick chat with our team.", ar: "التكلفة تعتمد على طبيعة المهمة — احصل على عرض سعر مجاني وبدون التزام بعد محادثة سريعة مع فريقنا." },
    },
    faqs: [
      { question: { en: "What trades do you cover?", ar: "ما التخصصات التي تغطونها؟" }, answer: { en: "AC maintenance, plumbing, electrical, painting, and general handyman work.", ar: "صيانة التكييف والسباكة والكهرباء والدهان وأعمال الهاندي مان العامة." } },
      { question: { en: "Can I book multiple jobs in one visit?", ar: "هل يمكنني حجز عدة مهام في زيارة واحدة؟" }, answer: { en: "Yes — let our team know everything you need and they'll coordinate accordingly.", ar: "نعم — أخبر فريقنا بكل ما تحتاجه وسينسقون وفقًا لذلك." } },
      { question: { en: "How fast can you send a technician?", ar: "كم تحتاجون من الوقت لإرسال فني؟" }, answer: { en: "Message us on WhatsApp or call, and our team follows up right away to confirm the nearest available slot.", ar: "راسلنا عبر واتساب أو اتصل، وسيتابع فريقنا معك فورًا لتأكيد أقرب موعد متاح." } },
      { question: { en: "Do you offer recurring maintenance plans?", ar: "هل تقدمون خطط صيانة دورية؟" }, answer: { en: "Speak with our team about a routine plan that covers the main areas of your home on a regular basis.", ar: "تحدث مع فريقنا عن خطة دورية تغطي المجالات الرئيسية لمنزلك بشكل منتظم." } },
      { question: { en: "Is this suitable for villas as well as apartments?", ar: "هل تناسب هذه الخدمة الفلل بالإضافة للشقق؟" }, answer: { en: "Yes, we service both villas and apartments across the UAE.", ar: "نعم، نقدم الخدمة للفلل والشقق في جميع أنحاء الإمارات." } },
      { question: { en: "How much does home maintenance cost?", ar: "كم تكلفة الصيانة المنزلية؟" }, answer: { en: "It depends on the specific job — contact us for a free quote.", ar: "تعتمد على طبيعة المهمة تحديدًا — تواصل معنا للحصول على عرض سعر مجاني." } },
      { question: { en: "Do you serve my emirate?", ar: "هل تقدمون الخدمة في إمارتي؟" }, answer: { en: "We cover all 7 UAE emirates — Dubai, Abu Dhabi, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, and Fujairah.", ar: "نغطي جميع إمارات الدولة السبع — دبي، أبوظبي، الشارقة، عجمان، أم القيوين، رأس الخيمة، والفجيرة." } },
      { question: { en: "What if the issue turns out to be bigger than expected?", ar: "ماذا لو تبين أن المشكلة أكبر من المتوقع؟" }, answer: { en: "The technician will explain what they found and confirm next steps with you before proceeding.", ar: "سيشرح الفني ما اكتشفه ويؤكد الخطوات التالية معك قبل المتابعة." } },
      { question: { en: "Can I book online without calling?", ar: "هل يمكنني الحجز أونلاين بدون اتصال؟" }, answer: { en: "Yes — use the booking form on this page, or message us on WhatsApp.", ar: "نعم — استخدم نموذج الحجز في هذه الصفحة، أو راسلنا عبر واتساب." } },
      { question: { en: "Is AFAQ AL HAYAT available for emergencies?", ar: "هل آفاق الحياة متاحة للحالات الطارئة؟" }, answer: { en: "We're available 24/7 — reach out any time and our team will confirm the earliest available visit.", ar: "نحن متاحون على مدار الساعة — تواصل معنا في أي وقت وسيؤكد فريقنا أقرب موعد متاح." } },
    ].map((faq, i) => ({ id: faqIds("home-maintenance", 10)[i], ...faq })),
    finalCta: {
      title: { en: "One Team, Every Trade Your Home Needs", ar: "فريق واحد، لكل تخصص يحتاجه منزلك" },
      subtitle: { en: "Book online, call, or message us on WhatsApp — our team follows up to confirm your visit.", ar: "احجز أونلاين، أو اتصل، أو راسلنا عبر واتساب — يتابع فريقنا معك لتأكيد زيارتك." },
    },
  },
  {
    slug: "plumbing",
    serviceSlug: "plumbing",
    seo: {
      title: { en: "Plumbing Services Dubai & UAE | Fast Repairs | AFAQ AL HAYAT", ar: "خدمات سباكة في دبي والإمارات | إصلاحات سريعة | آفاق الحياة" },
      description: { en: "Plumbing repair and installation across the UAE — leaks, low pressure, blocked drains, fixture installation. Free quote, book online or on WhatsApp.", ar: "إصلاح وتركيب سباكة في جميع أنحاء الإمارات — تسريبات، ضعف ضغط، انسداد مصارف، تركيب تجهيزات. عرض سعر مجاني، احجز أونلاين أو عبر واتساب." },
      keywords: { en: ["plumbing services Dubai", "plumber UAE", "leaking pipe repair", "low water pressure fix"], ar: ["خدمات سباكة دبي", "سباك الإمارات", "إصلاح تسريب المواسير", "حل ضعف ضغط المياه"] },
    },
    hero: {
      image: { src: "/brand/images/services/maintenance/plumbing-maintenance-service-card-afaq-v1.webp", width: 1196, height: 1315 },
      alt: { en: "AFAQ AL HAYAT plumber repairing a kitchen faucet in a UAE home", ar: "سباك من آفاق الحياة يصلح صنبور مياه في المطبخ بمنزل بالإمارات" },
      eyebrow: { en: "Plumbing", ar: "السباكة" },
      headline: { en: "Plumbing Fixed Right, Not Just Fixed Fast", ar: "سباكة تُصلح بشكل صحيح، لا بشكل سريع فقط" },
      subheadline: { en: "Leaks, low pressure, blocked drains, or new fixtures — trained plumbers across all 7 emirates.", ar: "تسريبات، ضعف ضغط، انسداد مصارف، أو تجهيزات جديدة — سباكون مدربون في جميع الإمارات السبع." },
      trustBadges: [
        { en: "UAE-wide service", ar: "خدمة في جميع الإمارات" },
        { en: "Trained plumbers", ar: "سباكون مدربون" },
        { en: "Available 24/7", ar: "متاحون على مدار الساعة" },
        { en: "Quality-focused", ar: "التركيز على الجودة" },
      ],
    },
    problem: {
      title: { en: "A Small Leak Rarely Stays Small", ar: "التسريب الصغير نادرًا ما يبقى صغيرًا" },
      body: [
        { en: "A slow drip under the sink or a slightly low-pressure shower might not seem urgent — until the water damage or the pipe failure it was warning about finally happens.", ar: "تسريب بطيء تحت الحوض أو ضعف طفيف في ضغط الدش قد لا يبدو عاجلاً — حتى يحدث ضرر المياه أو عطل الأنبوب الذي كان يحذر منه." },
        { en: "Plumbing problems rarely improve with time, and the cost of fixing them almost always grows the longer they're left unaddressed.", ar: "مشاكل السباكة نادرًا ما تتحسن مع الوقت، وتكلفة إصلاحها تزداد دائمًا تقريبًا كلما تُركت دون معالجة." },
      ],
    },
    whyUs: {
      title: { en: "Why UAE Homeowners Choose AFAQ AL HAYAT", ar: "لماذا يختار أصحاب المنازل في الإمارات آفاق الحياة" },
      points: [
        { en: "Real diagnosis before any repair starts.", ar: "تشخيص حقيقي قبل بدء أي إصلاح." },
        { en: "Trained plumbers for leaks, pressure, and installation.", ar: "سباكون مدربون للتسريبات والضغط والتركيب." },
        { en: "Fast response — WhatsApp or call.", ar: "استجابة سريعة — واتساب أو اتصال." },
        { en: "Coverage across all 7 emirates.", ar: "تغطية في جميع الإمارات السبع." },
      ],
    },
    serviceDetails: {
      title: { en: "What Our Plumbing Service Covers", ar: "ما الذي تشمله خدمة السباكة" },
      body: [{ en: "From a single dripping tap to a full fixture installation, our plumbers handle the range of jobs every home eventually needs.", ar: "من صنبور واحد يقطر إلى تركيب تجهيزات كاملة، يتولى سباكونا نطاق المهام التي يحتاجها كل منزل عاجلاً أم آجلاً." }],
      included: [
        { en: "Leak detection and repair", ar: "كشف وإصلاح التسريبات" },
        { en: "Low water pressure diagnosis", ar: "تشخيص ضعف ضغط المياه" },
        { en: "Blocked drain clearing", ar: "تسليك المصارف المسدودة" },
        { en: "Fixture repair and installation", ar: "إصلاح وتركيب التجهيزات" },
      ],
    },
    process: {
      title: { en: "How It Works", ar: "كيف تسير الخدمة" },
      steps: [
        { title: { en: "1. Request", ar: "١. الطلب" }, description: { en: "Book online or message us with what's happening.", ar: "احجز أونلاين أو راسلنا بما يحدث." } },
        { title: { en: "2. Diagnosis", ar: "٢. التشخيص" }, description: { en: "A plumber identifies the actual cause.", ar: "يحدد السباك السبب الفعلي." } },
        { title: { en: "3. Repair", ar: "٣. الإصلاح" }, description: { en: "The fix is carried out properly, not patched over.", ar: "يتم تنفيذ الإصلاح بشكل صحيح، وليس ترقيعًا مؤقتًا." } },
        { title: { en: "4. Test", ar: "٤. الاختبار" }, description: { en: "A final check before the plumber leaves.", ar: "فحص أخير قبل مغادرة السباك." } },
      ],
    },
    standardOfWork: {
      title: { en: "The Standard You Can Expect", ar: "المستوى الذي يمكنك توقعه" },
      description: { en: "A proper fix at the source — not a temporary patch.", ar: "إصلاح مناسب عند المصدر — وليس ترقيعًا مؤقتًا." },
      image: { src: "/brand/images/services/maintenance/plumbing-repair-service-card-afaq-v1.webp", alt: { en: "AFAQ AL HAYAT plumber completing a pipe repair", ar: "سباك من آفاق الحياة يقوم بإتمام إصلاح أنبوب" } },
    },
    pricing: {
      title: { en: "What Does It Cost?", ar: "كم التكلفة؟" },
      body: { en: "Pricing depends on the issue — get a free, no-obligation quote after a quick chat with our team.", ar: "التكلفة تعتمد على طبيعة المشكلة — احصل على عرض سعر مجاني وبدون التزام بعد محادثة سريعة مع فريقنا." },
    },
    faqs: [
      { question: { en: "How fast can you send a plumber?", ar: "كم تحتاجون من الوقت لإرسال سباك؟" }, answer: { en: "Message us on WhatsApp or call, and our team follows up right away to confirm the nearest available slot.", ar: "راسلنا عبر واتساب أو اتصل، وسيتابع فريقنا معك فورًا لتأكيد أقرب موعد متاح." } },
      { question: { en: "Can you fix low water pressure?", ar: "هل يمكنكم حل مشكلة ضعف ضغط المياه؟" }, answer: { en: "Yes — a plumber will diagnose the actual cause, from a blockage to a pressure regulator issue.", ar: "نعم — سيشخص السباك السبب الفعلي، من انسداد إلى مشكلة في منظم الضغط." } },
      { question: { en: "Do you handle blocked drains too?", ar: "هل تتعاملون مع المصارف المسدودة أيضًا؟" }, answer: { en: "Yes, blocked drain clearing is part of our standard plumbing service.", ar: "نعم، تسليك المصارف المسدودة جزء من خدمة السباكة القياسية لدينا." } },
      { question: { en: "What if the leak is inside a wall?", ar: "ماذا لو كان التسريب داخل الجدار؟" }, answer: { en: "Our team can advise on non-invasive leak detection before any wall work is considered.", ar: "يمكن لفريقنا تقديم استشارة حول كشف التسرب غير التدخلي قبل النظر في أي عمل بالجدار." } },
      { question: { en: "Can you install new fixtures, not just repair?", ar: "هل يمكنكم تركيب تجهيزات جديدة، وليس فقط الإصلاح؟" }, answer: { en: "Yes, we handle fixture installation as well as repairs.", ar: "نعم، نتولى تركيب التجهيزات بالإضافة للإصلاحات." } },
      { question: { en: "How much does plumbing repair cost?", ar: "كم تكلفة إصلاح السباكة؟" }, answer: { en: "It depends on the issue — contact us for a free quote.", ar: "تعتمد على طبيعة المشكلة — تواصل معنا للحصول على عرض سعر مجاني." } },
      { question: { en: "Do you serve my emirate?", ar: "هل تقدمون الخدمة في إمارتي؟" }, answer: { en: "We cover all 7 UAE emirates — Dubai, Abu Dhabi, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, and Fujairah.", ar: "نغطي جميع إمارات الدولة السبع — دبي، أبوظبي، الشارقة، عجمان، أم القيوين، رأس الخيمة، والفجيرة." } },
      { question: { en: "Is this safe for older buildings?", ar: "هل هذا آمن للمباني القديمة؟" }, answer: { en: "Our plumbers assess the specific plumbing setup before recommending any work.", ar: "يقيّم سباكونا تركيب السباكة تحديدًا قبل التوصية بأي عمل." } },
      { question: { en: "Can I book online without calling?", ar: "هل يمكنني الحجز أونلاين بدون اتصال؟" }, answer: { en: "Yes — use the booking form on this page, or message us on WhatsApp.", ar: "نعم — استخدم نموذج الحجز في هذه الصفحة، أو راسلنا عبر واتساب." } },
      { question: { en: "Is AFAQ AL HAYAT available for emergencies?", ar: "هل آفاق الحياة متاحة للحالات الطارئة؟" }, answer: { en: "We're available 24/7 — reach out any time and our team will confirm the earliest available visit.", ar: "نحن متاحون على مدار الساعة — تواصل معنا في أي وقت وسيؤكد فريقنا أقرب موعد متاح." } },
    ].map((faq, i) => ({ id: faqIds("plumbing", 10)[i], ...faq })),
    finalCta: {
      title: { en: "Get It Fixed Properly, the First Time", ar: "أصلحها بشكل صحيح، من أول مرة" },
      subtitle: { en: "Book online, call, or message us on WhatsApp — our team follows up to confirm your visit.", ar: "احجز أونلاين، أو اتصل، أو راسلنا عبر واتساب — يتابع فريقنا معك لتأكيد زيارتك." },
    },
  },
  {
    slug: "electrical",
    serviceSlug: "electrical-maintenance",
    seo: {
      title: { en: "Electrical Services Dubai & UAE | Safe, Fast Repairs | AFAQ AL HAYAT", ar: "خدمات كهرباء في دبي والإمارات | إصلاحات آمنة وسريعة | آفاق الحياة" },
      description: { en: "Electrical repair and installation across the UAE — outlets, breakers, lighting, frequent trips diagnosed safely. Free quote, book online or on WhatsApp.", ar: "إصلاح وتركيب كهرباء في جميع أنحاء الإمارات — مقابس، قواطع، إضاءة، تشخيص آمن للانقطاع المتكرر. عرض سعر مجاني، احجز أونلاين أو عبر واتساب." },
      keywords: { en: ["electrical services Dubai", "electrician UAE", "power trip fix", "flickering lights repair"], ar: ["خدمات كهرباء دبي", "كهربائي الإمارات", "حل انقطاع الكهرباء", "إصلاح وميض الإضاءة"] },
    },
    hero: {
      image: { src: "/brand/images/services/maintenance/electrical-maintenance-service-card-afaq-v1.webp", width: 1195, height: 1316 },
      alt: { en: "AFAQ AL HAYAT electrician inspecting a distribution board with proper safety gear", ar: "كهربائي من آفاق الحياة يفحص لوحة توزيع كهربائية بمعدات السلامة المناسبة" },
      eyebrow: { en: "Electrical Services", ar: "الخدمات الكهربائية" },
      headline: { en: "Electrical Work Is Never a DIY Job — Call a Real Technician", ar: "الأعمال الكهربائية ليست مهمة منزلية — استعن بفني حقيقي" },
      subheadline: { en: "Frequent trips, flickering lights, outlet issues — safely diagnosed and fixed across all 7 emirates.", ar: "انقطاع متكرر، وميض إضاءة، مشاكل مقابس — تشخيص وإصلاح آمن في جميع الإمارات السبع." },
      trustBadges: [
        { en: "UAE-wide service", ar: "خدمة في جميع الإمارات" },
        { en: "Trained electricians", ar: "كهربائيون مدربون" },
        { en: "Available 24/7", ar: "متاحون على مدار الساعة" },
        { en: "Safety-first work", ar: "العمل بأولوية السلامة" },
      ],
    },
    problem: {
      title: { en: "Electrical Issues Are a Safety Matter, Not Just an Inconvenience", ar: "الأعطال الكهربائية مسألة سلامة، لا مجرد إزعاج" },
      body: [
        { en: "A breaker that trips repeatedly, an outlet that feels warm, or lights that flicker for no clear reason are warning signs — not quirks to live with.", ar: "قاطع يفصل بشكل متكرر، أو مقبس يبدو دافئًا، أو إضاءة تومض دون سبب واضح، كلها علامات تحذيرية — وليست أمورًا يجب التعايش معها." },
        { en: "Electrical work carries real risk when handled without training — this is exactly the kind of job worth a licensed technician, every time.", ar: "الأعمال الكهربائية تحمل خطرًا حقيقيًا عند التعامل معها دون تدريب — وهذا بالضبط نوع العمل الذي يستحق فنيًا مرخصًا، في كل مرة." },
      ],
    },
    whyUs: {
      title: { en: "Why UAE Homeowners Choose AFAQ AL HAYAT", ar: "لماذا يختار أصحاب المنازل في الإمارات آفاق الحياة" },
      points: [
        { en: "Safety-first diagnosis before any repair.", ar: "تشخيص بأولوية السلامة قبل أي إصلاح." },
        { en: "Trained electricians, properly equipped.", ar: "كهربائيون مدربون ومجهزون بشكل مناسب." },
        { en: "Fast response — WhatsApp or call.", ar: "استجابة سريعة — واتساب أو اتصال." },
        { en: "Coverage across all 7 emirates.", ar: "تغطية في جميع الإمارات السبع." },
      ],
    },
    serviceDetails: {
      title: { en: "What Our Electrical Service Covers", ar: "ما الذي تشمله خدمة الكهرباء" },
      body: [{ en: "From a single faulty outlet to diagnosing repeated breaker trips, our electricians handle it safely and properly.", ar: "من مقبس واحد معطل إلى تشخيص انقطاع القاطع المتكرر، يتولى كهربائيونا الأمر بأمان وبشكل صحيح." }],
      included: [
        { en: "Circuit breaker and distribution board checks", ar: "فحص قواطع الدائرة ولوحة التوزيع" },
        { en: "Outlet and switch repair or replacement", ar: "إصلاح أو استبدال المقابس والمفاتيح" },
        { en: "Lighting installation and repair", ar: "تركيب وإصلاح الإضاءة" },
        { en: "Diagnosis of frequent trips or flickering", ar: "تشخيص الانقطاع المتكرر أو الوميض" },
      ],
    },
    process: {
      title: { en: "How It Works", ar: "كيف تسير الخدمة" },
      steps: [
        { title: { en: "1. Request", ar: "١. الطلب" }, description: { en: "Book online or message us with what's happening.", ar: "احجز أونلاين أو راسلنا بما يحدث." } },
        { title: { en: "2. Diagnosis", ar: "٢. التشخيص" }, description: { en: "An electrician identifies the actual cause safely.", ar: "يحدد الكهربائي السبب الفعلي بأمان." } },
        { title: { en: "3. Repair", ar: "٣. الإصلاح" }, description: { en: "The fix is carried out to a proper safety standard.", ar: "يتم تنفيذ الإصلاح وفق معيار سلامة مناسب." } },
        { title: { en: "4. Test", ar: "٤. الاختبار" }, description: { en: "A final safety check before the electrician leaves.", ar: "فحص سلامة أخير قبل مغادرة الكهربائي." } },
      ],
    },
    standardOfWork: {
      title: { en: "The Standard You Can Expect", ar: "المستوى الذي يمكنك توقعه" },
      description: { en: "Proper safety gear, proper diagnosis, every visit.", ar: "معدات سلامة مناسبة، وتشخيص مناسب، في كل زيارة." },
      image: { src: "/brand/images/services/maintenance/electrical-repair-maintenance-service-card-afaq-v1.webp", alt: { en: "AFAQ AL HAYAT electrician completing an electrical repair safely", ar: "كهربائي من آفاق الحياة يقوم بإتمام إصلاح كهربائي بأمان" } },
    },
    pricing: {
      title: { en: "What Does It Cost?", ar: "كم التكلفة؟" },
      body: { en: "Pricing depends on the issue — get a free, no-obligation quote after a quick chat with our team.", ar: "التكلفة تعتمد على طبيعة المشكلة — احصل على عرض سعر مجاني وبدون التزام بعد محادثة سريعة مع فريقنا." },
    },
    faqs: [
      { question: { en: "How fast can you send an electrician?", ar: "كم تحتاجون من الوقت لإرسال كهربائي؟" }, answer: { en: "Message us on WhatsApp or call, and our team follows up right away to confirm the nearest available slot.", ar: "راسلنا عبر واتساب أو اتصل، وسيتابع فريقنا معك فورًا لتأكيد أقرب موعد متاح." } },
      { question: { en: "Is it safe to ignore a breaker that keeps tripping?", ar: "هل من الآمن تجاهل قاطع يستمر بالفصل؟" }, answer: { en: "No — repeated trips usually point to a real underlying issue and are worth a proper inspection.", ar: "لا — الفصل المتكرر يشير عادة لمشكلة حقيقية كامنة ويستحق فحصًا مناسبًا." } },
      { question: { en: "Can you install new lighting fixtures?", ar: "هل يمكنكم تركيب تجهيزات إضاءة جديدة؟" }, answer: { en: "Yes, lighting installation is part of our standard electrical service.", ar: "نعم، تركيب الإضاءة جزء من خدمة الكهرباء القياسية لدينا." } },
      { question: { en: "Why do my lights flicker sometimes?", ar: "لماذا تومض إضاءتي أحيانًا؟" }, answer: { en: "This can have several causes, from a loose connection to a load issue — a technician can identify the exact cause.", ar: "قد يكون لهذا عدة أسباب، من اتصال غير محكم إلى مشكلة في الحمل — يمكن للفني تحديد السبب الدقيق." } },
      { question: { en: "Do you handle full distribution board checks?", ar: "هل تقومون بفحص كامل للوحة التوزيع؟" }, answer: { en: "Yes, distribution board and circuit breaker checks are part of our service.", ar: "نعم، فحص لوحة التوزيع وقواطع الدائرة جزء من خدمتنا." } },
      { question: { en: "How much does electrical repair cost?", ar: "كم تكلفة الإصلاح الكهربائي؟" }, answer: { en: "It depends on the issue — contact us for a free quote.", ar: "تعتمد على طبيعة المشكلة — تواصل معنا للحصول على عرض سعر مجاني." } },
      { question: { en: "Do you serve my emirate?", ar: "هل تقدمون الخدمة في إمارتي؟" }, answer: { en: "We cover all 7 UAE emirates — Dubai, Abu Dhabi, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, and Fujairah.", ar: "نغطي جميع إمارات الدولة السبع — دبي، أبوظبي، الشارقة، عجمان، أم القيوين، رأس الخيمة، والفجيرة." } },
      { question: { en: "Should I try to fix electrical issues myself?", ar: "هل يجب أن أحاول إصلاح المشاكل الكهربائية بنفسي؟" }, answer: { en: "No — electrical work carries real risk and should always be handled by a trained technician.", ar: "لا — الأعمال الكهربائية تحمل خطرًا حقيقيًا ويجب أن يتولاها دائمًا فني مدرب." } },
      { question: { en: "Can I book online without calling?", ar: "هل يمكنني الحجز أونلاين بدون اتصال؟" }, answer: { en: "Yes — use the booking form on this page, or message us on WhatsApp.", ar: "نعم — استخدم نموذج الحجز في هذه الصفحة، أو راسلنا عبر واتساب." } },
      { question: { en: "Is AFAQ AL HAYAT available for emergencies?", ar: "هل آفاق الحياة متاحة للحالات الطارئة؟" }, answer: { en: "We're available 24/7 — reach out any time and our team will confirm the earliest available visit.", ar: "نحن متاحون على مدار الساعة — تواصل معنا في أي وقت وسيؤكد فريقنا أقرب موعد متاح." } },
    ].map((faq, i) => ({ id: faqIds("electrical", 10)[i], ...faq })),
    finalCta: {
      title: { en: "Leave Electrical Work to a Trained Technician", ar: "اترك الأعمال الكهربائية لفني مدرب" },
      subtitle: { en: "Book online, call, or message us on WhatsApp — our team follows up to confirm your visit.", ar: "احجز أونلاين، أو اتصل، أو راسلنا عبر واتساب — يتابع فريقنا معك لتأكيد زيارتك." },
    },
  },
  {
    slug: "water-tank-cleaning",
    serviceSlug: "water-tank-cleaning",
    seo: {
      title: { en: "Water Tank Cleaning Dubai & UAE | Sterilization | AFAQ AL HAYAT", ar: "تنظيف خزانات المياه في دبي والإمارات | تعقيم | آفاق الحياة" },
      description: { en: "Water tank cleaning and sterilization across the UAE — protect your family's water supply. Free quote, book online or on WhatsApp.", ar: "تنظيف وتعقيم خزانات المياه في جميع أنحاء الإمارات — احمِ إمدادات المياه لعائلتك. عرض سعر مجاني، احجز أونلاين أو عبر واتساب." },
      keywords: { en: ["water tank cleaning Dubai", "water tank cleaning UAE", "tank sterilization service", "how often clean water tank"], ar: ["تنظيف خزانات المياه دبي", "تنظيف خزانات المياه الإمارات", "خدمة تعقيم الخزان", "كم مرة ينظف خزان المياه"] },
    },
    hero: {
      image: { src: "/brand/images/services/cleaning/water-tank-cleaning-service-card-afaq-v1.webp", width: 1402, height: 1122 },
      alt: { en: "AFAQ AL HAYAT technician cleaning a rooftop water tank in the UAE", ar: "فني آفاق الحياة أثناء تنظيف خزان مياه على سطح منزل بالإمارات" },
      eyebrow: { en: "Water Tank Cleaning", ar: "تنظيف خزانات المياه" },
      headline: { en: "Your Water Tank Is Overdue for a Real Clean", ar: "خزان مياهك يحتاج تنظيفًا حقيقيًا لم يحصل عليه منذ فترة" },
      subheadline: { en: "Sediment, algae, and bacteria build up silently — professional cleaning and sterilization across all 7 emirates.", ar: "الرواسب والطحالب والبكتيريا تتراكم بصمت — تنظيف وتعقيم احترافي في جميع الإمارات السبع." },
      trustBadges: [
        { en: "UAE-wide service", ar: "خدمة في جميع الإمارات" },
        { en: "Trained technicians", ar: "فنيون مدربون" },
        { en: "Thorough sterilization", ar: "تعقيم شامل" },
        { en: "Quality-focused", ar: "التركيز على الجودة" },
      ],
    },
    problem: {
      title: { en: "The Tank You Never See Holds the Water You Drink Every Day", ar: "الخزان الذي لا تراه أبدًا يحتفظ بالمياه التي تشربها يوميًا" },
      body: [
        { en: "Water tanks are one of the most overlooked parts of home maintenance — out of sight, easy to forget, yet directly connected to your family's daily water supply.", ar: "خزانات المياه من أكثر عناصر الصيانة المنزلية إهمالًا — بعيدة عن الأنظار، يسهل نسيانها، ورغم ذلك مرتبطة مباشرة بإمدادات المياه اليومية لعائلتك." },
        { en: "Sediment, algae growth, and bacteria can build up gradually without any visible sign until water quality is already affected.", ar: "الرواسب ونمو الطحالب والبكتيريا يمكن أن تتراكم تدريجيًا دون أي علامة ظاهرة حتى تتأثر جودة المياه بالفعل." },
      ],
    },
    whyUs: {
      title: { en: "Why UAE Homeowners Choose AFAQ AL HAYAT", ar: "لماذا يختار أصحاب المنازل في الإمارات آفاق الحياة" },
      points: [
        { en: "Full drain, scrub, and sterilization process.", ar: "عملية تصريف وتنظيف وتعقيم كاملة." },
        { en: "Trained technicians equipped for the job.", ar: "فنيون مدربون ومجهزون للمهمة." },
        { en: "Fast response — WhatsApp or call.", ar: "استجابة سريعة — واتساب أو اتصال." },
        { en: "Coverage across all 7 emirates.", ar: "تغطية في جميع الإمارات السبع." },
      ],
    },
    serviceDetails: {
      title: { en: "What Our Water Tank Cleaning Covers", ar: "ما الذي يشمله تنظيف خزانات المياه" },
      body: [{ en: "A full clean isn't just rinsing — it's draining, scrubbing every interior surface, and sterilizing before refilling.", ar: "التنظيف الكامل ليس مجرد شطف — إنه تصريف، وتنظيف كل سطح داخلي، وتعقيم قبل إعادة التعبئة." }],
      included: [
        { en: "Full tank drainage", ar: "تصريف كامل للخزان" },
        { en: "Interior scrubbing and sediment removal", ar: "تنظيف الداخل وإزالة الرواسب" },
        { en: "Sterilization before refilling", ar: "تعقيم قبل إعادة التعبئة" },
        { en: "Inspection for cracks or damage", ar: "فحص للشقوق أو الأضرار" },
      ],
    },
    process: {
      title: { en: "How It Works", ar: "كيف تسير الخدمة" },
      steps: [
        { title: { en: "1. Request", ar: "١. الطلب" }, description: { en: "Book online or message us to schedule a visit.", ar: "احجز أونلاين أو راسلنا لجدولة زيارة." } },
        { title: { en: "2. Drain", ar: "٢. التصريف" }, description: { en: "The tank is fully drained before cleaning begins.", ar: "يتم تصريف الخزان بالكامل قبل بدء التنظيف." } },
        { title: { en: "3. Clean & Sterilize", ar: "٣. التنظيف والتعقيم" }, description: { en: "Every surface is scrubbed and sterilized.", ar: "يتم تنظيف وتعقيم كل سطح." } },
        { title: { en: "4. Refill", ar: "٤. إعادة التعبئة" }, description: { en: "The tank is refilled once fully clean.", ar: "تتم إعادة تعبئة الخزان بمجرد اكتمال التنظيف." } },
      ],
    },
    standardOfWork: {
      title: { en: "The Standard You Can Expect", ar: "المستوى الذي يمكنك توقعه" },
      description: { en: "A full drain-scrub-sterilize process — not a quick rinse.", ar: "عملية تصريف وتنظيف وتعقيم كاملة — وليست شطفًا سريعًا." },
      image: { src: "/brand/images/services/cleaning/water-tank-cleaning-service-card-afaq-v1.webp", alt: { en: "AFAQ AL HAYAT technician thoroughly cleaning a water tank interior", ar: "فني آفاق الحياة يقوم بتنظيف شامل لداخل خزان المياه" } },
    },
    pricing: {
      title: { en: "What Does It Cost?", ar: "كم التكلفة؟" },
      body: { en: "Pricing depends on your tank's size and condition — get a free, no-obligation quote after a quick chat with our team.", ar: "التكلفة تعتمد على حجم خزانك وحالته — احصل على عرض سعر مجاني وبدون التزام بعد محادثة سريعة مع فريقنا." },
    },
    faqs: [
      { question: { en: "How often should a water tank be cleaned?", ar: "كم مرة يجب تنظيف خزان المياه؟" }, answer: { en: "It depends on the tank and usage — a technician can suggest a schedule based on a real inspection.", ar: "يعتمد ذلك على الخزان والاستخدام — يمكن للفني اقتراح جدول بناءً على فحص حقيقي." } },
      { question: { en: "Is the sterilization safe for drinking water?", ar: "هل التعقيم آمن لمياه الشرب؟" }, answer: { en: "Our process is designed for household water tanks — the technician can walk you through exactly what's used.", ar: "عمليتنا مصممة لخزانات المياه المنزلية — يمكن للفني شرح ما يُستخدم بالضبط." } },
      { question: { en: "How long does the process take?", ar: "كم تستغرق العملية؟" }, answer: { en: "It depends on the tank's size — our team will give you a realistic estimate before booking.", ar: "يعتمد ذلك على حجم الخزان — سيقدم فريقنا تقديرًا واقعيًا قبل الحجز." } },
      { question: { en: "Will we be without water during cleaning?", ar: "هل سنكون بدون مياه أثناء التنظيف؟" }, answer: { en: "There may be a brief interruption while the tank is drained and refilled — our team will let you know what to expect.", ar: "قد يكون هناك انقطاع مؤقت أثناء تصريف الخزان وإعادة تعبئته — سيخبرك فريقنا بما يجب توقعه." } },
      { question: { en: "Do you inspect for damage as well as clean?", ar: "هل تفحصون الأضرار بالإضافة للتنظيف؟" }, answer: { en: "Yes, we check for cracks or damage as part of the visit.", ar: "نعم، نفحص الشقوق أو الأضرار كجزء من الزيارة." } },
      { question: { en: "How much does water tank cleaning cost?", ar: "كم تكلفة تنظيف خزان المياه؟" }, answer: { en: "It depends on your tank's size and condition — contact us for a free quote.", ar: "تعتمد على حجم خزانك وحالته — تواصل معنا للحصول على عرض سعر مجاني." } },
      { question: { en: "Do you serve my emirate?", ar: "هل تقدمون الخدمة في إمارتي؟" }, answer: { en: "We cover all 7 UAE emirates — Dubai, Abu Dhabi, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, and Fujairah.", ar: "نغطي جميع إمارات الدولة السبع — دبي، أبوظبي، الشارقة، عجمان، أم القيوين، رأس الخيمة، والفجيرة." } },
      { question: { en: "Is this suitable for villa and building tanks?", ar: "هل تناسب خزانات الفلل والمباني؟" }, answer: { en: "Yes, we service tanks across villas, apartments, and buildings.", ar: "نعم، نخدم الخزانات في الفلل والشقق والمباني." } },
      { question: { en: "Can I book online without calling?", ar: "هل يمكنني الحجز أونلاين بدون اتصال؟" }, answer: { en: "Yes — use the booking form on this page, or message us on WhatsApp.", ar: "نعم — استخدم نموذج الحجز في هذه الصفحة، أو راسلنا عبر واتساب." } },
      { question: { en: "Is AFAQ AL HAYAT available for emergencies?", ar: "هل آفاق الحياة متاحة للحالات الطارئة؟" }, answer: { en: "We're available 24/7 — reach out any time and our team will confirm the earliest available visit.", ar: "نحن متاحون على مدار الساعة — تواصل معنا في أي وقت وسيؤكد فريقنا أقرب موعد متاح." } },
    ].map((faq, i) => ({ id: faqIds("water-tank-cleaning", 10)[i], ...faq })),
    finalCta: {
      title: { en: "Protect What Your Family Drinks Every Day", ar: "احمِ ما تشربه عائلتك كل يوم" },
      subtitle: { en: "Book online, call, or message us on WhatsApp — our team follows up to confirm your visit.", ar: "احجز أونلاين، أو اتصل، أو راسلنا عبر واتساب — يتابع فريقنا معك لتأكيد زيارتك." },
    },
  },
  {
    slug: "villa-cleaning",
    serviceSlug: "villa-cleaning",
    seo: {
      title: { en: "Villa Cleaning UAE | Dubai, Abu Dhabi & More | AFAQ AL HAYAT", ar: "تنظيف فلل في الإمارات | دبي وأبوظبي والمزيد | آفاق الحياة" },
      description: { en: "Professional villa cleaning across the UAE — every floor, every room, every detail. Trained teams, free quote, book online or on WhatsApp.", ar: "تنظيف فلل احترافي في جميع أنحاء الإمارات — كل طابق، كل غرفة، كل تفصيل. فرق مدربة، عرض سعر مجاني، احجز أونلاين أو عبر واتساب." },
      keywords: { en: ["villa cleaning UAE", "villa cleaning Dubai", "luxury villa cleaning", "villa cleaning company"], ar: ["تنظيف فلل الإمارات", "تنظيف فلل دبي", "تنظيف فلل فاخرة", "شركة تنظيف فلل"] },
    },
    hero: {
      image: { src: "/brand/images/services/cleaning/villa-palace-cleaning-service-card-afaq-v1.webp", width: 1402, height: 1122 },
      alt: { en: "AFAQ AL HAYAT cleaning team working in a luxury villa living room", ar: "فريق آفاق الحياة أثناء العمل في صالة معيشة فيلا فاخرة" },
      eyebrow: { en: "Villa Cleaning", ar: "تنظيف الفلل" },
      headline: { en: "Villa Cleaning That Covers Every Floor, Not Just the Main Ones", ar: "تنظيف فلل يغطي كل طابق، لا الطوابق الرئيسية فقط" },
      subheadline: { en: "Larger spaces, multiple floors, varied surfaces — a cleaning approach built for villas, not apartments.", ar: "مساحات أوسع، طوابق متعددة، أسطح متنوعة — نهج تنظيف مصمم للفلل، لا للشقق." },
      trustBadges: [
        { en: "UAE-wide service", ar: "خدمة في جميع الإمارات" },
        { en: "Trained cleaning teams", ar: "فرق تنظيف مدربة" },
        { en: "Flexible scheduling", ar: "جدولة مرنة" },
        { en: "Quality-focused", ar: "التركيز على الجودة" },
      ],
    },
    problem: {
      title: { en: "A Villa Isn't Just a Bigger Apartment to Clean", ar: "الفيلا ليست مجرد شقة أكبر للتنظيف" },
      body: [
        { en: "Multiple floors, outdoor spaces, larger surface areas, and often more varied finishes mean a villa needs a cleaning plan built for its actual layout — not a generic apartment routine stretched thinner.", ar: "طوابق متعددة، مساحات خارجية، أسطح أوسع، وغالبًا تشطيبات أكثر تنوعًا، كل ذلك يعني أن الفيلا تحتاج خطة تنظيف مصممة لتخطيطها الفعلي — لا روتين شقة عام يُمدد ليغطي مساحة أكبر." },
        { en: "Without a plan matched to the space, some rooms get thorough attention while others — a rarely used upstairs floor, a study, a guest wing — quietly fall behind.", ar: "بدون خطة تناسب المساحة، تحصل بعض الغرف على عناية دقيقة بينما تتراجع أخرى بصمت — طابق علوي نادر الاستخدام، غرفة مكتب، جناح ضيوف." },
      ],
    },
    whyUs: {
      title: { en: "Why UAE Homeowners Choose AFAQ AL HAYAT", ar: "لماذا يختار أصحاب المنازل في الإمارات آفاق الحياة" },
      points: [
        { en: "A cleaning plan matched to your villa's actual layout.", ar: "خطة تنظيف مطابقة لتخطيط فيلتك الفعلي." },
        { en: "Trained, uniformed teams for every visit.", ar: "فرق مدربة بزي موحد لكل زيارة." },
        { en: "Flexible scheduling around your routine.", ar: "جدولة مرنة حول روتينك." },
        { en: "Coverage across all 7 emirates.", ar: "تغطية في جميع الإمارات السبع." },
      ],
    },
    serviceDetails: {
      title: { en: "What Our Villa Cleaning Service Covers", ar: "ما الذي تشمله خدمة تنظيف الفلل" },
      body: [{ en: "Every floor, every room, and the varied surfaces a villa typically has — covered with the same care, not a rushed pass.", ar: "كل طابق، كل غرفة، والأسطح المتنوعة التي تحتويها الفيلا عادة — بنفس العناية، لا بمرور سريع." }],
      included: [
        { en: "Multi-floor cleaning, room by room", ar: "تنظيف متعدد الطوابق، غرفة بغرفة" },
        { en: "Kitchen and multiple bathroom cleaning", ar: "تنظيف المطبخ وعدة حمامات" },
        { en: "Living and dining area detailing", ar: "تنظيف دقيق لمناطق المعيشة والطعام" },
        { en: "Flexible one-time or recurring scheduling", ar: "جدولة مرنة لمرة واحدة أو بشكل دوري" },
      ],
    },
    process: {
      title: { en: "How It Works", ar: "كيف تسير الخدمة" },
      steps: [
        { title: { en: "1. Request", ar: "١. الطلب" }, description: { en: "Book online or message us with your villa's size and layout.", ar: "احجز أونلاين أو راسلنا بحجم فيلتك وتخطيطها." } },
        { title: { en: "2. Confirm", ar: "٢. التأكيد" }, description: { en: "Our team follows up to confirm scope and timing.", ar: "يتابع فريقنا معك لتأكيد النطاق والتوقيت." } },
        { title: { en: "3. Clean", ar: "٣. التنظيف" }, description: { en: "A team covers every floor, methodically.", ar: "يغطي الفريق كل طابق، بشكل منهجي." } },
        { title: { en: "4. Repeat or Done", ar: "٤. التكرار أو الانتهاء" }, description: { en: "Set it as recurring, or book again as needed.", ar: "اجعلها دورية، أو احجز مجددًا حسب الحاجة." } },
      ],
    },
    standardOfWork: {
      title: { en: "The Standard You Can Expect", ar: "المستوى الذي يمكنك توقعه" },
      description: { en: "The same care on the top floor as the ground floor.", ar: "نفس العناية في الطابق العلوي كما في الأرضي." },
      image: { src: "/brand/images/services/cleaning/villa-palace-cleaning-service-card-afaq-v1.webp", alt: { en: "AFAQ AL HAYAT team cleaning a spacious villa interior", ar: "فريق آفاق الحياة يقوم بتنظيف داخل فيلا واسعة" } },
    },
    pricing: {
      title: { en: "What Does It Cost?", ar: "كم التكلفة؟" },
      body: { en: "Pricing depends on your villa's size and how often you'd like a visit — get a free, no-obligation quote after a quick chat with our team.", ar: "التكلفة تعتمد على حجم فيلتك وعدد مرات الزيارة — احصل على عرض سعر مجاني وبدون التزام بعد محادثة سريعة مع فريقنا." },
    },
    faqs: [
      { question: { en: "Can you clean multi-floor villas?", ar: "هل يمكنكم تنظيف الفلل متعددة الطوابق؟" }, answer: { en: "Yes — our teams plan around your villa's actual layout, floor by floor.", ar: "نعم — تخطط فرقنا وفق تخطيط فيلتك الفعلي، طابقًا بطابق." } },
      { question: { en: "Do you clean outdoor areas too?", ar: "هل تنظفون المناطق الخارجية أيضًا؟" }, answer: { en: "Let our team know what outdoor spaces you'd like included when booking.", ar: "أخبر فريقنا بالمساحات الخارجية التي تريد تضمينها عند الحجز." } },
      { question: { en: "Can I set up a recurring villa cleaning schedule?", ar: "هل يمكنني إعداد جدول تنظيف دوري للفيلا؟" }, answer: { en: "Yes — weekly, bi-weekly, or monthly, whichever fits your routine.", ar: "نعم — أسبوعي، أو كل أسبوعين، أو شهري، أيهما يناسب روتينك." } },
      { question: { en: "How many people come for a villa cleaning visit?", ar: "كم عدد الأشخاص الذين يأتون لزيارة تنظيف الفيلا؟" }, answer: { en: "Team size is matched to your villa's size — our team will confirm this when scheduling.", ar: "يُحدد حجم الفريق وفق حجم فيلتك — سيؤكد فريقنا ذلك عند الجدولة." } },
      { question: { en: "Do you bring your own cleaning supplies?", ar: "هل تحضرون مواد التنظيف الخاصة بكم؟" }, answer: { en: "Yes, our team brings the equipment and supplies needed for the visit.", ar: "نعم، يحضر فريقنا المعدات والمواد اللازمة للزيارة." } },
      { question: { en: "How much does villa cleaning cost?", ar: "كم تكلفة تنظيف الفلل؟" }, answer: { en: "It depends on your villa's size and visit frequency — contact us for a free quote.", ar: "تعتمد على حجم فيلتك وتكرار الزيارات — تواصل معنا للحصول على عرض سعر مجاني." } },
      { question: { en: "Do you serve my emirate?", ar: "هل تقدمون الخدمة في إمارتي؟" }, answer: { en: "We cover all 7 UAE emirates — Dubai, Abu Dhabi, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, and Fujairah.", ar: "نغطي جميع إمارات الدولة السبع — دبي، أبوظبي، الشارقة، عجمان، أم القيوين، رأس الخيمة، والفجيرة." } },
      { question: { en: "Can I request a deep clean instead of a regular one?", ar: "هل يمكنني طلب تنظيف عميق بدلاً من العادي؟" }, answer: { en: "Yes — see our dedicated deep cleaning service for a thorough, one-time reset.", ar: "نعم — راجع خدمة التنظيف العميق المخصصة لدينا لإعادة ضبط شاملة لمرة واحدة." } },
      { question: { en: "Can I book online without calling?", ar: "هل يمكنني الحجز أونلاين بدون اتصال؟" }, answer: { en: "Yes — use the booking form on this page, or message us on WhatsApp.", ar: "نعم — استخدم نموذج الحجز في هذه الصفحة، أو راسلنا عبر واتساب." } },
      { question: { en: "Is AFAQ AL HAYAT available for emergencies?", ar: "هل آفاق الحياة متاحة للحالات الطارئة؟" }, answer: { en: "We're available 24/7 — reach out any time and our team will confirm the earliest available visit.", ar: "نحن متاحون على مدار الساعة — تواصل معنا في أي وقت وسيؤكد فريقنا أقرب موعد متاح." } },
    ].map((faq, i) => ({ id: faqIds("villa-cleaning", 10)[i], ...faq })),
    finalCta: {
      title: { en: "Every Floor of Your Villa, Properly Cleaned", ar: "كل طابق في فيلتك، منظف بشكل صحيح" },
      subtitle: { en: "Book online, call, or message us on WhatsApp — our team follows up to confirm your visit.", ar: "احجز أونلاين، أو اتصل، أو راسلنا عبر واتساب — يتابع فريقنا معك لتأكيد زيارتك." },
    },
  },
  {
    slug: "emergency-home-services",
    serviceSlug: "",
    seo: {
      title: { en: "Emergency Home Services Dubai & UAE | 24/7 Response | AFAQ AL HAYAT", ar: "خدمات منزلية طارئة في دبي والإمارات | استجابة على مدار الساعة | آفاق الحياة" },
      description: { en: "24/7 emergency response for plumbing, electrical, and AC issues across the UAE. Trained technicians, fast follow-up, book online or on WhatsApp.", ar: "استجابة على مدار الساعة لمشاكل السباكة والكهرباء والتكييف في جميع أنحاء الإمارات. فنيون مدربون، متابعة سريعة، احجز أونلاين أو عبر واتساب." },
      keywords: { en: ["emergency home services UAE", "emergency plumber Dubai", "24/7 home repair", "urgent AC repair"], ar: ["خدمات منزلية طارئة الإمارات", "سباك طوارئ دبي", "إصلاح منزلي 24 ساعة", "إصلاح تكييف عاجل"] },
    },
    hero: {
      image: { src: "/brand/images/services/maintenance/service-handyman-maintenance.webp", width: 1402, height: 1122 },
      alt: { en: "AFAQ AL HAYAT technician responding to an urgent home repair visit", ar: "فني آفاق الحياة أثناء الاستجابة لزيارة إصلاح منزلي عاجلة" },
      eyebrow: { en: "Emergency Home Services", ar: "الخدمات المنزلية الطارئة" },
      headline: { en: "When It Can't Wait, Neither Do We", ar: "عندما لا يحتمل الأمر الانتظار، فنحن أيضًا لا ننتظر" },
      subheadline: { en: "Active leaks, power issues, AC breakdowns — reach out any time and our team follows up to confirm the earliest available visit.", ar: "تسريبات نشطة، مشاكل كهرباء، أعطال تكييف — تواصل معنا في أي وقت وسيتابع فريقنا لتأكيد أقرب موعد متاح." },
      trustBadges: [
        { en: "Available 24/7", ar: "متاحون على مدار الساعة" },
        { en: "UAE-wide service", ar: "خدمة في جميع الإمارات" },
        { en: "Trained technicians", ar: "فنيون مدربون" },
        { en: "Fast follow-up", ar: "متابعة سريعة" },
      ],
    },
    problem: {
      title: { en: "Some Problems Genuinely Can't Wait for a Scheduled Slot", ar: "بعض المشاكل لا تحتمل الانتظار لموعد مجدول" },
      body: [
        { en: "An active water leak, a full power outage, or an AC that fails during peak summer heat aren't situations where \"next week\" is good enough.", ar: "تسريب مياه نشط، أو انقطاع كهرباء كامل، أو تكييف يتعطل في ذروة حر الصيف، ليست مواقف يكفي فيها \"الأسبوع القادم\"." },
        { en: "Reach out and our team follows up right away to understand the situation and confirm the earliest available visit.", ar: "تواصل معنا وسيتابع فريقنا فورًا لفهم الموقف وتأكيد أقرب موعد متاح." },
      ],
    },
    whyUs: {
      title: { en: "Why UAE Homeowners Choose AFAQ AL HAYAT", ar: "لماذا يختار أصحاب المنازل في الإمارات آفاق الحياة" },
      points: [
        { en: "Available around the clock, every day.", ar: "متاحون على مدار الساعة، كل يوم." },
        { en: "Trained technicians across plumbing, electrical, and AC.", ar: "فنيون مدربون في السباكة والكهرباء والتكييف." },
        { en: "Fast follow-up on WhatsApp or by phone.", ar: "متابعة سريعة عبر واتساب أو الهاتف." },
        { en: "Coverage across all 7 emirates.", ar: "تغطية في جميع الإمارات السبع." },
      ],
    },
    serviceDetails: {
      title: { en: "What Our Emergency Response Covers", ar: "ما الذي تشمله استجابتنا الطارئة" },
      body: [{ en: "The situations that genuinely can't wait — matched with the right technician as fast as our team can confirm one.", ar: "المواقف التي لا تحتمل الانتظار فعلاً — تُقابل بالفني المناسب بأسرع ما يمكن لفريقنا تأكيده." }],
      included: [
        { en: "Active water leaks and burst pipes", ar: "تسريبات مياه نشطة وانفجار المواسير" },
        { en: "Full or partial power outages", ar: "انقطاع كهرباء كامل أو جزئي" },
        { en: "AC breakdowns during peak heat", ar: "أعطال التكييف في ذروة الحر" },
        { en: "Full drain blockages preventing use", ar: "انسداد كامل للمصارف يمنع الاستخدام" },
      ],
    },
    process: {
      title: { en: "How It Works", ar: "كيف تسير الخدمة" },
      steps: [
        { title: { en: "1. Reach Out", ar: "١. التواصل" }, description: { en: "Call or message us on WhatsApp — any time, any day.", ar: "اتصل أو راسلنا عبر واتساب — في أي وقت، أي يوم." } },
        { title: { en: "2. Confirm", ar: "٢. التأكيد" }, description: { en: "Our team follows up right away to understand the situation.", ar: "يتابع فريقنا فورًا لفهم الموقف." } },
        { title: { en: "3. Technician Dispatched", ar: "٣. إرسال الفني" }, description: { en: "The right specialist is sent for the earliest available visit.", ar: "يتم إرسال المتخصص المناسب لأقرب موعد متاح." } },
        { title: { en: "4. Resolved", ar: "٤. الحل" }, description: { en: "The issue is fixed properly, not just patched.", ar: "يتم إصلاح المشكلة بشكل صحيح، لا ترقيعها فقط." } },
      ],
    },
    standardOfWork: {
      title: { en: "The Standard You Can Expect", ar: "المستوى الذي يمكنك توقعه" },
      description: { en: "The same careful, proper work — even when speed matters most.", ar: "نفس العمل الدقيق والمناسب — حتى عندما تكون السرعة الأهم." },
      image: { src: "/brand/images/services/maintenance/service-handyman-maintenance.webp", alt: { en: "AFAQ AL HAYAT technician responding quickly to an urgent repair", ar: "فني آفاق الحياة يستجيب بسرعة لإصلاح عاجل" } },
    },
    pricing: {
      title: { en: "What Does It Cost?", ar: "كم التكلفة؟" },
      body: { en: "Pricing depends on the issue and the trade involved — get a free, no-obligation quote after a quick chat with our team.", ar: "التكلفة تعتمد على طبيعة المشكلة والتخصص المعني — احصل على عرض سعر مجاني وبدون التزام بعد محادثة سريعة مع فريقنا." },
    },
    faqs: [
      { question: { en: "Are you really available 24/7?", ar: "هل أنتم متاحون فعلاً على مدار الساعة؟" }, answer: { en: "Yes — reach out any time and our team will follow up to confirm the earliest available visit.", ar: "نعم — تواصل معنا في أي وقت وسيتابع فريقنا لتأكيد أقرب موعد متاح." } },
      { question: { en: "What counts as an emergency?", ar: "ما الذي يُعتبر حالة طارئة؟" }, answer: { en: "Active leaks, full power outages, AC breakdowns in peak heat, and full drain blockages are common examples.", ar: "التسريبات النشطة، وانقطاع الكهرباء الكامل، وأعطال التكييف في ذروة الحر، وانسداد المصارف الكامل، كلها أمثلة شائعة." } },
      { question: { en: "How fast can you actually respond?", ar: "ما مدى سرعة استجابتكم فعليًا؟" }, answer: { en: "Message us on WhatsApp or call, and our team follows up right away to confirm the nearest available slot based on your situation.", ar: "راسلنا عبر واتساب أو اتصل، وسيتابع فريقنا معك فورًا لتأكيد أقرب موعد متاح بناءً على موقفك." } },
      { question: { en: "Do you charge more for emergency visits?", ar: "هل تتقاضون أكثر مقابل الزيارات الطارئة؟" }, answer: { en: "Pricing depends on the specific situation — our team will be upfront with you before confirming the visit.", ar: "التكلفة تعتمد على الموقف تحديدًا — سيكون فريقنا صريحًا معك قبل تأكيد الزيارة." } },
      { question: { en: "What if it turns out not to be a true emergency?", ar: "ماذا لو تبين أنها ليست حالة طارئة حقيقية؟" }, answer: { en: "That's fine — our team can still help and advise on the best next step, urgent or not.", ar: "لا مشكلة — يمكن لفريقنا مساعدتك وتقديم استشارة حول الخطوة التالية الأفضل، سواء كانت عاجلة أم لا." } },
      { question: { en: "Which trades do you cover for emergencies?", ar: "ما التخصصات التي تغطونها للطوارئ؟" }, answer: { en: "Plumbing, electrical, and AC are the most common emergency categories we handle.", ar: "السباكة والكهرباء والتكييف هي أكثر فئات الطوارئ شيوعًا التي نتعامل معها." } },
      { question: { en: "Do you serve my emirate?", ar: "هل تقدمون الخدمة في إمارتي؟" }, answer: { en: "We cover all 7 UAE emirates — Dubai, Abu Dhabi, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, and Fujairah.", ar: "نغطي جميع إمارات الدولة السبع — دبي، أبوظبي، الشارقة، عجمان، أم القيوين، رأس الخيمة، والفجيرة." } },
      { question: { en: "Can I message on WhatsApp instead of calling?", ar: "هل يمكنني المراسلة عبر واتساب بدلاً من الاتصال؟" }, answer: { en: "Yes — WhatsApp works just as well for urgent situations.", ar: "نعم — واتساب يعمل بنفس الكفاءة للمواقف العاجلة." } },
      { question: { en: "Can I book a non-urgent visit here too?", ar: "هل يمكنني حجز زيارة غير عاجلة هنا أيضًا؟" }, answer: { en: "Yes — use the booking form on this page for routine visits as well.", ar: "نعم — استخدم نموذج الحجز في هذه الصفحة للزيارات الروتينية أيضًا." } },
      { question: { en: "Will the same technician follow up afterward?", ar: "هل سيتابع نفس الفني لاحقًا؟" }, answer: { en: "Our team coordinates any needed follow-up to make sure the issue is fully resolved.", ar: "ينسق فريقنا أي متابعة لازمة للتأكد من حل المشكلة بالكامل." } },
    ].map((faq, i) => ({ id: faqIds("emergency-home-services", 10)[i], ...faq })),
    finalCta: {
      title: { en: "Don't Wait Out an Emergency", ar: "لا تنتظر انتهاء حالة طارئة من تلقاء نفسها" },
      subtitle: { en: "Call or message us on WhatsApp any time — our team follows up right away.", ar: "اتصل أو راسلنا عبر واتساب في أي وقت — يتابع فريقنا فورًا." },
    },
  },
  {
    slug: "painting",
    serviceSlug: "painting",
    seo: {
      title: { en: "Painting Services Dubai & UAE | Interior & Exterior | AFAQ AL HAYAT", ar: "خدمات الدهانات في دبي والإمارات | داخلي وخارجي | آفاق الحياة" },
      description: { en: "Professional interior and exterior painting across the UAE — surface prep, color consultation, clean finish. Trained technicians, free quote. Book online or on WhatsApp.", ar: "دهانات داخلية وخارجية احترافية في جميع أنحاء الإمارات — تحضير الأسطح، استشارة الألوان، تشطيب نظيف. فنيون مدربون، عرض سعر مجاني. احجز أونلاين أو عبر واتساب." },
      keywords: { en: ["Painting Services UAE", "House Painter Dubai", "Wall Painting", "Interior Painting UAE", "Villa Painting"], ar: ["دهانات الإمارات", "دهان دبي", "طلاء جدران", "دهانات داخلية", "دهان فلل"] },
    },
    hero: {
      image: { src: "/brand/images/services/maintenance/painting-wall-painting-maintenance-service-card-afaq-v1.webp", width: 1402, height: 1122 },
      alt: { en: "AFAQ AL HAYAT technician rolling wall paint in a luxury UAE hallway", ar: "فني آفاق الحياة يطلي جدارًا بالأسطوانة في ممر فاخر بالإمارات" },
      eyebrow: { en: "Painting", ar: "الدهانات" },
      headline: { en: "Fresh Walls, Flawless Finish — Painting Done Properly", ar: "جدران منعشة وتشطيب مثالي — دهانات تُنفذ بالشكل الصحيح" },
      subheadline: { en: "Interior and exterior wall painting and touch-up work for homes and businesses — surface prep, color consultation, and a clean finish, across all 7 emirates.", ar: "طلاء الجدران الداخلية والخارجية وأعمال الرتوش للمنازل والمنشآت — تحضير الأسطح واستشارة الألوان وتشطيب نظيف، في جميع الإمارات السبع." },
      trustBadges: [
        { en: "UAE-wide service", ar: "خدمة في جميع الإمارات" },
        { en: "Trained technicians", ar: "فنيون مدربون" },
        { en: "Available 24/7", ar: "متاحون على مدار الساعة" },
        { en: "Quality-focused", ar: "التركيز على الجودة" },
      ],
    },
    problem: {
      title: { en: "Faded Walls and Patch Marks Don't Fix Themselves", ar: "الجدران الباهتة وآثار الترقيع لا تُصلح نفسها" },
      body: [
        {
          en: "Chipped or faded paint, visible stains, cracks, patch marks, or a color that no longer matches after a previous repair — these don't improve on their own, and covering them with another quick coat over an unprepared surface usually shows through within months.",
          ar: "الطلاء المتقشر أو الباهت، أو البقع الظاهرة، أو التشققات، أو آثار الترقيع، أو لون لم يعد متطابقًا بعد إصلاح سابق — كل هذا لا يتحسن من تلقاء نفسه، وتغطيته بطبقة سريعة أخرى فوق سطح غير مُجهز يظهر عادة خلال أشهر.",
        },
        {
          en: "Damp or moisture marks affecting the paint finish are worth noting before repainting over them, and an outdated color scheme is one of the fastest ways to make an otherwise well-kept space feel tired.",
          ar: "آثار الرطوبة التي تؤثر على تشطيب الطلاء تستحق الانتباه قبل إعادة الطلاء فوقها، وأنظمة الألوان القديمة من أسرع الأسباب التي تجعل مساحة معتنى بها تبدو باهتة.",
        },
      ],
    },
    whyUs: {
      title: { en: "Why UAE Homeowners Choose AFAQ AL HAYAT", ar: "لماذا يختار أصحاب المنازل في الإمارات آفاق الحياة" },
      points: [
        { en: "Proper surface preparation before any paint goes on — not a rushed coat over a dirty wall.", ar: "تحضير مناسب للسطح قبل أي طلاء — وليس طبقة سريعة فوق جدار غير نظيف." },
        { en: "Color guidance based on your space and preference, explained before work starts.", ar: "إرشاد في اختيار الألوان حسب مساحتك وتفضيلك، يُشرح قبل بدء العمل." },
        { en: "Furniture and flooring protected, work areas kept ventilated throughout.", ar: "حماية الأثاث والأرضيات، والحفاظ على تهوية مكان العمل طوال الوقت." },
        { en: "Coverage across all 7 emirates.", ar: "تغطية في جميع الإمارات السبع." },
      ],
    },
    serviceDetails: {
      title: { en: "What Our Painting Service Covers", ar: "ما الذي تشمله خدمة الدهانات لدينا" },
      body: [
        {
          en: "From a single-room refresh to full-property repainting, our painting service covers interior and exterior wall painting and touch-up work for homes and businesses across the UAE.",
          ar: "من تجديد غرفة واحدة إلى إعادة طلاء العقار بالكامل، تغطي خدمة الدهانات لدينا طلاء الجدران الداخلية والخارجية وأعمال الرتوش للمنازل والمنشآت في جميع أنحاء الإمارات.",
        },
      ],
      included: [
        { en: "Surface preparation — cleaning, minor filling, sanding", ar: "تحضير السطح — تنظيف وترقيع بسيط وصنفرة" },
        { en: "Interior wall and ceiling painting", ar: "طلاء الجدران والأسقف الداخلية" },
        { en: "Exterior wall painting where accessible", ar: "طلاء الجدران الخارجية حيث يمكن الوصول إليها" },
        { en: "Color consultation based on your preference", ar: "استشارة اختيار الألوان حسب تفضيلك" },
      ],
    },
    process: {
      title: { en: "How It Works", ar: "كيف تسير الخدمة" },
      steps: [
        { title: { en: "1. Request", ar: "١. الطلب" }, description: { en: "Book online or message us with the space and scope.", ar: "احجز أونلاين أو راسلنا بالمساحة ونطاق العمل." } },
        { title: { en: "2. Assessment", ar: "٢. المعاينة" }, description: { en: "A technician assesses the surfaces and discusses color and finish with you.", ar: "يقوم الفني بمعاينة الأسطح ومناقشة اللون والتشطيب معك." } },
        { title: { en: "3. Painting", ar: "٣. الطلاء" }, description: { en: "Surface preparation, then primer and paint applied properly.", ar: "تحضير السطح، ثم تطبيق البرايمر والطلاء بشكل صحيح." } },
        { title: { en: "4. Final Check", ar: "٤. الفحص النهائي" }, description: { en: "A quality check together, then full cleanup of the work area.", ar: "فحص جودة معًا، ثم تنظيف كامل لمكان العمل." } },
      ],
    },
    standardOfWork: {
      title: { en: "The Standard You Can Expect", ar: "المستوى الذي يمكنك توقعه" },
      description: {
        en: "Surfaces properly prepared, furniture and flooring protected, and a clean, even finish — checked together before the team leaves.",
        ar: "أسطح مُحضّرة بشكل صحيح، وحماية للأثاث والأرضيات، وتشطيب نظيف ومتساوٍ — يتم فحصه معًا قبل مغادرة الفريق.",
      },
      image: {
        src: "/brand/images/services/maintenance/painting-wall-painting-maintenance-service-card-afaq-v1.webp",
        alt: { en: "AFAQ AL HAYAT technician rolling wall paint in a luxury UAE hallway", ar: "فني آفاق الحياة يطلي جدارًا بالأسطوانة في ممر فاخر بالإمارات" },
      },
    },
    pricing: {
      title: { en: "What Does It Cost?", ar: "كم التكلفة؟" },
      body: {
        en: "Pricing depends on the area size, surface condition, and paint chosen — get a free, no-obligation quote after a quick chat with our team.",
        ar: "التكلفة تعتمد على حجم المساحة وحالة السطح والطلاء المختار — احصل على عرض سعر مجاني وبدون التزام بعد محادثة سريعة مع فريقنا.",
      },
    },
    faqs: [
      { question: { en: "How long does paint take to dry before the room can be used?", ar: "كم يستغرق الطلاء ليجف قبل استخدام الغرفة؟" }, answer: { en: "Drying time depends on the paint type, number of coats, and ventilation. Your technician will advise the expected drying time for your specific job before finishing.", ar: "يعتمد وقت الجفاف على نوع الطلاء وعدد الطبقات والتهوية. سيرشدك الفني إلى وقت الجفاف المتوقع لعملك تحديدًا قبل الانتهاء." } },
      { question: { en: "Is painting work covered by a warranty?", ar: "هل تشمل أعمال الطلاء ضمانًا؟" }, answer: { en: "Warranty terms are subject to company policy — please confirm directly with our team before the visit.", ar: "تخضع شروط الضمان لسياسة الشركة — يُرجى التأكيد المباشر مع فريقنا قبل الزيارة." } },
      { question: { en: "Can you help me choose a paint color?", ar: "هل يمكنكم مساعدتي في اختيار لون الطلاء؟" }, answer: { en: "Yes, our team can offer general color guidance based on your space and preference during the on-site consultation.", ar: "نعم، يمكن لفريقنا تقديم إرشاد عام لاختيار الألوان حسب مساحتك وتفضيلك أثناء المعاينة الميدانية." } },
      { question: { en: "How much does painting a room cost?", ar: "كم تكلفة طلاء غرفة؟" }, answer: { en: "Pricing depends on the area size, surface condition, and paint chosen. This is subject to company policy — please contact us directly for an accurate quote for your property.", ar: "تعتمد التكلفة على حجم المساحة وحالة السطح والطلاء المختار. يخضع ذلك لسياسة الشركة — يُرجى التواصل معنا مباشرة للحصول على عرض سعر دقيق لعقارك." } },
      { question: { en: "Do you handle exterior painting too, not just interior?", ar: "هل تقومون بالطلاء الخارجي أيضًا وليس فقط الداخلي؟" }, answer: { en: "Yes — our painting service covers exterior wall painting where accessible, in addition to interior walls and ceilings.", ar: "نعم — تشمل خدمة الدهانات لدينا طلاء الجدران الخارجية حيث يمكن الوصول إليها، بالإضافة إلى الجدران والأسقف الداخلية." } },
      { question: { en: "Will you protect my furniture and flooring?", ar: "هل ستحمون أثاثي وأرضياتي؟" }, answer: { en: "Yes, furniture and flooring are protected before painting begins, and work areas are kept ventilated during and after paint application.", ar: "نعم، تتم حماية الأثاث والأرضيات قبل بدء الطلاء، ويتم الحفاظ على تهوية مكان العمل أثناء وبعد تطبيق الطلاء." } },
      { question: { en: "Do you fix cracks or patch marks before painting?", ar: "هل تُصلحون التشققات أو آثار الترقيع قبل الطلاء؟" }, answer: { en: "Minor filling and surface preparation is included in every job — structural repair of walls or ceilings is outside this service's scope.", ar: "يشمل كل عمل ترقيعًا بسيطًا وتحضيرًا للسطح — أما الإصلاح الإنشائي للجدران أو الأسقف فهو خارج نطاق هذه الخدمة." } },
      { question: { en: "Do you serve my emirate?", ar: "هل تقدمون الخدمة في إمارتي؟" }, answer: { en: "We cover all 7 UAE emirates — Dubai, Abu Dhabi, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, and Fujairah.", ar: "نغطي جميع إمارات الدولة السبع — دبي، أبوظبي، الشارقة، عجمان، أم القيوين، رأس الخيمة، والفجيرة." } },
      { question: { en: "Can I book online without calling?", ar: "هل يمكنني الحجز أونلاين بدون اتصال؟" }, answer: { en: "Yes — use the booking form on this page, or message us on WhatsApp, whichever is easier for you.", ar: "نعم — استخدم نموذج الحجز في هذه الصفحة، أو راسلنا عبر واتساب، أيهما أسهل بالنسبة لك." } },
      { question: { en: "Is AFAQ AL HAYAT available for emergencies?", ar: "هل آفاق الحياة متاحة للحالات الطارئة؟" }, answer: { en: "We're available 24/7 — reach out any time and our team will confirm the earliest available visit.", ar: "نحن متاحون على مدار الساعة — تواصل معنا في أي وقت وسيؤكد فريقنا أقرب موعد متاح." } },
    ].map((faq, i) => ({ id: faqIds("painting", 10)[i], ...faq })),
    finalCta: {
      title: { en: "Give Your Walls a Fresh, Flawless Finish", ar: "امنح جدرانك تشطيبًا منعشًا ومثاليًا" },
      subtitle: { en: "Book online, call, or message us on WhatsApp — our team follows up to confirm your visit.", ar: "احجز أونلاين، أو اتصل، أو راسلنا عبر واتساب — يتابع فريقنا معك لتأكيد زيارتك." },
    },
  },
  {
    slug: "interior-decoration",
    serviceSlug: "interior-decoration",
    seo: {
      title: { en: "Interior Decoration Dubai & UAE | Fixtures & Finishing | AFAQ AL HAYAT", ar: "ديكور داخلي في دبي والإمارات | تجهيزات وتشطيب | آفاق الحياة" },
      description: { en: "Interior decoration across the UAE — fixture installation, wall treatments, coordinated finishing touches for homes and businesses. Free quote, book online or on WhatsApp.", ar: "ديكور داخلي في جميع أنحاء الإمارات — تركيب تجهيزات، معالجة جدران، لمسات تشطيب منسقة للمنازل والمنشآت. عرض سعر مجاني، احجز أونلاين أو عبر واتساب." },
      keywords: { en: ["interior decoration Dubai", "interior decoration UAE", "fixture installation Dubai", "home finishing UAE"], ar: ["ديكور داخلي دبي", "ديكور داخلي الإمارات", "تركيب تجهيزات دبي", "تشطيب منازل الإمارات"] },
    },
    hero: {
      image: { src: "/brand/images/services/maintenance/service-interior-decoration.webp", width: 1402, height: 1122 },
      alt: { en: "AFAQ AL HAYAT technician installing a decorative fixture in a UAE home", ar: "فني آفاق الحياة يقوم بتركيب تجهيزة ديكور في منزل بالإمارات" },
      eyebrow: { en: "Interior Decoration", ar: "الديكور الداخلي" },
      headline: { en: "A Refined Finish for Every Room", ar: "لمسة تشطيب راقية لكل غرفة" },
      subheadline: { en: "Fixture installation, wall treatments, and finishing touches for homes and businesses — coordinated with painting and wallpaper trades where needed, across all 7 emirates.", ar: "تركيب التجهيزات ومعالجة الجدران ولمسات التشطيب للمنازل والمنشآت — بالتنسيق مع فرق الدهان وورق الحائط عند الحاجة، في جميع الإمارات السبع." },
      trustBadges: [
        { en: "UAE-wide service", ar: "خدمة في جميع الإمارات" },
        { en: "Trained technicians", ar: "فنيون مدربون" },
        { en: "Available 24/7", ar: "متاحون على مدار الساعة" },
        { en: "Quality-focused", ar: "التركيز على الجودة" },
      ],
    },
    problem: {
      title: { en: "A Space That Feels Outdated Doesn't Need a Full Renovation", ar: "المساحة التي تبدو قديمة لا تحتاج ترميمًا كاملاً" },
      body: [
        {
          en: "Shelving that's never been mounted, molding left unfinished, or a color and material mix that never quite came together — these are finishing gaps, not structural problems, and they're usually simpler to resolve than they feel.",
          ar: "أرفف لم يتم تركيبها بعد، أو كرانيش غير مكتملة، أو مزيج ألوان ومواد لم يتناسق أبدًا — هذه فجوات تشطيب، وليست مشاكل إنشائية، وعادة ما تكون أبسط في الحل مما تبدو عليه.",
        },
        {
          en: "A room needing a refresh before a specific occasion or handover, or existing decorative elements that are damaged or incomplete, are common reasons homeowners reach out — and coordinating paint, wallpaper, and fixtures into one consistent look is exactly the gap this service closes.",
          ar: "غرفة تحتاج تجديدًا قبل مناسبة معينة أو تسليم، أو عناصر ديكور موجودة تالفة أو غير مكتملة، من الأسباب الشائعة التي تدفع أصحاب المنازل للتواصل — وتنسيق الدهان وورق الحائط والتجهيزات في مظهر واحد متسق هو بالضبط ما تسده هذه الخدمة.",
        },
      ],
    },
    whyUs: {
      title: { en: "Why UAE Homeowners Choose AFAQ AL HAYAT", ar: "لماذا يختار أصحاب المنازل في الإمارات آفاق الحياة" },
      points: [
        { en: "A coordinated finish across fixtures, wall treatments, and trim — not disconnected individual jobs.", ar: "تشطيب منسق عبر التجهيزات ومعالجة الجدران والحواف — وليس أعمالًا منفصلة." },
        { en: "A clear plan agreed with you before any work starts.", ar: "خطة واضحة متفق عليها معك قبل بدء أي عمل." },
        { en: "Careful, safe installation — especially for anything mounted at height.", ar: "تركيب دقيق وآمن — خصوصًا لأي عنصر يُثبت على ارتفاع." },
        { en: "Coverage across all 7 emirates.", ar: "تغطية في جميع الإمارات السبع." },
      ],
    },
    serviceDetails: {
      title: { en: "What Our Interior Decoration Service Covers", ar: "ما الذي تشمله خدمة الديكور الداخلي لدينا" },
      body: [
        {
          en: "A space assessment and outcome discussion first, then installation of decorative fixtures and fittings, coordinated with painting or wallpaper trades when a combined finish is needed.",
          ar: "معاينة للمساحة ومناقشة النتيجة المطلوبة أولًا، ثم تركيب تجهيزات وقطع الديكور، بالتنسيق مع فرق الدهان أو ورق الحائط عند الحاجة لتشطيب متكامل.",
        },
      ],
      included: [
        { en: "Space assessment and desired-outcome discussion", ar: "معاينة المساحة ومناقشة النتيجة المطلوبة" },
        { en: "Installation of decorative fixtures and fittings", ar: "تركيب تجهيزات وقطع الديكور" },
        { en: "Coordination with painting/wallpaper trades for a combined finish", ar: "التنسيق مع فرق الدهان وورق الحائط لتشطيب متكامل" },
        { en: "General finishing touches — trim, molding, fixture placement", ar: "لمسات تشطيب عامة — حواف وكرانيش وأماكن التجهيزات" },
      ],
    },
    process: {
      title: { en: "How It Works", ar: "كيف تسير الخدمة" },
      steps: [
        { title: { en: "1. Assessment", ar: "١. المعاينة" }, description: { en: "Book online or message us — a technician assesses the space and desired outcome.", ar: "احجز أونلاين أو راسلنا — يقوم الفني بمعاينة المساحة والنتيجة المطلوبة." } },
        { title: { en: "2. Plan", ar: "٢. الخطة" }, description: { en: "A plan is agreed with you, coordinated with any other trades involved.", ar: "يتم الاتفاق على خطة معك، بالتنسيق مع أي فرق أخرى مشاركة." } },
        { title: { en: "3. Installation", ar: "٣. التركيب" }, description: { en: "Fixtures and finishing elements are installed.", ar: "يتم تركيب التجهيزات وعناصر التشطيب." } },
        { title: { en: "4. Walkthrough", ar: "٤. الفحص النهائي" }, description: { en: "A final walkthrough together before the team leaves.", ar: "فحص نهائي معًا قبل مغادرة الفريق." } },
      ],
    },
    standardOfWork: {
      title: { en: "The Standard You Can Expect", ar: "المستوى الذي يمكنك توقعه" },
      description: {
        en: "Standard practice for mounting and fixing decorative elements safely — and any pre-existing wall or surface issue is reported to you, not concealed.",
        ar: "ممارسات معيارية لتركيب وتثبيت عناصر الديكور بأمان — وأي مشكلة موجودة مسبقًا في الحائط أو السطح يتم إبلاغك بها بدل إخفائها.",
      },
      image: {
        src: "/brand/images/services/maintenance/service-interior-decoration.webp",
        alt: { en: "AFAQ AL HAYAT technician installing a decorative fixture in a UAE home", ar: "فني آفاق الحياة يقوم بتركيب تجهيزة ديكور في منزل بالإمارات" },
      },
    },
    pricing: {
      title: { en: "What Does It Cost?", ar: "كم التكلفة؟" },
      body: {
        en: "Pricing depends on the scope and the fixtures involved — get a free, no-obligation quote after a quick chat with our team.",
        ar: "التكلفة تعتمد على نطاق العمل والتجهيزات المطلوبة — احصل على عرض سعر مجاني وبدون التزام بعد محادثة سريعة مع فريقنا.",
      },
    },
    faqs: [
      { question: { en: "Do you handle structural changes?", ar: "بتتعاملوا مع تغييرات إنشائية؟" }, answer: { en: "No, structural renovation is outside this service's scope — assessed separately if needed.", ar: "لا، الترميم الإنشائي خارج نطاق هذه الخدمة — يتم تقييمه بشكل منفصل عند الحاجة." } },
      { question: { en: "Can you coordinate with painting or wallpaper work?", ar: "بتقدروا تنسقوا مع أعمال الدهان أو ورق الحائط؟" }, answer: { en: "Yes, coordination with those trades is part of the scope when a combined finish is needed.", ar: "نعم، التنسيق مع هذه الفرق جزء من نطاق الخدمة عند الحاجة لتشطيب متكامل." } },
      { question: { en: "Do you source the decorative materials?", ar: "بتوفروا مواد الديكور؟" }, answer: { en: "Subject to company policy — discussed during the initial assessment.", ar: "يخضع ذلك لسياسة الشركة — يتم مناقشته أثناء المعاينة الأولية." } },
      { question: { en: "Do you help choose or source furniture?", ar: "بتساعدوا في اختيار أو توفير الأثاث؟" }, answer: { en: "Furniture sourcing and selection is subject to company policy and your preference — discussed during the initial assessment.", ar: "توريد واختيار الأثاث يخضع لسياسة الشركة وتفضيلك — يتم مناقشته أثناء المعاينة الأولية." } },
      { question: { en: "Can you source a specific designer or brand product I want?", ar: "بتقدروا توفروا منتج ماركة أو مصمم معين أطلبه؟" }, answer: { en: "Sourcing a specific designer or brand product is outside this service's scope — we can discuss general alternatives during the assessment.", ar: "توريد منتج ماركة أو مصمم معين خارج نطاق هذه الخدمة — يمكننا مناقشة بدائل عامة أثناء المعاينة." } },
      { question: { en: "Is it safe to mount heavy decorative pieces on my walls?", ar: "هل من الآمن تركيب قطع ديكور ثقيلة على جدراني؟" }, answer: { en: "Our technicians follow standard practice for mounting and fixing decorative elements safely, especially at height.", ar: "يتبع فنيونا ممارسات معيارية لتركيب وتثبيت عناصر الديكور بأمان، خصوصًا على ارتفاع." } },
      { question: { en: "Will I see a plan before you start any work?", ar: "هل سأرى خطة قبل بدء أي عمل؟" }, answer: { en: "Yes — the plan is agreed with you first, coordinated with any other trades involved, before installation begins.", ar: "نعم — يتم الاتفاق على الخطة معك أولاً، بالتنسيق مع أي فرق أخرى مشاركة، قبل بدء التركيب." } },
      { question: { en: "Do you serve my emirate?", ar: "هل تقدمون الخدمة في إمارتي؟" }, answer: { en: "We cover all 7 UAE emirates — Dubai, Abu Dhabi, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, and Fujairah.", ar: "نغطي جميع إمارات الدولة السبع — دبي، أبوظبي، الشارقة، عجمان، أم القيوين، رأس الخيمة، والفجيرة." } },
      { question: { en: "Can I book online without calling?", ar: "هل يمكنني الحجز أونلاين بدون اتصال؟" }, answer: { en: "Yes — use the booking form on this page, or message us on WhatsApp.", ar: "نعم — استخدم نموذج الحجز في هذه الصفحة، أو راسلنا عبر واتساب." } },
      { question: { en: "Is AFAQ AL HAYAT available for emergencies?", ar: "هل آفاق الحياة متاحة للحالات الطارئة؟" }, answer: { en: "We're available 24/7 — reach out any time and our team will confirm the earliest available visit.", ar: "نحن متاحون على مدار الساعة — تواصل معنا في أي وقت وسيؤكد فريقنا أقرب موعد متاح." } },
    ].map((faq, i) => ({ id: faqIds("interior-decoration", 10)[i], ...faq })),
    finalCta: {
      title: { en: "Give Every Room a Finished, Coordinated Look", ar: "امنح كل غرفة مظهرًا متكاملاً ومنسقًا" },
      subtitle: { en: "Book online, call, or message us on WhatsApp — our team follows up to confirm your visit.", ar: "احجز أونلاين، أو اتصل، أو راسلنا عبر واتساب — يتابع فريقنا معك لتأكيد زيارتك." },
    },
  },
];

export function getLandingPage(slug: string): LandingPageData | undefined {
  return LANDING_PAGES.find((page) => page.slug === slug);
}
