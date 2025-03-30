import { expect, test, describe } from "vitest";
import { FieldDefinition } from "./field.ts";
import { z } from "zod";
import { FixedSource } from "./source/fixed.ts";

describe("FieldDefinition", () => {
  class TestFieldDefinition extends FieldDefinition {
    validator = z.any();
    fromString(string: string): unknown {
      return string;
    }
  }

  describe(".loadValue()", () => {
    test("should load a value from a fixed source", () => {
      const source = new FixedSource({ a: 1 });
      const field = new TestFieldDefinition();
      const value = field.loadValue("a", [source])
      expect(value).toBe(1);
    });
  });

  test(".alias()", () => {
    const source1 = new FixedSource({ a: 1 });
    const source2 = new FixedSource({ aButLonger: 2 });
    const field = new TestFieldDefinition().alias("aButLonger");
    expect(field.loadValue("a", [source1])).toEqual(1);
    expect(field.loadValue("a", [source2])).toEqual(2);
  });

  describe(".default()", () => {
    test("should use a default value if no value is provided", () => {
      const field = new TestFieldDefinition().default(1);
      const source = new FixedSource({ b: 2 });
      const value = field.loadValue("a", [source]);
      expect(value).toBe(1);
    });

    test("should use a value from a source if found", () => {
      const field = new TestFieldDefinition().default(1);
      const source = new FixedSource({ a: 3, b: 2 });
      const value = field.loadValue("a", [source]);
      expect(value).toBe(3);
    });
  });

  describe(".constant()", () => {
    test("should use the value if no value is provided", () => {
      const field = new TestFieldDefinition().constant(1);
      const source = new FixedSource({ b: 2 });
      const value = field.loadValue("a", [source]);
      expect(value).toBe(1);
    });

    test("should use the value from the field even if found in source", () => {
      const field = new TestFieldDefinition().constant(1);
      const source = new FixedSource({ a: 3, b: 2 });
      const value = field.loadValue("a", [source]);
      expect(value).toBe(1);
    });
  });

    describe(".optional()", () => {
      test("should return null if no value provided", () => {
        const field = new TestFieldDefinition().optional();
        const source = new FixedSource({ b: 2 });
        const value = field.loadValue("a", [source]);
        expect(value).toBe(null);
      });

      test("should use the value from the source if found", () => {
        const field = new TestFieldDefinition().optional();
        const source = new FixedSource({ a: 3, b: 2 });
        const value = field.loadValue("a", [source]);
        expect(value).toBe(3);
      });
    });
});
