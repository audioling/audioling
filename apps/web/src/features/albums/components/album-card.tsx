import { LibraryItemType, ListSortOrder, TrackListSortOptions } from '@repo/shared-types';
import { PlayerController } from '@/features/controllers/player-controller.tsx';
import { PrefetchController } from '@/features/controllers/prefetch-controller.tsx';
import type { BaseCardProps, LoadedCardProps, LoadingCardProps } from '@/features/ui/card/card.tsx';
import { Card } from '@/features/ui/card/card.tsx';
import { dndUtils, DragOperation, DragTarget } from '@/utils/drag-drop.ts';

type BaseAlbumCardProps = BaseCardProps & {
    className?: string;
};

type LoadingAlbumCardProps = LoadingCardProps & BaseAlbumCardProps;

type LoadedAlbumCardProps = Omit<LoadedCardProps, 'controls'> & BaseAlbumCardProps;

type AlbumCardProps = LoadingAlbumCardProps | LoadedAlbumCardProps;

export function AlbumCard(props: AlbumCardProps) {
    if (props.componentState !== 'loaded') {
        return (
            <Card
                className={props.className}
                componentState={props.componentState}
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
                    type: DragTarget.ALBUM,
                },
                { image: props.image, title: props.titledata.text },
            );
        },
        onDragStart: () => {
            PrefetchController.call({
                cmd: {
                    tracksByAlbumId: {
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
                        itemType: LibraryItemType.ALBUM,
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
            metadata={props.metadata}
            metadataLines={props.metadataLines ?? 1}
            titledata={props.titledata}
        />
    );
}
