<script lang="ts">
    import {
        ArrowBigLeftDash,
        ArrowBigRightDash,
        Binoculars,
        Check,
        Delete,
        Pencil,
        X,
    } from "lucide-svelte";
    import IconButton from "../IconButton.svelte";
    import Table from "../Table.svelte";
    import {
        findOriginalAddress,
        getOriginalImportMap,
    } from "./import-map-utils.svelte.js";
    import Toggle from "../Toggle.svelte";
    import type { OverrideData } from "../../private-types.js";
    import { OverrideHistory } from "../state/OverrideHistory";

    type Props = {
        data: OverrideData[];
    };

    let { data = $bindable() }: Props = $props();

    const originalImportMap = getOriginalImportMap();
    const overrideInputs = $derived.by(() => {
        const result = $state<
            Record<string, { value: string; history: OverrideHistory }>
        >({});
        for (const row of data) {
            result[row.id] = {
                value: "",
                history: new OverrideHistory(row.id),
            };
        }
        return result;
    });
    let searchTerm = $state("");
    const filteredData = $derived.by(() => {
        if (!searchTerm) {
            return data;
        }
        return data.filter(
            (row) =>
                row.id.includes(searchTerm) ||
                row.override.replacement?.includes(searchTerm) ||
                row.address.includes(searchTerm),
        );
    });
    const cols = [
        { key: "id", label: "Module Specifier" } as const,
        { key: "address", label: "Address" } as const,
        { key: "override", label: "Override" } as const,
        { key: "actions", label: "Actions" } as const,
    ];

    function acceptOverrideChange(row: (typeof data)[number]) {
        row.override.replacement = overrideInputs[row.id]?.value || "";
        row.override.active = true;
        row.editing = false;
        overrideInputs[row.id].value = "";
        overrideInputs[row.id].history.push(row.override.replacement);
    }

    function startEdit(row: (typeof data)[number]) {
        row.editing = true;
        row.override.active = !!row.override.replacement || row.override.active;
        overrideInputs[row.id].value = "";
    }
</script>

<p>
    This is the current import map with all active overrides applied. This is
    also where you can manage current and new overrides.
</p>
<div class="cjs-input-group">
    <span class="cjs-addon">Search</span>
    <input
        type="text"
        bind:value={searchTerm}
        placeholder="Search within identifiers and addresses"
        class="cjs-input"
    />
    <IconButton
        variant="primary"
        icon={Binoculars}
        title="Search"
        disabled={!searchTerm}
    />
    <IconButton
        variant="secondary"
        icon={Delete}
        title="Clear Search"
        onclick={() => (searchTerm = "")}
        disabled={!searchTerm}
    />
</div>
<Table {cols} data={filteredData} size="compact">
    {#snippet header(col)}
        <strong>{col.label}</strong>
    {/snippet}
    {#snippet cell_actions(row)}
        <div class="cjs-flex cjs-gap-2">
            <div class="cjs-btn-group">
                {#if row.editing}
                    <IconButton
                        icon={Check}
                        variant="primary"
                        title="Accept change"
                        onclick={() => acceptOverrideChange(row)}
                    />
                    <IconButton
                        icon={X}
                        variant="warning"
                        title="Cancel edit"
                        onclick={() => (row.editing = false)}
                    />
                {:else}
                    <IconButton
                        icon={Pencil}
                        variant="primary"
                        title="Edit override"
                        onclick={() => startEdit(row)}
                    />
                    <IconButton
                        icon={Delete}
                        variant="warning"
                        title="Delete override"
                        onclick={() => (
                            (row.override.replacement = ""),
                            (row.override.active = false)
                        )}
                        disabled={!row.override.replacement}
                    />
                {/if}
            </div>
            <Toggle
                bind:toggled={row.override.active}
                hideLabel
                label="Enable or disable this override"
                on="Enabled"
                off="Disabled"
                disabled={!row.override.replacement}
            />
        </div>
    {/snippet}
    {#snippet cell_override(row)}
        {#if row.editing}
            {@const history = overrideInputs[row.id].history}
            <input
                type="text"
                class="cjs-input"
                bind:value={overrideInputs[row.id].value}
                list={history.current.length ? `history-${row.id}` : undefined}
            />
            <datalist id={`history-${row.id}`}>
                {#each history.current as pastValue}
                    <option value={pastValue}>{pastValue}</option>
                {/each}
            </datalist>
        {:else if row.override.replacement}
            <div class="cjs-text-success cjs-font-semibold">
                {row.override.replacement}
            </div>
        {:else}
            <span class="cjs-text-muted">(none)</span>
        {/if}
    {/snippet}
    {#snippet cell_address(row)}
        {#if row.overridden}
            <div class="cjs-text-muted cjs-flex cjs-items-center cjs-gap-2">
                <ArrowBigLeftDash strokeWidth={1} size="1em" />
                {findOriginalAddress(originalImportMap, row)}
            </div>
        {/if}
        <div class="cjs-flex cjs-items-center cjs-gap-2">
            {#if row.overridden}
                <ArrowBigRightDash fill="currentColor" size="1em" />
            {/if}
            <span class={[row.overridden && "cjs-font-semibold"]}
                >{row.address}</span
            >
        </div>
    {/snippet}
    {#snippet cell_id(row)}
        <span>{row.id}</span>
        {#if row.overridden}
            <span class="cjs-badge cjs-badge-primary" title="Overridden"
                >ovr</span
            >
        {/if}
    {/snippet}
</Table>
