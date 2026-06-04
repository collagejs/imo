<script lang="ts">
    import {
        Languages,
        Laptop,
        MoonIcon,
        MoveDownLeft,
        MoveDownRight,
        MoveUpLeft,
        MoveUpRight,
        Settings,
        SunIcon,
    } from 'lucide-svelte';
    import Dialog from '../Dialog.svelte';
    import { imoUiOptions } from '../state/imoUiOptions';
    import Button from '../Button.svelte';
    import IconButton from '../IconButton.svelte';

    type Props = {
        show?: boolean;
    };

    let { show = $bindable(false) }: Props = $props();
</script>

<Dialog bind:show>
    {#snippet title()}
        <h2><Settings /> Options</h2>
    {/snippet}
    <div class="cjs-flex cjs-flex-col">
        <span class="option-title">Theme</span>
        <div class="cjs-btn-group">
            <Button
                size="sm"
                variant="primary"
                ghost
                class={[imoUiOptions.current.theme === 'system' && 'active']}
                onclick={() => (imoUiOptions.current.theme = 'system')}
            >
                <Laptop size="1rem" />
            </Button>
            <Button
                size="sm"
                variant="primary"
                ghost
                class={[imoUiOptions.current.theme === 'light' && 'active']}
                onclick={() => (imoUiOptions.current.theme = 'light')}
            >
                <SunIcon size="1rem" />
            </Button>
            <Button
                size="sm"
                variant="primary"
                ghost
                class={[imoUiOptions.current.theme === 'dark' && 'active']}
                onclick={() => (imoUiOptions.current.theme = 'dark')}
            >
                <MoonIcon size="1rem" />
            </Button>
        </div>
        <span class="option-title">Language</span>
        <div class="cjs-input-group">
            <span class="cjs-addon"><Languages /></span>
            <select class="cjs-input">
                <option value="en" selected={imoUiOptions.current.language === 'en'}>English</option>
            </select>
        </div>
        <fieldset>
            <legend class="option-title">Glass Options</legend>
            <label>
                <input type="checkbox" bind:checked={imoUiOptions.current.glass.enabled} />
                Use glass effect
            </label>
            <label>
                Blur:
                <input
                    type="range"
                    list="blur-list"
                    min="0"
                    max="30"
                    step="1"
                    bind:value={imoUiOptions.current.glass.blur}
                />
                <datalist id="blur-list">
                    <option value="3"></option>
                    <option value="10"></option>
                    <option value="25"></option>
                </datalist>
                <span class="value">{imoUiOptions.current.glass.blur}px</span>
            </label>
            <label>
                Opacity:
                <input
                    type="range"
                    list="opacity-list"
                    min="0"
                    max="1"
                    step="0.05"
                    bind:value={imoUiOptions.current.glass.opacity}
                />
                <datalist id="opacity-list">
                    <option value="0.1"></option>
                    <option value="0.25"></option>
                    <option value="0.6"></option>
                </datalist>
                <span class="value">{(imoUiOptions.current.glass.opacity * 100).toFixed(0)}%</span>
            </label>
            <label>
                Saturation:
                <input
                    type="range"
                    list="saturation-list"
                    min="0"
                    max="200"
                    step="5"
                    bind:value={imoUiOptions.current.glass.saturation}
                />
                <datalist id="saturation-list">
                    <option value="30"></option>
                    <option value="100"></option>
                    <option value="180"></option>
                </datalist>
                <span class="value">{imoUiOptions.current.glass.saturation}%</span>
            </label>
        </fieldset>
        <div class="option-title">Corner</div>
        <div class="pos-grid">
            <IconButton
                variant="primary"
                ghost
                icon={MoveUpLeft}
                size="lg"
                style="grid-area: tl;"
                class={[imoUiOptions.current.position === 'top-left' && 'active']}
                onclick={() => (imoUiOptions.current.position = 'top-left')}
            />
            <IconButton
                variant="primary"
                ghost
                icon={MoveUpRight}
                size="lg"
                style="grid-area: tr;"
                class={[imoUiOptions.current.position === 'top-right' && 'active']}
                onclick={() => (imoUiOptions.current.position = 'top-right')}
            />
            <IconButton
                variant="primary"
                ghost
                icon={MoveDownLeft}
                size="lg"
                style="grid-area: bl;"
                class={[imoUiOptions.current.position === 'bottom-left' && 'active']}
                onclick={() => (imoUiOptions.current.position = 'bottom-left')}
            />
            <IconButton
                variant="primary"
                ghost
                icon={MoveDownRight}
                size="lg"
                style="grid-area: br;"
                class={[imoUiOptions.current.position === 'bottom-right' && 'active']}
                onclick={() => (imoUiOptions.current.position = 'bottom-right')}
            />
        </div>
    </div>
</Dialog>

<style>
    .option-title {
        font-weight: bold;
        margin-bottom: 0.3rem;
        margin-top: 0.7rem;
    }

    fieldset {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin: 1rem 0;
        padding: 0.5rem;
        border-radius: 0.5rem;
        border: 2px solid var(--cjs-border);

        & > label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            & input[type='range'] {
                flex: 1;
            }

            & .value {
                font-weight: bolder;
                min-width: 3rem;
                text-align: right;
            }
        }
    }

    .pos-grid {
        display: grid;
        justify-content: start;
        gap: 0.5rem;
        grid-template:
            'tl tr'
            'bl br';
    }
</style>
