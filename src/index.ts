import { DynamicValueType, KeyConfig, KeyValue } from "./types";

export default class ReactQueryKeys<T> {
  private readonly _baseName: string;
  private readonly _config: KeyConfig<T>;

  constructor(baseName: string, config: KeyConfig<T>) {
    this._baseName = baseName;
    this._config = config;
  }

  public all() {
    return this._baseArray();
  }

  public key(name: keyof T & string, dynamicValues?: DynamicValueType) {
    return ([] as KeyValue)
      .concat(this._baseArray())
      .concat(this._parentArray(name))
      .concat(this._nameArray(name))
      .concat(this._dynamicValuesArray(name, dynamicValues));
  }

  private _baseArray() {
    return [this._baseName];
  }

  private _parentArray(name: keyof T & string) {
    const result: KeyValue = [];
    const { childOf } = this._config.keyDefinitions[name];
    if (childOf) {
      if (!this._config.keyDefinitions[childOf as keyof T]) {
        throw new Error(
          `Query key "${name.toString()}" is child of nonexistent parent key ${childOf}. Check config.`
        );
      }

      result.push(childOf);
    }

    return result;
  }

  private _nameArray(name: keyof T & string) {
    return [name];
  }

  private _dynamicValuesArray(name: keyof T, dynamicValues?: DynamicValueType) {
    const result: KeyValue = [];
    if (dynamicValues) {
      const { dynamicVariableNames: definitionVariableNames } =
        this._config.keyDefinitions[name];
      const requestedVariableNames = Object.keys(dynamicValues);
      const validVariableNames = requestedVariableNames.filter((key) =>
        (definitionVariableNames ?? []).includes(key)
      );
      // make sure only variables provided in config are used
      if (validVariableNames.length !== requestedVariableNames.length) {
        const invalidNames = requestedVariableNames
          .filter((name) => !validVariableNames.includes(name))
          .map((name) => `"${name}"`)
          .join(",");
        throw new Error(
          `Query key "${name.toString()}" is using one or more invalid dynamic value variable names: [${invalidNames}]. Check config`
        );
      }
      const currDynamicValues: DynamicValueType = {};
      validVariableNames.forEach(
        (key) => (currDynamicValues[key] = dynamicValues[key])
      );

      result.push(currDynamicValues);
    }
    return result;
  }
}
