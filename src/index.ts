import { buildPiece } from "@collagejs/svelte";
import Imo from "./lib/Imo.svelte";
import { cssMountFactory } from "@collagejs/vite-css/ex";
import type { ImoUiFactoryOptions } from "./types.js";
import { getInitialImoUiFactoryOptions } from "./shared/options.js";
import { initImoUiOptions } from "./lib/state/imoUiOptions";
import type { CorePiece } from "@collagejs/core";

const cssMount = cssMountFactory('piece');

export async function imoUiFactory(options?: ImoUiFactoryOptions): Promise<CorePiece<{}>> {
    const initialOptions = await getInitialImoUiFactoryOptions(options);
    const mountFn = initialOptions?.base ? cssMount.bind({ base: initialOptions.base }) : cssMount;
    initImoUiOptions(initialOptions.ui);
    const corePiece = buildPiece(Imo);
    return {
        mount: [mountFn, corePiece.mount],
        update: corePiece.update,
    };
}
