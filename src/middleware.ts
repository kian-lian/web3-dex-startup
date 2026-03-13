/**
 * author: kian-lian
 * create time: 2026-03-08 00:00:00
 * last edit time: 2026-03-13 15:05:48
 * description: Next.js middleware — composes next-intl locale detection with security headers
 */

import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/shared/i18n/routing";

const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' https://fonts.gstatic.com",
  [
    "connect-src 'self'",
    "https://*.walletconnect.com",
    "wss://*.walletconnect.com",
    "https://*.sentry.io",
    "https://*.ingest.sentry.io",
    "https://*.alchemyapi.io",
    "https://*.infura.io",
    "https://cloudflare-eth.com",
    "https://rpc.ankr.com",
  ].join(" "),
  "frame-src 'self' https://*.walletconnect.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
];

const CSP_VALUE = CSP_DIRECTIVES.join("; ");

const isDev = process.env.NODE_ENV === "development";

const SECURITY_HEADERS: ReadonlyArray<readonly [string, string]> = [
  [
    isDev ? "Content-Security-Policy-Report-Only" : "Content-Security-Policy",
    CSP_VALUE,
  ],
  ["X-Content-Type-Options", "nosniff"],
  ["X-Frame-Options", "DENY"],
  ["Referrer-Policy", "strict-origin-when-cross-origin"],
  [
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  ],
  ["Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload"],
  ["X-DNS-Prefetch-Control", "on"],
];

const intlMiddleware = createIntlMiddleware(routing);

export function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  for (const [name, value] of SECURITY_HEADERS) {
    response.headers.set(name, value);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (browser favicon)
     * - monitoring (Sentry tunnel route)
     * - api (API routes don't need locale)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|monitoring|api).*)",
  ],
};
