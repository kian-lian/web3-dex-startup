import { Writable } from "node:stream";
import * as Sentry from "@sentry/nextjs";

/**
 * Custom Writable stream that forwards Pino error/fatal logs to Sentry.
 *
 * Pino writes one JSON object per line. This stream parses each line and,
 * when `level >= 50` (error or fatal), reports to Sentry using the
 * already-initialized `@sentry/nextjs` instance.
 */
export function createSentryStream(): Writable {
  return new Writable({
    write(chunk: Buffer, _encoding: BufferEncoding, callback: () => void) {
      try {
        const log = JSON.parse(chunk.toString()) as Record<string, unknown>;
        const level = log.level as number | undefined;

        if (level !== undefined && level >= 50) {
          forwardToSentry(log);
        }
      } catch {
        // Non-JSON chunk — skip silently (pino should always produce JSON,
        // but we don't want the stream to break the application).
      }

      callback();
    },
  });
}

/** Pino internal fields that should not be forwarded as Sentry extras. */
const PINO_INTERNAL_KEYS = new Set([
  "level",
  "time",
  "pid",
  "hostname",
  "msg",
  "err",
]);

function forwardToSentry(log: Record<string, unknown>): void {
  const { msg, err, level } = log;
  const extras: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(log)) {
    if (!PINO_INTERNAL_KEYS.has(key)) {
      extras[key] = value;
    }
  }

  const sentryLevel = (level as number) >= 60 ? "fatal" : "error";

  if (err && typeof err === "object" && "message" in err) {
    const error = new Error((err as { message: string }).message);
    if ("stack" in err) {
      error.stack = (err as { stack: string }).stack;
    }
    Sentry.captureException(error, {
      level: sentryLevel,
      extra: extras,
    });
  } else {
    Sentry.captureMessage(typeof msg === "string" ? msg : "Unknown error", {
      level: sentryLevel,
      extra: extras,
    });
  }
}
