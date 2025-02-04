import { useEffect, useRef, useState } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { LibraryItemType } from '@repo/shared-types';
import clsx from 'clsx';
import { generatePath, NavLink } from 'react-router';
import type { TrackItem } from '@/api/api-types.ts';
import { getDbItems } from '@/api/db/app-db-api.ts';
import { AddToPlaylistModal } from '@/features/playlists/add-to-playlist/add-to-playlist-modal.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import { APP_ROUTE } from '@/routes/app-routes.ts';
import type { DragData } from '@/utils/drag-drop.ts';
import { dndUtils, DragTarget } from '@/utils/drag-drop.ts';
import styles from './nav-bar-playlist-item.module.scss';

interface NavBarPlaylistItemProps {
    libraryId: string;
    name: string;
    playlistId: string;
}

export function NavBarPlaylistItem(props: NavBarPlaylistItemProps) {
    const { libraryId, name, playlistId } = props;
    const ref = useRef<HTMLAnchorElement>(null);
    const [isDraggedOver, setIsDraggedOver] = useState(false);

    useEffect(() => {
        if (!ref.current) return;

        return dropTargetForElements({
            canDrop: (args) => {
                const data = args.source.data as DragData<unknown>;
                return dndUtils.isDropTarget(data.type, [
                    DragTarget.ALBUM,
                    DragTarget.ALBUM_ARTIST,
                    DragTarget.ARTIST,
                    DragTarget.PLAYLIST,
                    DragTarget.PLAYLIST_TRACK,
                    DragTarget.TRACK,
                    DragTarget.QUEUE_TRACK,
                    DragTarget.GENRE,
                ]);
            },
            element: ref.current,
            onDragEnter: () => setIsDraggedOver(true),
            onDragLeave: () => setIsDraggedOver(false),
            onDrop: async (args) => {
                const type = dndUtils.dropType({
                    data: args.source.data as DragData<unknown>,
                });

                const dragData = args.source.data as DragData<unknown>;

                switch (type) {
                    case DragTarget.PLAYLIST:
                        AddToPlaylistModal.call({
                            libraryId,
                            playlistId,
                            playlists: dragData.id,
                        });
                        break;
                    case DragTarget.TRACK:
                    case DragTarget.PLAYLIST_TRACK: {
                        const ids = dragData.id;
                        const items = await getDbItems(LibraryItemType.TRACK, ids);

                        AddToPlaylistModal.call({
                            libraryId,
                            playlistId,
                            tracks: items as TrackItem[],
                        });
                        break;
                    }
                    case DragTarget.QUEUE_TRACK:
                        AddToPlaylistModal.call({
                            libraryId,
                            playlistId,
                            tracks: dragData.item as TrackItem[],
                        });
                        break;
                    case DragTarget.ALBUM:
                        AddToPlaylistModal.call({
                            albums: dragData.id,
                            libraryId,
                            playlistId,
                        });
                        break;
                    case DragTarget.ALBUM_ARTIST:
                        AddToPlaylistModal.call({
                            artists: dragData.id,
                            libraryId,
                            playlistId,
                        });
                        break;
                    case DragTarget.ARTIST:
                        AddToPlaylistModal.call({
                            artists: dragData.id,
                            libraryId,
                            playlistId,
                        });
                        break;
                    case DragTarget.GENRE:
                        AddToPlaylistModal.call({
                            genres: dragData.id,
                            libraryId,
                            playlistId,
                        });
                        break;
                }

                setIsDraggedOver(false);
            },
        });
    }, [libraryId, playlistId]);

    return (
        <NavLink
            ref={ref}
            className={({ isActive }) =>
                clsx(styles.container, {
                    [styles.draggedOver]: isDraggedOver,
                    [styles.active]: isActive,
                })
            }
            to={generatePath(APP_ROUTE.DASHBOARD_PLAYLISTS_DETAIL, {
                libraryId: libraryId,
                playlistId: playlistId,
            })}
        >
            <Text isEllipsis size="md">
                {name}
            </Text>
        </NavLink>
    );
}
