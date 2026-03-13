/**
 * author: Claude
 * create time: 2026-03-12 17:45:00
 * last edit time: 2026-03-12 17:50:00
 * description: Client-side fetch wrapper with timeout, credentials, and typed errors.
 */

import { apiBaseUrl } from "@/shared/config/env";
import { createLogger } from "@/shared/lib/logger";
import { HttpError } from "./errors";
import type { ClientRequestOptions } from "./types";
import { extractErrorMessage, handleFetchError, parseErrorBody } from "./utils";

const log = createLogger("client-fetch");

const DEFAULT_TIMEOUT_MS = 10_000;

/**
 * Client-side fetch wrapper.
 *
 * - Resolves paths against `NEXT_PUBLIC_API_BASE_URL`
 * - AbortController timeout (default 10 s)
 * - Sends `credentials: 'include'` by default
 * - Throws `HttpError` on non-2xx, `TimeoutError` on timeout
 */
export async function clientFetch<T>(
  path: string,
  options: ClientRequestOptions = {},
): Promise<T> {
  const { timeout = DEFAULT_TIMEOUT_MS, ...init } = options;

  const url = apiBaseUrl ? `${apiBaseUrl}${path}` : path;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      credentials: "include",
      ...init,
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await parseErrorBody(response);
      const message = extractErrorMessage(
        body,
        response.status,
        response.statusText,
      );
      throw new HttpError(response.status, message, { details: body });
    }

    return (await response.json()) as T;
  } catch (error) {
    handleFetchError(error, url, timeout, log);
  } finally {
    clearTimeout(timer);
  }
}
