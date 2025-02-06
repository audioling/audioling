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
        if ('fileContainer' in item && typeof item.fileContainer === 'string') {
            return (
                <Text isCentered isSecondary className={styles.cell}>
                    {item.fileContainer}
                </Text>
            );
        }
    }

    return <EmptyCell />;
}

export const qualityColumn = {
    cell: Cell,
    header: () => <Text isUppercase>Quality</Text>,
    id: 'quality' as ItemListColumn.QUALITY,
    size: numberToColumnSize(70, 'px'),
};
