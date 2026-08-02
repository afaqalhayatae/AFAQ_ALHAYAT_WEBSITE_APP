# Pest Control — Complete SEO & Asset Content

## Document Information

- **Prepared:** 2026-07-29, updated 2026-07-30 (hero section data, image alt/title fields,
  Arabic naming refinements: "مكافحة الوزغ" for Gecko Control, "مكافحة البعوض والناموس" for
  Mosquito Control)
- **Status:** Draft — content generated per Owner request to populate the sub-service data
  foundation. Not yet through this package's Evidence Gate or a dedicated linguistic review
  (the same status every other draft in `01_PEST_CONTROL/` carries — see `README.md`).
- **Data source of truth:** `src/data/SERVICE_DATABASE.json` → `services[slug=pest-control]`
  (`heroSection` + `subServices`). This document is the human-readable mirror — if the two
  ever disagree, the JSON is authoritative.
- **Scope:** data/documentation only. No UI, components, or existing architecture were created,
  modified, or renamed. No approved asset file was changed, renamed, or removed — see
  `PEST_CONTROL_ASSET_MANIFEST.md`'s "Code integration notes" for how this eventually connects
  to the frontend.
- **Language:** Arabic is the site's primary language (`defaultLocale = "ar"` in
  `src/i18n/config.ts`, unchanged). Every field below is bilingual; Arabic is listed first in
  each pair to match that priority.

## Content approach

Each entry's copy follows the same evidence-safe pattern already approved for the general Pest
Control page (`06_PAGE_CONTENT.md`): what the service is, that treatment uses safe/approved
methods, and the 7-emirate coverage already established in `SERVICE_MATRIX.md`/`SERVICE_AREAS.md`.
It deliberately avoids the claim categories flagged elsewhere in this project's governance docs
and in `IMAGE_APPROVAL_REPORT.md` — no certification claims, no unconditional safety/child/pet
assurances, no guarantees, no response-time commitments ("24/7," etc.), and no invented
statistics.

## UAE locations — a scope note

`SERVICE_AREAS.md` (the canonical geographic registry) approves coverage claims **at emirate
level only**: *"UAE-wide and emirate-level coverage may be stated using this registry... City,
district, community, neighborhood, and branch claims remain blocked."* A separate "Priority
Community Registry" in that same document lists specific communities (Downtown Dubai, Dubai
Marina, Khalifa City, Al Zahia, etc.) but explicitly as internal *"marketing priorities, not
branch addresses"* — not yet cleared for public claims. The app's own `locations.ts` mirrors
this: only emirate-level entries exist, with a note that community-level entries are
"intentionally omitted until their own review checklist clears."

So the "UAE locations" requested for each sub-service below is the 7 approved emirates — the
same `coverage` array already in `SERVICE_DATABASE.json`. If city/community-level SEO targeting
is wanted later, that requires clearing the Priority Community Registry's own review first, not
a documentation choice made here.

---

## Hero Section

| Field | Value |
|---|---|
| Filename | `HERO_PEST_CONTROL_21x9.webp` |
| Location | `public/brand/images/pest-control/HERO_PEST_CONTROL_21x9.webp` |
| Ratio / dimensions | 21:9 / 1915×821 px |
| Title (EN) | Pest Control — AFAQ AL HAYAT |
| Title (AR) | مكافحة الحشرات — آفاق الحياة |
| Alt text (EN) | AFAQ AL HAYAT pest control technician treating the exterior of a modern Dubai villa at dusk |
| Alt text (AR) | فني مكافحة حشرات من آفاق الحياة يعالج محيط فيلا حديثة في دبي عند الغسق |
| Target page | `/[locale]/services/pest-control` — hero section |
| Usage | Full-width hero banner |

**Note carried from `IMAGE_APPROVAL_REPORT.md` / `PEST_CONTROL_ASSET_MANIFEST.md`, not
re-litigated here:** this asset includes a text/claims strip (a years-in-business statistic, a
star rating, and a guarantee line). Alt text above follows standard accessibility practice by
describing the photographic content, not transcribing the marketing badges — it doesn't imply
those badges are approved claims.

---

## Service Cards — Complete Data (10 sub-services)

### 1. مكافحة القوارض / Rodent Control

| Field | Arabic | English |
|---|---|---|
| Service name | مكافحة القوارض | Rodent Control |
| Professional description | خدمة احترافية لمكافحة القوارض من آفاق الحياة — معاينة وتركيب محطات طعم وإرشادات لسد نقاط الدخول، لحماية المنازل والمنشآت في الإمارات من الفئران والجرذان. | Professional rodent control from AFAQ AL HAYAT — inspection, bait-station placement, and entry-point guidance to help protect UAE homes and businesses from mice and rats. |
| SEO title | مكافحة القوارض في الإمارات \| آفاق الحياة | Rodent Control in the UAE \| AFAQ AL HAYAT |
| Meta description | خدمة احترافية لمكافحة القوارض في جميع إمارات الدولة السبع. معاينة الموقع وتركيب محطات الطعم وإرشادات المتابعة من آفاق الحياة. تواصل معنا لحجز الموعد. | Professional rodent control across all 7 UAE emirates. Site inspection, bait-station placement, and follow-up guidance from AFAQ AL HAYAT. Contact us to schedule a visit. |
| Keywords | مكافحة القوارض الإمارات، مكافحة الفئران دبي، مكافحة الجرذان أبوظبي، شركة مكافحة قوارض، إبادة قوارض | rodent control UAE, mice control Dubai, rat control Abu Dhabi, rodent exterminator UAE, pest control rodents |
| UAE locations (emirate-level, approved) | أبوظبي، دبي، الشارقة، عجمان، أم القيوين، رأس الخيمة، الفجيرة | Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, Fujairah |
| Hashtags | #مكافحة_القوارض #مكافحة_حشرات_الإمارات #آفاق_الحياة | #RodentControl #PestControlUAE #AFAQAlHayat #MiceControl |
| Image filename | `001-rodent-control-service-card.webp` | |
| Image title | مكافحة القوارض | Rodent Control |
| Image alt | فني آفاق الحياة يضع محطة طعم للقوارض بجانب فتحة دخول فأر في مطبخ بالإمارات | AFAQ AL HAYAT technician placing a rodent bait station beside a mouse entry point in a UAE kitchen |
| Scope status | Matches approved scope item "Rodent Control" | |

### 2. مكافحة النمل / Ant Control

| Field | Arabic | English |
|---|---|---|
| Service name | مكافحة النمل | Ant Control |
| Professional description | خدمة مكافحة النمل من آفاق الحياة — معاينة مسارات النمل ومعالجة آمنة ومعتمدة للتخلص من النمل في المطابخ والمكاتب والمساحات الخارجية بالإمارات. | Targeted ant control from AFAQ AL HAYAT — trail inspection and safe, approved treatment to help clear ant activity from UAE kitchens, offices, and outdoor areas. |
| SEO title | مكافحة النمل في الإمارات \| آفاق الحياة | Ant Control in the UAE \| AFAQ AL HAYAT |
| Meta description | خدمة احترافية لمكافحة النمل في جميع إمارات الدولة السبع. معاينة مسارات النمل ومعالجة آمنة ومعتمدة من آفاق الحياة. تواصل معنا لحجز الموعد. | Professional ant control across all 7 UAE emirates. Trail inspection and safe, approved treatment from AFAQ AL HAYAT. Contact us to schedule a visit. |
| Keywords | مكافحة النمل الإمارات، مكافحة النمل دبي، علاج النمل أبوظبي، شركة مكافحة نمل، إبادة نمل | ant control UAE, ant exterminator Dubai, ant treatment Abu Dhabi, kitchen ant control, pest control ants |
| UAE locations | أبوظبي، دبي، الشارقة، عجمان، أم القيوين، رأس الخيمة، الفجيرة | Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, Fujairah |
| Hashtags | #مكافحة_النمل #مكافحة_حشرات_الإمارات #آفاق_الحياة | #AntControl #PestControlUAE #AFAQAlHayat |
| Image filename | `002-ant-control-service-card.webp` | |
| Image title | مكافحة النمل | Ant Control |
| Image alt | فني آفاق الحياة يعالج مسار نمل على جدار مطبخ في الإمارات | AFAQ AL HAYAT technician treating an ant trail along a kitchen wall in the UAE |
| Scope status | Matches approved scope item "Ant Control" | |

### 3. مكافحة النمل الأبيض / Termite Control

| Field | Arabic | English |
|---|---|---|
| Service name | مكافحة النمل الأبيض | Termite Control |
| Professional description | خدمة مكافحة النمل الأبيض من آفاق الحياة — معاينة الأخشاب والمنشآت المتضررة ومعالجة آمنة ومعتمدة، لحماية العقارات في الإمارات من أضرار النمل الأبيض. | Professional termite control from AFAQ AL HAYAT — inspection of affected timber and structures, with safe, approved treatment to help protect UAE properties from termite damage. |
| SEO title | مكافحة النمل الأبيض في الإمارات \| آفاق الحياة | Termite Control in the UAE \| AFAQ AL HAYAT |
| Meta description | خدمة احترافية لمكافحة النمل الأبيض ومعاينته في جميع إمارات الدولة السبع. معالجة آمنة ومعتمدة من آفاق الحياة. تواصل معنا لحجز الموعد. | Professional termite control and inspection across all 7 UAE emirates. Safe, approved treatment from AFAQ AL HAYAT. Contact us to schedule a visit. |
| Keywords | مكافحة النمل الأبيض الإمارات، علاج النمل الأبيض دبي، معاينة النمل الأبيض أبوظبي، شركة مكافحة النمل الأبيض | termite control UAE, termite treatment Dubai, termite inspection Abu Dhabi, white ant control, pest control termites |
| UAE locations | أبوظبي، دبي، الشارقة، عجمان، أم القيوين، رأس الخيمة، الفجيرة | Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, Fujairah |
| Hashtags | #مكافحة_النمل_الأبيض #مكافحة_حشرات_الإمارات #آفاق_الحياة | #TermiteControl #PestControlUAE #AFAQAlHayat |
| Image filename | `003-termite-control-service-card.webp` | |
| Image title | مكافحة النمل الأبيض | Termite Control |
| Image alt | فني آفاق الحياة يعالج أضرار النمل الأبيض عند حافة الجدار | AFAQ AL HAYAT technician treating termite damage at a wall baseboard |
| Scope status | Matches approved scope item "Termite Control" | |

### 4. مكافحة الصراصير / Cockroach Control

| Field | Arabic | English |
|---|---|---|
| Service name | مكافحة الصراصير | Cockroach Control |
| Professional description | خدمة مكافحة الصراصير من آفاق الحياة — معاينة ومعالجة آمنة ومعتمدة لحماية المنازل والمطاعم والمنشآت في الإمارات من الصراصير. | Professional cockroach control from AFAQ AL HAYAT — inspection and safe, approved treatment to help protect UAE homes, restaurants, and businesses from cockroach activity. |
| SEO title | مكافحة الصراصير في الإمارات \| آفاق الحياة | Cockroach Control in the UAE \| AFAQ AL HAYAT |
| Meta description | خدمة احترافية لمكافحة الصراصير في جميع إمارات الدولة السبع. معاينة ومعالجة آمنة ومعتمدة من آفاق الحياة. تواصل معنا لحجز الموعد. | Professional cockroach control across all 7 UAE emirates. Site inspection and safe, approved treatment from AFAQ AL HAYAT. Contact us to schedule a visit. |
| Keywords | مكافحة الصراصير الإمارات، مكافحة الصراصير دبي، علاج الصراصير أبوظبي، شركة مكافحة صراصير | cockroach control UAE, cockroach exterminator Dubai, roach treatment Abu Dhabi, cockroach pest control, kitchen cockroach control |
| UAE locations | أبوظبي، دبي، الشارقة، عجمان، أم القيوين، رأس الخيمة، الفجيرة | Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, Fujairah |
| Hashtags | #مكافحة_الصراصير #مكافحة_حشرات_الإمارات #آفاق_الحياة | #CockroachControl #PestControlUAE #AFAQAlHayat |
| Image filename | `004-cockroach-control-service-card.webp` | |
| Image title | مكافحة الصراصير | Cockroach Control |
| Image alt | فني آفاق الحياة يعالج صرصورًا بالقرب من قاعدة خزانة مطبخ في الإمارات | AFAQ AL HAYAT technician treating a cockroach near a kitchen cabinet base in the UAE |
| Scope status | Matches approved scope item "Cockroach Control" | |

### 5. مكافحة الثعابين / Snake Control

| Field | Arabic | English |
|---|---|---|
| Service name | مكافحة الثعابين | Snake Control |
| Professional description | خدمة الإمساك بالثعابين وإخراجها من آفاق الحياة — استجابة حذرة ومدربة عند رصد ثعبان في عقارك، باستخدام معدات الإمساك المناسبة في جميع أنحاء الإمارات. | Snake capture and removal from AFAQ AL HAYAT — a careful, trained response to a snake sighting on your property, using appropriate capture equipment across the UAE. |
| SEO title | مكافحة الثعابين وإخراجها في الإمارات \| آفاق الحياة | Snake Control & Removal in the UAE \| AFAQ AL HAYAT |
| Meta description | خدمة الإمساك بالثعابين وإخراجها في جميع إمارات الدولة السبع. استجابة مدربة من آفاق الحياة. تواصل معنا في حال رصد ثعبان في عقارك. | Snake capture and removal service across all 7 UAE emirates. Trained response from AFAQ AL HAYAT. Contact us if you spot a snake on your property. |
| Keywords | مكافحة الثعابين الإمارات، إخراج الثعابين دبي، صائد ثعابين أبوظبي، خدمة مكافحة الثعابين | snake control UAE, snake removal Dubai, snake catcher Abu Dhabi, snake control service |
| UAE locations | أبوظبي، دبي، الشارقة، عجمان، أم القيوين، رأس الخيمة، الفجيرة | Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, Fujairah |
| Hashtags | #مكافحة_الثعابين #مكافحة_حشرات_الإمارات #آفاق_الحياة | #SnakeControl #PestControlUAE #AFAQAlHayat |
| Image filename | `005-snake-control-service-card.webp` | |
| Image title | مكافحة الثعابين | Snake Control |
| Image alt | فني آفاق الحياة يمسك بأمان بثعبان داخل المنزل باستخدام ملقط إمساك وكيس احتواء | AFAQ AL HAYAT technician safely capturing a snake indoors using capture tongs and a containment bag |
| Scope status | **Not yet in `SERVICE_CATALOG.md`/`03_BOOKING_OPTIONS.md`'s approved list** — recommend a matching update there. | |

### 6. مكافحة الحمام / Pigeon Control

| Field | Arabic | English |
|---|---|---|
| Service name | مكافحة الحمام | Pigeon Control |
| Professional description | حلول ردع الحمام ومنع استيطانه من آفاق الحياة — تركيب أشواك وشباك للحفاظ على الأسطح والشرفات والحواف في الإمارات خالية من أعشاش الحمام. | Pigeon deterrent and roost-prevention solutions from AFAQ AL HAYAT — spikes and netting installation to help keep rooftops, balconies, and ledges across the UAE free of pigeon nesting. |
| SEO title | مكافحة الحمام في الإمارات \| آفاق الحياة | Pigeon Control in the UAE \| AFAQ AL HAYAT |
| Meta description | تركيب أشواك وشباك لمنع استيطان الحمام في جميع إمارات الدولة السبع. خدمة من آفاق الحياة. تواصل معنا لحجز الموعد. | Pigeon spike and netting installation across all 7 UAE emirates. Roost-prevention service from AFAQ AL HAYAT. Contact us to schedule a visit. |
| Keywords | مكافحة الحمام الإمارات، أشواك طرد الحمام دبي، شباك حماية من الحمام أبوظبي، منع استيطان الطيور | pigeon control UAE, bird spikes Dubai, pigeon netting Abu Dhabi, bird proofing UAE |
| UAE locations | أبوظبي، دبي، الشارقة، عجمان، أم القيوين، رأس الخيمة، الفجيرة | Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, Fujairah |
| Hashtags | #مكافحة_الحمام #مكافحة_الطيور_الإمارات #آفاق_الحياة | #PigeonControl #BirdControlUAE #AFAQAlHayat |
| Image filename | `006-pigeon-control-service-card.webp` | |
| Image title | مكافحة الحمام | Pigeon Control |
| Image alt | فني آفاق الحياة يركّب أشواك وشباك لمنع استيطان الحمام على حافة سطح في دبي | AFAQ AL HAYAT technician installing anti-roosting bird spikes and netting on a Dubai rooftop ledge |
| Scope status | **Not yet in `SERVICE_CATALOG.md`/`03_BOOKING_OPTIONS.md`'s approved list** — recommend a matching update there. | |

### 7. مكافحة الوزغ / Gecko Control

| Field | Arabic | English |
|---|---|---|
| Service name | مكافحة الوزغ | Gecko Control |
| Professional description | معاينة ومعالجة الوزغ (أبو بريص) من آفاق الحياة — للمساعدة في تقليل تواجده داخل المنازل والمنشآت في الإمارات باستخدام طرق آمنة ومعتمدة. | Gecko inspection and treatment from AFAQ AL HAYAT — helping reduce gecko activity indoors across UAE homes and businesses using safe, approved methods. |
| SEO title | مكافحة الوزغ في الإمارات \| آفاق الحياة | Gecko Control in the UAE \| AFAQ AL HAYAT |
| Meta description | معاينة ومعالجة احترافية للوزغ (أبو بريص) في جميع إمارات الدولة السبع. طرق آمنة ومعتمدة من آفاق الحياة. تواصل معنا لحجز الموعد. | Professional gecko inspection and treatment across all 7 UAE emirates. Safe, approved methods from AFAQ AL HAYAT. Contact us to schedule a visit. |
| Keywords | مكافحة الوزغ الإمارات، مكافحة أبو بريص دبي، التخلص من أبو بريص أبوظبي، مكافحة الوزغ الشارقة | gecko control UAE, gecko removal Dubai, house lizard control Abu Dhabi, gecko treatment UAE |
| UAE locations | أبوظبي، دبي، الشارقة، عجمان، أم القيوين، رأس الخيمة، الفجيرة | Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, Fujairah |
| Hashtags | #مكافحة_الوزغ #مكافحة_أبو_بريص #آفاق_الحياة | #GeckoControl #PestControlUAE #AFAQAlHayat |
| Image filename | `007-gecko-control-service-card.webp` | |
| Image title | مكافحة الوزغ | Gecko Control |
| Image alt | فني آفاق الحياة يفحص الجدار بمصباح يدوي لمعالجة وجود وزغ (أبو بريص) داخل المنزل | AFAQ AL HAYAT technician inspecting a wall with a flashlight to treat a gecko sighting indoors |
| Scope status | **Not yet in `SERVICE_CATALOG.md`/`03_BOOKING_OPTIONS.md`'s approved list** — recommend a matching update there. | |

*Naming note: "مكافحة الوزغ" (the standard/formal Arabic term) is now the primary name per the
2026-07-30 request, with "أبو بريص" (the common colloquial term) retained in the description and
keywords — both terms are real, commonly searched terms for the same animal, so keeping both
serves SEO without changing what's depicted.*

### 8. مكافحة الدبابير والنحل / Wasp & Bee Control

| Field | Arabic | English |
|---|---|---|
| Service name | مكافحة الدبابير والنحل | Wasp & Bee Control |
| Professional description | معالجة أعشاش الدبابير والنحل من آفاق الحياة — إزالة مدربة للأعشاش من الفلل والشرفات والمساحات الخارجية في الإمارات باستخدام معدات الحماية المناسبة. | Wasp and bee nest treatment from AFAQ AL HAYAT — trained removal of nests from villas, balconies, and outdoor spaces across the UAE using appropriate protective equipment. |
| SEO title | مكافحة الدبابير والنحل في الإمارات \| آفاق الحياة | Wasp & Bee Control in the UAE \| AFAQ AL HAYAT |
| Meta description | إزالة أعشاش الدبابير والنحل في جميع إمارات الدولة السبع. استجابة مدربة من آفاق الحياة. تواصل معنا في حال وجود عش على عقارك. | Wasp and bee nest removal across all 7 UAE emirates. Trained response from AFAQ AL HAYAT. Contact us if you find a nest on your property. |
| Keywords | مكافحة الدبابير الإمارات، إزالة النحل دبي، إزالة عش دبابير أبوظبي، خدمة مكافحة النحل | wasp control UAE, bee removal Dubai, wasp nest removal Abu Dhabi, bee control service UAE |
| UAE locations | أبوظبي، دبي، الشارقة، عجمان، أم القيوين، رأس الخيمة، الفجيرة | Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, Fujairah |
| Hashtags | #مكافحة_الدبابير #إزالة_النحل #آفاق_الحياة | #WaspControl #BeeRemoval #AFAQAlHayat |
| Image filename | `008-wasp-bee-control-service-card.webp` | |
| Image title | مكافحة الدبابير والنحل | Wasp & Bee Control |
| Image alt | فني آفاق الحياة يعالج عش دبابير أسفل سقف فيلا في الإمارات | AFAQ AL HAYAT technician treating a wasp nest under a villa roof overhang in the UAE |
| Scope status | **Not yet in `SERVICE_CATALOG.md`/`03_BOOKING_OPTIONS.md`'s approved list** — recommend a matching update there. | |

### 9. مكافحة البعوض والناموس / Mosquito Control

| Field | Arabic | English |
|---|---|---|
| Service name | مكافحة البعوض والناموس | Mosquito Control |
| Professional description | خدمة مكافحة البعوض والناموس الخارجية من آفاق الحياة — معالجة الحدائق والنباتات للمساعدة في تقليل تواجد البعوض حول الفلل والحدائق والمساحات الخارجية في الإمارات. | Outdoor mosquito control from AFAQ AL HAYAT — garden and vegetation treatment to help reduce mosquito activity around UAE villas, gardens, and outdoor living spaces. |
| SEO title | مكافحة البعوض والناموس في الإمارات \| آفاق الحياة | Mosquito Control in the UAE \| AFAQ AL HAYAT |
| Meta description | خدمة احترافية لمكافحة البعوض والناموس في الحدائق والمساحات الخارجية بجميع إمارات الدولة السبع. من آفاق الحياة. تواصل معنا لحجز الموعد. | Professional outdoor mosquito control across all 7 UAE emirates. Garden and vegetation treatment from AFAQ AL HAYAT. Contact us to schedule a visit. |
| Keywords | مكافحة البعوض الإمارات، مكافحة الناموس دبي، رش البعوض أبوظبي، علاج البعوض في الحدائق، مكافحة حشرات خارجية | mosquito control UAE, mosquito fogging Dubai, garden mosquito treatment Abu Dhabi, outdoor pest control UAE |
| UAE locations | أبوظبي، دبي، الشارقة، عجمان، أم القيوين، رأس الخيمة، الفجيرة | Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, Fujairah |
| Hashtags | #مكافحة_البعوض #مكافحة_الناموس #آفاق_الحياة | #MosquitoControl #PestControlUAE #AFAQAlHayat |
| Image filename | `009-mosquito-control-service-card.webp` | |
| Image title | مكافحة البعوض والناموس | Mosquito Control |
| Image alt | فني آفاق الحياة يرش النباتات في الحديقة لمكافحة البعوض بجانب مسبح فيلا عند الغسق | AFAQ AL HAYAT technician fogging garden vegetation for mosquito control beside a villa pool at dusk |
| Scope status | Matches approved scope item "Mosquito Control" ("البعوض" and "الناموس" are the same insect — regional synonym added for search coverage) | |

### 10. مكافحة الذباب المنزلي وتركيب المصائد الضوئية / House Fly Control & Light Trap Installation

| Field | Arabic | English |
|---|---|---|
| Service name | مكافحة الذباب المنزلي وتركيب المصائد الضوئية | House Fly Control & Light Trap Installation |
| Professional description | خدمة مكافحة الذباب المنزلي وتركيب المصائد الضوئية بالأشعة فوق البنفسجية من آفاق الحياة — للمساعدة في تقليل تواجد الذباب في المنازل والمطاعم والمطابخ التجارية بالإمارات. | House fly control and UV light-trap installation from AFAQ AL HAYAT — helping reduce fly activity in UAE homes, restaurants, and commercial kitchens. |
| SEO title | مكافحة الذباب وتركيب المصائد الضوئية في الإمارات \| آفاق الحياة | House Fly Control & Light Trap Installation in the UAE \| AFAQ AL HAYAT |
| Meta description | مكافحة الذباب المنزلي وتركيب المصائد الضوئية في جميع إمارات الدولة السبع. مناسبة للمطاعم والمطابخ التجارية. تواصل مع آفاق الحياة لحجز الموعد. | House fly control and UV light-trap installation across all 7 UAE emirates. Ideal for restaurants and commercial kitchens. Contact AFAQ AL HAYAT to schedule a visit. |
| Keywords | مكافحة الذباب الإمارات، تركيب مصيدة ضوئية دبي، مكافحة الذباب للمطاعم أبوظبي، مصيدة ذباب بالأشعة فوق البنفسجية | fly control UAE, light trap installation Dubai, restaurant fly control Abu Dhabi, UV fly trap UAE |
| UAE locations | أبوظبي، دبي، الشارقة، عجمان، أم القيوين، رأس الخيمة، الفجيرة | Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, Fujairah |
| Hashtags | #مكافحة_الذباب #مصيدة_ضوئية #آفاق_الحياة | #FlyControl #LightTrap #AFAQAlHayat |
| Image filename | `010-house-fly-control-light-trap-installation.webp` | |
| Image title | مكافحة الذباب وتركيب المصائد الضوئية | House Fly Control & Light Trap Installation |
| Image alt | فني آفاق الحياة يركّب مصيدة ضوئية للذباب بالأشعة فوق البنفسجية على جدار مطعم في الإمارات | AFAQ AL HAYAT technician installing a UV fly light trap on a restaurant wall in the UAE |
| Scope status | Matches approved scope item "Fly Control"; the light-trap method is a new detail not yet described in `06_PAGE_CONTENT.md`'s text. | |

---

## Related Documents

- `src/data/SERVICE_DATABASE.json`
- `docs/PEST_CONTROL_ASSET_MANIFEST.md`
- `docs/IMAGE_APPROVAL_REPORT.md`
- `04_SERVICE_KNOWLEDGE/SERVICE_MASTER_DATABASE.md`
- `04_SERVICE_KNOWLEDGE/01_PEST_CONTROL/06_PAGE_CONTENT.md`
- `03_MARKET/SERVICE_AREAS.md`
