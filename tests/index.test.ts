import { expect, test, describe } from "vitest";
import { g } from "../src/definition.ts";
import { loadConfig } from "../src/loader.ts";
import { FixedSource } from "../src/source/fixed.ts";

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
});
