import {
  FieldDefinitionNumber,
  FieldDefinitionString,
  type FieldDefinition,
} from "./field.ts";

export type ConfigDefinition<T> = {
  [K in keyof T & string]: FieldDefinition<T[K]>;
};

export const g = {
  string: () => new FieldDefinitionString(),
  number: () => new FieldDefinitionNumber(),
};

type FieldGetResult =
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
  abstract get(key: string, definition: FieldDefinition): FieldGetResult;
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
    const definition = configDefinition[name] as FieldDefinition | undefined;
    if (!definition) continue;
    const value = definition.loadValue(name, sources);
    rv[name as unknown as keyof R] = value as R[keyof R];
  }
  return rv as R;
}

export { EnvSource } from "./env.ts";
