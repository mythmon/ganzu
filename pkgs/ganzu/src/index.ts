import type { ConfigDefinition } from "./definition.ts";
import type { LoadConfigReturn } from "./loader.ts";

export type Infer<C extends ConfigDefinition<unknown>> = LoadConfigReturn<unknown, C>;
export type { SourceGetResult  } from "./source.ts";
export { EnvSource, FixedSource, Source  } from "./source.ts";
export type { LoadConfigReturn } from "./loader.ts";
export { loadConfig } from "./loader.ts";
export type { ConfigDefinition } from "./definition.ts";
export { g } from "./definition.ts";
