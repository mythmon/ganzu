import { describe, test, expect, vi } from "vitest";
import * as ganzu from "ganzu";
import { OnePasswordReference, OnePasswordSdkSource } from "../src";
import { z } from "zod";

describe("OnePasswordSdkSource", () => {
  test("it works", async () => {
    const mockResult = Symbol();
    const mockResolve = vi.fn().mockReturnValueOnce(mockResult);
    const mockClient = {
      secrets: { resolve: mockResolve },
    };
    const source = new OnePasswordSdkSource(mockClient);
    const field = new TestFieldDefinition().with(
      new OnePasswordReference("op://vault/item/field"),
    );
    expect(await source.get("field", field)).toEqual({
      found: true,
      needsFromString: true,
      ok: true,
      value: mockResult,
    });
    expect(mockResolve).toHaveBeenCalledExactlyOnceWith(
      "op://vault/item/field",
    );
  });
});

class TestFieldDefinition extends ganzu.FieldDefinition {
  constructor(metadata?: any) {
    super(z.any(), metadata);
  }
  clone(): ganzu.FieldDefinition {
    return new TestFieldDefinition(new Map([...this._metadata]));
  }
  fromString(string: string): unknown {
    return string;
  }
}
