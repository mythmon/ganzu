import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import type { SourceGetResult } from "ganzu";
import * as ganzu from "ganzu";

export class JsonSource extends ganzu.Source {
  parsed: Record<string, unknown>;

  constructor(contents: string) {
    super();
    this.parsed = JSON.parse(contents);
  }

  static fromString(str: string): JsonSource {
    return new JsonSource(str);
  }

  static async fromFile(path: string): Promise<JsonSource> {
    const content = await readFile(path, "utf8");
    return new JsonSource(content);
  }

  fromFileSync(path: string): JsonSource {
    const content = readFileSync(path, "utf8");
    return new JsonSource(content);
  }

  get(key: string): SourceGetResult {
    const value = this.parsed[key];
    if (value === undefined) {
      return { ok: true, found: false };
    }
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      return { ok: true, found: true, value, needsFromString: false };
    }
    return { ok: false, error: new Error(`Key '${key}' found in document but is not a number, string, or boolean`) };
  }
}
