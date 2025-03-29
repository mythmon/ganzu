import { constantCase } from "change-case";
import { Source } from "./index.ts";
import type { FieldDefinition } from "../field.ts";

export class EnvSource extends Source {
  constructor(params: { prefix?: string }) {
    super();
    this.#prefix = params.prefix ?? "";
  }

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

  get(
    key: string,
    definition: FieldDefinition,
  ): { found: false } | { found: true; value: string; needsFromString: true } {
    for (const alias of this.nameVariants(key, definition)) {
      const envVar = process.env[alias];
      if (envVar) return { found: true, value: envVar, needsFromString: true };
    }
    return { found: false };
  }
}
