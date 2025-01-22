import type { ColumnHelper } from '@tanstack/react-table';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { Skeleton } from '@/features/ui/skeleton/skeleton.tsx';
import styles from './column.module.scss';

export function favoriteColumn<T>(columnHelper: ColumnHelper<T>) {
    return columnHelper.display({
        cell: ({ row, context }) => {
            const item = context.data || row.original;

            if (typeof item === 'object' && item) {
                if ('favorite' in item && typeof item.favorite === 'boolean') {
                    return <div className={styles.cell}>{item.favorite ? 'Yes' : 'No'}</div>;
                }
            }

            return <Skeleton height={20} width={50} />;
        },
        header: 'Favorite',
        id: 'favorite',
        size: itemListHelpers.table.numberToColumnSize(50, 'px'),
    });
}
