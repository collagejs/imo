import { mountPiece, type CorePiece, type MountedPiece, type AcceptableTarget } from "@collagejs/core";
import { imoUiFactory } from "./index.js";

export class UiController {
    #piece: CorePiece<{}> | undefined;
    #mountedPiece: MountedPiece<{}> | undefined;
    #target: HTMLElement | undefined;

    async mount(shadow: boolean = true) {
        if (this.#mountedPiece) {
            throw new Error('IMO UI is already mounted.');
        }
        this.#piece = await imoUiFactory();
        let target: AcceptableTarget = this.#target = document.createElement('div');
        document.body.append(this.#target);
        if (shadow) {
            target = this.#target.attachShadow({ mode: 'closed' });
        }
        this.#mountedPiece = await mountPiece(this.#piece, target);
    }
    async unmount() {
        if (!this.#mountedPiece) {
            throw new Error('Cannot unmount:  IMO UI is not mounted.');
        }
        await this.#mountedPiece.unmount();
        document.body.removeChild(this.#target!);
        this.#mountedPiece = undefined;
        this.#piece = undefined;
        this.#target = undefined;
    }
}
