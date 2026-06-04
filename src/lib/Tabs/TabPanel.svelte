<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import { getTabsContext } from './tabs-context.svelte.js';

    type Props = Omit<HTMLAttributes<HTMLDivElement>, 'id' | 'role' | 'aria-labelledby'> & {
        id: string | number;
    };

    let { id: tabId, class: cssClass, children, ...restProps }: Props = $props();

    const ctx = getTabsContext();
    // svelte-ignore state_referenced_locally
    ctx.tabs.push(tabId);
</script>

{#if ctx.activeTabId === tabId}
    <div
        id={`tabpanel-${ctx.tabsId}-${tabId}`}
        class={['cjs-tab-panel', cssClass]}
        role="tabpanel"
        aria-labelledby={`tab-${ctx.tabsId}-${tabId}`}
        {...restProps}
    >
        {@render children?.()}
    </div>
{/if}
