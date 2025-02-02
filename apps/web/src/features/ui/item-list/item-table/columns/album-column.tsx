import type { ItemListCellProps, ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import { numberToColumnSize } from '@/features/ui/item-list/helpers.ts';
import { CellSkeleton, EmptyCell } from '@/features/ui/item-list/item-table/columns/shared.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './column.module.scss';

function Cell({ item }: ItemListCellProps) {
    if (!item) {
        return <CellSkeleton height={20} width={100} />;
    }

    if (typeof item === 'object' && item) {
        if ('album' in item && typeof item.album === 'string') {
            return (
                <Text isSecondary className={styles.cell}>
                    {item.album}
                </Text>
            );
        }
    }

    return <EmptyCell />;
}

export const albumColumn = {
    cell: Cell,
    header: () => <Text isUppercase>Album</Text>,
    id: 'album' as ItemListColumn.ALBUM,
    size: numberToColumnSize(1, 'fr'),
};
