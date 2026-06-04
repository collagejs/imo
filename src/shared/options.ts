import wjConfig from "wj-config";
import type { ImPostingOptions, RequiredImoUiOptions } from "../private-types.js";
import { skImoUiOptions } from "./storage-keys.js";
import type { ImoUiOptions } from "../types.js";

/**
 * Identifier used to tag IMO options.
 */
export const imPostingOptionsId = "collagejs-im-post-options";

/**
 * Identifier used to tag IMO UI options.
 */
export const imoUiOptionsId = "collagejs-imo-ui-options";

/**
 * Default import map posting options.
 */
const defaultImPostingOptions: Required<ImPostingOptions> = {
    importMapEndpoint: '/__import_map',
    autoAllowLocalhost: 'all',
    retryOptions: {
        retries: 5,
        factor: 2,
        minTimeout: 1_000,
        maxTimeout: 10_000,
    }
};

/**
 * Default IMO UI options.
 */
export const defaultImoUiOptions: RequiredImoUiOptions = {
    theme: 'system',
    position: 'bottom-right',
    language: 'en',
    localStorageTrigger: 'imo-ui',
    glass: {
        enabled: true,
        blur: 15,
        opacity: 0.1,
        saturation: 110,
    },
};

/**
 * Locates, reads and returns the set options for the import map posting process.  If none are found, then the
 * default options are returned instead.
 *
 * **IMPORTANT:**  The resulting set of options is the merge between the default options and developer-provided
 * options.
 * @returns The retrieved options or the default values.
 */
export async function readImPostingOptions(): Promise<Required<ImPostingOptions>> {
    let optionsScript: HTMLElement | null;
    try {
        return await wjConfig()
            .addObject(defaultImPostingOptions)
            .addJson<{}>(() => Promise.resolve(optionsScript!.textContent))
            .when(() => {
                optionsScript = document.querySelector(`script[type="application/json"][id="${imPostingOptionsId}"]`);
                return !!optionsScript?.textContent;
            })
            .build();
    }
    catch (e) {
        console.warn(`Failed to parse the IMO options found in the document: ${e}`);
        return structuredClone(defaultImPostingOptions);
    }
}

/**
 * Calculates the initial options for the IMO user interface.
 *
 * Sources, in increasing order of precedence:
 *   - The library's default options
 *   - The settings set in the `"collagejs-imo-ui-options"` script in the HEAD element
 *   - The provided set of options via the `options` parameter
 *
 * The script is set by the `@collagejs/vite-im` Vite plug-in; the parameter carries the values given to the IMO UI
 * factory function.
 * @param options Optional set of options that are merged last (and therefore has the highest priority).
 * @returns The final initial set of options for the IMO user interface.
 */
export async function getInitialImoUiOptions(options?: ImoUiOptions): Promise<RequiredImoUiOptions> {
    let optionsScript: HTMLElement | null;
    try {
        return await wjConfig()
            .addObject(defaultImoUiOptions)
            .addJson<{}>(() => Promise.resolve(optionsScript!.textContent))
            .when(() => {
                optionsScript = document.querySelector(`script[type="application/json"][id="${imoUiOptionsId}"]`);
                return !!optionsScript?.textContent;
            })
            .addObject<{}>(options ?? {})
            .build();
    }
    catch (e) {
        console.warn(`Failed to parse default IMO settings: ${(e as Error).message}`);
        return structuredClone(defaultImoUiOptions);
    }
}

/**
 * Reads the current IMO UI options from local storage.
 * @returns The stored IMO UI options, or null if nothing was saved.
 */
export function readCurrentImoUiOptions() {
    const raw = localStorage.getItem(skImoUiOptions);
    if (!raw) {
        return null;
    }
    return JSON.parse(raw) as RequiredImoUiOptions;
}

/**
 * Writes the given IMO UI options to local storage.
 * @param options The preference values to store.
 */
export function writeImoUiOptions(options: RequiredImoUiOptions) {
    localStorage.setItem(skImoUiOptions, JSON.stringify(options));
}

/**
 * Deletes the stored IMO UI options.
 */
export function deleteStoredImoUiOptions() {
    localStorage.removeItem(skImoUiOptions);
}
