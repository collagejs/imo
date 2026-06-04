<script lang="ts">
    import { type Snippet } from "svelte";
    import type { HTMLDialogAttributes } from "svelte/elements";
    import { X } from "lucide-svelte";
    import Button from "./Button.svelte";
    import logo64 from "@collagejs/core/logo/64";
    import { effectiveTheme } from "./state/effectiveTheme.svelte.js";
    import { imoUiOptions } from "./state/imoUiOptions.js";

    type Props = Omit<HTMLDialogAttributes, "title"> & {
        show?: boolean;
        title?: Snippet;
        footer?: Snippet;
    };

    let {
        show = $bindable(false),
        title,
        footer,
        children,
        ...restProps
    }: Props = $props();

    let dialog: HTMLDialogElement;
    let clientWidth = $state(0);
    let clientHeight = $state(0);
    let currentMaxWidth = 0;
    let currentMaxHeight = 0;
    let dimensionStyle = $state("");
    let firstRun = true;

    $effect(() => {
        if (show) {
            dialog.showModal();
        } else {
            dialog.close();
        }
    });

    $effect(() => {
        if (show && firstRun) {
            (
                dialog.querySelector("button:not([data-close])") as HTMLElement
            )?.focus();
            firstRun = false;
        }
    });

    $effect(() => {
        currentMaxHeight = Math.max(currentMaxHeight, clientHeight);
        currentMaxWidth = Math.max(currentMaxWidth, clientWidth);
        dimensionStyle = `min-width: ${currentMaxWidth}px; min-height: ${currentMaxHeight}px;`;
    });
</script>

<dialog
    bind:this={dialog}
    bind:clientHeight
    bind:clientWidth
    class={[
        imoUiOptions.current.glass.enabled && "cjs-bg-cyan",
        "cjs-theme-sky",
        imoUiOptions.current.glass.enabled && "cjs-glass",
        `cjs-theme-${effectiveTheme.current}`,
    ]}
    style={dimensionStyle}
    style:--cjs-glass-bg-opacity={imoUiOptions.current.glass.opacity}
    style:--cjs-glass-blur={`${imoUiOptions.current.glass.blur}px`}
    style:--cjs-glass-saturation={`${imoUiOptions.current.glass.saturation}%`}
    {...restProps}
    onclose={() => (show = false)}
>
    <!-- Watermark logo positioned absolutely -->
    <a href="https://collagejs.dev" class="watermark-logo" target="_blank" rel="noopener noreferrer" title="CollageJS Docs">
        <img src={logo64} alt="CollageJS" />
    </a>
    <header>
        <div class="title-area">
            {@render title?.()}
        </div>
        <div class="controls-area">
            <Button
                size="sm"
                onclick={() => (show = false)}
                aria-label="Close dialog"
                data-close
            >
                <X />
            </Button>
        </div>
    </header>
    <div class="content">
        {@render children?.()}
    </div>
    {#if footer}
        <footer>
            {@render footer()}
        </footer>
    {/if}
</dialog>

<style>
    dialog {
        border: none;
        border-radius: 0.7rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        padding: 2rem 2rem;
        position: relative;
        max-width: 1000px;

        &[open] {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
    }

    header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;

        & :global(h1),
        & :global(h2),
        & :global(h3),
        & :global(h4),
        & :global(h5),
        & :global(h6) {
            margin: 0;
        }
    }

    .title-area {
        flex: 1;
    }

    .controls-area {
        display: flex;
        align-items: center;
    }

    .watermark-logo {
        position: absolute;
        top: 4rem;
        right: 1rem;
        width: 64px;
        height: 64px;
        opacity: 0.4;
        z-index: 1;

        &:hover {
            opacity: 1;
        }
    }

    .content {
        flex: 1;
        overflow: auto;
        padding: 0.5rem;
    }

    footer {
        display: flex;
        gap: 0.5rem;
        justify-content: flex-end;
        margin-top: auto;
    }
</style>
