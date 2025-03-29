import { expect, test, describe } from "vitest";
import { FixedSource } from "./source/index.ts";
import { g, loadConfig } from "./index.ts";
import { FieldDefinition } from "./field.ts";
import { z } from "zod";

describe("FieldDefinition", () => {
  class TestFieldDefinition extends FieldDefinition {
    validator = z.any();
    fromString(string: string): unknown {
      return string;
    }
  }

  describe("loadValue", () => {
    test("should load a value from a fixed source", () => {
      const source = new FixedSource({ a: 1 });
      const field = new TestFieldDefinition();
      const value = field.loadValue("a", [source])
      expect(value).toBe(1);
    });

    test("handle aliases", () => {
      const source1 = new FixedSource({ a: 1 });
      const source2 = new FixedSource({ aButLonger: 2 });
      const field = new TestFieldDefinition().alias("aButLonger");
      expect(field.loadValue("a", [source1])).toEqual(1);
      expect(field.loadValue("a", [source2])).toEqual(2);
    });
  });
});
