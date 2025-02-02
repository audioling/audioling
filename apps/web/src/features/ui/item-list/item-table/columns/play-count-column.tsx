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
        if ('playCount' in item && typeof item.playCount === 'number') {
            return (
                <Text isCentered isSecondary className={styles.cell}>
                    {item.playCount}
                </Text>
            );
        }
    }

    return <EmptyCell />;
}

export const playCountColumn = {
    cell: Cell,
    header: () => (
        <Text isCentered isUppercase>
            Plays
        </Text>
    ),
    id: 'playCount' as ItemListColumn.PLAY_COUNT,
    size: numberToColumnSize(50, 'px'),
};
