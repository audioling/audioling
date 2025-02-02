import type { ItemListCellProps, ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import { numberToColumnSize } from '@/features/ui/item-list/helpers.ts';
import { CellSkeleton, EmptyCell } from '@/features/ui/item-list/item-table/columns/shared.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './column.module.scss';

function Cell({ item }: ItemListCellProps) {
    if (!item) {
        return <CellSkeleton height={20} width={100} />;
    }

    if (typeof item === 'object' && item) {
        if ('createdDate' in item && typeof item.createdDate === 'string') {
            return (
                <Text isSecondary className={styles.cell}>
                    {item.createdDate}
                </Text>
            );
        }
    }

    return <EmptyCell />;
}

export const dateAddedColumn = {
    cell: Cell,
    header: () => <Text isUppercase>Date Added</Text>,
    id: 'dateAdded' as ItemListColumn.DATE_ADDED,
    size: numberToColumnSize(100, 'px'),
};
