import type { ColumnHelper } from '@tanstack/react-table';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './column.module.scss';

export function rowIndexColumn<T>(columnHelper: ColumnHelper<T>) {
    return columnHelper.display({
        cell: ({ row }) => {
            return (
                <Text isSecondary className={styles.cell}>
                    {row.index + 1}
                </Text>
            );
        },
        header: '#',
        id: 'rowIndex',
        size: itemListHelpers.table.numberToColumnSize(60, 'px'),
    });
}
