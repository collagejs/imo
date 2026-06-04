import { mount } from 'svelte';
import App from './App.svelte';
import { getInitialImoUiOptions } from './shared/options.js';
import { initImoUiOptions } from './lib/state/imoUiOptions.js';

initImoUiOptions(await getInitialImoUiOptions());

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
