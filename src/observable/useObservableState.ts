import { useEffect, useMemo, useState } from "react";
import { isEqual } from "./isEqual";
import { isSetFunction, type SetFunction } from "./isSetFunction";
import type { ObservableValueInterface } from "./ObservableValue";

const ObservableSetterFactory =
  <Value>(observable: ObservableValueInterface<Value>) =>
  async (valueFromParam: Value | SetFunction<Value>): Promise<void> => {
    const newValue = isSetFunction(valueFromParam)
      ? await valueFromParam(observable.getValue())
      : valueFromParam;

    observable.next(newValue);
  };

export const useObservableValueState = <Value>(
  observable: ObservableValueInterface<Value>,
): [Value, ReturnType<typeof ObservableSetterFactory<Value>>] => {
  const [state, setState] = useState<Value>(observable.getValue());

  useEffect(() => {
    const subscription = observable.subscribe((nextValue) => {
      setState((prevState) => (!isEqual(prevState, nextValue) ? nextValue : prevState));
    });
    return () => {
      subscription?.unsubscribe();
    };
  }, [observable]);

  return useMemo(() => [state, ObservableSetterFactory(observable)], [state, observable]);
};
