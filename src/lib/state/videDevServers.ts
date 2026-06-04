import { persistedState } from "svelte-persisted-state";
import { skViteDevServers } from "../../shared/storage-keys.js";
import type { ViteServerInfoRecord } from "../../private-types.js";

export const viteDevServers = persistedState(skViteDevServers, {} as ViteServerInfoRecord, {
    // @ts-expect-error This library's TS doesn't support 2 different value shapes.
    beforeWrite(value) {
        const result = [] as [string, boolean][];
        for (const [origin, info] of Object.entries((value))) {
            result.push([origin, info.allowPostImportMap]);
        }
        return result;
    },
    beforeRead(value) {
        const val = value as unknown as [string, boolean][];
        const result: ViteServerInfoRecord = {};
        for (const [origin, allowPostImportMap] of val) {
            result[origin] = { allowPostImportMap };
        }
        return result;
    }
});
