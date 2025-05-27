import { expect, test } from "vitest";
import { YamlSource } from "../src/index.ts";

test("it works", async () => {
  const content = "x: 5\ny: foo";
  const source = YamlSource.fromString(content);
  await expect(source.get("x")).resolves.toEqual({
    ok: true,
    found: true,
    value: 5,
    needsFromString: false,
  });
  await expect(source.get("y")).resolves.toEqual({
    ok: true,
    found: true,
    value: "foo",
    needsFromString: false,
  });
});

test("it handles missing values", async () => {
  const content = "x: 5\ny: foo";
  const source = YamlSource.fromString(content);
  await expect(source.get("z")).resolves.toEqual({ ok: true, found: false });
});

test("it errors on non-scalar values", async () => {
  const content = "list: [1, 2, 3]";
  const source = YamlSource.fromString(content);
  await expect(source.get("list")).resolves.toEqual({
    ok: false,
    error: new Error("Key 'list' found in document but is not a scalar"),
  });
});
