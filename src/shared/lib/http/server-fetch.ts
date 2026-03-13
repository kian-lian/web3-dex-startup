/**
 * author: Claude
 * create time: 2026-03-12 17:45:00
 * last edit time: 2026-03-12 17:50:00
 * description: Server-side fetch wrapper with Next.js cache support, timeout, and typed errors.
 */

import { apiBaseUrl, internalApiBaseUrl } from "@/shared/config/env";
import { createLogger } from "@/shared/lib/logger";
import { HttpError } from "./errors";
import type { ServerRequestOptions } from "./types";
import { extractErrorMessage, handleFetchError, parseErrorBody } from "./utils";

const log = createLogger("server-fetch");

const DEFAULT_TIMEOUT_MS = 10_000;

/**
 * Server-side fetch wrapper.
 *
 * - Resolves paths against `INTERNAL_API_BASE_URL` (fallback `NEXT_PUBLIC_API_BASE_URL`)
 * - Supports Next.js `cache` / `next.revalidate` / `next.tags`
 * - AbortController timeout (default 10 s)
 * - Throws `HttpError` on non-2xx, `TimeoutError` on timeout
 */
export async function serverFetch<T>(
  path: string,
  options: ServerRequestOptions = {},
): Promise<T> {
  const { timeout = DEFAULT_TIMEOUT_MS, next, ...init } = options;

  const baseUrl = internalApiBaseUrl || apiBaseUrl;
  const url = baseUrl ? `${baseUrl}${path}` : path;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      ...(next ? { next } : {}),
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
