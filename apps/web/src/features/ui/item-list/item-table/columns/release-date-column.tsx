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
        if ('releaseDate' in item && typeof item.releaseDate === 'string') {
            return (
                <Text isSecondary className={styles.cell}>
                    {item.releaseDate}
                </Text>
            );
        }
    }

    return <EmptyCell />;
}

export const releaseDateColumn = {
    cell: Cell,
    header: () => <Text isUppercase>Release Date</Text>,
    id: 'releaseDate' as ItemListColumn.RELEASE_DATE,
    size: numberToColumnSize(100, 'px'),
};
