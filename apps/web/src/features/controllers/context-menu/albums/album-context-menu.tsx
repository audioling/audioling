import { useCallback, useMemo } from 'react';
import { LibraryItemType } from '@repo/shared-types';
import { useParams } from 'react-router';
import type { AlbumContextMenuProps } from '@/features/controllers/context-menu/context-menu-controller.tsx';
import { QueueCache } from '@/features/controllers/context-menu/queue/queue-cache.tsx';
import { QueueDownload } from '@/features/controllers/context-menu/queue/queue-download.tsx';
import { QueueInfo } from '@/features/controllers/context-menu/queue/queue-info.tsx';
import { QueueShare } from '@/features/controllers/context-menu/queue/queue-share.tsx';
import { AddToPlaylistContextItem } from '@/features/controllers/context-menu/shared/add-to-playlist-context-item.tsx';
import { FavoritesContextItem } from '@/features/controllers/context-menu/shared/favorites-context-item.tsx';
import {
    PlayLastContextItem,
    PlayNextContextItem,
    PlayNowContextItem,
} from '@/features/controllers/context-menu/shared/play-context-item.tsx';
import { RatingContextItem } from '@/features/controllers/context-menu/shared/rating-context-item.tsx';
import { PlayerController } from '@/features/controllers/player-controller.tsx';
import { useFavoriteAlbum } from '@/features/favorites/hooks/use-favorite-album.ts';
import { useUnfavoriteAlbum } from '@/features/favorites/hooks/use-unfavorite-album.ts';
import { PlayType } from '@/features/player/stores/player-store.tsx';
import { ContextMenu } from '@/features/ui/context-menu/context-menu.tsx';
import { Divider } from '@/features/ui/divider/divider.tsx';

export function AlbumContextMenu({ items }: AlbumContextMenuProps) {
    const { libraryId } = useParams() as { libraryId: string };

    const ids = useMemo(() => items.map((item) => item.id), [items]);

    const handlePlay = useCallback(
        (type: PlayType) => {
            PlayerController.call({
                cmd: {
                    addToQueueByFetch: {
                        id: ids,
                        itemType: LibraryItemType.ALBUM,
                        type,
                    },
                },
            });
        },
        [ids],
    );

    const { mutate: favoriteAlbum } = useFavoriteAlbum();
    const { mutate: unfavoriteAlbum } = useUnfavoriteAlbum();

    const handleFavorite = useCallback(() => {
        favoriteAlbum({ data: { ids }, libraryId });
    }, [favoriteAlbum, ids, libraryId]);

    const handleUnfavorite = useCallback(() => {
        unfavoriteAlbum({ data: { ids }, libraryId });
    }, [unfavoriteAlbum, ids, libraryId]);

    return (
        <ContextMenu.Content>
            <PlayNowContextItem onPlay={() => handlePlay(PlayType.NOW)} />
            <PlayNextContextItem onPlay={() => handlePlay(PlayType.NEXT)} />
            <PlayLastContextItem onPlay={() => handlePlay(PlayType.LAST)} />
            <Divider />
            <AddToPlaylistContextItem albums={ids} />
            <RatingContextItem />
            <FavoritesContextItem onFavorite={handleFavorite} onUnfavorite={handleUnfavorite} />
            <QueueDownload />
            <QueueCache />
            <Divider />
            <QueueShare />
            <Divider />
            <QueueInfo />
        </ContextMenu.Content>
    );
}
