import { expect, test, describe } from "vitest";
import { z, ZodError } from "zod";
import { FieldDefinition, FieldDefinitionBoolean, FieldDefinitionNumber, FieldDefinitionString } from "../src/field.ts";
import { FixedSource } from "../src/source.ts";

describe("FieldDefinition", () => {
  class TestFieldDefinition extends FieldDefinition {
    constructor() {
      super(z.any(), [], undefined, undefined);
    }
    clone(): FieldDefinition {
      const next = new TestFieldDefinition();
      next._aliases = [...this._aliases];
      next._constant = this._constant;
      next._default = this._default;
      return next;
    }
    fromString(string: string): unknown {
      return string;
    }
  }

  describe(".loadValue()", () => {
    test("should load a value from a fixed source", () => {
      const source = new FixedSource({ a: 1 });
      const field = new TestFieldDefinition();
      const value = field.loadValue("a", [source]);
      expect(value).toBe(1);
    });
  });

  describe(".alias()", () => {
    test("should work", () => {
      const source1 = new FixedSource({ a: 1 });
      const source2 = new FixedSource({ aButLonger: 2 });
      const field = new TestFieldDefinition().alias("aButLonger");
      expect(field.loadValue("a", [source1])).toEqual(1);
      expect(field.loadValue("a", [source2])).toEqual(2);
    });

    test("should return a new instance", () => {
      const field1 = new TestFieldDefinition();
      const field2 = field1.alias("alias");
      expect(field1).not.toBe(field2);
    });
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

    test("should return a new instance", () => {
      const field1 = new TestFieldDefinition();
      const field2 = field1.default(1);
      expect(field1).not.toBe(field2);
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

    test("should return a new instance", () => {
      const field1 = new TestFieldDefinition();
      const field2 = field1.constant(1);
      expect(field1).not.toBe(field2);
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

    test("should return a new instance", () => {
      const field1 = new TestFieldDefinition();
      const field2 = field1.optional();
      expect(field1).not.toBe(field2);
    });

    test("works on string fields", () => {
      const field = FieldDefinitionString.create().optional();
      const source = new FixedSource({ b: 2 });
      const value = field.loadValue("a", [source]);
      expect(value).toBe(null);
    });
  });
});

describe("FieldDefinitionString", () => {
  test("works", () => {
    const field = FieldDefinitionString.create();
    const source = new FixedSource({ a: "hello" });
    const value = field.loadValue("a", [source]);
    expect(value).toBe("hello");
  });
});

describe("FieldDefinitionNumber", () => {
  test("works", () => {
    const field = FieldDefinitionNumber.create();
    const source = new FixedSource({ a: 3 });
    const value = field.loadValue("a", [source]);
    expect(value).toBe(3);
  });
});

describe("FieldDefinitionBoolean", () => {
  test("works", () => {
    const field = FieldDefinitionBoolean.create();
    const source = new FixedSource({ a: true, b: false, c: "yo" });
    expect(field.loadValue("a", [source])).toBe(true);
    expect(field.loadValue("b", [source])).toBe(false);
    expect(() => field.loadValue("c", [source])).toThrow(ZodError);
  });
});
