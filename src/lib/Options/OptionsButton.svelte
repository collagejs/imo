<script lang="ts">
    import type { ComponentProps } from 'svelte';
    import IconButton from '../IconButton.svelte';
    import { Settings } from 'lucide-svelte';
    import OptionsDialog from './OptionsDialog.svelte';

    let {
        class: cssClass,
        ...restProps
    }: Omit<ComponentProps<typeof IconButton>, 'icon'> = $props();

    let showSettings = $state(false);
</script>

<IconButton
    class={["cjs-p-1", cssClass]}
    onclick={() => showSettings = !showSettings}
    {...restProps}
    icon={Settings}
/>
<OptionsDialog bind:show={showSettings} />
