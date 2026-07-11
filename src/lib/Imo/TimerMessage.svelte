<script lang="ts">
    import type { Snippet } from "svelte";
    import type { HTMLAttributes } from "svelte/elements";

    type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
        time: number;
        children?: Snippet<[number]>;
        stopped?: Snippet;
        onTimer?: () => void;
    }

    let { time, children, stopped, onTimer, ...restProps }: Props = $props();

    let timerStopped = $state(false);
    // svelte-ignore state_referenced_locally
    let timeLeft = $state(time);

    const timer = setInterval(() => {
        timeLeft -= 1;
        if (timeLeft <= 0) {
            clearInterval(timer);
            onTimer?.();
        }
    }, 1000);

    export function stop() {
        clearInterval(timer);
        timerStopped = true;
    }
</script>

<div {...restProps}>
    {#if timerStopped}
        {@render stopped?.()}
    {:else}
        {@render children?.(timeLeft)}
    {/if}
</div>
