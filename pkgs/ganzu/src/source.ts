import { constantCase } from "change-case";

export type SourceGetResult =
  | { found: false }
  | {
      found: true;
      value: string;
      needsFromString: true;
    }
  | {
      found: true;
      value: unknown;
      needsFromString: false;
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
      return { found: true, value: this.values[key], needsFromString: false };
    }
    return { found: false };
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
      if (envVar) return { found: true, value: envVar, needsFromString: true };
    }
    return { found: false };
  }
}
