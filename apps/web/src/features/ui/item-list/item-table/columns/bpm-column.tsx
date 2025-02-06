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
        if ('bpm' in item && typeof item.bpm === 'number') {
            return (
                <Text isCentered isSecondary className={styles.cell}>
                    {item.bpm}
                </Text>
            );
        }
    }

    return <EmptyCell />;
}

export const bpmColumn = {
    cell: Cell,
    header: () => (
        <Text isCentered isUppercase>
            BPM
        </Text>
    ),
    id: 'bpm' as ItemListColumn.BPM,
    size: numberToColumnSize(50, 'px'),
};
