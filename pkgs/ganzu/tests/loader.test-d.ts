import { test, expectTypeOf, describe } from "vitest";
import type { ConfigDefinition } from "../src/definition.ts";
import { g } from "../src/definition.ts";
import { loadConfig } from "../src/loader.ts";

describe("loadConfig", () => {
  test("config type is passed through", () => {
    interface Config {
      a: number;
      b: string;
    }

    const Config: ConfigDefinition<Config> = {
      a: g.number(),
      b: g.string(),
    };

    const config = loadConfig(Config, []);
    expectTypeOf(config).toEqualTypeOf<{ a: number; b: string }>();
  });

  test("config type is inferred", () => {
    const Config = {
      a: g.string(),
      b: g.number(),
    };

    const config = loadConfig(Config, []);
    expectTypeOf(config).toEqualTypeOf<{ a: string; b: number }>();
    expectTypeOf(config.a).toEqualTypeOf<string>();
    expectTypeOf(config.b).toEqualTypeOf<number>();
  });

  test("optional fields are marked as nullable", () => {
    const Config = {
      a: g.string().optional(),
      b: g.number().optional(),
    };

    const config = loadConfig(Config, []);
    expectTypeOf(config).toEqualTypeOf<{ a: string | null; b: number | null }>();
    expectTypeOf(config.a).toEqualTypeOf<string | null>();
    expectTypeOf(config.b).toEqualTypeOf<number | null>();
  });
});
