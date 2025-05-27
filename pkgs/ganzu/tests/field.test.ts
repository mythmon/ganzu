import { expect, test, describe } from "vitest";
import { z, ZodError } from "zod";
import {
  FieldDefinition,
  FieldDefinitionBoolean,
  FieldDefinitionNumber,
  FieldDefinitionString,
} from "../src/field.ts";
import { FixedSource } from "../src/source.ts";
import type { TypeMap } from "../src/TypeMap.ts";

describe("FieldDefinition", () => {
  class TestFieldDefinition extends FieldDefinition {
    constructor(metadata?: TypeMap) {
      super(z.any(), metadata);
    }
    clone(): FieldDefinition {
      return new TestFieldDefinition(new Map([...this._metadata]));
    }
    fromString(string: string): unknown {
      return string;
    }
  }

  describe(".loadValue()", () => {
    test("should load a value from a fixed source", async () => {
      const source = new FixedSource({ a: 1 });
      const field = new TestFieldDefinition();
      const value = field.loadValue("a", [source]);
      await expect(value).resolves.toBe(1);
    });
  });

  describe(".alias()", () => {
    test("should work", async () => {
      const source1 = new FixedSource({ a: 1 });
      const source2 = new FixedSource({ aButLonger: 2 });
      const field = new TestFieldDefinition().alias("aButLonger");
      await expect(field.loadValue("a", [source1])).resolves.toEqual(1);
      await expect(field.loadValue("a", [source2])).resolves.toEqual(2);
    });

    test("should return a new instance", () => {
      const field1 = new TestFieldDefinition();
      const field2 = field1.alias("alias");
      expect(field1).not.toBe(field2);
    });
  });

  describe(".default()", () => {
    test("should use a default value if no value is provided", async () => {
      const field = new TestFieldDefinition().default(1);
      const source = new FixedSource({ b: 2 });
      const value = field.loadValue("a", [source]);
      await expect(value).resolves.toBe(1);
    });

    test("should use a value from a source if found", async () => {
      const field = new TestFieldDefinition().default(1);
      const source = new FixedSource({ a: 3, b: 2 });
      const value = field.loadValue("a", [source]);
      await expect(value).resolves.toBe(3);
    });

    test("should return a new instance", () => {
      const field1 = new TestFieldDefinition();
      const field2 = field1.default(1);
      expect(field1).not.toBe(field2);
    });
  });

  describe(".constant()", () => {
    test("should use the value if no value is provided", async () => {
      const field = new TestFieldDefinition().constant(1);
      const source = new FixedSource({ b: 2 });
      const value = field.loadValue("a", [source]);
      await expect(value).resolves.toBe(1);
    });

    test("should use the value from the field even if found in source", async () => {
      const field = new TestFieldDefinition().constant(1);
      const source = new FixedSource({ a: 3, b: 2 });
      const value = field.loadValue("a", [source]);
      await expect(value).resolves.toBe(1);
    });

    test("should return a new instance", async () => {
      const field1 = new TestFieldDefinition();
      const field2 = field1.constant(1);
      expect(field1).not.toBe(field2);
    });
  });

  describe(".optional()", () => {
    test("should return null if no value provided", async () => {
      const field = new TestFieldDefinition().optional();
      const source = new FixedSource({ b: 2 });
      const value = field.loadValue("a", [source]);
      await expect(value).resolves.toBe(null);
    });

    test("should use the value from the source if found", async () => {
      const field = new TestFieldDefinition().optional();
      const source = new FixedSource({ a: 3, b: 2 });
      const value = field.loadValue("a", [source]);
      await expect(value).resolves.toBe(3);
    });

    test("should return a new instance", async () => {
      const field1 = new TestFieldDefinition();
      const field2 = field1.optional();
      expect(field1).not.toBe(field2);
    });

    test("works on string fields", async () => {
      const field = FieldDefinitionString.create().optional();
      const source = new FixedSource({ b: 2 });
      const value = field.loadValue("a", [source]);
      await expect(value).resolves.toBe(null);
    });
  });

  describe("metadata", () => {
    test("it should work", () => {
      // eslint-disable-next-line @typescript-eslint/no-extraneous-class
      class TestMetadata {}
      const metadata = new TestMetadata();
      const field = new TestFieldDefinition().with(metadata);
      expect(field.getMetadata(TestMetadata)).toBe(metadata);
    });
  });
});

describe("FieldDefinitionString", () => {
  test("works", async () => {
    const field = FieldDefinitionString.create();
    const source = new FixedSource({ a: "hello" });
    const value = field.loadValue("a", [source]);
    await expect(value).resolves.toBe("hello");
  });
});

describe("FieldDefinitionNumber", () => {
  test("works", async () => {
    const field = FieldDefinitionNumber.create();
    const source = new FixedSource({ a: 3 });
    const value = field.loadValue("a", [source]);
    await expect(value).resolves.toBe(3);
  });
});

describe("FieldDefinitionBoolean", () => {
  test("works", async () => {
    const field = FieldDefinitionBoolean.create();
    const source = new FixedSource({ a: true, b: false, c: "yo" });
    await expect(field.loadValue("a", [source])).resolves.toBe(true);
    await expect(field.loadValue("b", [source])).resolves.toBe(false);
    await expect(() => field.loadValue("c", [source])).rejects.toThrow(ZodError);
  });
});
