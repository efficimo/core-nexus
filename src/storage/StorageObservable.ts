import { isEqual } from "@/observable/isEqual";
import { isSetFunction, type SetFunction } from "@/observable/isSetFunction";
import { Observable, type Subscriber } from "@/observable/Observable";
import type { ObservableValueInterface } from "@/observable/ObservableValue";

export class StorageObservable<StorageKey extends string>
  extends Observable<string | null>
  implements ObservableValueInterface<string | null>
{
  private key: StorageKey;
  private storage: Storage;

  constructor(key: StorageKey, storage: Storage) {
    super();
    this.key = key;
    this.storage = storage;
  }

  subscribe = (subscriber: Subscriber<string | null>) => {
    subscriber(this.storage.getItem(this.key));
    return super.subscribe(subscriber);
  };

  next = async (value: string | null | SetFunction<string | null>) => {
    const prevValue = this.storage.getItem(this.key);
    const newValue = isSetFunction(value) ? await value(prevValue) : value;

    if (isEqual(prevValue, newValue)) {
      return;
    }

    if (newValue == null) {
      this.storage.removeItem(this.key);
    } else {
      this.storage.setItem(this.key, newValue);
    }

    super.next(newValue);
  };

  getValue = () => {
    return this.storage.getItem(this.key);
  };
}
