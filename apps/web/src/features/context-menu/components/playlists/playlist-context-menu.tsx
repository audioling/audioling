import type { PlaylistContextMenuProps } from '/@/features/context-menu/context-menu-controller';
import { ServerItemType } from '@repo/shared-types/app-types';
import { useCallback } from 'react';
import { ContextMenu } from '/@/components/context-menu/context-menu';
import { PlayerController } from '/@/controllers/player-controller';
import { QueueCache } from '/@/features/context-menu/components/queue/queue-cache';
import { QueueDownload } from '/@/features/context-menu/components/queue/queue-download';
import { QueueInfo } from '/@/features/context-menu/components/queue/queue-info';
import { QueueShare } from '/@/features/context-menu/components/queue/queue-share';
import { AddToPlaylistContextItem } from '/@/features/context-menu/components/shared/add-to-playlist-context-item';
import {
    PlayLastContextItem,
    PlayNextContextItem,
    PlayNowContextItem,
} from '/@/features/context-menu/components/shared/play-context-item';
import { RatingContextItem } from '/@/features/context-menu/components/shared/rating-context-item';
import { PlayType } from '/@/stores/player-store';

export function PlaylistContextMenu({ ids }: PlaylistContextMenuProps) {
    const handlePlay = useCallback(
        (type: PlayType) => {
            PlayerController.call({
                cmd: {
                    addToQueueByFetch: {
                        id: ids,
                        itemType: ServerItemType.PLAYLIST,
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
