import { expect, test, describe } from "vitest";
import { EnvSource } from "../src/source.ts";

function makeDebugEnv(values: Record<string, string> = {}) {
  const log: string[] = [];
  const proxyEnv = new Proxy(values, {
    get(target, prop) {
      if (typeof prop !== "string") throw new Error("Must use strings for debugEnv");
      log.push(prop);
      return target[prop] ?? null;
    },
  });
  return { proxyEnv, log };
}

describe("EnvSource", () => {
  test("loads the original name and an upcased version of the aname", () => {
    const { proxyEnv, log } = makeDebugEnv();
    const source = new EnvSource({ env: proxyEnv });
    expect(source.get("testKey")).toEqual({ found: false, ok: true });
    expect(log).toEqual(["testKey", "TEST_KEY"]);
  });
});
