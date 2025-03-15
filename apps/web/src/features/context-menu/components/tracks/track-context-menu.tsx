import type { TrackItem } from '/@/app-types';
import type { TrackContextMenuProps } from '/@/features/context-menu/context-menu-controller';
import { Divider } from '@mantine/core';
import { ServerItemType } from '@repo/shared-types/app-types';
import { useCallback } from 'react';
import { getDBItems } from '/@/api/app-db';
import { ContextMenu } from '/@/components/context-menu/context-menu';
import { PlayerController } from '/@/controllers/player-controller';
import { useAppContext } from '/@/features/authentication/context/app-context';
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
import { useFavoriteTrack, useUnfavoriteTrack } from '/@/features/favorites/api/set-track-favorite';
import { PlayType } from '/@/stores/player-store';

export function TrackContextMenu({ ids }: TrackContextMenuProps) {
    const { appDB, server } = useAppContext();

    const handlePlay = useCallback(
        async (type: PlayType) => {
            const items = await getDBItems(appDB, ServerItemType.TRACK, ids);

            PlayerController.call({
                cmd: {
                    addToQueueByData: {
                        data: items as TrackItem[],
                        type,
                    },
                },
            });
        },
        [appDB, ids],
    );

    const { mutate: favoriteTrack } = useFavoriteTrack();
    const { mutate: unfavoriteTrack } = useUnfavoriteTrack();

    const handleFavorite = useCallback(() => {
        favoriteTrack({ ids, serverId: server.id });
    }, [favoriteTrack, ids, server.id]);

    const handleUnfavorite = useCallback(() => {
        unfavoriteTrack({ ids, serverId: server.id });
    }, [unfavoriteTrack, ids, server.id]);

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
