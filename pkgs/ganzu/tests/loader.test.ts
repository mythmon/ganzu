import { expect, test, describe } from "vitest";
import { g } from "../src/definition.ts";
import { loadConfig } from "../src/loader.ts";
import { FixedSource, type SourceGetResult } from "../src/source.ts";

describe("loadConfig", () => {
  test("it works", () => {
    const Config = {
      port: g.number(),
      host: g.string().alias("hostname"),
      debug: g.boolean().default(false),
    };

    const config = loadConfig(Config, [
      new FixedSource({ hostname: "localhost", port: 8080 }),
    ]);
    expect(config).toEqual({ host: "localhost", port: 8080, debug: false });
  });

  describe("string source handling", () => {
    class FixedStringSource<T extends Record<string, string>> extends FixedSource<T> {
      constructor(values: T) {
        super(values);
      }

      override get(key: string): SourceGetResult {
        const result = super.get(key);
        if ("value" in result)
          return { ...result, value: result.value as string, needsFromString: true };
        return result;
      }
    }

    test("converts values", () => {
      const Config = {
        port: g.number(),
        debug: g.boolean(),
      };

      const config = loadConfig(Config, [
        new FixedStringSource({ port: "8080", debug: "true" }),
      ]);
      expect(config).toEqual({ port: 8080, debug: true });
    });

    test("handles unconvertable numbers", () => {
      const Config = {
        port: g.number(),
      };

      expect(() => loadConfig(Config, [
        new FixedStringSource({ port: "idk" }),
      ]))
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

    test("handles unconvertable booleans", () => {
      const Config = {
        debug: g.boolean(),
      };

      expect(() => loadConfig(Config, [
        new FixedStringSource({ debug: "sort of" }),
      ]))
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
