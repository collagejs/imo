import { persistedState } from "svelte-persisted-state";
import { overrideEntryHistoryKey } from "../../shared/storage-keys";

export class OverrideHistory {
    #storage;
    constructor(key: string) {
        this.#storage = persistedState(overrideEntryHistoryKey(key), [] as string[], {
            storage: 'local'
        });
    }

    get current() {
        return this.#storage.current;
    }

    push(item: string) {
        const index = this.#storage.current.indexOf(item);
        if (index !== -1) {
            this.#storage.current.splice(index, 1);
        }
        if (this.#storage.current.length >= 10) {
            this.#storage.current.pop();
        }
        this.#storage.current.unshift(item);
    }
}
