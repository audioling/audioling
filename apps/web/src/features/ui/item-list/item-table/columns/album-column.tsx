import type { ColumnHelper } from '@tanstack/react-table';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { Skeleton } from '@/features/ui/skeleton/skeleton.tsx';
import styles from './column.module.scss';

export function albumColumn<T>(columnHelper: ColumnHelper<T>) {
    return columnHelper.display({
        cell: ({ row }) => {
            const item = row.original;

            if (typeof item === 'object' && item) {
                if ('album' in item && typeof item.album === 'string') {
                    return <div className={styles.cell}>{item.album}</div>;
                }
            }

            return <Skeleton height={20} width={100} />;
        },
        header: 'Album',
        id: 'album',
        size: itemListHelpers.table.numberToColumnSize(1, 'fr'),
    });
}
