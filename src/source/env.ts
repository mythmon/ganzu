import { constantCase } from "change-case";
import { Source, type SourceGetResult } from "./index.ts";

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
