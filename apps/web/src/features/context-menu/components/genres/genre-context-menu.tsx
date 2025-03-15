import type { GenreContextMenuProps } from '/@/features/context-menu/context-menu-controller';
import { useCallback } from 'react';
import { QueueInfo } from '/@/features/context-menu/components/queue/queue-info';
import { AddToPlaylistContextItem } from '/@/features/context-menu/components/shared/add-to-playlist-context-item';
import {
    PlayLastContextItem,
    PlayNextContextItem,
    PlayNowContextItem,
} from '/@/features/context-menu/components/shared/play-context-item';
import { PlayerController } from '../../../../controllers/player-controller';
import { PlayType } from '/@/stores/player-store';
import { ServerItemType } from '@repo/shared-types/app-types';
import { ContextMenu } from '/@/components/context-menu/context-menu';

export function GenreContextMenu({ ids }: GenreContextMenuProps) {
    const handlePlay = useCallback(
        (type: PlayType) => {
            PlayerController.call({
                cmd: {
                    addToQueueByFetch: {
                        id: ids,
                        itemType: ServerItemType.GENRE,
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
            <ContextMenu.Divider />
            <QueueInfo />
        </ContextMenu.Content>
    );
}
