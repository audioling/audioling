import type { MouseEvent } from 'react';
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createCallable } from 'react-call';
import { useParams } from 'react-router';
import type {
    AlbumArtistItem,
    AlbumItem,
    GenreItem,
    PlaylistItem,
    PlayQueueItem,
    TrackItem,
} from '@/api/api-types.ts';
import { AlbumArtistContextMenu } from '@/features/controllers/context-menu/album-artists/album-artist-context-menu.tsx';
import { AlbumContextMenu } from '@/features/controllers/context-menu/albums/album-context-menu.tsx';
import { GenreContextMenu } from '@/features/controllers/context-menu/genres/genre-context-menu.tsx';
import { PlaylistContextMenu } from '@/features/controllers/context-menu/playlists/playlist-context-menu.tsx';
import { QueueContextMenu } from '@/features/controllers/context-menu/queue/queue-context-menu.tsx';
import { TrackContextMenu } from '@/features/controllers/context-menu/tracks/track-context-menu.tsx';
import { ContextMenu } from '@/features/ui/context-menu/context-menu.tsx';

interface ContextMenuControllerProps {
    cmd: ContextMenuCommand;
    event: MouseEvent;
}

export const ContextMenuController = createCallable<ContextMenuControllerProps, void>(
    ({ call, cmd, event }) => {
        const { libraryId } = useParams() as { libraryId: string };
        const queryClient = useQueryClient();

        const triggerRef = useRef<HTMLDivElement>(null);
        const isExecuted = useRef<boolean>(false);

        useEffect(() => {
            if (isExecuted.current) {
                return;
            }

            if (!triggerRef.current) {
                return;
            }

            const handleContextMenu = () => {
                triggerRef.current?.dispatchEvent(
                    new MouseEvent('contextmenu', {
                        bubbles: true,
                        clientX: event.clientX,
                        clientY: event.clientY,
                    }),
                );
            };

            isExecuted.current = true;

            handleContextMenu();
        }, [call, cmd, event.clientX, event.clientY, libraryId, queryClient]);

        return (
            <ContextMenu>
                <ContextMenu.Target>
                    <div
                        ref={triggerRef}
                        style={{
                            height: 0,
                            left: 0,
                            pointerEvents: 'none',
                            position: 'absolute',
                            top: 0,
                            userSelect: 'none',
                            width: 0,
                        }}
                    />
                </ContextMenu.Target>
                {cmd.type === 'queue' && <QueueContextMenu {...cmd} />}
                {cmd.type === 'album' && <AlbumContextMenu {...cmd} />}
                {cmd.type === 'albumArtist' && <AlbumArtistContextMenu {...cmd} />}
                {cmd.type === 'genre' && <GenreContextMenu {...cmd} />}
                {cmd.type === 'playlist' && <PlaylistContextMenu {...cmd} />}
                {cmd.type === 'track' && <TrackContextMenu {...cmd} />}
            </ContextMenu>
        );
    },
);

export type ContextMenuCommand =
    | QueueContextMenuProps
    | AlbumContextMenuProps
    | TrackContextMenuProps
    | AlbumArtistContextMenuProps
    | GenreContextMenuProps
    | PlaylistContextMenuProps;

export type QueueContextMenuProps = {
    items: PlayQueueItem[];
    type: 'queue';
};

export type AlbumContextMenuProps = {
    items: AlbumItem[];
    type: 'album';
};

export type TrackContextMenuProps = {
    items: TrackItem[];
    type: 'track';
};

export type AlbumArtistContextMenuProps = {
    items: AlbumArtistItem[];
    type: 'albumArtist';
};

export type GenreContextMenuProps = {
    items: GenreItem[];
    type: 'genre';
};

export type PlaylistContextMenuProps = {
    items: PlaylistItem[];
    type: 'playlist';
};
