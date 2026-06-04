import { persistedState } from 'svelte-persisted-state';
import type { RequiredImoUiOptions } from '../../private-types.js';
import { skImoUiOptions } from '../../shared/storage-keys.js';

let imoUiOptions: ReturnType<typeof persistedState<RequiredImoUiOptions>>;

/**
 * Initializes the Svelte reactive store that contains the options for the user interface piece of
 * the `@collagejs/imo` library.
 * @param initialValue Initial options to configure.
 */
export function initImoUiOptions(initialValue: RequiredImoUiOptions) {
    imoUiOptions = persistedState(skImoUiOptions, initialValue, {
        storage: 'local',
        syncTabs: true
    });
}

export { imoUiOptions };
