import { test, expectTypeOf, describe } from "vitest";
import type { ConfigDefinition } from "../src/definition.ts";
import { g } from "../src/definition.ts";
import { loadConfig } from "../src/loader.ts";
import type { Infer } from "../src/index.ts";

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
      x: g.string(),
      y: g.number(),
    };

    const config = loadConfig(Config, []);
    expectTypeOf(config).toEqualTypeOf<{ x: string; y: number }>();
    expectTypeOf(config.x).toEqualTypeOf<string>();
    expectTypeOf(config.y).toEqualTypeOf<number>();
  });

  test("optional fields are marked as nullable", () => {
    const Config = {
      x: g.string().optional(),
      y: g.number().optional(),
    };

    const config = loadConfig(Config, []);
    expectTypeOf(config).toEqualTypeOf<{ x: string | null; y: number | null }>();
    expectTypeOf(config.x).toEqualTypeOf<string | null>();
    expectTypeOf(config.y).toEqualTypeOf<number | null>();
  });

});

describe("Infer", () => {
  test("returns the type of the configuration", () => {
    const Config = {
      x: g.string(),
      y: g.number(),
    };

    type Config = Infer<typeof Config>;
    expectTypeOf<Config>().toEqualTypeOf<{ x: string; y: number }>();
  });
});
