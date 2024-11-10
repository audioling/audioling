import type { ColumnHelper } from '@tanstack/react-table';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { Skeleton } from '@/features/ui/skeleton/skeleton.tsx';
import styles from './column.module.scss';

export function imageColumn<T>(columnHelper: ColumnHelper<T>) {
    return columnHelper.display({
        cell: ({ row }) => {
            const item = row.original;

            if (typeof item === 'object' && item) {
                if ('imageUrl' in item && typeof item.imageUrl === 'string') {
                    return (
                        <div className={styles.cell}>
                            <img src={item.imageUrl}></img>
                        </div>
                    );
                }
            }

            return <Skeleton height={20} width={100} />;
        },
        header: '',
        id: 'image',
        size: itemListHelpers.table.numberToColumnSize(60, 'px'),
    });
}
