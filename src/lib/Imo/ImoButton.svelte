<script lang="ts">
    import logo from '@collagejs/core/logo/64';
    import Button from '../Button.svelte';
    import type { ComponentProps } from 'svelte';
    import ImoDialog from './ImoDialog.svelte';

    let {
        ...restProps
    }: ComponentProps<typeof Button> = $props();

    let showImo = $state(false);
</script>

<Button class="cjs-p-1" title="CollageJS Import Map Overrides" {...restProps} onclick={() => showImo = !showImo}>
    <img src="{logo}" alt="CollageJS Import Map Overrides" width="64" height="64" />
</Button>
<ImoDialog bind:show={showImo} />
