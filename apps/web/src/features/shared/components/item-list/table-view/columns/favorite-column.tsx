import type { ItemListCellProps, ItemListColumn } from '/@/features/shared/components/item-list/utils/helpers';
import { ServerItemType } from '@repo/shared-types/app-types';
import { EmptyCell } from '/@/features/shared/components/item-list/table-view/columns/shared';
import { numberToColumnSize } from '/@/features/shared/components/item-list/utils/helpers';

function Cell({ isHovered, item, itemType }: ItemListCellProps) {
    if (!item) {
        return <EmptyCell />;
    }

    if (typeof item === 'object' && 'userFavorite' in item && !item.userFavorite && !isHovered) {
        return <EmptyCell />;
    }

    switch (itemType) {
        case ServerItemType.ALBUM:
            // return (
            //     <AlbumFavoriteButton
            //         buttonProps={{ size: 'md', variant: 'transparent' }}
            //         data={item as AlbumItem}
            //     />
            // );
            return <EmptyCell />;
        case ServerItemType.ALBUM_ARTIST:
            // return (
            //     <AlbumArtistFavoriteButton
            //         buttonProps={{ size: 'md', variant: 'transparent' }}
            //         data={item as AlbumArtistItem}
            //     />
            // );
            return <EmptyCell />;
        case ServerItemType.QUEUE_TRACK:
        case ServerItemType.TRACK:
        case ServerItemType.PLAYLIST_TRACK:
            return <EmptyCell />;
    }

    return <EmptyCell />;
}

export const favoriteColumn = {
    cell: Cell,
    header: () => '',
    id: 'favorite' as ItemListColumn.FAVORITE,
    size: numberToColumnSize(30, 'px'),
};
