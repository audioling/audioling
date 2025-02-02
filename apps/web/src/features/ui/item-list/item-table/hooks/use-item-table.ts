import { useMemo } from 'react';
import type { ItemListColumnDefinitions } from '@/features/ui/item-list/helpers.ts';
import { itemListColumnMap, type ItemListColumnOrder } from '@/features/ui/item-list/helpers.ts';

export function useItemTable(columnOrder: ItemListColumnOrder) {
    const columns = useMemo(() => {
        const listColumns: ItemListColumnDefinitions = [];

        for (const column of columnOrder) {
            const columnDefinition = itemListColumnMap[column];
            if (columnDefinition) {
                listColumns.push(columnDefinition);
            }
        }

        return listColumns;
    }, [columnOrder]);

    return {
        columns,
    };
}
