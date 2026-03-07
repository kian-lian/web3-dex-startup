/**
 * Typed environment configuration with hybrid validation.
 *
 * - Required vars: throw at build/startup in production, warn in development
 * - Optional vars: fall back to sensible defaults
 *
 * All app code should import from here instead of reading process.env directly.
 */

const isProduction = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function requireEnv(key: string): string {
  const value = process.env[key];
  if (value) return value;

  const message = `Missing required environment variable: ${key}`;
  if (isProduction) {
    throw new Error(message);
  }
  console.warn(`⚠️ ${message}`);
  return "";
}

function optionalEnv(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

function optionalNumber(key: string, fallback: number): number {
  const raw = process.env[key];
  if (raw === undefined) return fallback;
  const parsed = Number(raw);
  if (Number.isNaN(parsed)) {
    console.warn(
      `⚠️ ${key} is not a valid number ("${raw}"), using default ${fallback}`,
    );
    return fallback;
  }
  return parsed;
}

function optionalBoolean(key: string, fallback: boolean): boolean {
  const raw = process.env[key];
  if (raw === undefined) return fallback;
  return raw === "true" || raw === "1";
}

// ---------------------------------------------------------------------------
// Public config — build-time required
// ---------------------------------------------------------------------------

/** WalletConnect Cloud project ID. Required in production. */
export const walletConnectProjectId = requireEnv(
  "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID",
);

// ---------------------------------------------------------------------------
// Public config — runtime with defaults
// ---------------------------------------------------------------------------

export const appName = optionalEnv("NEXT_PUBLIC_APP_NAME", "Web3 DEX");

export const enableTestnets = optionalBoolean(
  "NEXT_PUBLIC_ENABLE_TESTNETS",
  false,
);

export const defaultChainId = optionalNumber("NEXT_PUBLIC_DEFAULT_CHAIN_ID", 1);

// ---------------------------------------------------------------------------
// Sentry
// ---------------------------------------------------------------------------

export const sentry = {
  dsn: optionalEnv("NEXT_PUBLIC_SENTRY_DSN", ""),
  environment: optionalEnv(
    "NEXT_PUBLIC_SENTRY_ENVIRONMENT",
    isProduction ? "production" : isTest ? "test" : "development",
  ),
  tracesSampleRate: optionalNumber(
    "NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE",
    isProduction ? 0.2 : 0,
  ),
  replaysSessionSampleRate: optionalNumber(
    "NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE",
    isProduction ? 0.1 : 0,
  ),
  replaysErrorSampleRate: optionalNumber(
    "NEXT_PUBLIC_SENTRY_REPLAYS_ERROR_SAMPLE_RATE",
    isProduction ? 1.0 : 0,
  ),
} as const;
