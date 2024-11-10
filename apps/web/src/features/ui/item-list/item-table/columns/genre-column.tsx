import type { ColumnHelper } from '@tanstack/react-table';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { Skeleton } from '@/features/ui/skeleton/skeleton.tsx';
import styles from './column.module.scss';

export function genreColumn<T>(columnHelper: ColumnHelper<T>) {
    return columnHelper.display({
        cell: ({ row }) => {
            const item = row.original;

            if (typeof item === 'object' && item) {
                if ('genres' in item && Array.isArray(item.genres)) {
                    return <div className={styles.cell}>{item.genres.join(', ')}</div>;
                }
            }

            return <Skeleton height={20} width={100} />;
        },
        header: 'Genre',
        id: 'genre',
        size: itemListHelpers.table.numberToColumnSize(1, 'fr'),
    });
}
