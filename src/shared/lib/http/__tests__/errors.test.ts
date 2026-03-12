import { describe, expect, it } from "vitest";
import { HttpError, TimeoutError } from "../errors";

describe("HttpError", () => {
  it("stores status and message", () => {
    const err = new HttpError(404, "Not Found");
    expect(err.status).toBe(404);
    expect(err.message).toBe("Not Found");
    expect(err.name).toBe("HttpError");
    expect(err.code).toBeUndefined();
    expect(err.details).toBeUndefined();
  });

  it("stores optional code and details", () => {
    const details = { field: "token" };
    const err = new HttpError(422, "Validation failed", {
      code: "VALIDATION_ERROR",
      details,
    });
    expect(err.code).toBe("VALIDATION_ERROR");
    expect(err.details).toBe(details);
  });

  it("is an instance of Error", () => {
    const err = new HttpError(500, "Internal");
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(HttpError);
  });
});

describe("TimeoutError", () => {
  it("has status 408 and descriptive message", () => {
    const err = new TimeoutError("https://api.example.com/data", 5000);
    expect(err.status).toBe(408);
    expect(err.message).toContain("timed out after 5000ms");
    expect(err.name).toBe("TimeoutError");
  });

  it("is an instance of HttpError", () => {
    const err = new TimeoutError("/test", 1000);
    expect(err).toBeInstanceOf(HttpError);
    expect(err).toBeInstanceOf(Error);
  });
});
