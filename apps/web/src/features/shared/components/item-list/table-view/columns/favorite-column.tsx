import type { ItemListCellProps, ItemListColumn } from '/@/features/shared/components/item-list/utils/helpers';
import { ActionIcon } from '@mantine/core';
import { ServerItemType } from '@repo/shared-types/app-types';
import { Icon } from '/@/components/icon/icon';
import { EmptyCell } from '/@/features/shared/components/item-list/table-view/columns/shared';
import { numberToColumnSize } from '/@/features/shared/components/item-list/utils/helpers';

function Cell({ data, isHovered, itemType, onFavorite, onUnfavorite }: ItemListCellProps) {
    if (!data) {
        return <EmptyCell />;
    }

    if (typeof data === 'object' && 'userFavorite' in data && !data.userFavorite && !isHovered) {
        return <EmptyCell />;
    }

    const isFavorite = typeof data === 'object' && 'userFavorite' in data && data.userFavorite as boolean;

    switch (itemType) {
        case ServerItemType.ALBUM_ARTIST:
        case ServerItemType.ALBUM:
            return (
                <FavoriteButton
                    isFavorite={isFavorite}
                    onFavorite={onFavorite!}
                    onUnfavorite={onUnfavorite!}
                />
            );
        case ServerItemType.QUEUE_TRACK:
        case ServerItemType.TRACK:
        case ServerItemType.PLAYLIST_TRACK:
            return <EmptyCell />;
        default:
            return <EmptyCell />;
    }
}

interface FavoriteButtonProps {
    isFavorite: boolean;
    onFavorite: () => void;
    onUnfavorite: () => void;
}

function FavoriteButton({ isFavorite, onFavorite, onUnfavorite }: FavoriteButtonProps) {
    return (
        <ActionIcon
            size="md"
            variant="transparent"
            onClick={(e) => {
                e.stopPropagation();
                if (isFavorite) {
                    onUnfavorite();
                }
                else {
                    onFavorite();
                }
            }}
        >
            <Icon fill={isFavorite ? 'secondary' : undefined} icon="favorite" size="md" />
        </ActionIcon>
    );
}

export const favoriteColumn = {
    cell: Cell,
    header: () => '',
    id: 'favorite' as ItemListColumn.FAVORITE,
    size: numberToColumnSize(30, 'px'),
};
