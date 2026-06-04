/*
Tasks:

1. Collect all import maps in the HEAD element.
    - Validate as they are picked up.
    - Discard invalid ones with warnings.
2. Merge the collected valid import maps.
3. Save the merged import map to session storage.
4. Apply active overrides from local storage to a copy of the merged import map.
5. Inject the resulting import map into the document.
6. Post the resulting import map to any Vite dev servers allowed in local storage
that are mentioned in the resulting import map, plus the page's origin if applicable.

*/
import { validate } from "@collagejs/importmap";
import { skFinalImportMap, skImportMap, skOverrides, skViteDevServers } from "../shared/storage-keys.js";
import type { ImoOverride, ImPostingOptions, MergedImportMap, ValidatedImportMap } from "../private-types.js";
import pRetry from "p-retry";
import { ensureImoController, getStoredDevServers, isViteServer } from "../shared/common.js";
import { readImPostingOptions } from "../shared/options.js";
import { ensureGlobalCollageJs } from "@collagejs/core";
import { Logger } from "./Logger.js";

function mergeAllImportMaps(): ValidatedImportMap<MergedImportMap> {
    const mergedImportMap = {
        imports: {} as Record<string, string>,
        scopes: {} as Record<string, Record<string, string>>,
        integrity: {} as Record<string, string>,
    };
    const importMapElements = document.head.querySelectorAll('script[type="overridable-importmap"]');
    logger.info(`Found ${importMapElements.length} import map source(s) in the document.`);
    importMapElements.forEach((element) => {
        try {
            const importMap = JSON.parse(element.textContent || '{}');
            const validInfo = validate(importMap);
            if (!validInfo.valid) {
                logger.warn(`Invalid import map detected! ${validInfo.errors.length} error(s):`);
                for (const e of validInfo.errors) {
                    logger.warn(` - ${e}`);
                }
                return;
            }
            if (importMap.imports && typeof importMap.imports === 'object') {
                Object.assign(mergedImportMap.imports, importMap.imports);
            }
            if (importMap.scopes && typeof importMap.scopes === 'object') {
                Object.entries(importMap.scopes).forEach(([scope, mappings]) => {
                    if (!mergedImportMap.scopes[scope]) {
                        mergedImportMap.scopes[scope] = {};
                    }
                    Object.assign(mergedImportMap.scopes[scope], mappings);
                });
            }
            if (importMap.integrity && typeof importMap.integrity === 'object') {
                Object.assign(mergedImportMap.integrity, importMap.integrity);
            }
        } catch (e) {
            logger.warn(`Failed to parse import map: ${(e as Error).message}`);
            logger.warn(`Discarding import map: ${element.textContent}`);
        }
    });
    const validInfo = validate(mergedImportMap);
    return { importMap: mergedImportMap, errors: validInfo.errors };
}

function applyImOverrides(importMap: MergedImportMap) {
    importMap = structuredClone(importMap);
    const configuredOverrides = JSON.parse(localStorage.getItem(skOverrides) || '[]') as ImoOverride[];
    configuredOverrides.forEach((override) => {
        if (!override.active) {
            logger.info(`Skipping inactive override for ${override.bareIdentifier} in scope "${override.scope ?? 'global'}".`);
            return;
        }
        const destination = override.scope ? (importMap.scopes[override.scope] = importMap.scopes[override.scope] || {}) : importMap.imports;
        destination[override.bareIdentifier] = override.replacement;
        logger.info(`Applied override for "${override.bareIdentifier}"${override.scope ? ` in scope "${override.scope}"` : ''}: ${override.replacement}.`);
    });
    const validInfo = validate(importMap);
    if (!validInfo.valid) {
        logger.warn(`Import map after applying overrides is invalid! (${validInfo.errors.length} error(s)):`);
        for (const e of validInfo.errors) {
            logger.warn(` - ${e}`);
        }
    }
    return { importMap, errors: validInfo.errors };
}

function discoverViteServers(importMap: MergedImportMap, autoAllowOption: Required<ImPostingOptions>['autoAllowLocalhost']): Map<string, boolean> {
    const servers = new Map<string, boolean>();
    const allUrls = Object.values(importMap.imports);
    // Also include the page's own URL at the top so it's the first receiving the import map.
    allUrls.unshift(location.href);
    Object.values(importMap.scopes).forEach((scopeMappings) => {
        allUrls.push(...Object.values(scopeMappings));
    });
    allUrls.forEach((urlStr) => {
        try {
            const url = new URL(urlStr);
            servers.set(url.origin, isViteServer(url, autoAllowOption));
        }
        catch { } // Ignore invalid URLs or the ones without a valid origin.
    });
    return servers;
}

function saveDiscoveredViteServers(viteServers: Map<string, boolean>) {
    const result = [] as [string, boolean][];
    // Merge with existing list.
    const existingServers = getStoredDevServers();
    for (const [origin, allowPostImportMap] of existingServers.entries()) {
        result.push([origin, allowPostImportMap]);
    }
    for (const [origin, allowPostImportMap] of viteServers.entries()) {
        if (!existingServers.has(origin)) {
            result.push([origin, allowPostImportMap]);
        }
    }
    localStorage.setItem(skViteDevServers, JSON.stringify(result));
    logger.info(`Saved discovered Vite servers to local storage: ${result.length} server(s).`);
}

function injectImportMap(importMap: MergedImportMap) {
    const script = document.createElement('script');
    script.type = 'importmap';
    script.textContent = JSON.stringify(importMap, null, 2);
    // const currentScript = document.currentScript || document.querySelector('script[src*="imo"]') || document.scripts[document.scripts.length - 1];
    const currentScript = document.currentScript;
    if (currentScript && currentScript.parentNode) {
        currentScript.parentNode.insertBefore(script, currentScript);
    } else {
        document.head.appendChild(script);
    }
    logger.info("Injected final import map into the document.");
}

async function postImportMapToViteServers(importMap: MergedImportMap, foundViteServers: string[], options: Required<ImPostingOptions>) {
    const viteServers = getStoredDevServers();
    const postPromises = [] as Promise<void>[];
    const body = JSON.stringify(importMap);
    const involvedViteServers = new Set(foundViteServers ? Array.from(foundViteServers).filter((origin) => {
        if (viteServers.get(origin)) {
            return true;
        }
        logger.info(`Vite server at ${origin} is not allowed to receive the import map. Skipping.`);
        return false;
    }) : []);
    let serverCount = 0;
    const postImportMaps = (serverUrl: string) => {
        postPromises.push(pRetry(async (attemptNumber) => {
            const response = await fetch(`${serverUrl}${options.importMapEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body,
            });
            if (response.ok) {
                ++serverCount;
                logger.info(`Successfully posted import map to Vite server at ${serverUrl}.`);
            }
            else {
                logger.warn(`Attempt #${attemptNumber}:  Failed to post import map to Vite server at ${serverUrl}: ${response.status} ${response.statusText}`);
            }
        }, {
            ...options.retryOptions,
            onFailedAttempt: (error) => {
                if (error.retriesLeft > 0) {
                    logger.warn(`Attempt ${error.attemptNumber} to post import map to ${serverUrl} failed. There are ${error.retriesLeft} retries left.`);
                }
                else {
                    logger.error(`All attempts to post import map to Vite server at ${serverUrl} have failed.`);
                }
                logger.save();
            },
        }));
    };
    involvedViteServers.forEach((serverUrl) => {
        postImportMaps(serverUrl);
    });
    await Promise.all(postPromises);
    logger.info(`Import map posting complete. Posted successfully to ${serverCount} Vite server(s).`);
}

async function main() {
    ensureGlobalCollageJs();
    ensureImoController();
    logger.info("@collagejs/imo started!");
    try {
        const mergedImportMap = mergeAllImportMaps();
        sessionStorage.setItem(skImportMap, JSON.stringify(mergedImportMap));
        const finalImportMap = applyImOverrides(mergedImportMap.importMap);
        sessionStorage.setItem(skFinalImportMap, JSON.stringify(finalImportMap));
        if (finalImportMap.errors.length > 0) {
            logger.warn(`The resulting import map turned out invalid.  Will not be injected or posted to Vite servers.`);
            return;
        }
        injectImportMap(finalImportMap.importMap);
        const options = await readImPostingOptions();
        const foundViteServers = await discoverViteServers(finalImportMap.importMap, options.autoAllowLocalhost);
        saveDiscoveredViteServers(foundViteServers);
        logger.save();
        await postImportMapToViteServers(finalImportMap.importMap, [...foundViteServers.keys()], options);
    }
    finally {
        logger.info("@collagejs/imo completed.");
        logger.save();
    }
}

const logger = new Logger();
main();
