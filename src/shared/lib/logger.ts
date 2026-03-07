import pino from "pino";
import { createSentryStream } from "./logger-sentry-stream";

const level = process.env.LOG_LEVEL ?? "info";

function createRootLogger(): pino.Logger {
  if (process.env.NODE_ENV !== "production") {
    return pino({
      level,
      transport: {
        target: "pino-pretty",
      },
    });
  }

  const sentryStream = createSentryStream();

  return pino(
    { level },
    pino.multistream([
      { stream: process.stdout },
      { stream: sentryStream, level: "error" },
    ]),
  );
}

/** Root logger singleton. Use `createLogger(module)` for module-scoped loggers. */
export const logger = createRootLogger();

/** Create a child logger with a `module` field for easy filtering. */
export function createLogger(module: string): pino.Logger {
  return logger.child({ module });
}
