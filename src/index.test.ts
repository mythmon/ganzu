import { expect, test } from "vitest";
import { g, loadConfig, EnvSource } from "./index.ts";

test("driving", () => {
  const Config1 = {
    port: g.number(),
  } as const;

  const Config2 = {
    ...Config1,
    host: g.string().alias("hostname"),
  } as const;

  let config = loadConfig(Config2, [
    new EnvSource({ env: { HOSTNAME: "localhost", PORT: "8080" } })
  ]);
  expect(config).toEqual({ host: "localhost", port: 8080 });
});
