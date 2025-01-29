import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router';
import type { TrackContextMenuProps } from '@/features/controllers/context-menu/context-menu-controller.tsx';
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
import { useFavoriteTrack } from '@/features/favorites/hooks/use-favorite-track.ts';
import { useUnfavoriteTrack } from '@/features/favorites/hooks/use-unfavorite-track.ts';
import { PlayType } from '@/features/player/stores/player-store.tsx';
import { ContextMenu } from '@/features/ui/context-menu/context-menu.tsx';
import { Divider } from '@/features/ui/divider/divider.tsx';

export function TrackContextMenu({ items }: TrackContextMenuProps) {
    const { libraryId } = useParams() as { libraryId: string };

    const ids = useMemo(() => items.map((item) => item.id), [items]);

    const handlePlay = useCallback(
        (type: PlayType) => {
            PlayerController.call({
                cmd: {
                    addToQueueByData: {
                        data: items,
                        type,
                    },
                },
            });
        },
        [items],
    );

    const { mutate: favoriteTrack } = useFavoriteTrack();
    const { mutate: unfavoriteTrack } = useUnfavoriteTrack();

    const handleFavorite = useCallback(() => {
        favoriteTrack({ data: { ids }, libraryId });
    }, [favoriteTrack, ids, libraryId]);

    const handleUnfavorite = useCallback(() => {
        unfavoriteTrack({ data: { ids }, libraryId });
    }, [unfavoriteTrack, ids, libraryId]);

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
