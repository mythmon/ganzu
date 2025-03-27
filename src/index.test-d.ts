import { test, expectTypeOf } from "vitest";
import { g, type ConfigDefinition, loadConfig, EnvSource } from "./index.ts";

test("config type is passed through", () => {
  interface Config {
    a: number;
    b: string;
  }

  const Config: ConfigDefinition<Config> = {
    a: g.number(),
    b: g.string(),
  };

  let config = loadConfig(Config, [
    new EnvSource({ env: { a: "5", b: "10" } }),
  ]);
  expectTypeOf(config).toEqualTypeOf<{ a: number; b: string }>();
});

test("config type is inferred", () => {
  const Config = {
    x: g.string(),
    y: g.number(),
  };

  let config = loadConfig(Config, [new EnvSource({ env: { a: "1", b: "2" } })]);
  expectTypeOf(config).toEqualTypeOf<{ x: string; y: number }>();
  expectTypeOf(config.x).toEqualTypeOf<string>();
  expectTypeOf(config.y).toEqualTypeOf<number>();
});
