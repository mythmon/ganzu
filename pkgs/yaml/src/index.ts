import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { isScalar, parseAllDocuments } from "yaml";
import type { Document } from "yaml";
import type { SourceGetResult } from "ganzu";
import * as ganzu from "ganzu";

export class YamlSource extends ganzu.Source {
  documents: Document[];

  constructor(contents: string) {
    super();
    this.documents = parseAllDocuments(contents);
  }

  static fromString(str: string): YamlSource {
    return new YamlSource(str);
  }

  static async fromFile(path: string): Promise<YamlSource> {
    const content = await readFile(path, "utf8");
    return new YamlSource(content);
  }

  fromFileSync(path: string): YamlSource {
    const content = readFileSync(path, "utf8");
    return new YamlSource(content);
  }

  get(key: string): SourceGetResult {
    const errors = [];
    for (const document of this.documents) {
      const keepScalar = true;
      const node = document.get(key, keepScalar);
      if (node === undefined) continue;
      if (isScalar(node)) {
        return { ok: true, found: true, value: node.value, needsFromString: false };
      }
      errors.push(`Key '${key}' found in document but is not a scalar`);
    }
    if (errors.length > 0) {
      return { ok: false, error: new Error(errors[0]) };
    }
    return { ok: true, found: false };
  }
}
