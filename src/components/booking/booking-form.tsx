"use client";

import { useState, type FormEvent } from "react";
import type { Locale } from "@/i18n/config";
import type { getMessages } from "@/i18n/get-messages";
import { getServiceEntry } from "@/i18n/get-messages";
import {
  CheckCircleIcon,
  ClockIcon,
  HomeIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { ALL_EMIRATES } from "@/lib/catalog/locations";
import { trackEvent } from "@/lib/analytics/track-event";
import {
  BOOKING_CATEGORIES,
  CONTACT_METHODS,
  PEST_TYPES,
  PROPERTY_SIZES,
  PROPERTY_TYPES,
  TIME_SLOTS,
  getAreasForEmirateSlug,
  getCategoryForServiceSlug,
  getServicesForCategory,
  type BookingCategory,
  type ContactMethod,
  type PestType,
  type PropertySize,
  type PropertyType,
  type TimeSlot,
} from "@/lib/catalog/booking-options";
import {
  submitBookingRequest,
  type BookingRequestPayload,
} from "@/lib/booking/submit-booking-request";

type Messages = ReturnType<typeof getMessages>;
type Step = 0 | 1 | 2 | 3 | 4;

type FormState = {
  name: string;
  phoneLocal: string;
  whatsappLocal: string;
  whatsappSameAsPhone: boolean;
  email: string;
  contactMethod: ContactMethod | "";
  emirateSlug: string;
  areaMode: "select" | "other";
  areaSelected: string;
  areaOther: string;
  propertyType: PropertyType | "";
  propertySize: PropertySize | "";
  propertyNotes: string;
  category: BookingCategory | "";
  serviceSlug: string;
  pestType: PestType | "";
  date: string;
  timeSlot: TimeSlot | "";
  description: string;
  fileNames: string[];
};

const BASE_INITIAL_STATE: FormState = {
  name: "",
  phoneLocal: "",
  whatsappLocal: "",
  whatsappSameAsPhone: true,
  email: "",
  contactMethod: "",
  emirateSlug: "",
  areaMode: "select",
  areaSelected: "",
  areaOther: "",
  propertyType: "",
  propertySize: "",
  propertyNotes: "",
  category: "",
  serviceSlug: "",
  pestType: "",
  date: "",
  timeSlot: "",
  description: "",
  fileNames: [],
};

/**
 * Booking-prefill entry point (per the cross-site integration task):
 * a service detail page can link to `/book?service=<slug>` and this
 * pre-selects that service's category and slug. Falls back to the
 * plain empty state for an unrecognized slug — never guesses.
 *
 * `initialLocationSlug` (JOB-AGT-WEB-20260730 emirates-expansion
 * structure phase) does the same for an emirate hub page linking to
 * `/book?location=<emirate-slug>` — prefills `emirateSlug` only, since
 * the area/district field below it always requires the visitor's own
 * choice.
 */
function buildInitialState(initialServiceSlug?: string, initialLocationSlug?: string): FormState {
  const category = initialServiceSlug ? getCategoryForServiceSlug(initialServiceSlug) : undefined;
  return {
    ...BASE_INITIAL_STATE,
    ...(category ? { category, serviceSlug: initialServiceSlug! } : {}),
    ...(initialLocationSlug ? { emirateSlug: initialLocationSlug } : {}),
  };
}

const UAE_PHONE_PATTERN = /^\d{9}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Professional Booking System Foundation — clean, ready-for-backend
 * front-end architecture. Still explicitly a preview: submitting calls
 * `submitBookingRequest()` (src/lib/booking/submit-booking-request.ts),
 * which today only simulates a short delay and returns a clearly-labeled
 * preview reference — per this task's explicit "do not fake submission"
 * rule. The database/CRM/WhatsApp-API/payment-gateway integration
 * points live in that one isolated module, not scattered through this
 * component, so wiring each one up later never requires touching this
 * file's UI code.
 */
export function BookingForm({
  locale,
  t,
  initialServiceSlug,
  initialLocationSlug,
}: {
  locale: Locale;
  t: Messages;
  /** Prefill from a service detail page's "Book This Service" link (`?service=<slug>`). */
  initialServiceSlug?: string;
  /** Prefill from an emirate hub page's booking link (`?location=<emirate-slug>`). */
  initialLocationSlug?: string;
}) {
  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState<FormState>(() =>
    buildInitialState(initialServiceSlug, initialLocationSlug)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const b = t.booking;
  const areasForEmirate = getAreasForEmirateSlug(form.emirateSlug);
  const servicesForCategory = form.category ? getServicesForCategory(form.category) : [];
  const selectedServiceEntry = form.serviceSlug ? getServiceEntry(t, form.serviceSlug) : null;
  const selectedEmirate = ALL_EMIRATES.find((emirate) => emirate.slug === form.emirateSlug);
  const dayLabel = form.date
    ? new Date(`${form.date}T00:00:00`).toLocaleDateString(locale === "ar" ? "ar-AE" : "en-US", {
        weekday: "long",
      })
    : "";

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validateStep(current: Step): boolean {
    const nextErrors: Record<string, string> = {};

    // Step 0: Service Selection
    if (current === 0) {
      if (!form.category) nextErrors.category = b.service.validation.category;
      if (!form.serviceSlug) nextErrors.service = b.service.validation.service;
    }

    // Step 1: Location & Property Details
    if (current === 1) {
      if (!form.emirateSlug) nextErrors.emirate = b.location.validation.emirate;
      const area = form.areaMode === "select" ? form.areaSelected : form.areaOther;
      if (!area.trim()) nextErrors.area = b.location.validation.area;
      if (!form.propertyType) nextErrors.propertyType = b.property.validation.type;
      if (!form.propertySize) nextErrors.propertySize = b.property.validation.size;
    }

    // Step 2: Appointment & Problem Details
    if (current === 2) {
      if (!form.date) nextErrors.date = b.schedule.validation.date;
      if (!form.timeSlot) nextErrors.timeSlot = b.schedule.validation.timeSlot;
    }

    // Step 3: Customer Details
    if (current === 3) {
      if (!form.name.trim()) nextErrors.name = b.customer.validation.name;
      if (!UAE_PHONE_PATTERN.test(form.phoneLocal.trim())) nextErrors.phone = b.customer.validation.phone;
      if (!form.whatsappSameAsPhone && !UAE_PHONE_PATTERN.test(form.whatsappLocal.trim())) {
        nextErrors.whatsapp = b.customer.validation.whatsapp;
      }
      if (!EMAIL_PATTERN.test(form.email.trim())) nextErrors.email = b.customer.validation.email;
      if (!form.contactMethod) nextErrors.contactMethod = b.customer.validation.contactMethod;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function goNext() {
    if (!validateStep(step)) return;
    setStep((prev) => (prev < 4 ? ((prev + 1) as Step) : prev));
  }

  function goBack() {
    setErrors({});
    setStep((prev) => (prev > 0 ? ((prev - 1) as Step) : prev));
  }

  function buildPayload(): BookingRequestPayload {
    const area = form.areaMode === "select" ? form.areaSelected : form.areaOther;
    return {
      customer: {
        name: form.name.trim(),
        phoneE164: `+971${form.phoneLocal.trim()}`,
        whatsappE164: `+971${(form.whatsappSameAsPhone ? form.phoneLocal : form.whatsappLocal).trim()}`,
        email: form.email.trim(),
        preferredContactMethod: form.contactMethod as ContactMethod,
      },
      location: {
        emirateSlug: form.emirateSlug,
        area: area.trim(),
      },
      property: {
        type: form.propertyType as PropertyType,
        size: form.propertySize as PropertySize,
        notes: form.propertyNotes.trim(),
      },
      service: {
        category: form.category as BookingCategory,
        serviceSlug: form.serviceSlug,
        pestType: form.pestType || undefined,
      },
      appointment: {
        date: form.date,
        timeSlot: form.timeSlot as TimeSlot,
      },
      problem: {
        description: form.description.trim(),
        fileNames: form.fileNames,
      },
      locale,
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    const result = await submitBookingRequest(buildPayload());
    if (result.status === "received") {
      setReference(result.reference);
      trackEvent("booking_submit", { emirate: form.emirateSlug });
    } else {
      setSubmitError(result.message);
    }
    setSubmitting(false);
  }

  function startOver() {
    setForm(buildInitialState(initialServiceSlug, initialLocationSlug));
    setErrors({});
    setStep(0);
    setReference(null);
    setSubmitError(null);
  }

  if (reference) {
    return (
      <div
        role="status"
        className="mx-auto max-w-lg rounded-2xl border border-(--color-success) bg-(--color-surface) p-space-4"
      >
        <div className="flex items-start gap-space-2">
          <CheckCircleIcon className="h-6 w-6 shrink-0 text-(--color-success)" />
          <div>
            <p className="text-h5 font-semibold text-(--color-success)">{b.confirmation.title}</p>
            <p className="mt-space-2 text-small text-(--color-text-secondary)">{b.confirmation.body}</p>
            <p className="mt-space-3 text-small text-(--color-text-primary)">
              <span className="font-semibold">{b.confirmation.referenceLabel}:</span>{" "}
              <span dir="ltr">{reference}</span>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={startOver}
          className="mt-space-4 flex h-12 w-full items-center justify-center rounded-xl border border-(--color-border) px-space-3 text-small font-semibold text-(--color-text-primary) transition-colors hover:border-(--color-primary) hover:text-(--color-primary)"
        >
          {b.confirmation.newBookingButton}
        </button>
      </div>
    );
  }

  const stepTitles = [b.steps.service, b.steps.location, b.steps.schedule, b.steps.customer, b.steps.review];

  return (
    <div className="mx-auto max-w-2xl">
      {/* Step indicator */}
      <ol className="flex items-center gap-space-2">
        {stepTitles.map((title, index) => (
          <li key={title} className="flex flex-1 flex-col gap-space-1">
            <div
              className={`h-1.5 rounded-full ${index <= step ? "bg-(--color-primary)" : "bg-(--color-border)"}`}
              aria-hidden="true"
            />
            <span
              className={`hidden text-small tablet:block ${index === step ? "font-semibold text-(--color-primary)" : "text-(--color-text-secondary)"}`}
            >
              {title}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-space-2 text-small text-(--color-text-muted)" aria-live="polite">
        {b.stepLabel} {step + 1} {b.ofLabel} 5 — {stepTitles[step]}
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-space-4 flex flex-col gap-space-4">
        {/* Step 0: Service Selection */}
        {step === 0 ? (
          <fieldset className="flex flex-col gap-space-3">
            <legend className="text-h5 font-semibold text-(--color-text-primary)">
              {b.service.title}
            </legend>

            <div className="flex flex-col gap-space-1">
              <span className="text-small font-medium text-(--color-text-primary)">
                {b.service.categoryLabel}
              </span>
              <div className="grid gap-space-2 tablet:grid-cols-3">
                {BOOKING_CATEGORIES.map((category) => {
                  const selected = form.category === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        update("category", category);
                        update("serviceSlug", "");
                        update("pestType", "");
                      }}
                      aria-pressed={selected}
                      className={`flex h-12 items-center justify-center rounded-xl border px-space-3 text-small font-semibold transition-colors ${
                        selected
                          ? "border-(--color-primary) bg-(--color-primary)/10 text-(--color-primary)"
                          : "border-(--color-border) text-(--color-text-primary) hover:border-(--color-primary)"
                      }`}
                    >
                      {b.service.categories[category]}
                    </button>
                  );
                })}
              </div>
              {errors.category ? (
                <p role="alert" className="text-small text-(--color-danger)">
                  {errors.category}
                </p>
              ) : null}
            </div>

            {form.category ? (
              <div className="flex flex-col gap-space-1">
                <label htmlFor="booking-service" className="text-small font-medium text-(--color-text-primary)">
                  {b.service.serviceLabel}
                </label>
                <select
                  id="booking-service"
                  value={form.serviceSlug}
                  onChange={(event) => update("serviceSlug", event.target.value)}
                  className="h-12 rounded-xl border border-(--color-border) bg-(--color-surface) px-space-2 text-(--color-text-primary) focus:border-(--color-primary) focus:outline-none"
                  aria-invalid={Boolean(errors.service)}
                >
                  <option value="">{b.service.servicePlaceholder}</option>
                  {servicesForCategory.map((service) => (
                    <option key={service.slug} value={service.slug}>
                      {getServiceEntry(t, service.slug).name}
                    </option>
                  ))}
                </select>
                {errors.service ? (
                  <p role="alert" className="text-small text-(--color-danger)">
                    {errors.service}
                  </p>
                ) : null}
              </div>
            ) : null}

            {form.category === "pest-control" && form.serviceSlug ? (
              <div className="flex flex-col gap-space-1">
                <label htmlFor="booking-pest-type" className="text-small font-medium text-(--color-text-primary)">
                  {b.service.pestTypeLabel}
                </label>
                <select
                  id="booking-pest-type"
                  value={form.pestType}
                  onChange={(event) => update("pestType", event.target.value as PestType | "")}
                  className="h-12 rounded-xl border border-(--color-border) bg-(--color-surface) px-space-2 text-(--color-text-primary) focus:border-(--color-primary) focus:outline-none"
                >
                  <option value="">{b.service.pestTypePlaceholder}</option>
                  {PEST_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {b.service.pestTypes[type]}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </fieldset>
        ) : null}

        {/* Step 1: Location & Property Details */}
        {step === 1 ? (
          <>
            <fieldset className="flex flex-col gap-space-3">
              <legend className="text-h5 font-semibold text-(--color-text-primary)">
                {b.location.title}
              </legend>

              <div className="flex flex-col gap-space-1">
                <label htmlFor="booking-emirate" className="text-small font-medium text-(--color-text-primary)">
                  {b.location.emirateLabel}
                </label>
                <select
                  id="booking-emirate"
                  value={form.emirateSlug}
                  onChange={(event) => {
                    update("emirateSlug", event.target.value);
                    update("areaSelected", "");
                    update("areaMode", "select");
                  }}
                  className="h-12 rounded-xl border border-(--color-border) bg-(--color-surface) px-space-2 text-(--color-text-primary) focus:border-(--color-primary) focus:outline-none"
                  aria-invalid={Boolean(errors.emirate)}
                >
                  <option value="">{b.location.emiratePlaceholder}</option>
                  {ALL_EMIRATES.map((emirate) => (
                    <option key={emirate.id} value={emirate.slug}>
                      {emirate.name[locale]}
                    </option>
                  ))}
                </select>
                {errors.emirate ? (
                  <p role="alert" className="text-small text-(--color-danger)">
                    {errors.emirate}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-space-1">
                <label htmlFor="booking-area" className="text-small font-medium text-(--color-text-primary)">
                  {b.location.areaLabel}
                </label>
                {areasForEmirate.length > 0 && form.areaMode === "select" ? (
                  <select
                    id="booking-area"
                    value={form.areaSelected}
                    onChange={(event) => {
                      if (event.target.value === "__other__") {
                        update("areaMode", "other");
                      } else {
                        update("areaSelected", event.target.value);
                      }
                    }}
                    className="h-12 rounded-xl border border-(--color-border) bg-(--color-surface) px-space-2 text-(--color-text-primary) focus:border-(--color-primary) focus:outline-none"
                    aria-invalid={Boolean(errors.area)}
                  >
                    <option value="">{b.location.areaPlaceholder}</option>
                    {areasForEmirate.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                    <option value="__other__">{b.location.areaOtherOption}</option>
                  </select>
                ) : (
                  <input
                    id="booking-area"
                    type="text"
                    value={form.areaOther}
                    onChange={(event) => update("areaOther", event.target.value)}
                    placeholder={b.location.areaFreeTextPlaceholder}
                    className="h-12 rounded-xl border border-(--color-border) px-space-2 text-(--color-text-primary) focus:border-(--color-primary) focus:outline-none"
                    aria-invalid={Boolean(errors.area)}
                  />
                )}
                {errors.area ? (
                  <p role="alert" className="text-small text-(--color-danger)">
                    {errors.area}
                  </p>
                ) : null}
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-space-3">
              <legend className="text-h5 font-semibold text-(--color-text-primary)">
                {b.property.title}
              </legend>

              <div className="grid gap-space-3 tablet:grid-cols-2">
                <div className="flex flex-col gap-space-1">
                  <label htmlFor="booking-property-type" className="text-small font-medium text-(--color-text-primary)">
                    {b.property.typeLabel}
                  </label>
                  <select
                    id="booking-property-type"
                    value={form.propertyType}
                    onChange={(event) => update("propertyType", event.target.value as PropertyType | "")}
                    className="h-12 rounded-xl border border-(--color-border) bg-(--color-surface) px-space-2 text-(--color-text-primary) focus:border-(--color-primary) focus:outline-none"
                    aria-invalid={Boolean(errors.propertyType)}
                  >
                    <option value="">{b.property.typePlaceholder}</option>
                    {PROPERTY_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {b.property.types[type]}
                      </option>
                    ))}
                  </select>
                  {errors.propertyType ? (
                    <p role="alert" className="text-small text-(--color-danger)">
                      {errors.propertyType}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-space-1">
                  <label htmlFor="booking-property-size" className="text-small font-medium text-(--color-text-primary)">
                    {b.property.sizeLabel}
                  </label>
                  <select
                    id="booking-property-size"
                    value={form.propertySize}
                    onChange={(event) => update("propertySize", event.target.value as PropertySize | "")}
                    className="h-12 rounded-xl border border-(--color-border) bg-(--color-surface) px-space-2 text-(--color-text-primary) focus:border-(--color-primary) focus:outline-none"
                    aria-invalid={Boolean(errors.propertySize)}
                  >
                    <option value="">{b.property.sizePlaceholder}</option>
                    {PROPERTY_SIZES.map((size) => (
                      <option key={size} value={size}>
                        {b.property.sizes[size]}
                      </option>
                    ))}
                  </select>
                  {errors.propertySize ? (
                    <p role="alert" className="text-small text-(--color-danger)">
                      {errors.propertySize}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col gap-space-1">
                <label htmlFor="booking-property-notes" className="text-small font-medium text-(--color-text-primary)">
                  {b.property.notesLabel}
                </label>
                <textarea
                  id="booking-property-notes"
                  rows={3}
                  value={form.propertyNotes}
                  onChange={(event) => update("propertyNotes", event.target.value)}
                  placeholder={b.property.notesPlaceholder}
                  className="rounded-xl border border-(--color-border) px-space-2 py-space-2 text-(--color-text-primary) focus:border-(--color-primary) focus:outline-none"
                />
              </div>
            </fieldset>
          </>
        ) : null}

        {/* Step 2: Appointment & Problem Details */}
        {step === 2 ? (
          <>
            <fieldset className="flex flex-col gap-space-3">
              <legend className="text-h5 font-semibold text-(--color-text-primary)">
                {b.schedule.title}
              </legend>

              <div className="grid gap-space-3 tablet:grid-cols-2">
                <div className="flex flex-col gap-space-1">
                  <label htmlFor="booking-date" className="text-small font-medium text-(--color-text-primary)">
                    {b.schedule.dateLabel}
                  </label>
                  <input
                    id="booking-date"
                    type="date"
                    min={todayIsoDate()}
                    value={form.date}
                    onChange={(event) => update("date", event.target.value)}
                    className="h-12 rounded-xl border border-(--color-border) px-space-2 text-(--color-text-primary) focus:border-(--color-primary) focus:outline-none"
                    aria-invalid={Boolean(errors.date)}
                  />
                  {errors.date ? (
                    <p role="alert" className="text-small text-(--color-danger)">
                      {errors.date}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-space-1">
                  <span className="text-small font-medium text-(--color-text-primary)">
                    {b.schedule.dayLabel}
                  </span>
                  <div className="flex h-12 items-center rounded-xl border border-(--color-border) bg-(--color-surface-secondary) px-space-2 text-(--color-text-secondary)">
                    {dayLabel || "—"}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-space-1">
                <span className="text-small font-medium text-(--color-text-primary)">
                  {b.schedule.timeSlotLabel}
                </span>
                <div className="grid gap-space-2 tablet:grid-cols-3">
                  {TIME_SLOTS.map((slot) => {
                    const selected = form.timeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => update("timeSlot", slot)}
                        aria-pressed={selected}
                        className={`flex h-12 items-center justify-center gap-space-1 rounded-xl border px-space-3 text-small font-semibold transition-colors ${
                          selected
                            ? "border-(--color-primary) bg-(--color-primary)/10 text-(--color-primary)"
                            : "border-(--color-border) text-(--color-text-primary) hover:border-(--color-primary)"
                        }`}
                      >
                        <ClockIcon className="h-4 w-4" />
                        {b.schedule.timeSlots[slot]}
                      </button>
                    );
                  })}
                </div>
                {errors.timeSlot ? (
                  <p role="alert" className="text-small text-(--color-danger)">
                    {errors.timeSlot}
                  </p>
                ) : null}
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-space-3">
              <legend className="text-h5 font-semibold text-(--color-text-primary)">
                {b.details.title}
              </legend>

              <div className="flex flex-col gap-space-1">
                <label
                  htmlFor="booking-description"
                  className="text-small font-medium text-(--color-text-primary)"
                >
                  {b.details.descriptionLabel}
                </label>
                <textarea
                  id="booking-description"
                  rows={4}
                  value={form.description}
                  onChange={(event) => update("description", event.target.value)}
                  placeholder={b.details.descriptionPlaceholder}
                  className="rounded-xl border border-(--color-border) px-space-2 py-space-2 text-(--color-text-primary) focus:border-(--color-primary) focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-space-1">
                <label htmlFor="booking-upload" className="text-small font-medium text-(--color-text-primary)">
                  {b.details.uploadLabel}
                </label>
                <input
                  id="booking-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) =>
                    update("fileNames", Array.from(event.target.files ?? []).map((file) => file.name))
                  }
                  className="text-small text-(--color-text-secondary) file:me-space-2 file:h-10 file:rounded-xl file:border file:border-(--color-border) file:bg-(--color-surface) file:px-space-3 file:text-small file:font-semibold file:text-(--color-text-primary)"
                />
                <p className="text-small text-(--color-text-muted)">{b.details.uploadHint}</p>
                {form.fileNames.length > 0 ? (
                  <p className="text-small text-(--color-text-secondary)">
                    {b.details.filesSelectedPrefix} {form.fileNames.join(", ")}
                  </p>
                ) : null}
              </div>
            </fieldset>
          </>
        ) : null}

        {/* Step 3: Customer Details */}
        {step === 3 ? (
          <fieldset className="flex flex-col gap-space-3">
            <legend className="text-h5 font-semibold text-(--color-text-primary)">
              {b.customer.title}
            </legend>

            <div className="flex flex-col gap-space-1">
              <label htmlFor="booking-name" className="text-small font-medium text-(--color-text-primary)">
                {b.customer.nameLabel}
              </label>
              <input
                id="booking-name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                placeholder={b.customer.namePlaceholder}
                className="h-12 rounded-xl border border-(--color-border) px-space-2 text-(--color-text-primary) focus:border-(--color-primary) focus:outline-none"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "booking-name-error" : undefined}
              />
              {errors.name ? (
                <p id="booking-name-error" role="alert" className="text-small text-(--color-danger)">
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-space-1">
              <label htmlFor="booking-phone" className="text-small font-medium text-(--color-text-primary)">
                {b.customer.phoneLabel}
              </label>
              <div className="flex" dir="ltr">
                <span className="flex h-12 items-center rounded-s-xl border border-e-0 border-(--color-border) bg-(--color-surface-secondary) px-space-2 text-(--color-text-secondary)">
                  +971
                </span>
                <input
                  id="booking-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  value={form.phoneLocal}
                  onChange={(event) => update("phoneLocal", event.target.value.replace(/\D/g, ""))}
                  placeholder={b.customer.phonePlaceholder}
                  className="h-12 w-full rounded-e-xl border border-(--color-border) px-space-2 text-(--color-text-primary) focus:border-(--color-primary) focus:outline-none"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "booking-phone-error" : undefined}
                />
              </div>
              {errors.phone ? (
                <p id="booking-phone-error" role="alert" className="text-small text-(--color-danger)">
                  {errors.phone}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-space-1">
              <div className="flex items-center justify-between gap-space-2">
                <label htmlFor="booking-whatsapp" className="text-small font-medium text-(--color-text-primary)">
                  {b.customer.whatsappLabel}
                </label>
                <label className="flex items-center gap-space-1 text-small text-(--color-text-secondary)">
                  <input
                    type="checkbox"
                    checked={form.whatsappSameAsPhone}
                    onChange={(event) => update("whatsappSameAsPhone", event.target.checked)}
                  />
                  {b.customer.whatsappSameAsPhoneLabel}
                </label>
              </div>
              {!form.whatsappSameAsPhone ? (
                <div className="flex" dir="ltr">
                  <span className="flex h-12 items-center rounded-s-xl border border-e-0 border-(--color-border) bg-(--color-surface-secondary) px-space-2 text-(--color-text-secondary)">
                    +971
                  </span>
                  <input
                    id="booking-whatsapp"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={form.whatsappLocal}
                    onChange={(event) => update("whatsappLocal", event.target.value.replace(/\D/g, ""))}
                    placeholder={b.customer.phonePlaceholder}
                    className="h-12 w-full rounded-e-xl border border-(--color-border) px-space-2 text-(--color-text-primary) focus:border-(--color-primary) focus:outline-none"
                    aria-invalid={Boolean(errors.whatsapp)}
                  />
                </div>
              ) : null}
              {errors.whatsapp ? (
                <p role="alert" className="text-small text-(--color-danger)">
                  {errors.whatsapp}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-space-1">
              <label htmlFor="booking-email" className="text-small font-medium text-(--color-text-primary)">
                {b.customer.emailLabel}
              </label>
              <input
                id="booking-email"
                type="email"
                dir="ltr"
                autoComplete="email"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
                placeholder={b.customer.emailPlaceholder}
                className="h-12 rounded-xl border border-(--color-border) px-space-2 text-(--color-text-primary) focus:border-(--color-primary) focus:outline-none"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "booking-email-error" : undefined}
              />
              {errors.email ? (
                <p id="booking-email-error" role="alert" className="text-small text-(--color-danger)">
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-space-1">
              <span className="text-small font-medium text-(--color-text-primary)">
                {b.customer.contactMethodLabel}
              </span>
              <div className="grid gap-space-2 tablet:grid-cols-3">
                {CONTACT_METHODS.map((method) => {
                  const MethodIcon =
                    method === "whatsapp" ? WhatsAppIcon : method === "phone" ? PhoneIcon : MailIcon;
                  const selected = form.contactMethod === method;
                  return (
                    <button
                      key={method}
                      type="button"
                      onClick={() => update("contactMethod", method)}
                      aria-pressed={selected}
                      className={`flex h-12 items-center justify-center gap-space-1 rounded-xl border px-space-3 text-small font-semibold transition-colors ${
                        selected
                          ? "border-(--color-primary) bg-(--color-primary)/10 text-(--color-primary)"
                          : "border-(--color-border) text-(--color-text-primary) hover:border-(--color-primary)"
                      }`}
                    >
                      <MethodIcon className="h-5 w-5" />
                      {b.customer.contactMethods[method]}
                    </button>
                  );
                })}
              </div>
              {errors.contactMethod ? (
                <p role="alert" className="text-small text-(--color-danger)">
                  {errors.contactMethod}
                </p>
              ) : null}
            </div>
          </fieldset>
        ) : null}

        {/* Step 4: Summary & Submit */}
        {step === 4 ? (
          <div className="flex flex-col gap-space-3">
            <h2 className="text-h5 font-semibold text-(--color-text-primary)">{b.summary.title}</h2>
            <p className="text-small text-(--color-text-secondary)">{b.summary.subtitle}</p>

            <dl className="flex flex-col gap-space-2 rounded-2xl border border-(--color-border) p-space-4">
              <div className="flex items-start gap-space-2">
                <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-(--color-primary)" />
                <div>
                  <dt className="text-small text-(--color-text-muted)">{b.summary.serviceLabel}</dt>
                  <dd className="text-small text-(--color-text-primary)">
                    {selectedServiceEntry?.name}
                    {form.pestType ? ` — ${b.service.pestTypes[form.pestType]}` : ""}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-space-2">
                <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-(--color-primary)" />
                <div>
                  <dt className="text-small text-(--color-text-muted)">{b.summary.locationLabel}</dt>
                  <dd className="text-small text-(--color-text-primary)">
                    {form.areaMode === "select" ? form.areaSelected : form.areaOther}
                    {selectedEmirate ? `, ${selectedEmirate.name[locale]}` : ""}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-space-2">
                <HomeIcon className="mt-0.5 h-5 w-5 shrink-0 text-(--color-primary)" />
                <div>
                  <dt className="text-small text-(--color-text-muted)">{b.summary.propertyLabel}</dt>
                  <dd className="text-small text-(--color-text-primary)">
                    {form.propertyType ? b.property.types[form.propertyType] : ""}
                    {form.propertySize ? ` — ${b.property.sizes[form.propertySize]}` : ""}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-space-2">
                <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-(--color-primary)" />
                <div>
                  <dt className="text-small text-(--color-text-muted)">
                    {b.summary.dateLabel} / {b.summary.timeLabel}
                  </dt>
                  <dd className="text-small text-(--color-text-primary)">
                    {form.date} ({dayLabel}) — {form.timeSlot ? b.schedule.timeSlots[form.timeSlot] : ""}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-space-2">
                <UserIcon className="mt-0.5 h-5 w-5 shrink-0 text-(--color-primary)" />
                <div>
                  <dt className="text-small text-(--color-text-muted)">{b.customer.title}</dt>
                  <dd className="text-small text-(--color-text-primary)">
                    {form.name} · <span dir="ltr">+971{form.phoneLocal}</span> ·{" "}
                    <span dir="ltr">{form.email}</span> ·{" "}
                    {form.contactMethod ? b.customer.contactMethods[form.contactMethod] : ""}
                  </dd>
                </div>
              </div>

              {form.description ? (
                <div>
                  <dt className="text-small text-(--color-text-muted)">
                    {b.details.descriptionLabel}
                  </dt>
                  <dd className="text-small text-(--color-text-primary)">{form.description}</dd>
                </div>
              ) : null}
            </dl>

            <p className="text-small text-(--color-text-muted)">{b.summary.disclaimer}</p>

            {submitError ? (
              <p role="alert" className="text-small text-(--color-danger)">
                {b.summary.errorMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="flex h-12 items-center justify-center rounded-xl bg-(--color-primary) px-space-3 text-small font-semibold text-(--color-surface) transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? b.summary.submitting : b.summary.submitButton}
            </button>
          </div>
        ) : null}

        {/* Step navigation */}
        {step < 4 ? (
          <div className="flex justify-between gap-space-2">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0}
              className="flex h-12 items-center justify-center rounded-xl border border-(--color-border) px-space-4 text-small font-semibold text-(--color-text-primary) transition-colors hover:border-(--color-primary) disabled:opacity-0"
            >
              {b.navigation.back}
            </button>
            <button
              type="button"
              onClick={goNext}
              className="flex h-12 items-center justify-center rounded-xl bg-(--color-primary) px-space-4 text-small font-semibold text-(--color-surface) transition-opacity hover:opacity-90"
            >
              {b.navigation.next}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={goBack}
            className="flex h-12 items-center justify-center self-start rounded-xl border border-(--color-border) px-space-4 text-small font-semibold text-(--color-text-primary) transition-colors hover:border-(--color-primary)"
          >
            {b.navigation.back}
          </button>
        )}
      </form>
    </div>
  );
}
