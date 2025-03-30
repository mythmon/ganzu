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
  abstract get(key: string): SourceGetResult;
}
