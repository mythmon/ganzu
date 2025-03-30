import { expect, test, describe } from "vitest";
import { g } from "./definition";
import { loadConfig } from "./loader";
import { FixedSource } from "./source/fixed";

describe("loadConfig", () => {
  test("it works", () => {
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
