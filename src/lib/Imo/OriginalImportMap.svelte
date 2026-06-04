<script lang="ts">
    import Table from '../Table.svelte';
    import { getOriginalImportMap, mapImportMapToArray } from './import-map-utils.svelte';

    const importMapData = mapImportMapToArray(getOriginalImportMap());
    const cols = [
        { key: 'id', label: 'Module Specifier' },
        { key: 'address', label: 'Address' },
    ] satisfies { key: keyof (typeof importMapData)[0]; label: string }[];
</script>

<p>
    This is the original import map as defined before any overrides were applied. It is the resultant import map from
    merging all import maps found in the HTML HEAD element of type <code>overridable-importmap</code>.
</p>
<Table {cols} data={importMapData} size="compact">
    {#snippet header(col)}
        <strong>{col.label}</strong>
    {/snippet}
    {#snippet cell(record, _, col)}
        {#if col.key === 'address'}
            <span class="address">{record[col.key]}</span>
        {:else}
            <span class="specifier">{record[col.key]}</span>
        {/if}
    {/snippet}
</Table>

<style>
    .specifier {
        font-family: monospace;
    }

    .address {
        font-family: monospace;
    }
</style>
