import type { ColumnHelper } from '@tanstack/react-table';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { Skeleton } from '@/features/ui/skeleton/skeleton.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './column.module.scss';

export function trackNumberColumn<T>(columnHelper: ColumnHelper<T>) {
    return columnHelper.display({
        cell: ({ row, context }) => {
            const item = context.data || row.original;

            if (typeof item === 'object' && item) {
                if ('trackNumber' in item && typeof item.trackNumber === 'number') {
                    return (
                        <Text isCentered isSecondary className={styles.cell}>
                            {item.trackNumber}
                        </Text>
                    );
                }
            }

            return <Skeleton height={20} width={50} />;
        },
        header: 'Track',
        id: 'trackNumber',
        size: itemListHelpers.table.numberToColumnSize(50, 'px'),
    });
}
