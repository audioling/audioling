import type { ColumnHelper } from '@tanstack/react-table';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import styles from './column.module.scss';

export function ratingColumn<T>(columnHelper: ColumnHelper<T>) {
    return columnHelper.display({
        cell: ({ row, context }) => {
            const item = context.data || row.original;

            if (typeof item === 'object' && item) {
                if ('userRating' in item && typeof item.userRating === 'number') {
                    return <div className={styles.cell}>{item.userRating}</div>;
                }
            }

            return <div className={styles.cell}>&nbsp;</div>;
        },
        header: 'Rating',
        id: 'rating',
        size: itemListHelpers.table.numberToColumnSize(100, 'px'),
    });
}
