/**
 * author: Claude
 * create time: 2026-03-12 17:45:00
 * last edit time: 2026-03-12 17:45:00
 * description: Request option types for server and client fetch wrappers.
 */

/** Options for server-side fetch (supports Next.js caching directives). */
export type ServerRequestOptions = Omit<RequestInit, "signal"> & {
  /** Abort timeout in milliseconds. Default: 10_000. */
  timeout?: number;
  /** Next.js fetch extensions for ISR / on-demand revalidation. */
  next?: { revalidate?: number | false; tags?: string[] };
};

/** Options for client-side fetch. */
export type ClientRequestOptions = Omit<RequestInit, "signal"> & {
  /** Abort timeout in milliseconds. Default: 10_000. */
  timeout?: number;
};
