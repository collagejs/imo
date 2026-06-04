import { mountPiece, type CorePiece, type MountedPiece } from "@collagejs/core";
import { imoUiFactory } from "./index.js";

export class UiController {
    #piece: CorePiece<{}> | undefined;
    #mountedPiece: MountedPiece<{}> | undefined;
    #target: HTMLElement | undefined;

    async mount() {
        if (this.#mountedPiece) {
            throw new Error('IMO UI is already mounted.');
        }
        this.#piece = await imoUiFactory();
        this.#target = document.createElement('div');
        document.body.append(this.#target);
        this.#mountedPiece = await mountPiece(this.#piece, this.#target);
    }
    async unmount() {
        if (!this.#mountedPiece) {
            throw new Error('Cannot unmount:  IMO UI is not mounted.');
        }
        await this.#mountedPiece.unmount();
        document.body.removeChild(this.#target!);
        this.#mountedPiece = undefined;
        this.#piece = undefined;
    }
}
