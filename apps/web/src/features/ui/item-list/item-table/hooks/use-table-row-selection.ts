import type { MouseEvent } from 'react';
import { useCallback, useState } from 'react';
import type { Row, Table } from '@tanstack/react-table';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';

export function useMultiRowSelection<T>() {
    const [lastSelectedId, setLastSelectedId] = useState<number | null>(null);

    const onRowClick = useCallback(
        (e: MouseEvent<HTMLDivElement>, row: Row<T | undefined>, table: Table<T | undefined>) => {
            e.stopPropagation();

            if (e.shiftKey) {
                const { rows, rowsById } = table.getRowModel();

                const currentIndex = row.index;
                const rowsToToggle = itemListHelpers.table.getRowRange(
                    rows,
                    currentIndex,
                    Number(lastSelectedId),
                );
                const isCellSelected = rowsById[row.id].getIsSelected();
                rowsToToggle.forEach((_row) => _row.toggleSelected(!isCellSelected));
            } else if (e.ctrlKey) {
                row.toggleSelected();
            } else {
                table.resetRowSelection();
                row.toggleSelected();
            }

            setLastSelectedId(row.index);
        },
        [lastSelectedId],
    );

    return { onRowClick };
}

export function useSingleRowSelection<T>() {
    const onRowClick = useCallback(
        (e: MouseEvent<HTMLDivElement>, row: Row<T | undefined>, table: Table<T | undefined>) => {
            e.stopPropagation();

            table.resetRowSelection();
            row.toggleSelected();
        },
        [],
    );

    return { onRowClick };
}
