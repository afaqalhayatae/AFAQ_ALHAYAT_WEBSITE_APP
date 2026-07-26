import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EnquiryForm } from "./enquiry-form";
import { getMessages } from "@/i18n/get-messages";

const t = getMessages("en");

function fillForm() {
  fireEvent.change(screen.getByLabelText(t.contact.form.nameLabel), {
    target: { value: "Jane Doe" },
  });
  fireEvent.change(screen.getByLabelText(t.contact.form.contactLabel), {
    target: { value: "050 000 0000" },
  });
  fireEvent.change(screen.getByLabelText(t.contact.form.messageLabel), {
    target: { value: "My AC is not cooling." },
  });
}

describe("EnquiryForm", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows validation errors instead of submitting when fields are empty", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<EnquiryForm t={t} />);
    fireEvent.click(screen.getByRole("button", { name: t.contact.form.submit }));

    expect(screen.getByText(t.contact.form.validation.name)).toBeInTheDocument();
    expect(screen.getByText(t.contact.form.validation.contact)).toBeInTheDocument();
    expect(screen.getByText(t.contact.form.validation.message)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts to /api/enquiries and shows a success message", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        apiVersion: "v1",
        correlationId: "test",
        data: { id: "enq_1", status: "new" },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<EnquiryForm t={t} source="test-source" />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: t.contact.form.submit }));

    await waitFor(() => {
      expect(screen.getByText(t.contact.form.successTitle)).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/enquiries",
      expect.objectContaining({ method: "POST" })
    );
    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body as string);
    expect(body).toEqual({
      customerId: "050 000 0000",
      need: "Jane Doe: My AC is not cooling.",
      source: "test-source",
      actor: "website-visitor",
    });
  });

  it("shows the API error message when the request is rejected", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        apiVersion: "v1",
        correlationId: "test",
        error: { code: "validation_error", message: "need is required", retryable: false },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<EnquiryForm t={t} />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: t.contact.form.submit }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("need is required");
    });
  });
});
