<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import { setTabsContext, TabsContextImpl } from './tabs-context.svelte';
    import { untrack, type Snippet } from 'svelte';

    type Props = HTMLAttributes<HTMLUListElement> & {
        activeTab?: string | number;
        tab?: Snippet<[string | number]>;
        [x: `tab_${string}`]: Snippet;
    };

    let { activeTab, tab, class: cssClass, children, ...restProps }: Props = $props();

    const controlId = $props.id();
    let tabsEl: HTMLUListElement;

    const ctx = setTabsContext(new TabsContextImpl(controlId));

    $effect.pre(() => {
        ctx.activeTabId = activeTab;
        if (untrack(() => ctx.activeTabId) === undefined && ctx.tabs.length > 0) {
            ctx.activeTabId = ctx.tabs[0];
        }
    });

    $effect.pre(() => {
        activeTab = ctx.activeTabId;
    });

    function handleArrowKeys(event: KeyboardEvent) {
        const activeId = document.activeElement?.id;
        if (!tabsEl.contains(document.activeElement) || document.activeElement?.role !== 'tab' || !activeId) {
            return;
        }
        const currentIndex = ctx.tabs.indexOf(activeId.replace(`tab-${ctx.tabsId}-`, ''));
        if (currentIndex === -1) {
            tabsEl.querySelector<HTMLButtonElement>('li>[role="tab"]')?.focus();
            return;
        }
        if (event.key === 'ArrowRight') {
            const nextIndex = (currentIndex + 1) % ctx.tabs.length;
            tabsEl.querySelector<HTMLButtonElement>(`#tab-${ctx.tabsId}-${ctx.tabs[nextIndex]}`)?.focus();
            event.preventDefault();
        } else if (event.key === 'ArrowLeft') {
            const prevIndex = (currentIndex - 1 + ctx.tabs.length) % ctx.tabs.length;
            tabsEl.querySelector<HTMLButtonElement>(`#tab-${ctx.tabsId}-${ctx.tabs[prevIndex]}`)?.focus();
            event.preventDefault();
        }
    }
</script>

<ul bind:this={tabsEl} class={['cjs-tabs', cssClass]} {...restProps} role="tablist" aria-orientation="horizontal" onkeydown={handleArrowKeys}>
    {#each ctx.tabs as tabId, idx (tabId)}
        {@const tabSnippet = restProps[`tab_${tabId}`]}
        <li role="presentation">
            <button
                type="button"
                tabindex={idx === 0 ? 0 : -1}
                onclick={() => (ctx.activeTabId = tabId)}
                role="tab"
                aria-selected={ctx.activeTabId === tabId}
                id={`tab-${ctx.tabsId}-${tabId}`}
                aria-controls={`tabpanel-${ctx.tabsId}-${tabId}`}
                class={['cjs-tab', ctx.activeTabId === tabId && 'active']}
            >
                {#if tabSnippet}
                    {@render tabSnippet()}
                {:else}
                    {@render tab?.(tabId)}
                {/if}
            </button>
        </li>
    {/each}
</ul>
{@render children?.()}
