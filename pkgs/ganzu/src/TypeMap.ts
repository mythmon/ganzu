// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T> = new (...args: any[]) => T;
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export type Constructable = { constructor: Function };

export class TypeMap extends Map<Constructor<unknown>, Constructable> {}
