import { LibraryItemType, ListSortOrder, TrackListSortOptions } from '@repo/shared-types';
import { PlayerController } from '@/features/controllers/player-controller.tsx';
import { PrefetchController } from '@/features/controllers/prefetch-controller.tsx';
import type { BaseCardProps, LoadedCardProps, LoadingCardProps } from '@/features/ui/card/card.tsx';
import { Card } from '@/features/ui/card/card.tsx';
import { dndUtils, DragOperation, DragTarget } from '@/utils/drag-drop.ts';

type BasePlaylistCardProps = BaseCardProps & {
    className?: string;
};

type LoadingPlaylistCardProps = LoadingCardProps & BasePlaylistCardProps;

type LoadedPlaylistCardProps = Omit<LoadedCardProps, 'controls'> & BasePlaylistCardProps;

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

    const controls: LoadedCardProps['controls'] = {
        onDragInitialData: () => {
            return dndUtils.generateDragData(
                {
                    id: [props.id],
                    operation: [DragOperation.ADD],
                    type: DragTarget.PLAYLIST,
                },
                { image: props.image, title: props.titledata.text },
            );
        },
        onDragStart: () => {
            PrefetchController.call({
                cmd: {
                    tracksByPlaylistId: {
                        id: [props.id],
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
            id={props.id}
            image={props.image}
            itemType={LibraryItemType.PLAYLIST}
            metadata={props.metadata}
            metadataLines={props.metadataLines ?? 1}
            titledata={props.titledata}
        />
    );
}
