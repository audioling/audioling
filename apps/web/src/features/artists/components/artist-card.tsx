import { LibraryItemType, ListSortOrder, TrackListSortOptions } from '@repo/shared-types';
import { PlayerController } from '@/features/controllers/player-controller.tsx';
import { PrefetchController } from '@/features/controllers/prefetch-controller.tsx';
import type { BaseCardProps, LoadedCardProps, LoadingCardProps } from '@/features/ui/card/card.tsx';
import { Card } from '@/features/ui/card/card.tsx';
import { dndUtils, DragOperation, DragTarget } from '@/utils/drag-drop.ts';

type BaseArtistCardProps = BaseCardProps & {
    className?: string;
};

type LoadingArtistCardProps = LoadingCardProps & BaseArtistCardProps;

type LoadedArtistCardProps = Omit<LoadedCardProps, 'controls'> & BaseArtistCardProps;

type ArtistCardProps = LoadingArtistCardProps | LoadedArtistCardProps;

export function ArtistCard(props: ArtistCardProps) {
    if (props.componentState !== 'loaded') {
        return (
            <Card
                className={props.className}
                componentState={props.componentState}
                isCircle={true}
                itemType={LibraryItemType.ALBUM_ARTIST}
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
                    type: DragTarget.ALBUM_ARTIST,
                },
                { image: props.image, title: props.titledata.text },
            );
        },
        onDragStart: () => {
            PrefetchController.call({
                cmd: {
                    tracksByAlbumArtistId: {
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
                        itemType: LibraryItemType.ALBUM_ARTIST,
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
            isCircle={true}
            itemType={LibraryItemType.ALBUM_ARTIST}
            metadata={props.metadata}
            metadataLines={props.metadataLines ?? 1}
            titledata={props.titledata}
        />
    );
}
