import { z, type ZodType } from "zod";
import type { Source } from "./source/index.ts";

export abstract class FieldDefinition<T = unknown> {
  aliases: string[] = [];
  metadata: Record<string, unknown> = {};
  abstract validator: ZodType<T>;

  abstract fromString(string: string): T;

  alias(alias: string) {
    this.aliases.push(alias);
    return this;
  }

  loadValue(name: string, sources: Source[]): T {
    let lastValidationProblem = null;
    for (const alias of [name, ...this.aliases]) {
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
