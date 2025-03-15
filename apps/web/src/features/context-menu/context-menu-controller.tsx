import type { PlayQueueItem } from '/@/app-types';
import type { MouseEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { createCallable } from 'react-call';
import { useParams } from 'react-router';
import { ContextMenu } from '/@/components/context-menu/context-menu';
import { AlbumArtistContextMenu } from '/@/features/context-menu/components/album-artists/album-artist-context-menu';
import { AlbumContextMenu } from '/@/features/context-menu/components/albums/album-context-menu';
import { GenreContextMenu } from '/@/features/context-menu/components/genres/genre-context-menu';
import { PlaylistContextMenu } from '/@/features/context-menu/components/playlists/playlist-context-menu';
import { QueueContextMenu } from '/@/features/context-menu/components/queue/queue-context-menu';
import { TrackContextMenu } from '/@/features/context-menu/components/tracks/track-context-menu';

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

export interface QueueContextMenuProps {
    items: PlayQueueItem[];
    type: 'queue';
}

export interface AlbumContextMenuProps {
    ids: string[];
    type: 'album';
}

export interface TrackContextMenuProps {
    ids: string[];
    type: 'track';
}

export interface AlbumArtistContextMenuProps {
    ids: string[];
    type: 'albumArtist';
}

export interface GenreContextMenuProps {
    ids: string[];
    type: 'genre';
}

export interface PlaylistContextMenuProps {
    ids: string[];
    type: 'playlist';
}
