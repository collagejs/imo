<script lang="ts">
    import type { ComponentProps } from 'svelte';
    import IconButton from '../IconButton.svelte';
    import { Newspaper } from 'lucide-svelte';
    import LogDialog from './LogDialog.svelte';

    let { ...restProps }: Omit<ComponentProps<typeof IconButton>, 'icon'> = $props();

    let showLog = $state(false);
</script>

<IconButton
    size="sm"
    {...restProps}
    icon={Newspaper}
    title="View IMO logs..."
    onclick={() => (showLog = !showLog)}
/>

<LogDialog bind:show={showLog} />
