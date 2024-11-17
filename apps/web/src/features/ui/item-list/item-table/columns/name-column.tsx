import type { ColumnHelper } from '@tanstack/react-table';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { Skeleton } from '@/features/ui/skeleton/skeleton.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './column.module.scss';

export function nameColumn<T>(columnHelper: ColumnHelper<T>) {
    return columnHelper.display({
        cell: ({ row }) => {
            const item = row.original;

            if (typeof item === 'object' && item) {
                if ('name' in item && typeof item.name === 'string') {
                    return <Text className={styles.cell}>{item.name}</Text>;
                }
            }

            return <Skeleton height={20} width={100} />;
        },
        header: 'Name',
        id: 'name',
        size: itemListHelpers.table.numberToColumnSize(1, 'fr'),
    });
}
