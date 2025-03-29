import { Source, type SourceGetResult } from "./index.ts";

export class FixedSource<T extends Record<string, unknown>> extends Source {
  values: Record<string, unknown>;

  constructor(values: T) {
    super();
    this.values = values;
  }

  get(key: string): SourceGetResult {
    if (key in this.values) {
      return { found: true, value: this.values[key], needsFromString: false };
    } else {
      return { found: false };
    }
  }
}
