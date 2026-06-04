import { MediaQuery } from "svelte/reactivity";
import { imoUiOptions } from "./imoUiOptions.js";

export class EffectiveTheme {
    #themeMq = new MediaQuery('(prefers-color-scheme: dark)');
    current = $derived(imoUiOptions.current.theme === 'system' ? (this.#themeMq.current ? 'dark' : 'light') : imoUiOptions.current.theme);
}

export const effectiveTheme = new EffectiveTheme();
