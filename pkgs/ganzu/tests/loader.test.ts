import { expect, test, describe } from "vitest";
import { g } from "../src/definition.ts";
import { loadConfig } from "../src/loader.ts";
import { FixedSource, type SourceGetResult } from "../src/source.ts";

describe("loadConfig", () => {
  test("it works", async () => {
    const Config = {
      port: g.number(),
      host: g.string().alias("hostname"),
      debug: g.boolean().default(false),
    };

    const config = await loadConfig(Config, [
      new FixedSource({ hostname: "localhost", port: 8080 }),
    ]);
    expect(config).toEqual({ host: "localhost", port: 8080, debug: false });
  });

  describe("string source handling", () => {
    class FixedStringSource<T extends Record<string, string>> extends FixedSource<T> {
      override async get(key: string): Promise<SourceGetResult> {
        const result = await super.get(key);
        if ("value" in result)
          return { ...result, value: result.value as string, needsFromString: true };
        return result;
      }
    }

    test("converts values", async () => {
      const Config = {
        port: g.number(),
        debug: g.boolean(),
      };

      const config = await loadConfig(Config, [
        new FixedStringSource({ port: "8080", debug: "true" }),
      ]);
      expect(config).toEqual({ port: 8080, debug: true });
    });

    test("handles unconvertable numbers", async () => {
      const Config = {
        port: g.number(),
      };

      await expect(() => loadConfig(Config, [new FixedStringSource({ port: "idk" })])).rejects
        .toThrowErrorMatchingInlineSnapshot(`
          [Error: Failed to load config: port: [
            {
              "code": "invalid_type",
              "expected": "number",
              "received": "string",
              "path": [
                "port"
              ],
              "message": "Expected number, received string"
            }
          ]]
        `);
    });

    test("handles unconvertable booleans", async () => {
      const Config = {
        debug: g.boolean(),
      };

      await expect(() => loadConfig(Config, [new FixedStringSource({ debug: "sort of" })])).rejects
        .toThrowErrorMatchingInlineSnapshot(`
          [Error: Failed to load config: debug: [
            {
              "code": "invalid_type",
              "expected": "boolean",
              "received": "string",
              "path": [
                "debug"
              ],
              "message": "Expected boolean, received string"
            }
          ]]
        `);
    });
  });
});
