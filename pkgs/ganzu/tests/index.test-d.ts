import { test, expectTypeOf, describe } from "vitest";
import { g } from "../src/definition.ts";
import type { Infer } from "../src/index.ts";

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
