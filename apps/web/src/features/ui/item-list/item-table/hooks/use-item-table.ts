import { useMemo } from 'react';
import type { DisplayColumnDef } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import type { ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import { type ItemListColumnOrder, itemListHelpers } from '@/features/ui/item-list/helpers.ts';

export function useItemTable<T>(
    columnOrder: ItemListColumnOrder,
    setColumnOrder: (columnOrder: ItemListColumnOrder) => void,
) {
    const columnHelper = createColumnHelper<T | undefined>();

    const columns: DisplayColumnDef<T | undefined>[] = useMemo(
        () => itemListHelpers.table.getColumns(columnHelper, columnOrder as ItemListColumn[]),
        [columnHelper, columnOrder],
    );

    return {
        columnOrder,
        columns,
        setColumnOrder,
    };
}
