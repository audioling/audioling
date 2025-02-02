import type { ItemListCellProps, ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import { numberToColumnSize } from '@/features/ui/item-list/helpers.ts';
import { CellSkeleton, EmptyCell } from '@/features/ui/item-list/item-table/columns/shared.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './column.module.scss';

function Cell({ item }: ItemListCellProps) {
    if (!item) {
        return <CellSkeleton height={20} width={40} />;
    }

    if (typeof item === 'object' && item) {
        if ('releaseYear' in item && typeof item.releaseYear === 'number') {
            return (
                <Text isSecondary className={styles.cell}>
                    {item.releaseYear}
                </Text>
            );
        }
    }

    return <EmptyCell />;
}

export const yearColumn = {
    cell: Cell,
    header: () => <Text isUppercase>Year</Text>,
    id: 'year' as ItemListColumn.YEAR,
    size: numberToColumnSize(50, 'px'),
};
