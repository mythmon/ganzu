import { expect, test } from "vitest";
import { JsonSource } from "../src/index.ts";


test("it works", () => {
  const content = '{"x": 5, "y": "foo"}';
  const source = JsonSource.fromString(content);
  expect(source.get("x")).toEqual({ ok: true, found: true, value: 5, needsFromString: false });
  expect(source.get("y")).toEqual({ ok: true, found: true, value: "foo", needsFromString: false });
});

test("it handles missing values", () => {
  const content = '{"x": 5, "y": "foo"}';
  const source = JsonSource.fromString(content);
  expect(source.get("z")).toEqual({ ok: true, found: false });
});

test("it errors on non-scalar values", () => {
  const content = '{"list": [1, 2, 3]}';
  const source = JsonSource.fromString(content);
  expect(source.get("list")).toEqual({
    ok: false,
    error: new Error("Key 'list' found in document but is not a number, string, or boolean")
  });
});
