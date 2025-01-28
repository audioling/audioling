import type { ColumnHelper } from '@tanstack/react-table';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './column.module.scss';

export function yearColumn<T>(columnHelper: ColumnHelper<T>) {
    return columnHelper.display({
        cell: ({ row, context }) => {
            const item = context.data || row.original;

            if (typeof item === 'object' && item) {
                if ('releaseYear' in item && typeof item.releaseYear === 'number') {
                    return (
                        <Text isSecondary className={styles.cell}>
                            {item.releaseYear}
                        </Text>
                    );
                }
            }

            return <>&nbsp;</>;
        },
        header: 'Year',
        id: 'year',
        size: itemListHelpers.table.numberToColumnSize(50, 'px'),
    });
}
