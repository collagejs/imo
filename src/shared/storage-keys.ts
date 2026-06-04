import type { DataEntry } from "../global";

/**
 * Prefix used for all storage keys in local and session storage.
 */
export const storageKeyPrefix = "cjs-imo:";

/**
 * Computes the final storage key by prepending the global prefix.
 * @param key Desired key.
 * @returns The final storage key.
 */
export function storageKey(key: string): string {
    return `${storageKeyPrefix}${key}`;
}

/**
 * Creates a storage key for historical override entries for a specific module identifier and optional scope.
 * @param bareIdentifier Module identifier the key will be for.
 * @param scope Optional scope for the module identifier.
 * @returns The final key value used to store historical values for the module identifier.
 */
export function overrideEntryHistoryKey(bareIdentifier: string, scope?: string): string {
    return `${skOverrideEntryHistoryPrefix}${scope ?? "global"}#${bareIdentifier}`;
}

/**
 * Storage key for the merged import map (before overrides are applied).
 */
export const skImportMap = storageKey("im");

/**
 * Storage key for the final import map (after overrides are applied).
 */
export const skFinalImportMap = storageKey("fim");

/**
 * Storage key for per-site preferences.
 */
export const skImoUiOptions = storageKey("imoUiOptions");

/**
 * Storage key for the generated logs.
 */
export const skImoLogs = storageKey("il");

/**
 * Storage key for module overrides.
 */
export const skOverrides = storageKey("ovr");

/**
 * Storage key prefix for override entry history.  All keys for historical override entries start with this.
 */
export const skOverrideEntryHistoryPrefix = storageKey("oeh:");

/**
 * Storage key for Vite development server information.
 */
export const skViteDevServers = storageKey("vds");

/**
 * Deletes the specified data entry from storage.
 * @param entry Data entry to delete.
 * @param name Optional name for the entry (if applicable).
 */
export function deleteDataEntry(entry: DataEntry, name?: string): void {
    switch (entry) {
        case 'import-map':
            sessionStorage.removeItem(skImportMap);
            sessionStorage.removeItem(skFinalImportMap);
            break;
        case 'ui-options':
            localStorage.removeItem(skImoUiOptions);
            break;
        case 'logs':
            sessionStorage.removeItem(skImoLogs);
            break;
        case 'overrides':
            localStorage.removeItem(skOverrides);
            break;
        case 'ovr-history':
            if (name) {
                localStorage.removeItem(overrideEntryHistoryKey(name));
            }
            else {
                // Delete all override history entries
                const prefix = skOverrideEntryHistoryPrefix;
                for (let i = localStorage.length - 1; i >= 0; i--) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith(prefix)) {
                        localStorage.removeItem(key);
                    }
                }
            }
            break;
        case 'vite-servers':
            localStorage.removeItem(skViteDevServers);
            break;
        default:
            throw new Error(`Unknown data entry type: ${entry}`);
    }
}
