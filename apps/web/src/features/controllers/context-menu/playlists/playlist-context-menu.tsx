import { useCallback, useMemo } from 'react';
import { LibraryItemType } from '@repo/shared-types';
import type { PlaylistContextMenuProps } from '@/features/controllers/context-menu/context-menu-controller.tsx';
import { QueueCache } from '@/features/controllers/context-menu/queue/queue-cache.tsx';
import { QueueDownload } from '@/features/controllers/context-menu/queue/queue-download.tsx';
import { QueueInfo } from '@/features/controllers/context-menu/queue/queue-info.tsx';
import { QueueShare } from '@/features/controllers/context-menu/queue/queue-share.tsx';
import { AddToPlaylistContextItem } from '@/features/controllers/context-menu/shared/add-to-playlist-context-item.tsx';
import {
    PlayLastContextItem,
    PlayNextContextItem,
    PlayNowContextItem,
} from '@/features/controllers/context-menu/shared/play-context-item.tsx';
import { RatingContextItem } from '@/features/controllers/context-menu/shared/rating-context-item.tsx';
import { PlayerController } from '@/features/controllers/player-controller.tsx';
import { PlayType } from '@/features/player/stores/player-store.tsx';
import { ContextMenu } from '@/features/ui/context-menu/context-menu.tsx';

export function PlaylistContextMenu({ items }: PlaylistContextMenuProps) {
    const ids = useMemo(() => items.map((item) => item.id), [items]);

    const handlePlay = useCallback(
        (type: PlayType) => {
            PlayerController.call({
                cmd: {
                    addToQueueByFetch: {
                        id: ids,
                        itemType: LibraryItemType.PLAYLIST,
                        type,
                    },
                },
            });
        },
        [ids],
    );

    return (
        <ContextMenu.Content>
            <PlayNowContextItem onPlay={() => handlePlay(PlayType.NOW)} />
            <PlayNextContextItem onPlay={() => handlePlay(PlayType.NEXT)} />
            <PlayLastContextItem onPlay={() => handlePlay(PlayType.LAST)} />
            <ContextMenu.Divider />
            <AddToPlaylistContextItem albums={ids} />
            <RatingContextItem />
            <ContextMenu.Divider />
            <QueueDownload />
            <QueueCache />
            <QueueShare />
            <QueueInfo />
        </ContextMenu.Content>
    );
}
