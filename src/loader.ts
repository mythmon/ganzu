import { ZodError } from "zod";
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
  const rv: R = {} as unknown as R;
  const errors: { name: string; error: ZodError }[] = [];

  for (const name in configDefinition) {
    const definition = configDefinition[name] as FieldDefinition | undefined;
    if (!definition) continue;
    try {
      const value = definition.loadValue(name, sources);
      rv[name as unknown as keyof R] = value as R[keyof R];
    } catch (error) {
      if (!(error instanceof ZodError)) throw error;
      errors.push({ name, error });
    }
  }

  if (errors.length > 0) {
    throw new Error(`Failed to load config: ${errors[0]?.name}: ${errors[0]?.error.toString()}`);
  }

  return rv as R;
}
