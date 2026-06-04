<script lang="ts" module>
    export type Column = {
        key: string;
        label?: string;
    };

    export type Row = {
        id: string | number;
    };
</script>

<script lang="ts" generics="TRow extends Row, TCol extends Column">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes, HTMLTableAttributes } from 'svelte/elements';

    type Props = HTMLTableAttributes & {
        data: TRow[];
        cols: TCol[];
        size?: 'compact' | 'normal' | 'spacious';
        header?: Snippet<[col: TCol, index: number]>;
        row?: Snippet<[record: TRow, index: number]>;
        cell?: Snippet<[record: TRow, index: number, col: TCol, colIndex: number]>;
        [x: `header_${string}`]: Snippet<[col: TCol, index: number]>;
        [x: `cell_${string}`]: Snippet<[record: TRow, index: number, col: TCol, colIndex: number]>;
    };

    let { data, cols, size = 'normal', header, row, cell, class: cssClass, ...restProps }: Props = $props();
</script>

<table class={['cjs-table', size && `${size}`, cssClass]} {...restProps}>
    <thead>
        <tr>
            {#each cols as col, colIndex (col.key)}
                {@const headerSnippet = restProps[`header_${col.key}`] ?? header}
                <th>
                    {@render headerSnippet?.(col, colIndex)}
                </th>
            {/each}
        </tr>
    </thead>
    <tbody>
        {#each data as record, rowIndex (record.id)}
            <tr>
                {#if row}
                    {@render row(record, rowIndex)}
                {:else}
                    {#each cols as col, colIndex}
                        {@const cellSnippet = restProps[`cell_${col.key}`] ?? cell}
                        <td>
                            {@render cellSnippet?.(record, rowIndex, col, colIndex)}
                        </td>
                    {/each}
                {/if}
            </tr>
        {/each}
    </tbody>
</table>
