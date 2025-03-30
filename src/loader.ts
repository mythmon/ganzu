import type { ConfigDefinition } from "./definition.ts";
import type { FieldDefinition } from "./field.ts";
import type { Source } from "./source/index.ts";

export type LoadConfigReturn<T, C extends ConfigDefinition<T>> =
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
