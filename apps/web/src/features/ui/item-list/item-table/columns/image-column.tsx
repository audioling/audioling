import { memo } from 'react';
import { type ColumnHelper, type Row } from '@tanstack/react-table';
import { ItemImage } from '@/features/shared/item-image/item-image.tsx';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import type { ItemTableContext } from '@/features/ui/item-list/item-table/item-table.tsx';
import { Skeleton } from '@/features/ui/skeleton/skeleton.tsx';
import styles from './column.module.scss';

export function imageColumn<T>(columnHelper: ColumnHelper<T>) {
    return columnHelper.display({
        cell: MemoizedCell,
        header: '',
        id: 'image',
        size: itemListHelpers.table.numberToColumnSize(60, 'px'),
    });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Cell<T>({ row, context }: { context: ItemTableContext; row: Row<T | any> }) {
    const item = context.data || row.original;

    if (typeof item === 'object' && item) {
        if ('imageUrl' in item) {
            return (
                <div className={styles.cell}>
                    <ItemImage
                        className={styles.image}
                        size="table"
                        src={item.imageUrl as string | string[]}
                    />
                </div>
            );
        }
    }

    return (
        <div className={styles.cell}>
            <Skeleton height="100%" />
        </div>
    );
}

export const MemoizedCell = memo(Cell);
