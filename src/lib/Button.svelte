<script lang="ts">
    import type { HTMLButtonAttributes } from 'svelte/elements';

    type Props = HTMLButtonAttributes & {
        variant?: 'primary' | 'secondary' | 'outline' | 'neutral' | 'success' | 'warning';
        ghost?: boolean;
        size?: 'sm' | '' | 'lg';
        bg?: string;
    };

    let { children, type = 'button', variant = 'neutral', ghost = false, size = '', bg, class: cssClass, ...restProps }: Props = $props();
</script>

<button
    {type}
    class={[cssClass, variant && `cjs-btn cjs-btn-${variant}`, ghost && 'cjs-btn-ghost', size && `cjs-btn-${size}`]}
    style:background={bg}
    {...restProps}
>
    {@render children?.()}
</button>
