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
        if ('discNumber' in item && typeof item.discNumber === 'string') {
            return (
                <Text isCentered isSecondary className={styles.cell}>
                    {item.discNumber}
                </Text>
            );
        }
    }

    return <EmptyCell />;
}

export const discNumberColumn = {
    cell: Cell,
    header: () => (
        <Text isCentered isUppercase>
            Disc
        </Text>
    ),
    id: 'discNumber' as ItemListColumn.DISC_NUMBER,
    size: numberToColumnSize(50, 'px'),
};
