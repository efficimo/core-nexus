import {
  ObservableValue,
  type ObservableValueInterface,
} from "./ObservableValue";

type From<Value, DerivedValue> = (derivedValue: DerivedValue) => Value;
type To<Value, DerivedValue> = (value: Value) => DerivedValue;

export class DerivedObservableValue<
  Value,
  DerivedValue,
> extends ObservableValue<Value> {
  #source: ObservableValueInterface<DerivedValue>;
  #from: From<Value, DerivedValue>;
  #to: To<Value, DerivedValue>;

  constructor(
    source: ObservableValueInterface<DerivedValue>,
    from: From<Value, DerivedValue>,
    to: To<Value, DerivedValue>,
    defaultValue?: Value,
  ) {
    super(from(source.getValue()) ?? (defaultValue as Value));
    this.#source = source;
    this.#from = from;
    this.#to = to;

    this.#source.subscribe((value) => {
      this.next(this.#from(value));
    });

    this.subscribe((value) => {
      this.#source.next(this.#to(value));
    });
  }
}