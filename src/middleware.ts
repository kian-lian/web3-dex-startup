import { type NextRequest, NextResponse } from "next/server";

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

export function middleware(_request: NextRequest) {
  const response = NextResponse.next();

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
     */
    "/((?!_next/static|_next/image|favicon\\.ico|monitoring).*)",
  ],
};
