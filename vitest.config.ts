import path from "node:path";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => {
  // Load .env and .env.test (mode defaults to "test" in vitest)
  // Third arg "" loads all vars, not just VITE_-prefixed ones
  const env = loadEnv(mode, process.cwd(), "");

  return {
    test: {
      environment: "jsdom",
      setupFiles: ["./src/shared/test/setup.ts"],
      include: ["src/**/__tests__/**/*.test.{ts,tsx}"],
      css: false,
      env,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
