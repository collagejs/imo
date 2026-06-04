<script lang="ts">
    import '@collagejs/core/theme/theme';
    import ImoButton from './Imo/ImoButton.svelte';
    import LogButton from './logs/LogButton.svelte';
    import OptionsButton from './Options/OptionsButton.svelte';
    import Positioner from './Positioner.svelte';
</script>

<div data-collagejs-theme style="display: content;">
    <Positioner
        contentTabIndexCount={3}
        data-collagejs-imo
    >
        {#snippet children(tabIndex)}
            <div class="container">
                <ImoButton tabindex={tabIndex} />
                <div class="sec-buttons">
                    <OptionsButton tabindex={tabIndex + 1} />
                    <LogButton tabindex={tabIndex + 2} />
                </div>
            </div>
        {/snippet}
    </Positioner>
</div>

<style>
    .container {
        display: flex;
        gap: 0.3rem;
        background: linear-gradient(135deg, #0ea5e9, #4f46e5);
        padding: 0.5rem;
        border-radius: 0.5rem;
    }

    .sec-buttons {
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
    }
</style>
