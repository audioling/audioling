import type { ColumnHelper } from '@tanstack/react-table';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { Skeleton } from '@/features/ui/skeleton/skeleton.tsx';
import styles from './column.module.scss';

export function artistsColumn<T>(columnHelper: ColumnHelper<T>) {
    return columnHelper.display({
        cell: ({ row }) => {
            const item = row.original;

            if (typeof item === 'object' && item) {
                if ('artists' in item && Array.isArray(item.artists)) {
                    return (
                        <div className={styles.cell}>
                            {item.artists.map((artist) => artist.name).join(', ')}
                        </div>
                    );
                }
            }

            return <Skeleton height={20} width={100} />;
        },
        header: 'Artists',
        id: 'artists',
        size: itemListHelpers.table.numberToColumnSize(1, 'fr'),
    });
}
