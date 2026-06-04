import './global';
import type { CorePiece } from "@collagejs/core";

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
