import { constantCase } from "change-case";
import type { FieldDefinition } from "./field.ts";

export type SourceGetResult =
  | { ok: true; found: false }
  | {
      ok: true;
      found: true;
      value: string;
      needsFromString: true;
    }
  | {
      ok: true;
      found: true;
      value: unknown;
      needsFromString: false;
    }
  | {
      ok: false;
      error: Error;
    };

export abstract class Source {
  abstract get(key: string, field: FieldDefinition): SourceGetResult;
}

export class FixedSource<T extends Record<string, unknown>> extends Source {
  values: Record<string, unknown>;

  constructor(values: T) {
    super();
    this.values = values;
  }

  get(key: string): SourceGetResult {
    if (key in this.values) {
      return { ok: true, found: true, value: this.values[key], needsFromString: false };
    }
    return { ok: true, found: false };
  }
}

export class EnvSource extends Source {
  constructor(params: { prefix?: string; env?: Record<string, string | undefined> } = {}) {
    super();
    this.#env = params.env ?? process.env;
    this.#prefix = params.prefix ?? "";
  }

  #env: Record<string, string | undefined>;
  #prefix: string;

  *nameVariants(name: string): Generator<string, void> {
    const prefixed = this.#prefix + name;
    yield prefixed;
    yield constantCase(prefixed);
  }

  get(key: string): SourceGetResult {
    for (const alias of this.nameVariants(key)) {
      const envVar = this.#env[alias];
      if (envVar) return { ok: true, found: true, value: envVar, needsFromString: true };
    }
    return { ok: true, found: false };
  }
}
