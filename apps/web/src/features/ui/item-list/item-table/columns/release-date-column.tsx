import type { ColumnHelper } from '@tanstack/react-table';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { Skeleton } from '@/features/ui/skeleton/skeleton.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './column.module.scss';

export function releaseDateColumn<T>(columnHelper: ColumnHelper<T>) {
    return columnHelper.display({
        cell: ({ row, context }) => {
            const item = context.data || row.original;

            if (typeof item === 'object' && item) {
                if ('releaseDate' in item && typeof item.releaseDate === 'string') {
                    return (
                        <Text isSecondary className={styles.cell}>
                            {item.releaseDate}
                        </Text>
                    );
                }
            }

            return <Skeleton height={20} width={100} />;
        },
        header: 'Release Date',
        id: 'releaseDate',
        size: itemListHelpers.table.numberToColumnSize(100, 'px'),
    });
}
