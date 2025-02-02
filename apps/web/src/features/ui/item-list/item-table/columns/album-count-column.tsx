import type { ItemListCellProps, ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import { numberToColumnSize } from '@/features/ui/item-list/helpers.ts';
import { CellSkeleton, EmptyCell } from '@/features/ui/item-list/item-table/columns/shared.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './column.module.scss';

function Cell({ item }: ItemListCellProps) {
    if (!item) {
        return <CellSkeleton height={20} width={50} />;
    }

    if (typeof item === 'object' && item) {
        if ('albumCount' in item && typeof item.albumCount === 'number') {
            return (
                <Text isCentered isSecondary className={styles.cell}>
                    {item.albumCount}
                </Text>
            );
        }
    }

    return <EmptyCell />;
}

export const albumCountColumn = {
    cell: Cell,
    header: () => (
        <Text isCentered isUppercase>
            Albums
        </Text>
    ),
    id: 'albumCount' as ItemListColumn.ALBUM_COUNT,
    size: numberToColumnSize(100, 'px'),
};
