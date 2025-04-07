import type { AlbumItem } from '/@/app-types';
import type { InnerServerTableItemProps } from '/@/features/shared/components/item-list/table-view/server-table-item';
import { ListSortOrder, ServerItemType, TrackListSortOptions } from '@repo/shared-types/app-types';
import { PlayerController } from '/@/controllers/player-controller';
import { PrefetchController } from '/@/controllers/prefetch-controller';
import { ContextMenuController } from '/@/features/context-menu/context-menu-controller';
import { dndUtils, DragOperation, DragTarget } from '/@/utils/drag-drop';

export const albumListItemProps: Partial<InnerServerTableItemProps<AlbumItem>> = {
    onContextMenu: (
        item,
        event,
        reducers,
    ) => {
        const ids = reducers?.getListSelection(item.id) ?? [];

        ContextMenuController.call({
            cmd: {
                ids,
                type: ServerItemType.ALBUM,
            },
            event,
        });
    },
    onDragInitialData: (item, reducers) => {
        const ids = reducers?.getListSelection(item.id) ?? [];

        return dndUtils.generateDragData(
            {
                id: ids,
                operation: [DragOperation.ADD],
                type: DragTarget.ALBUM,
            },
            { },
        );
    },
    onDragStart: (item, reducers) => {
        const ids = reducers?.getListSelection(item.id) ?? [];

        PrefetchController.call({
            cmd: {
                tracksByAlbumId: {
                    ids,
                    params: {
                        sortBy: TrackListSortOptions.ID,
                        sortOrder: ListSortOrder.ASC,
                    },
                },
            },
        });
    },
    onFavorite: (item) => {
        PlayerController.call({
            cmd: {
                setFavoriteAlbums: {
                    favorite: true,
                    ids: [item.id],
                },
            },
        });
    },
    onPlay: (item, playType) => {
        PlayerController.call({
            cmd: {
                addToQueueByFetch: {
                    id: [item.id],
                    itemType: ServerItemType.ALBUM,
                    type: playType,
                },
            },
        });
    },
    onUnfavorite: (item) => {
        PlayerController.call({
            cmd: {
                setFavoriteAlbums: {
                    favorite: false,
                    ids: [item.id],
                },
            },
        });
    },
};
