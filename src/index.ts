import {
  FieldDefinitionNumber,
  FieldDefinitionString,
  type FieldDefinition,
} from "./field.ts";
import type { Source } from "./source/index.ts";

export type ConfigDefinition<T> = {
  [K in keyof T & string]: FieldDefinition<T[K]>;
};

export const g = {
  string: () => new FieldDefinitionString(),
  number: () => new FieldDefinitionNumber(),
};

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

export type Infer<C extends ConfigDefinition<unknown>> = LoadConfigReturn<unknown, C>;
export { EnvSource, } from "./source/env.ts";
