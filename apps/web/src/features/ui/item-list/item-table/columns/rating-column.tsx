import type { ColumnHelper } from '@tanstack/react-table';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { Skeleton } from '@/features/ui/skeleton/skeleton.tsx';
import styles from './column.module.scss';

export function ratingColumn<T>(columnHelper: ColumnHelper<T>) {
    return columnHelper.display({
        cell: ({ row }) => {
            const item = row.original;

            if (typeof item === 'object' && item) {
                if ('userRating' in item && typeof item.userRating === 'number') {
                    return <div className={styles.cell}>{item.userRating}</div>;
                }
            }

            return <Skeleton height={20} width={100} />;
        },
        header: 'Rating',
        id: 'rating',
        size: itemListHelpers.table.numberToColumnSize(100, 'px'),
    });
}
