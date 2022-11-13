export type KeyValue = (string | DynamicValueType)[];

export type DynamicValueType = Record<string, any>;

export type KeyConfig<T> = {
  keyDefinitions: KeyDefinition<T>;
};

export type KeyDefinition<T> = Record<
  keyof T,
  { childOf?: (keyof T & string) | string; dynamicVariableNames?: string[] }
>;
