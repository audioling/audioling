import type { ColumnHelper } from '@tanstack/react-table';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { Skeleton } from '@/features/ui/skeleton/skeleton.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './column.module.scss';

export function playCountColumn<T>(columnHelper: ColumnHelper<T>) {
    return columnHelper.display({
        cell: ({ row, context }) => {
            const item = context.data || row.original;

            if (typeof item === 'object' && item) {
                if ('playCount' in item && typeof item.playCount === 'number') {
                    return (
                        <Text isCentered isSecondary className={styles.cell}>
                            {item.playCount}
                        </Text>
                    );
                }
            }

            return <Skeleton height={20} width={50} />;
        },
        header: 'Plays',
        id: 'playCount',
        size: itemListHelpers.table.numberToColumnSize(50, 'px'),
    });
}
