import type { AlbumItem } from '/@/app-types';
import type { ItemGridComponent } from '/@/features/shared/components/item-list/item-grid/item-grid';
import type { InnerServerGridItemProps } from '/@/features/shared/components/item-list/item-grid/server-grid-item';
import type { PlayType } from '/@/stores/player-store';
import { ListSortOrder, ServerItemType, TrackListSortOptions } from '@repo/shared-types/app-types';
import { memo, type MouseEvent } from 'react';
import { PlayerController } from '/@/controllers/player-controller';
import { PrefetchController } from '/@/controllers/prefetch-controller';
import { ContextMenuController } from '/@/features/context-menu/context-menu-controller';
import { InnerServerGridItem } from '/@/features/shared/components/item-list/item-grid/server-grid-item';
import { dndUtils, DragOperation, DragTarget } from '/@/utils/drag-drop';

const albumItemCardProps = {
    onContextMenu: (id: string, serverId: string, event: MouseEvent<HTMLButtonElement>) => {
        ContextMenuController.call({
            cmd: {
                ids: [id],
                type: ServerItemType.ALBUM,
            },
            event,
        });
    },
    onDragInitialData: (id: string) => {
        return dndUtils.generateDragData(
            {
                id: [id],
                operation: [DragOperation.ADD],
                type: DragTarget.ALBUM,
            },
            { },
        );
    },
    onDragStart: (id: string) => {
        PrefetchController.call({
            cmd: {
                tracksByAlbumId: {
                    id: [id],
                    params: {
                        sortBy: TrackListSortOptions.ID,
                        sortOrder: ListSortOrder.ASC,
                    },
                },
            },
        });
    },
    onFavorite: (id: string, serverId: string) => {
        // favoriteAlbum({ data: { ids: [id] }, libraryId });
    },
    onPlay: (id: string, serverId: string, playType: PlayType) => {
        PlayerController.call({
            cmd: {
                addToQueueByFetch: {
                    id: [id],
                    itemType: ServerItemType.ALBUM,
                    type: playType,
                },
            },
        });
    },
    onUnfavorite: (id: string, serverId: string) => {
        // unfavoriteAlbum({ data: { ids: [id] }, libraryId });
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
