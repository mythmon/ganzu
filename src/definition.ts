import {
  FieldDefinitionNumber,
  FieldDefinitionString,
  type FieldDefinition,
} from "./field.ts";

export type ConfigDefinition<T> = {
  [K in keyof T & string]: FieldDefinition<T[K]>;
};

export const g = {
  string: () => FieldDefinitionString.createDefault(),
  number: () => FieldDefinitionNumber.createDefault(),
};
