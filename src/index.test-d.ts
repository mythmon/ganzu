import { test, expectTypeOf, describe } from "vitest";
import { FixedSource } from "./source/fixed.ts";
import { ConfigDefinition, g } from "./definition.ts";
import { FieldDefinition } from "./field.ts";
import { loadConfig } from "./loader.ts";
import { Infer } from "./index.ts";

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

    let config = loadConfig(Config, []);
    expectTypeOf(config).toEqualTypeOf<{ a: number; b: string }>();
  });

  test("config type is inferred", () => {
    const Config = {
      x: g.string(),
      y: g.number(),
    };

    let config = loadConfig(Config, []);
    expectTypeOf(config).toEqualTypeOf<{ x: string; y: number }>();
    expectTypeOf(config.x).toEqualTypeOf<string>();
    expectTypeOf(config.y).toEqualTypeOf<number>();
  });

  test("optional fields are marked as nullable", () => {
    const Config = {
      x: g.string().optional(),
      y: g.number().optional(),
    };

    let config = loadConfig(Config, []);
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
