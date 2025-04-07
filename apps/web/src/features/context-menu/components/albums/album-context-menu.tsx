import type { AlbumContextMenuProps } from '/@/features/context-menu/context-menu-controller';
import { ServerItemType } from '@repo/shared-types/app-types';
import { useCallback } from 'react';
import { ContextMenu } from '/@/components/context-menu/context-menu';
import { PlayerController } from '/@/controllers/player-controller';
import { QueueCache } from '/@/features/context-menu/components/queue/queue-cache';
import { QueueDownload } from '/@/features/context-menu/components/queue/queue-download';
import { QueueShare } from '/@/features/context-menu/components/queue/queue-share';
import { AddToPlaylistContextItem } from '/@/features/context-menu/components/shared/add-to-playlist-context-item';
import { FavoritesContextItem } from '/@/features/context-menu/components/shared/favorites-context-item';
import {
    PlayLastContextItem,
    PlayNextContextItem,
    PlayNowContextItem,
} from '/@/features/context-menu/components/shared/play-context-item';
import { RatingContextItem } from '/@/features/context-menu/components/shared/rating-context-item';
import { useFavoriteAlbum, useUnfavoriteAlbum } from '/@/features/favorites/api/set-album-favorite';
import { PlayType } from '/@/stores/player-store';

export function AlbumContextMenu({ ids }: AlbumContextMenuProps) {
    const handlePlay = useCallback(
        (type: PlayType) => {
            PlayerController.call({
                cmd: {
                    addToQueueByFetch: {
                        id: ids,
                        itemType: ServerItemType.ALBUM,
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
        favoriteAlbum({ ids });
    }, [favoriteAlbum, ids]);

    const handleUnfavorite = useCallback(() => {
        unfavoriteAlbum({ ids });
    }, [unfavoriteAlbum, ids]);

    return (
        <>
            <PlayNowContextItem onPlay={() => handlePlay(PlayType.NOW)} />
            <PlayNextContextItem onPlay={() => handlePlay(PlayType.NEXT)} />
            <PlayLastContextItem onPlay={() => handlePlay(PlayType.LAST)} />
            <ContextMenu.Divider />
            <AddToPlaylistContextItem albums={ids} />
            <RatingContextItem />
            <FavoritesContextItem onFavorite={handleFavorite} onUnfavorite={handleUnfavorite} />
            <QueueDownload />
            <QueueCache />
            <ContextMenu.Divider />
            <QueueShare />
        </>
    );
}
