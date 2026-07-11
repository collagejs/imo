<script lang="ts">
    import { X, Check } from '@lucide/svelte';
    import Spinner from './Spinner.svelte';

    export type ActionResult = {
        success: boolean;
        error?: string;
    };

    type Props = {
        servers: { origin: string; actionPromise: Promise<ActionResult> }[];
        action: 'post' | 'delete';
        done: boolean;
        results: (ActionResult | undefined)[];
    }

    let { servers, action, done = $bindable(), results }: Props = $props();

    let title = $derived(action === 'post' ? 'Sending Import Map to' : 'Deleting Import Map from');
    let text = $derived(action === 'post' ? 'Sending' : 'Deleting');
    // Calculation of "done":
    $effect.pre(() => {
        done = results.every((result) => result !== undefined);
    });
    // Done in an effect to satisfy Svelte tools, but the list of servers or the action promise should not change
    // during the lifetime of this component.
    $effect.pre(() => {
        servers.forEach(async (server, index) => {
            server.actionPromise.then((result) => {
                results[index] = result;
            });
        });
    });
</script>

<div>
    <h4>{title} Development Servers</h4>
    <p>
        {#if done}
            All operations have completed.
        {:else}
            {text} import map on {servers.length} server{servers.length === 1 ? '' : 's'}...
        {/if}
    </p>
    <dl class="cjs-border cjs-rounded cjs-p-3">
        {#each servers as server, index}
            <dt>{server.origin}</dt>
            <dd>
                {#if results[index] === undefined}
                    <Spinner size="1.1em" />
                {:else if results[index].success}
                    <Check class="status-icon cjs-text-success" />
                {:else}
                    <X class="status-icon cjs-text-error" />
                    <span>{results[index].error}</span>
                {/if}
            </dd>
        {/each}
    </dl>
</div>

<style>
    dl {
        display: grid;
        grid-template-columns: min-content auto;
        gap: 0.25rem 1rem;
        overflow-y: auto;
        & > * {
            margin: 0;
        }

        & dd {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
    }

    :global .status-icon {
        stroke-width: 3;
    }
</style>
