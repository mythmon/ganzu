import { z, type ZodType } from "zod";
import type { Source } from "./source.ts";
import { TypeMap } from "./TypeMap.ts";
import type { Constructable, Constructor } from "./TypeMap.ts";

const CouldNotConvert = Symbol("CouldNotConvert");

export abstract class FieldDefinition<T = unknown> {
  _validator: ZodType<T>;
  _metadata: TypeMap;

  abstract fromString(string: string): T | typeof CouldNotConvert;
  abstract clone(): FieldDefinition<T>;

  constructor(validator: ZodType<T>, metadata: TypeMap = new TypeMap()) {
    this._validator = validator;
    this._metadata = metadata;
  }

  #withChanges(fn: (field: FieldDefinition<T>) => void) {
    const next = this.clone();
    fn(next);
    return next;
  }

  /** Add metadata to this field that can later be retrieved using its constructor. */
  with<M extends Constructable>(value: M): FieldDefinition<T> {
    return this.#withChanges((f) => {
      f.#unsafeSetMetadata(value);
    });
  }

  getMetadata<M>(type: Constructor<M>): M | undefined {
    return this._metadata.get(type) as M | undefined;
  }

  /** Mutates the current instance. Make sure the change won't be observable. */
  #unsafeSetMetadata<M extends Constructable>(value: M) {
    const key = value.constructor as Constructor<M>;
    this._metadata.set(key, value);
  }

  alias(...newAliases: string[]) {
    const { aliases = [] } = this.getMetadata(FieldAliases) ?? {};
    return this.with(new FieldAliases(...aliases, ...newAliases));
  }

  default(value: T) {
    const validated = this._validator.parse(value);
    return this.with(new FieldDefaultValue(validated));
  }

  constant(value: T) {
    const validated = this._validator.parse(value);
    return this.with(new FieldConstantValue(validated));
  }

  optional<Tn extends T | null>(): FieldDefinition<Tn> {
    return this.#withChanges((f) => {
      const newField = f as FieldDefinition<Tn>;
      newField._validator = this._validator.nullable() as unknown as z.ZodType<Tn>;
      newField.#unsafeSetMetadata(new FieldDefaultValue(null));
    }) as FieldDefinition<Tn>;
  }

  loadValue(name: string, sources: Source[]): T {
    const constant = this.getMetadata(FieldConstantValue);
    if (constant) return constant.value as T;

    let lastValidationProblem = null;
    const { aliases = [] } = this.getMetadata(FieldAliases) ?? {};
    for (const alias of [name, ...aliases]) {
      for (const source of sources) {
        const fromSource = source.get(alias, this);
        if (!fromSource.ok) {
          lastValidationProblem = fromSource.error;
          continue;
        }
        if (!fromSource.found) continue;
        let value = fromSource.value;
        if (fromSource.needsFromString) {
          const converted = this.fromString(fromSource.value);
          if (converted !== CouldNotConvert) value = converted;
        }
        const validation = this._validator.safeParse(value, { path: [alias] });
        if (validation.success) {
          return validation.data;
        }
        lastValidationProblem = validation.error;
      }
    }
    if (lastValidationProblem) throw lastValidationProblem;

    const fieldDefault = this.getMetadata(FieldDefaultValue);
    if (fieldDefault) return fieldDefault.value as T;

    throw new Error(`No value found for ${name}`);
  }
}

export class FieldAliases {
  aliases: string[];
  constructor(...aliases: string[]) {
    this.aliases = aliases;
  }
}

export class FieldDefaultValue<T> {
  value: T;
  constructor(defaultValue: T) {
    this.value = defaultValue;
  }
}

export class FieldConstantValue<T> {
  value: T;
  constructor(defaultValue: T) {
    this.value = defaultValue;
  }
}

export class FieldDefinitionString extends FieldDefinition<string> {
  constructor(metadata?: TypeMap) {
    super(z.string(), metadata);
  }

  static create(): FieldDefinitionString {
    return new FieldDefinitionString();
  }

  override clone(): FieldDefinition<string> {
    return new FieldDefinitionString(new Map([...this._metadata]));
  }

  fromString(string: string): string {
    return string;
  }
}

export class FieldDefinitionNumber extends FieldDefinition<number> {
  constructor(metadata?: TypeMap) {
    super(z.number(), metadata);
  }

  static create(): FieldDefinitionNumber {
    return new FieldDefinitionNumber();
  }

  override clone(): FieldDefinition<number> {
    return new FieldDefinitionNumber(new Map([...this._metadata]));
  }

  fromString(string: string): number | typeof CouldNotConvert {
    const converted = Number(string);
    if (isNaN(converted)) return CouldNotConvert;
    return converted;
  }
}

export class FieldDefinitionBoolean extends FieldDefinition<boolean> {
  strict: boolean;

  constructor(strict: boolean, metadata: TypeMap = new Map()) {
    super(z.boolean(), metadata);
    this.strict = strict;
  }

  static create({ strict = false }: { strict?: boolean } = {}): FieldDefinitionBoolean {
    return new FieldDefinitionBoolean(strict);
  }

  override clone(): FieldDefinition<boolean> {
    return new FieldDefinitionBoolean(this.strict, new Map([...this._metadata]));
  }

  fromString(string: string): boolean | typeof CouldNotConvert {
    const lower = string.toLowerCase();
    if (lower === "true") {
      return true;
    } else if (lower === "false") {
      return false;
    }
    if (this.strict) {
      return CouldNotConvert;
    }
    if (lower === "1" || lower === "t" || lower === "y" || lower === "yes" || lower === "on") {
      return true;
    } else if (
      lower === "0" ||
      lower === "f" ||
      lower === "n" ||
      lower === "no" ||
      lower === "off"
    ) {
      return false;
    }
    return CouldNotConvert;
  }
}
