import type { ItemListCellProps, ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import { numberToColumnSize } from '@/features/ui/item-list/helpers.ts';
import { CellSkeleton, EmptyCell } from '@/features/ui/item-list/item-table/columns/shared.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import { formatSize } from '@/utils/format-size.ts';
import styles from './column.module.scss';

function Cell({ item }: ItemListCellProps) {
    if (!item) {
        return <CellSkeleton height={20} width={50} />;
    }

    if (typeof item === 'object' && item) {
        if ('fileSize' in item && typeof item.fileSize === 'number') {
            return (
                <Text isCentered isSecondary className={styles.cell}>
                    {formatSize(item.fileSize)}
                </Text>
            );
        }
    }

    return <EmptyCell />;
}

export const fileSizeColumn = {
    cell: Cell,
    header: () => (
        <Text isCentered isUppercase>
            File Size
        </Text>
    ),
    id: 'fileSize' as ItemListColumn.FILE_SIZE,
    size: numberToColumnSize(80, 'px'),
};
