import { describe, it, expect, afterEach, vi } from "vitest";
import { apiClientManager } from "../apiClientManager-api.js";

describe("resolveLockToVersion", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    apiClientManager.disable();
  });

  describe("env fallback", () => {
    it("returns TRIGGER_VERSION when set", () => {
      vi.stubEnv("TRIGGER_VERSION", "1");
      expect(apiClientManager.resolveLockToVersion()).toBe("1");
    });

    it("returns undefined when nothing is set", () => {
      expect(apiClientManager.resolveLockToVersion()).toBeUndefined();
    });
  });

  describe("per-call override", () => {
    it("string pins to that version", () => {
      expect(apiClientManager.resolveLockToVersion("2")).toBe("2");
    });

    it("string wins over TRIGGER_VERSION", () => {
      vi.stubEnv("TRIGGER_VERSION", "1");
      expect(apiClientManager.resolveLockToVersion("2")).toBe("2");
    });

    it("null unpins, ignoring TRIGGER_VERSION", () => {
      vi.stubEnv("TRIGGER_VERSION", "1");
      expect(apiClientManager.resolveLockToVersion(null)).toBeUndefined();
    });

    it("string wins over scoped string", async () => {
      await apiClientManager.runWithConfig({ version: "2" }, async () => {
        expect(apiClientManager.resolveLockToVersion("3")).toBe("3");
      });
    });

    it("null wins over scoped string", async () => {
      await apiClientManager.runWithConfig({ version: "2" }, async () => {
        expect(apiClientManager.resolveLockToVersion(null)).toBeUndefined();
      });
    });

    it("string wins over scoped null", async () => {
      await apiClientManager.runWithConfig({ version: null }, async () => {
        expect(apiClientManager.resolveLockToVersion("3")).toBe("3");
      });
    });
  });

  describe("scoped override", () => {
    it("string pins, ignoring TRIGGER_VERSION", async () => {
      vi.stubEnv("TRIGGER_VERSION", "1");

      await apiClientManager.runWithConfig({ version: "2" }, async () => {
        expect(apiClientManager.resolveLockToVersion()).toBe("2");
      });
    });

    it("null unpins, ignoring TRIGGER_VERSION", async () => {
      vi.stubEnv("TRIGGER_VERSION", "1");

      await apiClientManager.runWithConfig({ version: null }, async () => {
        expect(apiClientManager.resolveLockToVersion()).toBeUndefined();
      });
    });

    it("undefined falls through to env", async () => {
      vi.stubEnv("TRIGGER_VERSION", "1");

      await apiClientManager.runWithConfig({ version: undefined }, async () => {
        expect(apiClientManager.resolveLockToVersion()).toBe("1");
      });
    });

    it("absent key falls through to env", async () => {
      vi.stubEnv("TRIGGER_VERSION", "1");

      await apiClientManager.runWithConfig({ accessToken: "tr_test" }, async () => {
        expect(apiClientManager.resolveLockToVersion()).toBe("1");
      });
    });
  });
});
