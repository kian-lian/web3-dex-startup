/**
 * author: Claude
 * create time: 2026-03-12 17:45:00
 * last edit time: 2026-03-12 17:45:00
 * description: Typed HTTP error classes for the fetch wrapper layer.
 */

/**
 * Represents a non-2xx HTTP response.
 */
export class HttpError extends Error {
  readonly status: number;
  readonly code: string | undefined;
  readonly details: unknown;

  constructor(
    status: number,
    message: string,
    options?: { code?: string; details?: unknown },
  ) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.code = options?.code;
    this.details = options?.details;
  }
}

/**
 * Represents a request that exceeded the configured timeout.
 */
export class TimeoutError extends HttpError {
  constructor(url: string, timeoutMs: number) {
    super(408, `Request to ${url} timed out after ${timeoutMs}ms`);
    this.name = "TimeoutError";
  }
}
