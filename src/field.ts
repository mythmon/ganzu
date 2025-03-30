import { z, type ZodType } from "zod";
import type { Source } from "./source/index.ts";

export abstract class FieldDefinition<T = unknown> {
  #aliases: string[] = [];
  #default: T | undefined = undefined;
  #constant: T | undefined = undefined;
  abstract validator: ZodType<T>;

  abstract fromString(string: string): T;

  alias(alias: string) {
    this.#aliases.push(alias);
    return this;
  }

  default(value: T) {
    this.#default = this.validator.parse(value);
    return this;
  }

  constant(value: T) {
    this.#constant = this.validator.parse(value);
    return this;
  }

  optional<Tn extends T | null>(): FieldDefinition<Tn> {
    const rv = this as unknown as FieldDefinition<Tn>;
    rv.#default = null as Tn;
    return rv;
  }

  loadValue(name: string, sources: Source[]): T {
    if (this.#constant !== undefined) return this.#constant;

    let lastValidationProblem = null;
    for (const alias of [name, ...this.#aliases]) {
      for (const source of sources) {
        let fromSource = source.get(alias);
        if (!fromSource.found) continue;
        let value = fromSource.value;
        if (fromSource.needsFromString) {
          value = this.fromString(fromSource.value);
        }
        let validation = this.validator.safeParse(value);
        if (validation.success) {
          return validation.data;
        } else {
          lastValidationProblem = validation.error;
        }
      }
    }
    if (lastValidationProblem) throw new Error(lastValidationProblem.message);

    if (this.#default !== undefined) return this.#default;

    throw new Error(`No value found for ${name}`);
  }
}

export class FieldDefinitionString extends FieldDefinition<string> {
  validator = z.string();
  fromString(string: string): string {
    return string;
  }
}

export class FieldDefinitionNumber extends FieldDefinition<number> {
  validator = z.number();
  fromString(string: string): number {
    return Number(string);
  }
}
