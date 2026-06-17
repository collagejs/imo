import { buildPiece } from "@collagejs/svelte";
import Imo from "./lib/Imo.svelte";
import { cssMountFactory } from "@collagejs/vite-css/ex";
import type { ImoUiFactoryOptions } from "./types.js";
import { getInitialImoUiOptions } from "./shared/options.js";
import { initImoUiOptions } from "./lib/state/imoUiOptions";
import type { CorePiece } from "@collagejs/core";

const cssMount = cssMountFactory('piece');

export async function imoUiFactory(options?: ImoUiFactoryOptions): Promise<CorePiece<{}>> {
    const mountFn = options?.base ? cssMount.bind({ base: options.base }) : cssMount;
    const initialOptions = await getInitialImoUiOptions(options?.ui);
    initImoUiOptions(initialOptions);
    const corePiece = buildPiece(Imo);
    return {
        mount: [mountFn, corePiece.mount],
        update: corePiece.update,
    };
}
