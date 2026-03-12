/**
 * author: Claude
 * create time: 2026-03-12 17:45:00
 * last edit time: 2026-03-12 17:50:00
 * description: Shared helpers for server-fetch and client-fetch wrappers.
 */

import type pino from "pino";
import { HttpError, TimeoutError } from "./errors";

/** Try to parse the response body as JSON, falling back to text. */
export async function parseErrorBody(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return await response.text().catch(() => undefined);
  }
}

/** Extract a human-readable message from a parsed error body. */
export function extractErrorMessage(
  body: unknown,
  status: number,
  statusText: string,
): string {
  if (
    typeof body === "object" &&
    body !== null &&
    "message" in body &&
    typeof (body as Record<string, unknown>).message === "string"
  ) {
    return (body as Record<string, string>).message;
  }
  return `HTTP ${status} ${statusText}`;
}

/** Re-throw known error types with logging; wrap abort errors as TimeoutError. */
export function handleFetchError(
  error: unknown,
  url: string,
  timeout: number,
  log: pino.Logger,
): never {
  if (error instanceof HttpError) {
    log.error({ status: error.status, url }, error.message);
    throw error;
  }

  if (error instanceof DOMException && error.name === "AbortError") {
    const timeoutErr = new TimeoutError(url, timeout);
    log.error({ url, timeout }, timeoutErr.message);
    throw timeoutErr;
  }

  log.error({ url, err: error }, "Unexpected fetch error");
  throw error;
}
