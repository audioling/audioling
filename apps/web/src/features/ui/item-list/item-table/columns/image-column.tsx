import { memo } from 'react';
import { type ColumnHelper, type Row } from '@tanstack/react-table';
import type { PlayQueueItem } from '@/api/api-types.ts';
import { ItemImage } from '@/features/shared/item-image/item-image.tsx';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import styles from './column.module.scss';

export function imageColumn<T>(columnHelper: ColumnHelper<T>) {
    return columnHelper.display({
        cell: MemoizedCell,
        header: '',
        id: 'image',
        size: itemListHelpers.table.numberToColumnSize(60, 'px'),
    });
}

function Cell<T>({
    row,
}: {
    context: { baseUrl: string; currentTrack: PlayQueueItem | undefined };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    row: Row<T | any>;
}) {
    const item = row.original;

    if (typeof item === 'object' && item) {
        if ('imageUrl' in item) {
            return (
                <div className={styles.cell}>
                    <ItemImage className={styles.image} size="table" src={item.imageUrl} />
                </div>
            );
        }
    }

    return null;
}

export const MemoizedCell = memo(Cell);
