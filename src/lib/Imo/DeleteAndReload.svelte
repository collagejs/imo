<script lang="ts">
    import type { HttpOrigin } from "../../private-types.js";
    import {
        getInvolvedViteServers,
        getStoredDiscoveredDevServers,
    } from "../../shared/common.js";
    import { readImPostingOptions } from "../../shared/options.js";
    import ServerActionProgress, {
        type ActionResult,
    } from "./ServerActionProgress.svelte";
    import TimerMessage from "./TimerMessage.svelte";

    const viteServers = [
        ...getInvolvedViteServers(
            getStoredDiscoveredDevServers().keys(),
        )[0],
    ];
    const servers = viteServers.map((origin) => {
        return {
            origin,
            actionPromise: deleteImFromServer(origin),
        };
    });
    let deletionResults = $state<(ActionResult | undefined)[]>(
        new Array(servers.length).fill(undefined),
    );
    let imDeleteDone = $state(false);
    const failedDeletions = $derived(
        imDeleteDone
            ? deletionResults.reduce(
                  (acc, result, index) => {
                      if (!result?.success) {
                          acc.push([servers[index].origin, result!.error]);
                      }
                      return acc;
                  },
                  [] as [HttpOrigin, string | undefined][],
              )
            : [],
    );
    let showTimedMessage = $state(false);
    let timedMessage = $state<TimerMessage>();

    async function deleteImFromServer(origin: HttpOrigin) {
        const options = await readImPostingOptions();
        try {
            const response = await fetch(
                new URL(options.importMapEndpoint, origin),
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
            if (response.ok) {
                return { success: true };
            } else {
                const errorText = await response.text();
                return {
                    success: false,
                    error:
                        errorText ||
                        `Failed to delete import map from ${origin}`,
                };
            }
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error ? error.message : error?.toString(),
            };
        }
    }

    // Effect that triggers reload or the timed message.
    $effect(() => {
        if (imDeleteDone && failedDeletions.length === 0) {
            window?.location.reload();
        } else if (imDeleteDone && failedDeletions.length > 0) {
            showTimedMessage = true;
        }
    });
</script>

<ServerActionProgress
    {servers}
    action="delete"
    bind:done={imDeleteDone}
    results={deletionResults}
/>
{#if showTimedMessage}
    <TimerMessage
        bind:this={timedMessage}
        time={Math.min(5 * failedDeletions.length, 60)}
        onTimer={() => window?.location.reload()}
    >
        {#snippet children(timeLeft)}
            <span>
                Some deletions failed. Restarting in {timeLeft} second{timeLeft ===
                1
                    ? ""
                    : "s"}...
            </span>
            <div class="cjs-btn-group cjs-m-3">
                <button
                    class="cjs-btn cjs-btn-primary cjs-btn-sm"
                    onclick={() => window?.location.reload()}
                >
                    Reload Now
                </button>
                <button
                    class="cjs-btn cjs-btn-secondary cjs-btn-sm"
                    onclick={() => timedMessage?.stop()}
                >
                    Don't Reload
                </button>
            </div>
        {/snippet}
        {#snippet stopped()}
            <span> Some deletions failed. </span>
            <button
                class="cjs-m-3 cjs-btn cjs-btn-primary cjs-btn-sm"
                onclick={() => window?.location.reload()}
            >
                Reload Now
            </button>
        {/snippet}
    </TimerMessage>
{/if}
