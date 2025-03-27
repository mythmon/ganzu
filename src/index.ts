export { EnvSource } from "./env.ts";

export type ConfigDefinition<T> = {
  [K in keyof T]: FieldDefinition<T[K]>;
};

export abstract class FieldDefinition<T = unknown> {
  aliases: string[] = [];

  abstract fromString(string: string): T;

  alias(alias: string) {
    this.aliases.push(alias);
    return this;
  }
}

export class FieldDefinitionString extends FieldDefinition<string> {
  fromString(string: string): string {
    return string;
  }
}

export class FieldDefinitionNumber extends FieldDefinition<number> {
  fromString(string: string): number {
    return Number(string);
  }
}

export const g = {
  string: () => new FieldDefinitionString(),
  number: () => new FieldDefinitionNumber(),
};

export abstract class Source {
  abstract get(key: string, definition: FieldDefinition): unknown;
}

type LoadConfigReturn<T, C extends ConfigDefinition<T>> =
  C extends ConfigDefinition<infer R> ? R : never;

export function loadConfig<
  T,
  C extends ConfigDefinition<T>,
  R = LoadConfigReturn<T, C>,
>(configDefinition: C, sources: Source[]): R {
  let rv: R = {} as unknown as R;
  for (const name in configDefinition) {
    let value;
    const definition: FieldDefinition = configDefinition[
      name
    ] as FieldDefinition;
    if (!definition) continue;
    for (const source of sources) {
      value = source.get(name, definition);
      if (value) break;
    }
    rv[name as unknown as keyof R] = value as R[keyof R];
  }
  return rv as R;
}
