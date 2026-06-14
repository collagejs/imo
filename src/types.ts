import './global';
import type { CorePiece } from "@collagejs/core";
import type { Options as PRetryOptions } from 'p-retry';

/**
 * Possible positions for the `@collagejs/imo` UI floating buttons.
 */
export type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
/**
 * Possible themes for the `@collagejs/imo` UI.
 */
export type Theme = 'light' | 'dark' | 'system';
/**
 * Settings for the glass effect in the `@collagejs/imo` UI.
 */
export type GlassSettings = {
    /**
     * Whether the glass effect is enabled.
     * @default true
     */
    enabled?: boolean;
    /**
     * Opacity of the glass effect (0 to 1).
     * @default 0.1
     */
    opacity?: number;
    /**
     * Blur amount of the glass effect (in pixels).
     * @default: 10
     */
    blur?: number;
    /**
     * Saturation amount of the glass effect (percentage).
     * @default 110
     */
    saturation?: number;
};
/**
 * Per-site preferences for the `@collagejs/imo` UI.
 */
export type ImoUiOptions = {
    /**
     * Desired position for the `@collagejs/imo` UI floating buttons.
     * @default 'bottom-right'
     */
    position?: Position;
    /**
     * Desired language for the `@collagejs/imo` UI.
     * @default 'en'
     */
    language?: string | undefined;
    /**
     * Desired theme for the `@collagejs/imo` UI.
     * @default 'system'
     */
    theme?: Theme;
    /**
     * Desired local storage key name used to automatically mount the IMO user interface.
     * @default 'imo-ui'
     */
    localStorageTrigger?: string | undefined;
    /**
     * Settings for the glass effect in the `@collagejs/imo` UI.
     */
    glass?: GlassSettings;
}
/**
 * Options that can be specified when creating the `@collagejs/imo` UI *CollageJS* piece.
 */
export type ImoUiFactoryOptions = {
    /**
     * Base URL for CSS assets.  This value overrides Vite's base if specified.
     *
     * **TIP**:  Use it when serving the *CollageJS* piece from a different origin than the main page.
     */
    base?: string;
    /**
     * Whether to mount the *CollageJS* piece inside a shadow DOM root.
     */
    shadowDom?: boolean;
    /**
     * User interface options.
     */
    ui?: ImoUiOptions;
}
/**
 * Creates a *CollageJS* piece that provides the `@collagejs/imo` user interface.
 * @param options Optional set of factory options.
 * @returns A promise resolving to the created *CollageJS* core piece.  Use *CollageJS*'s `mountPiece()` function
 * to mount it.
 */
export declare function imoUiFactory(options?: ImoUiFactoryOptions): Promise<CorePiece<{}>>;

/**
 * Identifier used to tag IMO options.
 */
export declare const imPostingOptionsId: string;

/**
 * Identifier used to tag IMO UI options.
 */
export declare const imoUiOptionsId: string;

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
