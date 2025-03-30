import type { ConfigDefinition } from "./definition.ts";
import type { LoadConfigReturn } from "./loader.ts";

export type Infer<C extends ConfigDefinition<unknown>> = LoadConfigReturn<unknown, C>;
export { EnvSource } from "./source/env.ts";
export { loadConfig, type LoadConfigReturn } from "./loader.ts";
export { g } from "./definition.ts";

// TODO
// - booleans
// - enums
// - arbitrary zod?
// - document environment variable naming
// - array values
// - map values
// - struct values
// - immutable field definitions
// - custom error messages
