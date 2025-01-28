import { LibraryItemType } from '@repo/shared-types';
import type { ColumnHelper } from '@tanstack/react-table';
import type { AlbumArtistItem, AlbumItem, TrackItem } from '@/api/api-types.ts';
import { AlbumArtistFavoriteButton } from '@/features/shared/favorites/album-artist-favorite-button.tsx';
import { AlbumFavoriteButton } from '@/features/shared/favorites/album-favorite-button.tsx';
import { TrackFavoriteButton } from '@/features/shared/favorites/track-favorite-button.tsx';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';

export function favoriteColumn<T>(columnHelper: ColumnHelper<T>) {
    return columnHelper.display({
        cell: ({ row, context }) => {
            const item = context.data || row.original;

            if (!item) {
                return <>&nbsp;</>;
            }

            if (
                typeof item === 'object' &&
                'userFavorite' in item &&
                !item.userFavorite &&
                !context.isHovered
            ) {
                return <>&nbsp;</>;
            }

            switch (context.itemType) {
                case LibraryItemType.ALBUM:
                    return (
                        <AlbumFavoriteButton
                            buttonProps={{ size: 'md' }}
                            data={item as AlbumItem}
                        />
                    );
                case LibraryItemType.ALBUM_ARTIST:
                    return (
                        <AlbumArtistFavoriteButton
                            buttonProps={{ size: 'md' }}
                            data={item as AlbumArtistItem}
                        />
                    );
                case LibraryItemType.TRACK:
                case LibraryItemType.PLAYLIST_TRACK:
                    return (
                        <TrackFavoriteButton
                            buttonProps={{ size: 'md' }}
                            data={item as TrackItem}
                        />
                    );
            }

            return null;
        },
        header: '',
        id: 'favorite',
        size: itemListHelpers.table.numberToColumnSize(30, 'px'),
    });
}
