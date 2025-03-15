import type { PlayQueueItem } from '/@/app-types';
import { useCallback, useMemo } from 'react';
import { ContextMenu } from '/@/components/context-menu/context-menu';
import { useAppContext } from '/@/features/authentication/context/app-context';
import { QueueCache } from '/@/features/context-menu/components/queue/queue-cache';
import { QueueDownload } from '/@/features/context-menu/components/queue/queue-download';
import { QueueInfo } from '/@/features/context-menu/components/queue/queue-info';
import { QueueMove } from '/@/features/context-menu/components/queue/queue-move';
import { QueueRemove } from '/@/features/context-menu/components/queue/queue-remove';
import { QueueShare } from '/@/features/context-menu/components/queue/queue-share';
import { QueueShuffle } from '/@/features/context-menu/components/queue/queue-shuffle';
import { AddToPlaylistContextItem } from '/@/features/context-menu/components/shared/add-to-playlist-context-item';
import { FavoritesContextItem } from '/@/features/context-menu/components/shared/favorites-context-item';
import { RatingContextItem } from '/@/features/context-menu/components/shared/rating-context-item';
import { useFavoriteTrack, useUnfavoriteTrack } from '/@/features/favorites/api/set-track-favorite';

interface QueueContextMenuProps {
    items: PlayQueueItem[];
}

export function QueueContextMenu({ items }: QueueContextMenuProps) {
    const { server } = useAppContext();

    const { ids, tracks } = useMemo(() => {
        const tracks = items.filter((item): item is PlayQueueItem => item !== undefined);
        const ids = tracks.map(track => track.id);
        return { ids, tracks };
    }, [items]);

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
            <QueueRemove items={items} />
            <ContextMenu.Divider />
            <AddToPlaylistContextItem tracks={tracks} />
            <RatingContextItem />
            <FavoritesContextItem onFavorite={handleFavorite} onUnfavorite={handleUnfavorite} />
            <ContextMenu.Divider />
            <QueueShuffle items={items} />
            <QueueMove items={items} />
            <ContextMenu.Divider />
            <QueueDownload />
            <QueueCache />
            <ContextMenu.Divider />
            <QueueShare />
            <ContextMenu.Divider />
            <QueueInfo />
        </ContextMenu.Content>
    );
}
