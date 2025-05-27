import { ZodError } from "zod";
import type { ConfigDefinition } from "./definition.ts";
import type { FieldDefinition } from "./field.ts";
import type { Source } from "./source.ts";

export type LoadConfigReturn<T, C extends ConfigDefinition<T>> =
  C extends ConfigDefinition<infer R> ? R : never;

export async function loadConfig<T, C extends ConfigDefinition<T>>(
  configDefinition: C,
  sources: Source[],
): Promise<LoadConfigReturn<T, C>> {
  const rv: LoadConfigReturn<T, C> = {} as unknown as LoadConfigReturn<T, C>;
  const errors: { name: string; error: ZodError }[] = [];

  for (const name in configDefinition) {
    const definition = configDefinition[name] as FieldDefinition | undefined;
    if (!definition) continue;
    try {
      const value = await definition.loadValue(name, sources);
      rv[name as unknown as keyof LoadConfigReturn<T, C>] = value as LoadConfigReturn<
        T,
        C
      >[keyof LoadConfigReturn<T, C>];
    } catch (error) {
      if (!(error instanceof ZodError)) throw error;
      errors.push({ name, error });
    }
  }

  if (errors.length > 0) {
    const firstError = errors[0];
    throw new Error(
      `Failed to load config: ${firstError?.name ?? "unknown"}: ${firstError?.error.toString() ?? "unknown error"}`,
    );
  }

  return rv;
}
