import type { ColumnHelper } from '@tanstack/react-table';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { Skeleton } from '@/features/ui/skeleton/skeleton.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './column.module.scss';

export function albumCountColumn<T>(columnHelper: ColumnHelper<T>) {
    return columnHelper.display({
        cell: ({ row }) => {
            const item = row.original;

            if (typeof item === 'object' && item) {
                if ('albumCount' in item && typeof item.albumCount === 'number') {
                    return (
                        <Text isCentered isSecondary className={styles.cell}>
                            {item.albumCount}
                        </Text>
                    );
                }
            }

            return <Skeleton height={20} width={50} />;
        },
        header: 'Albums',
        id: 'albumCount',
        size: itemListHelpers.table.numberToColumnSize(100, 'px'),
    });
}
