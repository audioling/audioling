import type { ColumnHelper } from '@tanstack/react-table';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { Skeleton } from '@/features/ui/skeleton/skeleton.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import { formatDuration } from '@/utils/format-duration.ts';
import styles from './column.module.scss';

export function durationColumn<T>(columnHelper: ColumnHelper<T>) {
    return columnHelper.display({
        cell: ({ row, context }) => {
            const item = context.data || row.original;

            if (typeof item === 'object' && item) {
                if ('duration' in item && typeof item.duration === 'number') {
                    return (
                        <Text isSecondary className={styles.cell}>
                            {formatDuration(item.duration)}
                        </Text>
                    );
                }
            }

            return <Skeleton height={20} width={100} />;
        },
        header: '',
        id: 'duration',
        size: itemListHelpers.table.numberToColumnSize(60, 'px'),
    });
}
