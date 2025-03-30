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
// - explain environment switching
// - document environment variable naming
// - make env parameter optional
// - array values
// - map values
// - struct values
// - immutable field definitions
