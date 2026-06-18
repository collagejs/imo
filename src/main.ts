import { mount } from 'svelte';
import App from './App.svelte';
import { getInitialImoUiFactoryOptions } from './shared/options.js';
import { initImoUiOptions } from './lib/state/imoUiOptions.js';

initImoUiOptions((await getInitialImoUiFactoryOptions()).ui);

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
