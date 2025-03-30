import { z, type ZodType } from "zod";
import type { Source } from "./source.ts";

export abstract class FieldDefinition<T = unknown> {
  _aliases: string[];
  _default: T | undefined;
  _constant: T | undefined;
  _validator: ZodType<T>;

  abstract fromString(string: string): T;
  abstract clone(): FieldDefinition<T>;

  constructor(
    validator: ZodType<T>,
    aliases: string[],
    default_: T | undefined,
    constant: T | undefined,
  ) {
    this._validator = validator;
    this._aliases = aliases;
    this._default = default_;
    this._constant = constant;
  }

  #withChanges(fn: (field: FieldDefinition<T>) => void) {
    const next = this.clone();
    fn(next);
    return next;
  }

  alias(alias: string) {
    return this.#withChanges((f) => f._aliases.push(alias));
  }

  default(value: T) {
    const validated = this._validator.parse(value);
    return this.#withChanges((f) => { f._default = validated; });
  }

  constant(value: T) {
    const validated = this._validator.parse(value);
    return this.#withChanges((f) => { f._constant = validated; });
  }

  optional<Tn extends T | null>(): FieldDefinition<Tn> {
    return (this as unknown as FieldDefinition<Tn>).default(null as Tn);
  }

  loadValue(name: string, sources: Source[]): T {
    if (this._constant !== undefined) return this._constant;

    let lastValidationProblem = null;
    for (const alias of [name, ...this._aliases]) {
      for (const source of sources) {
        const fromSource = source.get(alias);
        if (!fromSource.ok) {
          lastValidationProblem = fromSource.error;
          continue;
        }
        if (!fromSource.found) continue;
        let value = fromSource.value;
        if (fromSource.needsFromString) {
          value = this.fromString(fromSource.value);
        }
        const validation = this._validator.safeParse(value, { path: [alias]});
        if (validation.success) {
          return validation.data;
        }
        lastValidationProblem = validation.error;
      }
    }
    if (lastValidationProblem) throw lastValidationProblem;

    if (this._default !== undefined) return this._default;

    throw new Error(`No value found for ${name}`);
  }
}

export class FieldDefinitionString extends FieldDefinition<string> {
  constructor(
    aliases: string[],
    default_: string | undefined,
    constant: string | undefined,
  ) {
    super(z.string(), aliases, default_, constant);
  }

  static createDefault(): FieldDefinitionString {
    return new FieldDefinitionString([], undefined, undefined);
  }

  override clone(): FieldDefinition<string> {
    return new FieldDefinitionString(
      [...this._aliases],
      this._default,
      this._constant,
    );
  }


  fromString(string: string): string {
    return string;
  }
}

export class FieldDefinitionNumber extends FieldDefinition<number> {
  constructor(
    aliases: string[],
    default_: number | undefined,
    constant: number | undefined,
  ) {
    super(z.number(), aliases, default_, constant);
  }

  static createDefault(): FieldDefinitionNumber {
    return new FieldDefinitionNumber([], undefined, undefined);
  }

  override clone(): FieldDefinition<number> {
    return new FieldDefinitionNumber(
      [...this._aliases],
      this._default,
      this._constant,
    );
  }

  fromString(string: string): number {
    return Number(string);
  }
}
