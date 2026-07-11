<script lang="ts">
    import { X, Check, Loader } from '@lucide/svelte';
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

    let { servers, action, done = $bindable(false), results = $bindable() }: Props = $props();

    let title = $derived(action === 'post' ? 'Sending Import Map to' : 'Deleting Import Map from');
    // svelte-ignore state_referenced_locally
    results = new Array(servers.length).fill(undefined);
    let text = $derived(action === 'post' ? 'Sending' : 'Deleting');
    // svelte-ignore state_referenced_locally
    Promise.all(servers.map((s) => s.actionPromise)).then(() => {
        done = true;
    });
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
