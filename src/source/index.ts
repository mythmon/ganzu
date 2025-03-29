import type { FieldDefinition } from "../field.ts";

export type SourceGetResult =
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
  abstract get(key: string, definition: FieldDefinition): SourceGetResult;
}

export { EnvSource } from "./env.ts";
export { FixedSource } from "./fixed.ts";
