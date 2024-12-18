import type { ColumnHelper } from '@tanstack/react-table';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { Skeleton } from '@/features/ui/skeleton/skeleton.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './column.module.scss';

export function trackCountColumn<T>(columnHelper: ColumnHelper<T>) {
    return columnHelper.display({
        cell: ({ row }) => {
            const item = row.original;

            if (typeof item === 'object' && item) {
                if ('trackCount' in item && typeof item.trackCount === 'number') {
                    return (
                        <Text isCentered isSecondary className={styles.cell}>
                            {item.trackCount}
                        </Text>
                    );
                }
            }

            return <Skeleton height={20} width={50} />;
        },
        header: 'Tracks',
        id: 'trackCount',
        size: itemListHelpers.table.numberToColumnSize(100, 'px'),
    });
}
