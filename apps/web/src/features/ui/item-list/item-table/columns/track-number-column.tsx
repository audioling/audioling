import type { ItemListCellProps, ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import { numberToColumnSize } from '@/features/ui/item-list/helpers.ts';
import { CellSkeleton, EmptyCell } from '@/features/ui/item-list/item-table/columns/shared.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './column.module.scss';

function Cell({ item }: ItemListCellProps) {
    if (!item) {
        return <CellSkeleton height={20} width={30} />;
    }

    if (typeof item === 'object' && item) {
        if ('trackNumber' in item && typeof item.trackNumber === 'number') {
            return (
                <Text isCentered isSecondary className={styles.cell}>
                    {item.trackNumber}
                </Text>
            );
        }
    }

    return <EmptyCell />;
}

export const trackNumberColumn = {
    cell: Cell,
    header: () => (
        <Text isCentered isUppercase>
            Track
        </Text>
    ),
    id: 'trackNumber' as ItemListColumn.TRACK_NUMBER,
    size: numberToColumnSize(50, 'px'),
};
