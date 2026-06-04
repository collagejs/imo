import { persistedState } from "svelte-persisted-state";
import { skOverrides } from "../../shared/storage-keys";
import type { ImoOverride } from "../../private-types";

export const importMapOverrides = persistedState(skOverrides, [] as ImoOverride[], {
    storage: 'local',
});
