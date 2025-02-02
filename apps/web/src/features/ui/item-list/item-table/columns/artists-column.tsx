import type { ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import { type ItemListCellProps, numberToColumnSize } from '@/features/ui/item-list/helpers.ts';
import { CellSkeleton, EmptyCell } from '@/features/ui/item-list/item-table/columns/shared.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './column.module.scss';

function Cell({ item }: ItemListCellProps) {
    if (!item) {
        return <CellSkeleton height={20} width={100} />;
    }

    if (typeof item === 'object' && item) {
        if ('artists' in item && Array.isArray(item.artists)) {
            return (
                <Text isSecondary className={styles.cell}>
                    {item.artists.map((artist) => artist.name).join(', ')}
                </Text>
            );
        }
    }

    return <EmptyCell />;
}

export const artistsColumn = {
    cell: Cell,
    header: () => <Text isUppercase>Artists</Text>,
    id: 'artists' as ItemListColumn.ARTISTS,
    size: numberToColumnSize(1, 'fr'),
};
