<script lang="ts">
    import type { Snippet } from 'svelte';
    import PositionButton from './PositionButton.svelte';
    import {
        ArrowUp,
        ArrowDown,
        ArrowLeft,
        ArrowRight,
        ArrowUpLeft,
        ArrowUpRight,
        ArrowDownLeft,
        ArrowDownRight,
    } from 'lucide-svelte';
    import type { Position } from '../types.js';
    import { imoUiOptions } from './state/imoUiOptions';
    import type { HTMLAttributes } from 'svelte/elements';

    type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
        contentTabIndexCount?: number;
        children: Snippet<[tabIndex: number]>;
    };

    let { contentTabIndexCount = 1, class: cssClass, children, ...restProps }: Props = $props();
    // Determine which buttons to show based on current position
    const getButtonConfig = (pos: Position) => {
        switch (pos) {
            case 'bottom-right':
                return {
                    horizontal: { direction: 'left', target: 'bottom-left' as Position, icon: ArrowLeft },
                    vertical: { direction: 'top', target: 'top-right' as Position, icon: ArrowUp },
                    diagonal: { direction: 'top-left', target: 'top-left' as Position, icon: ArrowUpLeft },
                };
            case 'bottom-left':
                return {
                    horizontal: { direction: 'right', target: 'bottom-right' as Position, icon: ArrowRight },
                    vertical: { direction: 'top', target: 'top-left' as Position, icon: ArrowUp },
                    diagonal: { direction: 'top-right', target: 'top-right' as Position, icon: ArrowUpRight },
                };
            case 'top-right':
                return {
                    horizontal: { direction: 'left', target: 'top-left' as Position, icon: ArrowLeft },
                    vertical: { direction: 'bottom', target: 'bottom-right' as Position, icon: ArrowDown },
                    diagonal: { direction: 'bottom-left', target: 'bottom-left' as Position, icon: ArrowDownLeft },
                };
            case 'top-left':
                return {
                    horizontal: { direction: 'right', target: 'top-right' as Position, icon: ArrowRight },
                    vertical: { direction: 'bottom', target: 'bottom-left' as Position, icon: ArrowDown },
                    diagonal: { direction: 'bottom-right', target: 'bottom-right' as Position, icon: ArrowDownRight },
                };
        }
    };

    const buttonConfig = $derived(getButtonConfig(imoUiOptions.current.position));

    // Define tab order based on position for logical spatial navigation
    const getTabOrder = (pos: Position) => {
        switch (pos) {
            case 'top-left':
                return { content: 1, horizontal: 1 + contentTabIndexCount, vertical: 2 + contentTabIndexCount, diagonal: 3 + contentTabIndexCount };
            case 'top-right':
                return { horizontal: 1, content: 2, diagonal: 2 + contentTabIndexCount, vertical: 3 + contentTabIndexCount };
            case 'bottom-left':
                return { vertical: 1, diagonal: 2, content: 3, horizontal: 3 + contentTabIndexCount };
            case 'bottom-right':
                return { diagonal: 1, vertical: 2, horizontal: 3, content: 3 };
        }
    };

    const tabOrder = $derived(getTabOrder(imoUiOptions.current.position));
</script>

<div class={["positioner", cssClass]} style="--position: {imoUiOptions.current.position}" {...restProps}>
    <!-- Diagonal button -->
    <div style="grid-area: diagonal;">
        <PositionButton
            tabindex={tabOrder.diagonal}
            onclick={() => (imoUiOptions.current.position = buttonConfig.diagonal.target)}
            title={`Move to ${buttonConfig.diagonal.direction}`}
            icon={buttonConfig.diagonal.icon}
        />
    </div>

    <!-- Vertical button -->
    <div style="grid-area: vertical;">
        <PositionButton
            tabindex={tabOrder.vertical}
            onclick={() => (imoUiOptions.current.position = buttonConfig.vertical.target)}
            title={`Move to ${buttonConfig.vertical.direction}`}
            icon={buttonConfig.vertical.icon}
        />
    </div>

    <!-- Horizontal button -->
    <div style="grid-area: horizontal;">
        <PositionButton
            tabindex={tabOrder.horizontal}
            onclick={() => (imoUiOptions.current.position = buttonConfig.horizontal.target)}
            title={`Move to ${buttonConfig.horizontal.direction}`}
            icon={buttonConfig.horizontal.icon}
        />
    </div>

    <!-- Main content -->
    <div style="grid-area: content;">
        {@render children(tabOrder.content)}
    </div>
</div>

<style>
    .positioner {
        display: grid;
        gap: 0.25rem;
        position: fixed;
        opacity: 0.25;

        & > div:not([style*='grid-area: content']) {
            visibility: hidden;
            margin: auto;
            width: 100%;
            height: 100%;
            & > :global(button) {
                width: 100%;
                height: 100%;
            }
        }

        &:hover,
        &:focus-within {
            opacity: 1;

            & > div:not([style*='grid-area: content']) {
                visibility: visible;
            }
        }

        /* Grid template areas based on position */
        &[style*='--position: top-left'] {
            top: 1rem;
            left: 1rem;
            grid-template-areas:
                'content horizontal'
                'vertical diagonal';
            grid-template-columns: auto auto;
            grid-template-rows: auto auto;
        }

        &[style*='--position: top-right'] {
            top: 1rem;
            right: 1rem;
            grid-template-areas:
                'horizontal content'
                'diagonal vertical  ';
            grid-template-columns: auto auto;
            grid-template-rows: auto auto;
        }

        &[style*='--position: bottom-left'] {
            bottom: 1rem;
            left: 1rem;
            grid-template-areas:
                'vertical diagonal'
                'content horizontal';
            grid-template-columns: auto auto;
            grid-template-rows: auto auto;
        }

        &[style*='--position: bottom-right'] {
            bottom: 1rem;
            right: 1rem;
            grid-template-areas:
                'diagonal vertical'
                'horizontal content';
            grid-template-columns: auto auto;
            grid-template-rows: auto auto;
        }

        & :global(.pos-button) {
            background: linear-gradient(135deg, #7C3AED, #4F46E5);
        }
    }
</style>
