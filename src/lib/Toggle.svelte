<script lang="ts">
    import type { ComponentProps } from "svelte";
    import Toggle from "svelte-toggle";

    type Props = ComponentProps<Toggle>;

    let {
        toggled = $bindable(true),
        ...restProps
    }: Props = $props();
</script>

<Toggle bind:toggled {...restProps} toggledColor="var(--cjs-primary)" untoggledColor="var(--cjs-gray-500)" />
