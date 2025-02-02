import type { ItemListCellProps, ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import { numberToColumnSize } from '@/features/ui/item-list/helpers.ts';
import { CellSkeleton, EmptyCell } from '@/features/ui/item-list/item-table/columns/shared.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './column.module.scss';

function Cell({ item }: ItemListCellProps) {
    if (!item) {
        return <CellSkeleton height={20} width={60} />;
    }

    if (typeof item === 'object' && item) {
        if ('userLastPlayedDate' in item && typeof item.userLastPlayedDate === 'string') {
            return (
                <Text isSecondary className={styles.cell}>
                    {item.userLastPlayedDate}
                </Text>
            );
        }
    }

    return <EmptyCell />;
}

export const lastPlayedColumn = {
    cell: Cell,
    header: () => <Text isUppercase>Last Played</Text>,
    id: 'lastPlayed' as ItemListColumn.LAST_PLAYED,
    size: numberToColumnSize(100, 'px'),
};
