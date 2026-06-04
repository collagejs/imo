<script lang="ts">
    import type { ComponentProps } from "svelte";
    import IconButton from "./IconButton.svelte";

    type Props = ComponentProps<typeof IconButton>;

    let {
        ...restProps
    }: Props = $props();
</script>

<IconButton class="position-button" bg="var(--cjs-primary-gradient);" {...restProps} />
