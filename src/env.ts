import { constantCase } from "change-case";
import { Source } from "./index.ts";
import type { FieldDefinition } from "./field.ts";

export class EnvSource extends Source {
  constructor(params: {
    env?: Record<string, string | undefined>;
    prefix?: string;
  }) {
    super();
    this.#env = params.env ?? process.env;
    this.#prefix = params.prefix ?? "";
  }

  #env: Record<string, string | undefined>;
  #prefix: string;

  *nameVariants(
    name: string,
    definition: FieldDefinition,
  ): Generator<string, void> {
    for (const alias of [...definition.aliases, name]) {
      let prefixed = this.#prefix + alias;
      yield prefixed;
      yield constantCase(prefixed);
    }
  }

  get(key: string, definition: FieldDefinition):
    | { found: false }
    | { found: true, value: string, needsFromString: true }
  {
    for (const alias of this.nameVariants(key, definition)) {
      const envVar = this.#env[alias];
      if (envVar) return { found: true, value: envVar, needsFromString: true };
    }
    return { found: false };
  }
}
