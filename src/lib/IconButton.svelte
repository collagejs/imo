<script lang="ts">
    import Button from './Button.svelte';
    import type { ComponentProps } from 'svelte';
    import type { Icon as LucideIcon } from 'lucide-svelte';

    type Props = ComponentProps<typeof Button> & {
        icon: typeof LucideIcon;
        iconSize?: string | number;
    };

    let { icon: IconComponent, iconSize = "1.2em", class: cssClass, ...restProps }: Props = $props();
</script>

<Button class={[cssClass, 'cjs-p-1']} {...restProps}>
    <IconComponent size={iconSize} />
</Button>
