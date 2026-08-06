/**
 * Chat file/photo upload — lets a customer attach evidence (a leak, pest
 * damage, the unit that needs servicing) to their chat session. Stored on
 * local disk under public/uploads/chat/, not a new cloud storage service —
 * the simplest option that needs no new paid dependency or credential.
 * Caveat: this assumes the production host persists local disk writes
 * across deploys/restarts; Hostinger's exact deployment mechanism is still
 * unverified (11_TECHNICAL/DEPLOYMENT_AND_MONITORING.md) — revisit with
 * real cloud storage (S3-compatible) if that assumption turns out false.
 *
 * The bot never inspects file contents — uploads exist purely as evidence
 * attached to the eventual Enquiry/QuoteRequest for the human team to
 * review (src/lib/chat/tools.ts), matching the "escalate for owner
 * review" pattern the rest of the chatbot already follows
 * (09_AI_KNOWLEDGE/ANSWER_POLICY.md).
 */
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import type { ApiEnvelope, ApiErrorBody } from "@/types/api";
import { appendAttachment } from "@/lib/chat/session";

export const runtime = "nodejs";

const API_VERSION = "v1";
const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "application/pdf",
]);
const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads", "chat");

function envelope<T>(data: T): ApiEnvelope<T> {
  return { apiVersion: API_VERSION, correlationId: crypto.randomUUID(), data };
}

function errorResponse(status: number, code: string, message: string, retryable = false) {
  const body: ApiErrorBody = {
    apiVersion: API_VERSION,
    correlationId: crypto.randomUUID(),
    error: { code, message, retryable },
  };
  return NextResponse.json(body, { status });
}

/** Strips path separators and anything but safe filename characters —
 *  the original name is only used for the stored suffix, never trusted
 *  as a path on its own. */
function sanitizeFilename(name: string): string {
  const base = name.replace(/[/\\]/g, "_").replace(/[^a-zA-Z0-9._-]/g, "_");
  return base.slice(-100) || "file";
}

/** sessionId comes from the client (crypto.randomUUID() in chat-widget.tsx)
 *  and becomes a directory segment — validate it's actually a UUID so it
 *  can never be used to escape the upload root. */
function isValidSessionId(value: string): boolean {
  return /^[a-zA-Z0-9-]{1,100}$/.test(value);
}

export async function POST(request: NextRequest) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return errorResponse(400, "invalid_form_data", "Request body must be multipart/form-data");
  }

  const sessionId = formData.get("sessionId");
  const file = formData.get("file");

  if (typeof sessionId !== "string" || !isValidSessionId(sessionId)) {
    return errorResponse(400, "validation_error", "sessionId is required and must be a valid session id");
  }
  if (!(file instanceof File)) {
    return errorResponse(400, "validation_error", "file is required");
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return errorResponse(415, "unsupported_type", "Only images and PDF files are accepted");
  }
  if (file.size > MAX_FILE_BYTES) {
    return errorResponse(413, "file_too_large", "File must be 8MB or smaller");
  }
  if (file.size === 0) {
    return errorResponse(400, "empty_file", "File is empty");
  }

  const dir = path.join(UPLOAD_ROOT, sessionId);
  await mkdir(dir, { recursive: true });

  const safeName = sanitizeFilename(file.name || "upload");
  const storedName = `${randomUUID()}-${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, storedName), buffer);

  const url = `/uploads/chat/${sessionId}/${storedName}`;
  appendAttachment(sessionId, url);

  return NextResponse.json(envelope({ url, name: file.name, size: file.size, contentType: file.type }));
}

export async function GET() {
  return errorResponse(405, "method_not_allowed", "Use POST with multipart/form-data: sessionId, file");
}
