import type { DataEntry } from "./global.js";
import { deleteDataEntry } from "./shared/storage-keys.js";
import type { UiController } from "./UiController.js";

export class ImoController {
    ui: UiController | undefined;

    deleteData(entry: DataEntry, name?: string): void {
        deleteDataEntry(entry, name);
    }
}
