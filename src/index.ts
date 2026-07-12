import { buildPiece } from "@collagejs/svelte";
import Imo from "./lib/Imo.svelte";
import { CssFactory } from "@collagejs/vite-css/ex";
import type { ImoUiFactoryOptions } from "./types.js";
import { getInitialImoUiFactoryOptions } from "./shared/options.js";
import { initImoUiOptions } from "./lib/state/imoUiOptions";
import type { CorePiece } from "@collagejs/core";

// Edge case where import.meta.url ends up in a chunk because some module imports from this file, and for
// import.meta.url to work without changes, it needs to stay in the chunk named after the entry file.
// TODO: Take some time to figure out a module graph that allows the use of CssFactory in a module that is not
// imported by any other module.  That should make this edge case disappear.
const url = import.meta.url;
let base = url.substring(0, url.lastIndexOf("/") + 1);
if (base.endsWith("/assets/")) {
    base = base.substring(0, base.length - "assets/".length);
}
const css = new CssFactory(base + 'index.js');

export async function imoUiFactory(options?: ImoUiFactoryOptions): Promise<CorePiece<{}>> {
    const initialOptions = await getInitialImoUiFactoryOptions(options);
    const { mount, relocate } = css.instantiate();
    initImoUiOptions(initialOptions.ui);
    const corePiece = buildPiece(Imo);
    return {
        ...corePiece,
        mount: [mount, corePiece.mount],
        // TODO:  Once buildPiece()'s type is fixed, the ! operator should not be needed here.
        relocate: [relocate, corePiece.relocate!],
    };
}
