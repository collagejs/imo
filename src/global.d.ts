import "@collagejs/core";
import type { MountedPiece } from "@collagejs/core";

/**
 * Data entry types that can be deleted through the `ImoController.deleteData()` method.
 */
export type DataEntry = 'import-map' | 'ui-options' | 'logs' | 'overrides' | 'ovr-history' | 'vite-servers';

declare global {
    /**
     * Defines the capabilities of the IMO UI controller object.
     */
    interface UiController {
        /**
         * Mounts the IMO *CollageJS* piece in the document, assuming it wasn't already mounted.
         */
        mount(): Promise<void>;
        /**
         * Unmounts the IMO *CollageJS* piece from the document, assuming it is currently mounted.
         */
        unmount(): Promise<void>;
    }
    /**
     * Defines the capabilities of the import map overrides controller object.
     */
    interface ImoController {
        /**
         * Deletes stored data for the specified entry.
         * @param entry Entry to delete.
         * @param name Optional entry name, where applicable.
         */
        deleteData(entry: DataEntry, name?: string): void;
        /**
         * Object used to manipulate the IMO user interface.
         */
        readonly ui: UiController | undefined;
    }

    interface CollageJs {
        /**
         * Gets the import map overrides controller object that exposes import map functionality, including some
         * control over the IMO user interface (which is a *CollageJS* piece).
         */
        readonly Imo: ImoController;
    }
}

export {}; // Ensure this file is treated as a module
