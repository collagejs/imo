<script lang="ts">
    import { Bookmark, BookOpenText, PcCase } from "@lucide/svelte";
    import Tabs from "../Tabs/Tabs.svelte";
    import TabPanel from "../Tabs/TabPanel.svelte";
    import CurrentImportMap from "./CurrentImportMap.svelte";
    import OriginalImportMap from "./OriginalImportMap.svelte";
    import DevServers from "./DevServers.svelte";
    import {
        mergeOverridesWithImportMap,
    } from "./import-map-utils.svelte";

    type Props = {
        overrideData: ReturnType<typeof mergeOverridesWithImportMap>;
    };

    let { overrideData = $bindable() }: Props = $props();
</script>

<p class="first-content">
    Manage your import map overrides using the tabs below.
</p>
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
