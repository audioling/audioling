import { LibraryItemType, ListSortOrder, TrackListSortOptions } from '@repo/shared-types';
import type { PlaylistItem } from '@/api/api-types.ts';
import { ContextMenuController } from '@/features/controllers/context-menu/context-menu-controller.tsx';
import { PlayerController } from '@/features/controllers/player-controller.tsx';
import { PrefetchController } from '@/features/controllers/prefetch-controller.tsx';
import type { BaseCardProps, LoadedCardProps, LoadingCardProps } from '@/features/ui/card/card.tsx';
import { Card } from '@/features/ui/card/card.tsx';
import { dndUtils, DragOperation, DragTarget } from '@/utils/drag-drop.ts';

type BasePlaylistCardProps = BaseCardProps & {
    className?: string;
};

type LoadingPlaylistCardProps = LoadingCardProps & BasePlaylistCardProps;

type LoadedPlaylistCardProps = BasePlaylistCardProps & {
    componentState: 'loaded';
    id: string;
    libraryId: string;
    playlist: PlaylistItem;
};

type PlaylistCardProps = LoadingPlaylistCardProps | LoadedPlaylistCardProps;

export function PlaylistCard(props: PlaylistCardProps) {
    if (props.componentState !== 'loaded') {
        return (
            <Card
                className={props.className}
                componentState={props.componentState}
                itemType={LibraryItemType.PLAYLIST}
                metadataLines={props.metadataLines ?? 1}
            />
        );
    }

    const { playlist } = props;

    const controls: LoadedCardProps['controls'] = {
        onContextMenu: (id, event) => {
            ContextMenuController.call({
                cmd: {
                    ids: [id],
                    type: 'playlist',
                },
                event,
            });
        },
        onDragInitialData: (id) => {
            return dndUtils.generateDragData(
                {
                    id: [id],
                    operation: [DragOperation.ADD],
                    type: DragTarget.PLAYLIST,
                },
                { image: playlist.imageUrl, title: playlist.name },
            );
        },
        onDragStart: (id) => {
            PrefetchController.call({
                cmd: {
                    tracksByPlaylistId: {
                        id: [id],
                        params: {
                            sortBy: TrackListSortOptions.ID,
                            sortOrder: ListSortOrder.ASC,
                        },
                    },
                },
            });
        },
        onPlay: (id, playType) => {
            PlayerController.call({
                cmd: {
                    addToQueueByFetch: {
                        id: [id],
                        itemType: LibraryItemType.PLAYLIST,
                        type: playType,
                    },
                },
            });
        },
    };

    return (
        <Card
            className={props.className}
            componentState={props.componentState}
            controls={controls}
            id={playlist.id}
            image={playlist.imageUrl}
            itemType={LibraryItemType.PLAYLIST}
            libraryId={playlist.libraryId}
            metadata={[]}
            metadataLines={props.metadataLines ?? 1}
            titledata={{ path: '/', text: playlist.name }}
        />
    );
}
