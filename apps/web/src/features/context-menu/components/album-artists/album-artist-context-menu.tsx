import type { AlbumArtistContextMenuProps } from '/@/features/context-menu/context-menu-controller';
import { Divider } from '@mantine/core';
import { ServerItemType } from '@repo/shared-types/app-types';
import { useCallback } from 'react';
import { ContextMenu } from '/@/components/context-menu/context-menu';
import { PlayerController } from '/@/controllers/player-controller';
import { QueueCache } from '/@/features/context-menu/components/queue/queue-cache';
import { QueueDownload } from '/@/features/context-menu/components/queue/queue-download';
import { QueueInfo } from '/@/features/context-menu/components/queue/queue-info';
import { QueueShare } from '/@/features/context-menu/components/queue/queue-share';
import { AddToPlaylistContextItem } from '/@/features/context-menu/components/shared/add-to-playlist-context-item';
import { FavoritesContextItem } from '/@/features/context-menu/components/shared/favorites-context-item';
import {
    PlayLastContextItem,
    PlayNextContextItem,
    PlayNowContextItem,
} from '/@/features/context-menu/components/shared/play-context-item';
import { RatingContextItem } from '/@/features/context-menu/components/shared/rating-context-item';
import { useFavoriteAlbumArtist, useUnfavoriteAlbumArtist } from '/@/features/favorites/api/set-album-artist-favorite';
import { PlayType } from '/@/stores/player-store';

export function AlbumArtistContextMenu({ ids }: AlbumArtistContextMenuProps) {
    const handlePlay = useCallback(
        (type: PlayType) => {
            PlayerController.call({
                cmd: {
                    addToQueueByFetch: {
                        id: ids,
                        itemType: ServerItemType.ALBUM_ARTIST,
                        type,
                    },
                },
            });
        },
        [ids],
    );

    const { mutate: favoriteAlbumArtist } = useFavoriteAlbumArtist();
    const { mutate: unfavoriteAlbumArtist } = useUnfavoriteAlbumArtist();

    const handleFavorite = useCallback(() => {
        favoriteAlbumArtist({ ids });
    }, [favoriteAlbumArtist, ids]);

    const handleUnfavorite = useCallback(() => {
        unfavoriteAlbumArtist({ ids });
    }, [unfavoriteAlbumArtist, ids]);

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
