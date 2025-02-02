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
        if ('albumArtists' in item && Array.isArray(item.albumArtists)) {
            return (
                <Text isSecondary className={styles.cell}>
                    {item.albumArtists.map((artist) => artist.name).join(', ')}
                </Text>
            );
        }
    }

    return <EmptyCell />;
}

export const albumArtistsColumn = {
    cell: Cell,
    header: () => <Text isUppercase>Album Artists</Text>,
    id: 'albumArtists' as ItemListColumn.ALBUM_ARTISTS,
    size: numberToColumnSize(1, 'fr'),
};
