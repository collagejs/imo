import type { ImoLogEntry } from "../../private-types.js";
import { eventImoLogsUpdated } from "../../shared/common.js";
import { skImoLogs } from "../../shared/storage-keys.js";

export class ImoLogs {
    #current;
    constructor() {
        // @ts-expect-error TS2769
        window.addEventListener(eventImoLogsUpdated, this.#onUpdate.bind(this));
        this.#current = $state(JSON.parse(sessionStorage.getItem(skImoLogs) ?? "[]"));
    }
    #onUpdate(event: CustomEvent<ImoLogEntry[][]>) {
        this.#current = event.detail;
    }
    get current() {
        return this.#current;
    }
}

export const imoLogs = new ImoLogs();
