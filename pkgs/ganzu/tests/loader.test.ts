import { expect, test, describe } from "vitest";
import { g } from "../src/definition.ts";
import { loadConfig } from "../src/loader.ts";
import { FixedSource, type SourceGetResult } from "../src/source.ts";

describe("loadConfig", () => {
  test("it works", () => {
    const Config = {
      port: g.number(),
      host: g.string().alias("hostname"),
    };

    const config = loadConfig(Config, [
      new FixedSource({ hostname: "localhost", port: 8080 }),
    ]);
    expect(config).toEqual({ host: "localhost", port: 8080 });
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
      };

      const config = loadConfig(Config, [
        new FixedStringSource({ port: "8080" }),
      ]);
      expect(config).toEqual({ port: 8080 });
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
  });
});
