import { type MouseEvent } from 'react';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import type { ItemTableGroup } from '@/features/ui/item-list/item-table/grouped-item-table.tsx';
import type { ItemListInternalReducers } from '@/hooks/use-list.ts';
import styles from './table-group.module.scss';

interface TableGroupProps<T> {
    data: (T | undefined)[];
    getItemId?: (index: number, item: unknown) => string;
    groups: ItemTableGroup[];
    index: number;
    onGroupClick?: (e: MouseEvent<HTMLDivElement>, group: ItemTableGroup, rows: T[]) => void;
    reducers: ItemListInternalReducers;
}

export function TableGroup<T>({
    data,
    groups,
    index,
    getItemId,
    onGroupClick,
    reducers,
}: TableGroupProps<T>) {
    const handleGroupClick = (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        const itemSelection = reducers.getSelection();
        const rows = getGroupRows(data, groups, index) as T[];

        const isSomeSelected = rows.some(
            (row) => itemSelection[getItemId ? getItemId(index, row) : row],
        );

        if (!e.ctrlKey) {
            reducers.clearSelection();
        }

        const newSelection = rows.reduce(
            (acc, row) => {
                const itemId = getItemId ? getItemId(index, row) : row;
                acc[itemId as string] = isSomeSelected ? false : true;
                return acc;
            },
            {} as Record<string, boolean>,
        );

        reducers.setSelection(newSelection);

        onGroupClick?.(e, groups[index], rows);
    };

    const handleToggleExpand = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        const isGroupCollapsed = reducers.getGroupCollapsedById(index.toString());

        if (isGroupCollapsed) {
            reducers.setGroupCollapsedById(index.toString(), false);
        } else {
            reducers.setGroupCollapsedById(index.toString(), true);
        }
    };

    return (
        <div className={styles.container} onClick={handleGroupClick}>
            <div className={styles.text}>{groups[index].name}</div>
            <IconButton
                icon="arrowDownS"
                size="sm"
                variant="default"
                onClick={handleToggleExpand}
            />
        </div>
    );
}

function getGroupRows<T>(data: T[], groups: ItemTableGroup[], index: number) {
    let itemCountBeforeGroup = 0;
    for (let i = 0; i < index; i++) {
        itemCountBeforeGroup += groups[i].count;
    }

    return data.slice(itemCountBeforeGroup, itemCountBeforeGroup + groups[index].count);
}
