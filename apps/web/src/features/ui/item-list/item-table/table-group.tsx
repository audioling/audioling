import { type MouseEvent } from 'react';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import type { ItemTableGroup } from '@/features/ui/item-list/item-table/grouped-item-table.tsx';
import styles from './table-group.module.scss';

interface TableGroupProps {
    groups: ItemTableGroup[];
    index: number;
    onGroupClick?: (e: MouseEvent<HTMLDivElement>, group: ItemTableGroup) => void;
}

export function TableGroup({ groups, index }: TableGroupProps) {
    const handleGroupClick = (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        // const rows = getGroupRows(table, groups, index);
        // const isSomeSelected = rows.some((row) => row.getIsSelected());

        // if (!e.ctrlKey) {
        //     table.resetRowSelection();
        // }

        // rows.forEach((row) => {
        //     row.toggleSelected(isSomeSelected ? false : true);
        // });

        // onGroupClick?.(e, rows, groups[index], table);
    };

    const handleToggleExpand = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        // const rows = getGroupRows(table, groups, index);

        // rows.forEach((row) => {
        //     row.toggleExpanded();
        // });
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

// function getGroupRows<T>(table: Table<T | undefined>, groups: ItemTableGroup[], index: number) {
//     let itemCountBeforeGroup = 0;
//     for (let i = 0; i < index; i++) {
//         itemCountBeforeGroup += groups[i].count;
//     }

//     return table
//         .getRowModel()
//         .rows.slice(itemCountBeforeGroup, itemCountBeforeGroup + groups[index].count);
// }
