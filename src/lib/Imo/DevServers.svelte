<script lang="ts">
    import { Delete } from 'lucide-svelte';
    import type { ViteServerInfo } from '../../private-types.js';
    import Table from '../Table.svelte';
    import { viteDevServers } from '../state/videDevServers.js';
    import Toggle from '../Toggle.svelte';
    import IconButton from '../IconButton.svelte';

    const cols = [
        { key: 'origin', label: 'Origin' },
        { key: 'allowPostImportMap', label: 'Allowed to Receive Import Maps' },
        { key: 'actions', label: 'Actions' },
    ] satisfies { key: keyof ViteServerInfo | 'actions'; label: string }[];

    const data = $derived(
        Object.entries(viteDevServers.current).map(([origin, info]) => ({
            id: origin,
            origin,
            ...info,
        })),
    );

    function deleteViteDevServer(origin: string) {
        delete viteDevServers.current[origin];
    }
</script>

<p>
    These are the development servers discovered from import map information. For each server, you can allow or deny
    import map information.
</p>
<Table {cols} {data} size="compact">
    {#snippet header(col)}
        <strong>{col.label}</strong>
    {/snippet}
    {#snippet cell(record, _, col)}
        {#if col.key === 'allowPostImportMap'}
            <Toggle
                bind:toggled={viteDevServers.current[record.origin].allowPostImportMap}
                hideLabel
                label="Allow this server to receive import maps"
                on="Allow"
                off="Deny"
            />
        {:else if col.key === 'actions'}
            <IconButton
                variant="warning"
                icon={Delete}
                title="Remove the {record.origin} entry"
                onclick={() => deleteViteDevServer(record.origin)}
            />
        {:else}
            <span class="origin">{record[col.key]}</span>
        {/if}
    {/snippet}
</Table>
