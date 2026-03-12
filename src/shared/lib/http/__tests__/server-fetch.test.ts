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

// Mock env and logger before importing serverFetch
vi.mock("@/shared/config/env", () => ({
  apiBaseUrl: "https://api.example.com",
  internalApiBaseUrl: "https://internal.example.com",
}));

vi.mock("@/shared/lib/logger", () => ({
  createLogger: () => ({
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  }),
}));

// Must import after mocks
const { serverFetch } = await import("../server-fetch");

const mockFetch = vi.fn() as Mock;

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("serverFetch", () => {
  it("resolves path against internalApiBaseUrl", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ price: 42 }), { status: 200 }),
    );

    const result = await serverFetch<{ price: number }>("/v1/price");
    expect(result).toEqual({ price: 42 });
    expect(mockFetch).toHaveBeenCalledWith(
      "https://internal.example.com/v1/price",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("passes next options to fetch", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({}), { status: 200 }),
    );

    await serverFetch("/data", { next: { revalidate: 60, tags: ["prices"] } });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        next: { revalidate: 60, tags: ["prices"] },
      }),
    );
  });

  it("throws HttpError on non-2xx with JSON body", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(
        JSON.stringify({ message: "Not Found", code: "NOT_FOUND" }),
        {
          status: 404,
          statusText: "Not Found",
        },
      ),
    );

    try {
      await serverFetch("/missing");
      expect.unreachable("should throw");
    } catch (err) {
      expect(err).toBeInstanceOf(HttpError);
      expect((err as HttpError).status).toBe(404);
      expect((err as HttpError).message).toBe("Not Found");
    }
  });

  it("throws HttpError with statusText when body has no message field", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response("plain text", { status: 502, statusText: "Bad Gateway" }),
    );

    try {
      await serverFetch("/bad");
      expect.unreachable("should throw");
    } catch (err) {
      expect(err).toBeInstanceOf(HttpError);
      expect((err as HttpError).message).toBe("HTTP 502 Bad Gateway");
    }
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

    const promise = serverFetch("/slow", { timeout: 100 });
    vi.advanceTimersByTime(150);

    await expect(promise).rejects.toThrow(TimeoutError);
    vi.useRealTimers();
  });
});
