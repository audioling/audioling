import type { ColumnHelper } from '@tanstack/react-table';
import { Image } from '@/features/ui/image/image.tsx';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { Skeleton } from '@/features/ui/skeleton/skeleton.tsx';
import styles from './column.module.scss';

export function imageColumn<T>(columnHelper: ColumnHelper<T>) {
    return columnHelper.display({
        cell: ({ row, context }) => {
            const item = row.original;

            if (typeof item === 'object' && item) {
                if ('imageUrl' in item && typeof item.imageUrl === 'string') {
                    return (
                        <div className={styles.cell}>
                            <Image
                                visibleByDefault
                                className={styles.image}
                                src={`${context.baseUrl}${item.imageUrl}&size=100`}
                            />
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
