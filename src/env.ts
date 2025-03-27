import { constantCase } from "change-case";
import { FieldDefinition, Source } from "./index.ts";

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

  get(key: string, definition: FieldDefinition): unknown {
    for (const alias of this.nameVariants(key, definition)) {
      const envVar = this.#env[alias];
      if (envVar) return definition.fromString(envVar);
    }
    return undefined;
  }
}
