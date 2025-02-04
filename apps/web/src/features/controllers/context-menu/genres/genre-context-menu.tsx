import { useCallback } from 'react';
import { LibraryItemType } from '@repo/shared-types';
import type { GenreContextMenuProps } from '@/features/controllers/context-menu/context-menu-controller.tsx';
import { QueueInfo } from '@/features/controllers/context-menu/queue/queue-info.tsx';
import { AddToPlaylistContextItem } from '@/features/controllers/context-menu/shared/add-to-playlist-context-item.tsx';
import {
    PlayLastContextItem,
    PlayNextContextItem,
    PlayNowContextItem,
} from '@/features/controllers/context-menu/shared/play-context-item.tsx';
import { PlayerController } from '@/features/controllers/player-controller.tsx';
import { PlayType } from '@/features/player/stores/player-store.tsx';
import { ContextMenu } from '@/features/ui/context-menu/context-menu.tsx';

export function GenreContextMenu({ ids }: GenreContextMenuProps) {
    const handlePlay = useCallback(
        (type: PlayType) => {
            PlayerController.call({
                cmd: {
                    addToQueueByFetch: {
                        id: ids,
                        itemType: LibraryItemType.GENRE,
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
