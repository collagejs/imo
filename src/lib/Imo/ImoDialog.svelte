<script lang="ts">
    import { BookOpenText, RefreshCcw } from "@lucide/svelte";
    import Dialog from "../Dialog.svelte";
    import Button from "../Button.svelte";
    import DialogContent from "./DialogContent.svelte";
    import { importMapOverrides } from "../state/importMapOverrides.svelte";
    import { getFinalImportMap, mapImportMapToArray, mergeOverridesWithImportMap } from "./import-map-utils.svelte";
    import DeleteAndReload from "./DeleteAndReload.svelte";

    type Props = {
        show?: boolean;
    };

    let { show = $bindable(false) }: Props = $props();

    let reloadApp = $state(false);
    const importMapData = mapImportMapToArray(getFinalImportMap());
    let overrideData = $state(mergeOverridesWithImportMap(importMapData));
    let pendingOverrides = $derived(overrideData.some((item) => {
        const savedOverride = importMapOverrides.current.find(
            (ovr) =>
                ovr.scope === item.scope &&
                ovr.bareIdentifier === item.moduleId,
        );
        return (
            (savedOverride &&
                (item.override.replacement !== savedOverride.replacement ||
                    item.override.active !== savedOverride.active)) ||
            (!savedOverride && item.override.replacement)
        );
    }));

    function saveOverrides() {
        importMapOverrides.current = overrideData
            .filter((item) => !!item.override.replacement)
            .map((item) => item.override);
        reloadApp = true;
    }
</script>

<Dialog bind:show>
    {#snippet title()}
        <h2><BookOpenText /> Import Map Overrides</h2>
    {/snippet}
    {#if reloadApp}
        <DeleteAndReload />
    {:else}
        <DialogContent bind:overrideData />
    {/if}
    {#snippet footer()}
        {#if pendingOverrides}
            <Button variant="primary" onclick={saveOverrides}>
                <RefreshCcw size="1.1em" /> Save Overrides & Reload
            </Button>
        {/if}
        <Button variant="secondary" onclick={() => (show = false)}>
            Close
        </Button>
    {/snippet}
</Dialog>
