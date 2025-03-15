import { NavLink } from '@mantine/core';
import { ListSortOrder, PlaylistListSortOptions } from '@repo/shared-types/app-types';
import { Suspense } from 'react';
import { generatePath, NavLink as RNavLink } from 'react-router';
import { ComponentErrorBoundary } from '/@/components/error-boundary/component-error-boundary';
import { useAppContext } from '../../../authentication/context/app-context';
import { usePlaylistList } from '/@/features/playlists/api/get-playlist-list';
import { AppRoute } from '/@/routes/types';

export function PlaylistGroup() {
    return (
        <ComponentErrorBoundary>
            <Suspense fallback={<></>}>
                <PlaylistList />
            </Suspense>
        </ComponentErrorBoundary>
    );
}

function PlaylistList() {
    const { server } = useAppContext();

    const { data: playlists } = usePlaylistList(server, {
        query: {
            limit: -1,
            offset: 0,
            sortBy: PlaylistListSortOptions.NAME,
            sortOrder: ListSortOrder.ASC,
        },
    });

    return (
        <>
            {playlists.items.map(playlist => (
                <NavLink
                    key={playlist.id}
                    component={RNavLink}
                    label={playlist.name}
                    to={generatePath(AppRoute.APP_PLAYLISTS_DETAIL, { playlistId: playlist.id, serverId: server.id })}
                />
            ))}
        </>
    );
}
