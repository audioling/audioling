import type { ColumnHelper } from '@tanstack/react-table';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { Skeleton } from '@/features/ui/skeleton/skeleton.tsx';
import styles from './column.module.scss';

export function releaseDateColumn<T>(columnHelper: ColumnHelper<T>) {
    return columnHelper.display({
        cell: ({ row }) => {
            const item = row.original;

            if (typeof item === 'object' && item) {
                if ('releaseDate' in item && typeof item.releaseDate === 'string') {
                    return <div className={styles.cell}>{item.releaseDate}</div>;
                }
            }

            return <Skeleton height={20} width={100} />;
        },
        header: 'Release Date',
        id: 'releaseDate',
        size: itemListHelpers.table.numberToColumnSize(100, 'px'),
    });
}
