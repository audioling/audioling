import type { ItemListCellProps, ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import { numberToColumnSize } from '@/features/ui/item-list/helpers.ts';
import { CellSkeleton, EmptyCell } from '@/features/ui/item-list/item-table/columns/shared.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './column.module.scss';

function Cell({ item }: ItemListCellProps) {
    if (!item) {
        return <CellSkeleton isCentered height={20} width={30} />;
    }

    if (typeof item === 'object' && item) {
        if ('trackCount' in item && typeof item.trackCount === 'number') {
            return (
                <Text isCentered isSecondary className={styles.cell}>
                    {item.trackCount}
                </Text>
            );
        }
    }

    return <EmptyCell />;
}

export const trackCountColumn = {
    cell: Cell,
    header: () => (
        <Text isCentered isUppercase>
            Tracks
        </Text>
    ),
    id: 'trackCount' as ItemListColumn.TRACK_COUNT,
    size: numberToColumnSize(60, 'px'),
};
