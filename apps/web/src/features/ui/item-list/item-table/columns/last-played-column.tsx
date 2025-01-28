import type { ColumnHelper } from '@tanstack/react-table';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { Skeleton } from '@/features/ui/skeleton/skeleton.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './column.module.scss';

export function lastPlayedColumn<T>(columnHelper: ColumnHelper<T>) {
    return columnHelper.display({
        cell: ({ row, context }) => {
            const item = context.data || row.original;

            if (!item) {
                return <Skeleton height={20} width={100} />;
            }

            if (typeof item === 'object' && item) {
                if ('userLastPlayedDate' in item && typeof item.userLastPlayedDate === 'string') {
                    return (
                        <Text isSecondary className={styles.cell}>
                            {item.userLastPlayedDate}
                        </Text>
                    );
                }
            }

            return <div className={styles.cell}>&nbsp;</div>;
        },
        header: 'Last Played',
        id: 'lastPlayed',
        size: itemListHelpers.table.numberToColumnSize(100, 'px'),
    });
}
