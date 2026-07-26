import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { NewsletterForm } from "./newsletter-form";
import { getMessages } from "@/i18n/get-messages";

const t = getMessages("en");

function successResponse(data: unknown) {
  return {
    ok: true,
    json: async () => ({ apiVersion: "v1", correlationId: "test", data }),
  };
}

describe("NewsletterForm", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows validation errors instead of submitting when fields are empty", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<NewsletterForm t={t} />);
    fireEvent.click(screen.getByRole("button", { name: t.newsletter.submit }));

    expect(screen.getByText(t.newsletter.validation.contact)).toBeInTheDocument();
    expect(screen.getByText(t.newsletter.validation.consent)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts a lead to /api/enquiries and a compliance record to /api/consents", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(successResponse({ id: "enq_1", status: "new" }))
      .mockResolvedValueOnce(successResponse({ id: "consent_1", status: "granted" }));
    vi.stubGlobal("fetch", fetchMock);

    render(<NewsletterForm t={t} />);
    fireEvent.change(screen.getByLabelText(t.newsletter.contactLabel), {
      target: { value: "jane@example.com" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: t.newsletter.submit }));

    await waitFor(() => {
      expect(screen.getByText(t.newsletter.successTitle)).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);

    const [enquiryUrl, enquiryInit] = fetchMock.mock.calls[0];
    expect(enquiryUrl).toBe("/api/enquiries");
    expect(JSON.parse(enquiryInit.body as string)).toEqual({
      customerId: "jane@example.com",
      need: "Newsletter signup",
      source: "website-newsletter-signup",
      actor: "website-visitor",
    });

    const [consentUrl, consentInit] = fetchMock.mock.calls[1];
    expect(consentUrl).toBe("/api/consents");
    const consentBody = JSON.parse(consentInit.body as string);
    expect(consentBody).toMatchObject({
      channel: "email",
      purpose: "newsletter",
      status: "granted",
      source: "website-newsletter-signup",
      evidence: t.newsletter.consentLabel,
      actor: "website-visitor",
    });
    expect(typeof consentBody.recordedAt).toBe("string");
  });

  it("detects a WhatsApp number (no @) and uses the whatsapp channel", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(successResponse({ id: "enq_1", status: "new" }))
      .mockResolvedValueOnce(successResponse({ id: "consent_1", status: "granted" }));
    vi.stubGlobal("fetch", fetchMock);

    render(<NewsletterForm t={t} />);
    fireEvent.change(screen.getByLabelText(t.newsletter.contactLabel), {
      target: { value: "050 000 0000" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: t.newsletter.submit }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    const consentBody = JSON.parse(fetchMock.mock.calls[1][1].body as string);
    expect(consentBody.channel).toBe("whatsapp");
  });

  it("shows the API error message when either request is rejected", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(successResponse({ id: "enq_1", status: "new" }))
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          apiVersion: "v1",
          correlationId: "test",
          error: { code: "validation_error", message: "purpose is required", retryable: false },
        }),
      });
    vi.stubGlobal("fetch", fetchMock);

    render(<NewsletterForm t={t} />);
    fireEvent.change(screen.getByLabelText(t.newsletter.contactLabel), {
      target: { value: "jane@example.com" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: t.newsletter.submit }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("purpose is required");
    });
  });
});
