import type { ImportMap } from "@collagejs/importmap";
import { skFinalImportMap, skImportMap } from "../../shared/storage-keys";
import type { ImoEntry, ImoOverride } from "../../private-types";
import { importMapOverrides } from "../state/importMapOverrides.svelte";

function getImportMap(key: string): ImportMap {
    const importMapString = sessionStorage.getItem(key);
    if (importMapString) {
        try {
            const importMap: ImportMap = JSON.parse(importMapString).importMap;
            return importMap;
        }
        catch (e) {
            console.error("Failed to parse import map from session storage:", e);
            return { imports: {}, scopes: {} };
        }
    }
    return { imports: {}, scopes: {} };
}

export function getOriginalImportMap() {
    return getImportMap(skImportMap);
}

export function getFinalImportMap(): ImportMap {
    return getImportMap(skFinalImportMap);
}

function getScopedKey(scope: string, id: string) {
    return `${scope}: ${id}`
}

export function mapImportMapToArray(importMap: ImportMap): ImoEntry[] {
    const entries: ImoEntry[] = [];
    for (const [moduleId, address] of Object.entries(importMap.imports || {})) {
        entries.push({
            id: moduleId,
            moduleId,
            address,
        });
    }
    for (const [key, addressList] of Object.entries(importMap.scopes || {})) {
        for (const [subKey, subAddress] of Object.entries(addressList)) {
            entries.push({
                id: getScopedKey(key, subKey),
                scope: key,
                moduleId: subKey,
                address: subAddress
            });
        }
    }
    return entries;
}

export function mergeOverridesWithImportMap(importMapData: ImoEntry[]) {
    const result = [] as (ImoEntry & {
        overridden: boolean;
        override: ImoOverride;
        editing: boolean;
    })[];
    const remainingEntries = [...importMapData];
    for (const override of importMapOverrides.current) {
        const index = remainingEntries.findIndex(e => e.scope === override.scope && e.moduleId === override.bareIdentifier);
        const entry = remainingEntries[index];
        if (entry) {
            remainingEntries.splice(remainingEntries.indexOf(entry), 1);
            result.push({
                ...entry,
                overridden: entry.address === override.replacement,
                override: $state.snapshot(override),
                editing: false,
            });
        }
    }
    result.push(
        ...remainingEntries.map(e => ({
            ...e,
            overridden: false,
            editing: false,
            override: {
                scope: e.scope,
                bareIdentifier: e.moduleId,
                replacement: '',
                active: false,
            }
        })),
    );
    return result;
}

export function findOriginalAddress(importMap: ImportMap, entry: ImoEntry): string | null {
    const scope = entry.scope ? importMap.scopes?.[entry.scope] : importMap.imports;
    return scope?.[entry.moduleId] || null;
}
