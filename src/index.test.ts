import { expect, test, describe } from "vitest";
import { FixedSource } from "./source/index.ts";
import { g, loadConfig } from "./index.ts";

describe("loadConfig", () => {
  test("driving", () => {
    const Config = {
      port: g.number(),
      host: g.string().alias("hostname"),
    };

    let config = loadConfig(Config, [
      new FixedSource({ hostname: "localhost", port: 8080 }),
    ]);
    expect(config).toEqual({ host: "localhost", port: 8080 });
  });
});
