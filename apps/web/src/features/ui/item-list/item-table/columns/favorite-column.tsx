import { LibraryItemType } from '@repo/shared-types';
import type { AlbumArtistItem, AlbumItem, TrackItem } from '@/api/api-types.ts';
import { AlbumArtistFavoriteButton } from '@/features/shared/favorites/album-artist-favorite-button.tsx';
import { AlbumFavoriteButton } from '@/features/shared/favorites/album-favorite-button.tsx';
import { TrackFavoriteButton } from '@/features/shared/favorites/track-favorite-button.tsx';
import type { ItemListCellProps, ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import { numberToColumnSize } from '@/features/ui/item-list/helpers.ts';
import { EmptyCell } from '@/features/ui/item-list/item-table/columns/shared.tsx';

function Cell({ item, isHovered, itemType }: ItemListCellProps) {
    if (!item) {
        return <EmptyCell />;
    }

    if (typeof item === 'object' && 'userFavorite' in item && !item.userFavorite && !isHovered) {
        return <EmptyCell />;
    }

    switch (itemType) {
        case LibraryItemType.ALBUM:
            return <AlbumFavoriteButton buttonProps={{ size: 'md' }} data={item as AlbumItem} />;
        case LibraryItemType.ALBUM_ARTIST:
            return (
                <AlbumArtistFavoriteButton
                    buttonProps={{ size: 'md' }}
                    data={item as AlbumArtistItem}
                />
            );
        case LibraryItemType.TRACK:
        case LibraryItemType.PLAYLIST_TRACK:
            return <TrackFavoriteButton buttonProps={{ size: 'md' }} data={item as TrackItem} />;
    }

    return <EmptyCell />;
}

export const favoriteColumn = {
    cell: Cell,
    header: () => '',
    id: 'favorite' as ItemListColumn.FAVORITE,
    size: numberToColumnSize(30, 'px'),
};
