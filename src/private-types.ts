import { type ImportMap } from "@collagejs/importmap";
import type { GlassSettings, ImoUiOptions } from "./types.js";

/**
 * Version of `ImoUiOptions` where every setting is a required setting.
 */
export type RequiredImoUiOptions = Required<Omit<ImoUiOptions, 'glass'>> & {
    /**
     * Settings for the glass effect in the `@collagejs/imo` UI.
     */
    glass: Required<GlassSettings>;
}
/**
 * An entry in `@collagejs/imo`'s log.
 */
export type ImoLogEntry = {
    /**
     * Timestamp of the log entry.
     */
    timestamp: number;
    /**
     * Log level.
     */
    level: 'info' | 'warning' | 'error';
    /**
     * Log message.
     */
    message: string;
};
/**
 * An override rule for module imports.
 */
export type ImoOverride = {
    /**
     * Optional scope for the override.
     */
    scope?: string;
    /**
     * The bare module identifier to override.
     */
    bareIdentifier: string;
    /**
     * The replacement module specifier or URL.
     */
    replacement: string;
    /**
     * Whether the override is active.
     */
    active?: boolean;
};
/**
 * An entry in an import map.
 */
export type ImoEntry = {
    /**
     * Unique identifier calculated from the scope and module ID.
     */
    id: string;
    /**
     * Optional scope of the import entry.
     */
    scope?: string | undefined;
    /**
     * Module identifier.
     */
    moduleId: string;
    /**
     * Resolvable address for the module identifier.
     */
    address: string;
}
/**
 * An import map that has been merged from multiple sources.
 */
export type MergedImportMap = Required<ImportMap>;
/**
 * A validated import map, including any validation errors.
 */
export type ValidatedImportMap<T extends ImportMap = ImportMap> = {
    /**
     * List of validation errors, if any.
     */
    errors?: string[];
    /**
     * The validated import map.
     */
    importMap: T;
}
/**
 * Information `@collagejs/imo` stores about Vite development servers.
 */
export type ViteServerInfo = {
    /**
     * Origin URL of the Vite development server.
     */
    origin: string;
    /**
     * Whether the Vite server is allowed to receive the page's import map.
     */
    allowPostImportMap: boolean;
}
/**
 * Variant of `ViteServerInfo` that defines how the information is used (as a dictionary).
 */
export type ViteServerInfoRecord = Record<string, Omit<ViteServerInfo, 'origin'>>;
/**
 * An override entry enriched with additional data for use in the UI.
 */
export type OverrideData = ImoEntry & {
    /**
     * Whether the override is currently overriding the module address (as in "already applied").
     */
    overridden: boolean;
    /**
     * The override rule.
     */
    override: ImoOverride;
    /**
     * Whether the override is currently being edited.
     */
    editing: boolean;
};
