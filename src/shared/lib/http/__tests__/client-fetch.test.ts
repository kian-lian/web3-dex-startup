import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  vi,
} from "vitest";
import { HttpError, TimeoutError } from "../errors";

vi.mock("@/shared/config/env", () => ({
  apiBaseUrl: "https://api.example.com",
}));

vi.mock("@/shared/lib/logger", () => ({
  createLogger: () => ({
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  }),
}));

const { clientFetch } = await import("../client-fetch");

const mockFetch = vi.fn() as Mock;

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("clientFetch", () => {
  it("resolves path against apiBaseUrl", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );

    const result = await clientFetch<{ ok: boolean }>("/v1/health");
    expect(result).toEqual({ ok: true });
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com/v1/health",
      expect.objectContaining({
        credentials: "include",
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it("sends credentials include by default", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({}), { status: 200 }),
    );

    await clientFetch("/test");
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ credentials: "include" }),
    );
  });

  it("throws HttpError on non-2xx", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        statusText: "Unauthorized",
      }),
    );

    await expect(clientFetch("/protected")).rejects.toThrow(HttpError);
  });

  it("throws TimeoutError when request exceeds timeout", async () => {
    vi.useFakeTimers();

    mockFetch.mockImplementation(
      (_url: string, init: RequestInit) =>
        new Promise((_resolve, reject) => {
          init.signal?.addEventListener("abort", () =>
            reject(new DOMException("Aborted", "AbortError")),
          );
        }),
    );

    const promise = clientFetch("/slow", { timeout: 100 });
    vi.advanceTimersByTime(150);

    await expect(promise).rejects.toThrow(TimeoutError);
    vi.useRealTimers();
  });
});
