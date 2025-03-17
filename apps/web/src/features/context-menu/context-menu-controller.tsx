import type { PlayQueueItem } from '/@/app-types';
import type { MouseEvent } from 'react';
import { ServerItemType } from '@repo/shared-types/app-types';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { createCallable } from 'react-call';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { ContextMenu } from '/@/components/context-menu/context-menu';
import { AlbumArtistContextMenu } from '/@/features/context-menu/components/album-artists/album-artist-context-menu';
import { AlbumContextMenu } from '/@/features/context-menu/components/albums/album-context-menu';
import { GenreContextMenu } from '/@/features/context-menu/components/genres/genre-context-menu';
import { PlaylistContextMenu } from '/@/features/context-menu/components/playlists/playlist-context-menu';
import { QueueContextMenu } from '/@/features/context-menu/components/queue/queue-context-menu';
import { TrackContextMenu } from '/@/features/context-menu/components/tracks/track-context-menu';
import { logger } from '/@/logger';

interface ContextMenuControllerProps {
    cmd: ContextMenuCommand;
    event: MouseEvent;
}

export const ContextMenuController = createCallable<ContextMenuControllerProps, void>(
    ({ call, cmd, event }) => {
        const { libraryId } = useParams() as { libraryId: string };
        const { t } = useTranslation();
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
                logger.info('context-menu-controller', cmd);

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
                <ContextMenu.Content>
                    {cmd.type === 'queue' && <QueueContextMenu {...cmd} />}
                    {cmd.type === ServerItemType.ALBUM && <AlbumContextMenu {...cmd} />}
                    {cmd.type === ServerItemType.ALBUM_ARTIST && <AlbumArtistContextMenu {...cmd} />}
                    {cmd.type === ServerItemType.GENRE && <GenreContextMenu {...cmd} />}
                    {cmd.type === ServerItemType.PLAYLIST && <PlaylistContextMenu {...cmd} />}
                    {cmd.type === 'track' && <TrackContextMenu {...cmd} />}
                    <ContextMenu.Divider />
                    <ContextMenu.Item disabled>
                        {t('app.actions.selectedItems', { count: (cmd as { ids: string[] }).ids.length })}
                    </ContextMenu.Item>
                </ContextMenu.Content>
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
    type: ServerItemType.ALBUM;
}

export interface TrackContextMenuProps {
    ids: string[];
    type: ServerItemType.TRACK;
}

export interface AlbumArtistContextMenuProps {
    ids: string[];
    type: ServerItemType.ALBUM_ARTIST;
}

export interface GenreContextMenuProps {
    ids: string[];
    type: ServerItemType.GENRE;
}

export interface PlaylistContextMenuProps {
    ids: string[];
    type: ServerItemType.PLAYLIST;
}
