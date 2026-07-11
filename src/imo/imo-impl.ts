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
import { skDiscoveredViteServers, skFinalImportMap, skImportMap, skOverrides, skViteDevServers } from "../shared/storage-keys.js";
import type { HttpOrigin, ImoOverride, MergedImportMap, ValidatedImportMap } from "../private-types.js";
import type { ImPostingOptions } from "../types.js";
import pRetry from "p-retry";
import { ensureImoController, getInvolvedViteServers, getStoredDevServers, isViteServer } from "../shared/common.js";
import { readImPostingOptions } from "../shared/options.js";
import { ensureGlobalCollageJs } from "@collagejs/core";
import { Logger } from "./Logger.js";

/**
 * Searches for all overridable import maps in the document, validates them, and merges them into a
 * single import map.
 *
 * Invalid overridable import maps are discarded as a whole before merging.
 *
 * The resulting import map is validated at the end of the merging process.
 * @returns The resultant import map object and any validation errors that it may possess.
 */
function mergeAllImportMaps(): ValidatedImportMap<MergedImportMap> {
    const mergedImportMap: MergedImportMap = {
        imports: {},
        scopes: {},
        integrity: {},
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
/**
 * Applies any active overrides from local storage to the provided import map.
 * @param importMap The merged import map object used as receptacle for overrides.
 * @returns The resulting (overridden) import map object and its validation errors, if any.
 */
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
        logger.warn(`Import map became invalid after applying overrides! (${validInfo.errors.length} error(s)):`);
        for (const e of validInfo.errors) {
            logger.warn(` - ${e}`);
        }
    }
    return { importMap, errors: validInfo.errors };
}
/**
 * Discovers Vite servers from the provided import map and auto-allow option.
 * @param importMap The merged import map object to search for Vite servers.
 * @param autoAllowOption The auto-allow option for localhost.
 * @returns A map of Vite server origins and their allow status.
 */
function discoverViteServers(
    importMap: MergedImportMap,
    autoAllowOption: Required<ImPostingOptions>['autoAllowLocalhost']
): Map<HttpOrigin, boolean> {
    const servers = new Map<HttpOrigin, boolean>();
    const allUrls = Object.values(importMap.imports);
    // Also include the page's own URL at the top so it's the first receiving the import map.
    allUrls.unshift(location.href);
    Object.values(importMap.scopes).forEach((scopeMappings) => {
        allUrls.push(...Object.values(scopeMappings));
    });
    allUrls.forEach((urlStr) => {
        try {
            const url = new URL(urlStr);
            if (isHttpOrigin(url.origin)) {
                servers.set(url.origin, isViteServer(url, autoAllowOption));
            }
            else {
                logger.info(`Ignoring non-HTTP(S) origin: ${url.origin}`);
            }
        }
        catch { } // Ignore invalid URLs or the ones without a valid origin.
    });
    return servers;
}
/**
 * Saves the discovered Vite servers to local storage, merging with any existing entries.
 * @param viteServers Discovered Vite servers.
 */
function saveDiscoveredViteServers(viteServers: Map<HttpOrigin, boolean>) {
    const result = [] as [string, boolean][];
    // Merge with existing list.
    const existingServers = getStoredDevServers();
    for (const [origin, allowPostImportMap] of existingServers.entries()) {
        result.push([origin, allowPostImportMap]);
    }
    for (const [origin, isVite] of viteServers.entries()) {
        if (isVite && !existingServers.has(origin)) {
            result.push([origin, true]);
        }
    }
    localStorage.setItem(skViteDevServers, JSON.stringify(result));
    logger.info(`Saved discovered Vite servers to local storage: ${result.length} server(s).`);
    sessionStorage.setItem(skDiscoveredViteServers, JSON.stringify([...viteServers.entries()]));
    logger.info(`Saved discovered Vite servers to session storage: ${viteServers.size} server(s).`);
}
/**
 * Injects the provided import map into the document's HEAD element as a script of type
 * `"importmap"`.
 * @param importMap Import map to inject to the page's HEAD element.
 */
function injectImportMap(importMap: MergedImportMap) {
    const script = document.createElement('script');
    script.type = 'importmap';
    script.textContent = JSON.stringify(importMap, null, 2);
    const currentScript = document.currentScript;
    if (currentScript && currentScript.parentNode) {
        currentScript.parentNode.insertBefore(script, currentScript);
    } else {
        document.head.appendChild(script);
    }
    logger.info("Injected final import map into the document.");
}
/**
 * Tests whether a value represents an HTTP origin.
 * @param value Value to test.
 * @returns `true` if the value represents an HTTP origin, or `false` otherwise.
 */
function isHttpOrigin(value: string): value is HttpOrigin {
    try {
        const url = new URL(value);
        return (url.protocol === 'http:' || url.protocol === 'https:') && value === url.origin;
    } catch {
        return false;
    }
}
/**
 * Posts the provided import map to all Vite servers that are allowed to receive it.
 * @param importMap Import map to send.
 * @param foundViteServers List of Vite servers that have been seen in the resultant import map.
 * @param options Import map posting options.
 */
async function postImportMapToViteServers(importMap: MergedImportMap, foundViteServers: HttpOrigin[], options: Required<ImPostingOptions>) {
    const postPromises = [] as Promise<void>[];
    const body = JSON.stringify(importMap);
    const [involvedViteServers, excludedViteServers] = getInvolvedViteServers(foundViteServers);
    excludedViteServers.forEach((origin) => {
        logger.info(`Vite server at ${origin} is not allowed to receive the import map. Skipping.`);
    });
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

export async function main() {
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
