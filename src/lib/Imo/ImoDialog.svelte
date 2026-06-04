<script lang="ts">
    import { Bookmark, BookOpenText, BookOpenTextIcon, PcCase, RefreshCcw } from 'lucide-svelte';
    import Dialog from '../Dialog.svelte';
    import Tabs from '../Tabs/Tabs.svelte';
    import TabPanel from '../Tabs/TabPanel.svelte';
    import OriginalImportMap from './OriginalImportMap.svelte';
    import DevServers from './DevServers.svelte';
    import CurrentImportMap from './CurrentImportMap.svelte';
    import { getFinalImportMap, mapImportMapToArray, mergeOverridesWithImportMap } from './import-map-utils.svelte';
    import Button from '../Button.svelte';
    import { importMapOverrides } from '../state/importMapOverrides.svelte';

    type Props = {
        show?: boolean;
    };

    let { show = $bindable(false) }: Props = $props();
    const importMapData = mapImportMapToArray(getFinalImportMap());
    let overrideData = $derived.by(() => {
        const result = $state(mergeOverridesWithImportMap(importMapData));
        return result;
    });
    const pendingOverrides = $derived.by(() => {
        return overrideData.some((item) => {
            const savedOverride = importMapOverrides.current.find(
                (ovr) => ovr.scope === item.scope && ovr.bareIdentifier === item.moduleId,
            );
            return (
                (savedOverride &&
                    (item.override.replacement !== savedOverride.replacement ||
                        item.override.active !== savedOverride.active)) ||
                (!savedOverride && item.override.replacement)
            );
        });
    });
    $inspect(overrideData);

    function saveOverrides() {
        importMapOverrides.current = overrideData
            .filter((item) => !!item.override.replacement)
            .map((item) => item.override);
        location.reload();
    }
</script>

<Dialog bind:show>
    {#snippet title()}
        <h2><BookOpenText /> Import Map Overrides</h2>
    {/snippet}
    <p class="first-content">Manage your import map overrides using the tabs below.</p>
    <Tabs>
        {#snippet tab_current()}
            <span class="tab-title"><Bookmark size="1.2em" />Current</span>
        {/snippet}
        {#snippet tab_original()}
            <span class="tab-title"><BookOpenText size="1.2em" />Original</span>
        {/snippet}
        {#snippet tab_viteServers()}
            <span class="tab-title"><PcCase size="1.2em" />Dev Servers</span>
        {/snippet}
        <TabPanel id="current">
            <CurrentImportMap bind:data={overrideData} />
        </TabPanel>
        <TabPanel id="original">
            <OriginalImportMap />
        </TabPanel>
        <TabPanel id="viteServers">
            <DevServers />
        </TabPanel>
    </Tabs>
    {#snippet footer()}
        {#if pendingOverrides}
            <Button variant="primary" onclick={saveOverrides}><RefreshCcw size="1.1em" /> Save Overrides & Reload</Button>
        {/if}
        <Button variant="secondary" onclick={() => (show = false)}>Close</Button>
    {/snippet}
</Dialog>

<style>
    span.tab-title {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
    }
    .first-content {
        width: calc(100% - 64px + 1rem);
    }
</style>
