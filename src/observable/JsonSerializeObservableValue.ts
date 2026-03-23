import { DerivedObservableValue } from "./DerivedObservableValue";
import type { ObservableValueInterface } from "./ObservableValue";

export class JsonSerializeObservableValue<Value> extends DerivedObservableValue<
  Value | null,
  string | null
> {
  constructor(source: ObservableValueInterface<string | null>, defaultValue?: Value) {
    super(
      source,
      (derivedValue: string | null) => {
        if (derivedValue === null) return null;
        try {
          return JSON.parse(derivedValue) as Value;
        } catch {
          return null;
        }
      },
      (value) => (value == null ? null : JSON.stringify(value)),
      defaultValue ?? null,
    );
  }
}
