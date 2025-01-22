import { LibraryItemType, ListSortOrder, TrackListSortOptions } from '@repo/shared-types';
import type { AlbumArtistItem } from '@/api/api-types.ts';
import { PlayerController } from '@/features/controllers/player-controller.tsx';
import { PrefetchController } from '@/features/controllers/prefetch-controller.tsx';
import type { BaseCardProps, LoadedCardProps, LoadingCardProps } from '@/features/ui/card/card.tsx';
import { Card } from '@/features/ui/card/card.tsx';
import { dndUtils, DragOperation, DragTarget } from '@/utils/drag-drop.ts';

type BaseAlbumArtistCardProps = BaseCardProps & {
    className?: string;
};

type LoadingAlbumArtistCardProps = LoadingCardProps & BaseAlbumArtistCardProps;

type LoadedAlbumArtistCardProps = BaseAlbumArtistCardProps & {
    albumArtist: AlbumArtistItem;
    componentState: 'loaded';
    id: string;
    libraryId: string;
};

type AlbumArtistCardProps = LoadingAlbumArtistCardProps | LoadedAlbumArtistCardProps;

export function AlbumArtistCard(props: AlbumArtistCardProps) {
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

    const { albumArtist } = props;

    const controls: LoadedCardProps['controls'] = {
        onDragInitialData: () => {
            return dndUtils.generateDragData(
                {
                    id: [props.id],
                    operation: [DragOperation.ADD],
                    type: DragTarget.ALBUM_ARTIST,
                },
                { image: albumArtist.imageUrl, title: albumArtist.name },
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
            id={albumArtist.id}
            image={albumArtist.imageUrl}
            isCircle={true}
            itemType={LibraryItemType.ALBUM_ARTIST}
            libraryId={props.libraryId}
            metadata={[]}
            metadataLines={props.metadataLines ?? 1}
            titledata={{ path: '/', text: albumArtist.name }}
        />
    );
}
