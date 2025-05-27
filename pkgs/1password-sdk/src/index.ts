import * as ganzu from "ganzu";
import { Secrets } from "@1password/sdk";

/** Just the parts of the 1Password `Client` that we need */
type OnePasswordClientSubset = {
  secrets: {
    resolve(reference: string): Promise<string>;
  };
};

export class OnePasswordSdkSource extends ganzu.Source {
  client: OnePasswordClientSubset;

  constructor(client: OnePasswordClientSubset) {
    super();
    this.client = client;
  }

  async get(_key: string, field: ganzu.FieldDefinition): Promise<ganzu.SourceGetResult> {
    const ref = field.getMetadata(OnePasswordReference);
    if (!ref) return { ok: true, found: false };
    const secret = await this.client.secrets.resolve(ref.reference);
    return {found: true, ok: true, value: secret, needsFromString: true };
  }
}

export class OnePasswordReference {
  public readonly reference: string;
  constructor(reference: string) {
    Secrets.validateSecretReference(reference);
    this.reference = reference;
  }
}
