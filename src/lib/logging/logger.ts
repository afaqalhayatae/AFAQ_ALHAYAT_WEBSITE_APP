/**
 * Structured server-side logging (Production Readiness pass, 2026-08-04).
 *
 * Real gap this closes: every API route's catch-all fallback previously
 * treated any unrecognized error (a genuine bug, a dropped DB connection,
 * anything not one of the named ServiceError subclasses) as a 400 with
 * the raw error message exposed to the client, and logged nothing. That
 * left zero trace of real failures anywhere.
 *
 * Deliberately simple: writes one structured JSON line to console.error/
 * warn/log, which Node (and Hostinger's process manager) already captures
 * — no external service, no new dependency, no cost. Wiring this output
 * into a real log aggregator / APM tool is a separate "Monitoring
 * readiness" decision (likely a new external service, Owner-gated), not
 * this file's job — this only makes sure something is actually recorded
 * server-side today.
 */

export type LogContext = Record<string, unknown>;

function serializeError(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return { errorName: error.name, errorMessage: error.message, stack: error.stack };
  }
  return { error };
}

function write(level: "error" | "warn" | "info", message: string, extra: Record<string, unknown>) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...extra,
  };
  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

/** An unexpected, unrecognized failure — something genuinely went wrong, not an expected business-rule rejection. */
export function logError(message: string, error: unknown, context?: LogContext): void {
  write("error", message, { ...serializeError(error), ...context });
}

/** Something worth noting but not a failure — degraded behavior, a fallback path taken, etc. */
export function logWarn(message: string, context?: LogContext): void {
  write("warn", message, context ?? {});
}

/** Routine operational events worth a durable trace, not tied to an error. */
export function logInfo(message: string, context?: LogContext): void {
  write("info", message, context ?? {});
}
