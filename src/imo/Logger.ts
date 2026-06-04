import type { ImoLogEntry } from "../private-types";
import { eventImoLogsUpdated } from "../shared/common";
import { skImoLogs } from "../shared/storage-keys";

export class Logger {
    logs: ImoLogEntry[] = [];
    #saved = false;
    #log(level: ImoLogEntry['level'], message: string) {
        const entry: ImoLogEntry = {
            timestamp: Date.now(),
            level,
            message,
        };
        this.logs.push(entry);
        if (level === 'error') {
            console.error(`[@collagejs/imo][${new Date(entry.timestamp).toISOString()}][${level.toUpperCase()}] ${message}`);
        }
    }
    info(message: string) {
        this.#log('info', message);
    }
    warn(message: string) {
        this.#log('warning', message);
    }
    error(message: string) {
        this.#log('error', message);
    }
    save() {
        const curLogs = JSON.parse(sessionStorage.getItem(skImoLogs) || '[]') as (ImoLogEntry[])[];
        if (this.#saved) {
            curLogs[0] = this.logs;
        }
        else {
            curLogs.unshift(this.logs);
            this.#saved = true;
        }
        sessionStorage.setItem(skImoLogs, JSON.stringify(curLogs));
        window.dispatchEvent(new CustomEvent(eventImoLogsUpdated, {
            detail: curLogs
        }));
    }
}
