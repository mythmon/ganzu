import { constantCase } from "change-case";

export type SourceGetResult =
  | { ok: true, found: false }
  | {
    ok: true;
    found: true;
    value: string;
    needsFromString: true;
  } | {
    ok: true;
    found: true;
    value: unknown;
    needsFromString: false;
  } | {
    ok: false;
    error: Error;
  };

export abstract class Source {
  abstract get(key: string): SourceGetResult;
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
  constructor(params: { prefix?: string } = {}) {
    super();
    this.#prefix = params.prefix ?? "";
  }

  #prefix: string;

  *nameVariants(
    name: string,
  ): Generator<string, void> {
    const prefixed = this.#prefix + name;
    yield prefixed;
    yield constantCase(prefixed);
  }

  get(key: string): SourceGetResult {
    for (const alias of this.nameVariants(key)) {
      const envVar = process.env[alias];
      if (envVar) return { ok: true, found: true, value: envVar, needsFromString: true };
    }
    return { ok: true, found: false };
  }
}
