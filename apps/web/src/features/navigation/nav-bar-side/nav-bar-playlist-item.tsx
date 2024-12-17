import { useEffect, useRef, useState } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import clsx from 'clsx';
import { generatePath, NavLink } from 'react-router';
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
                const data = args.source.data as DragData;
                return dndUtils.isDropTarget(data.type, [
                    DragTarget.ALBUM,
                    DragTarget.ALBUM_ARTIST,
                    DragTarget.ARTIST,
                    DragTarget.PLAYLIST,
                    DragTarget.TRACK,
                ]);
            },
            element: ref.current,
            onDragEnter: () => setIsDraggedOver(true),
            onDragLeave: () => setIsDraggedOver(false),
            onDrop: () => {
                setIsDraggedOver(false);
            },
        });
    }, []);

    return (
        <NavLink
            ref={ref}
            className={clsx(styles.container, { [styles.draggedOver]: isDraggedOver })}
            to={generatePath(APP_ROUTE.DASHBOARD_PLAYLISTS_DETAIL, {
                libraryId: libraryId,
                playlistId: playlistId,
            })}
        >
            <Text size="md">{name}</Text>
        </NavLink>
    );
}
