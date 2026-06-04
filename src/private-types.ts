import { type ImportMap } from "@collagejs/importmap";
import type { Options as PRetryOptions } from 'p-retry';
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
 * Supported `p-retry` options.
 */
export type RetryOptions = Omit<PRetryOptions, 'onFailedAttempt' | 'shouldRetry' | 'shouldConsumeRetry' | 'signal'>;
/**
 * Options to configure the import map overriding process.
 */
export type ImPostingOptions = {
    /**
     * Server endpoint.
     * @default '/__import_map'
     */
    importMapEndpoint?: string;
    /**
     * Determines which HTTP origins are automatically allowed to receive import maps.
     *
     * - `'loopback'`:  Only origins with host name `'localhost'` or a loopback IP address (`127/24`).
     * - `'private-ip'`:  Only origins using a private IP address (i. e. `192.168.3.111`).
     * - `'all'`:  Loopback and private IP addresses allowed.
     * - `'none'`:  Nothing gets automatically allowed to receive import maps.
     *
     * This applies for new origins discovered after the import map is merged and injected to the page.  If there
     * were origins already stored in configuration, then the stored configuration setting wins.
     *
     * Private IP addresses are useful when testing in mobile through a home/company private network.
     * @default 'all'
     */
    autoAllowLocalhost?: 'loopback' | 'private-ip' | 'all' | 'none';
    /**
     * Retry options used when posting import maps to Vite development servers.  Refer to `p-retry`'s
     * [documentation](https://github.com/sindresorhus/p-retry#api) on its options for more information.
     *
     * **NOTE:**  Only serializable options are supported.
     */
    retryOptions?: RetryOptions;
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
