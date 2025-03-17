import type { AlbumItem } from '/@/app-types';
import type { ItemGridComponent } from '/@/features/shared/components/item-list/grid-view/item-list-grid';
import type { InnerServerGridItemProps } from '/@/features/shared/components/item-list/grid-view/server-grid-item';
import { ListSortOrder, ServerItemType, TrackListSortOptions } from '@repo/shared-types/app-types';
import { memo } from 'react';
import { PlayerController } from '/@/controllers/player-controller';
import { PrefetchController } from '/@/controllers/prefetch-controller';
import { ContextMenuController } from '/@/features/context-menu/context-menu-controller';
import { InnerServerGridItem } from '/@/features/shared/components/item-list/grid-view/server-grid-item';
import { dndUtils, DragOperation, DragTarget } from '/@/utils/drag-drop';

const albumItemCardProps: Partial<InnerServerGridItemProps<AlbumItem>> = {
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

function InnerAlbumGridItemBase<T extends AlbumItem>({
    context,
    data,
    index,
}: InnerServerGridItemProps<T>) {
    return (
        <InnerServerGridItem
            context={context}
            data={data}
            index={index}
            {...albumItemCardProps}
        />
    );
}

export const InnerAlbumGridItem = memo(InnerAlbumGridItemBase);

export const AlbumGridItem: ItemGridComponent = (index, data, context) => {
    return (
        <InnerAlbumGridItem
            context={context}
            data={data as string | undefined}
            index={index}
        />
    );
};
