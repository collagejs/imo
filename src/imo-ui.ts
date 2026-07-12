import { ensureGlobalCollageJs } from "@collagejs/core";
import { ensureImoController } from "./shared/common.js";
import { getInitialImoUiFactoryOptions } from "./shared/options.js";
import { UiController } from "./UiController.js";

ensureGlobalCollageJs();
ensureImoController();
// @ts-expect-error TS2540 - ui property is declared as read-only.
CollageJs.Imo.ui = new UiController();
const imoUiOptions = await getInitialImoUiFactoryOptions();
if (imoUiOptions.localStorageTrigger && localStorage.getItem(imoUiOptions.localStorageTrigger) === 'true') {
    CollageJs.Imo.ui.mount(imoUiOptions.shadow);
}
