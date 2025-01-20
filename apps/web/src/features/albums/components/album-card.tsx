import { LibraryItemType, ListSortOrder, TrackListSortOptions } from '@repo/shared-types';
import type { AlbumItem } from '@/api/api-types.ts';
import { PlayerController } from '@/features/controllers/player-controller.tsx';
import { PrefetchController } from '@/features/controllers/prefetch-controller.tsx';
import { useFavoriteAlbum } from '@/features/favorites/hooks/use-favorite-album.ts';
import { useUnfavoriteAlbum } from '@/features/favorites/hooks/use-unfavorite-album.ts';
import type { BaseCardProps, LoadedCardProps, LoadingCardProps } from '@/features/ui/card/card.tsx';
import { Card } from '@/features/ui/card/card.tsx';
import { dndUtils, DragOperation, DragTarget } from '@/utils/drag-drop.ts';

type BaseAlbumCardProps = BaseCardProps & {
    className?: string;
};

type LoadingAlbumCardProps = LoadingCardProps & BaseAlbumCardProps;

type LoadedAlbumCardProps = BaseAlbumCardProps & {
    album: AlbumItem;
    componentState: 'loaded';
};

type AlbumCardProps = LoadingAlbumCardProps | LoadedAlbumCardProps;

export function AlbumCard(props: AlbumCardProps) {
    const { mutate: favoriteAlbum } = useFavoriteAlbum();
    const { mutate: unfavoriteAlbum } = useUnfavoriteAlbum();

    if (props.componentState !== 'loaded') {
        return (
            <Card
                className={props.className}
                componentState={props.componentState}
                itemType={LibraryItemType.ALBUM}
                metadataLines={props.metadataLines ?? 1}
            />
        );
    }

    const { album } = props;

    const controls: LoadedCardProps['controls'] = {
        onDragInitialData: () => {
            return dndUtils.generateDragData(
                {
                    id: [album.id],
                    operation: [DragOperation.ADD],
                    type: DragTarget.ALBUM,
                },
                { image: album.imageUrl, title: album.name },
            );
        },
        onDragStart: () => {
            PrefetchController.call({
                cmd: {
                    tracksByAlbumId: {
                        id: [album.id],
                        params: {
                            sortBy: TrackListSortOptions.ID,
                            sortOrder: ListSortOrder.ASC,
                        },
                    },
                },
            });
        },
        onFavorite: (id, libraryId) => {
            favoriteAlbum({ data: { ids: [id] }, libraryId });
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
        onUnfavorite: (id, libraryId) => {
            unfavoriteAlbum({ data: { ids: [id] }, libraryId });
        },
        userFavorite: album?.userFavorite,
    };

    return (
        <Card
            className={props.className}
            componentState={props.componentState}
            controls={controls}
            id={album.id}
            image={album.imageUrl}
            itemType={LibraryItemType.ALBUM}
            libraryId={album.libraryId}
            metadata={[{ path: '/', text: album.artists[0]?.name }]}
            metadataLines={props.metadataLines ?? 1}
            titledata={{ path: '/', text: album.name }}
        />
    );
}
