import type { AdapterPlaylistTrackListRequest } from '@repo/shared-types/adapter-types';
import type { QueryClient } from '@tanstack/react-query';
import { adapterAPI } from '@repo/adapter-api';
import { type AuthServer, ServerItemType } from '@repo/shared-types/app-types';
import { useSuspenseQuery } from '@tanstack/react-query';

export async function getPlaylistTrackList(server: AuthServer, params: AdapterPlaylistTrackListRequest) {
    const adapter = adapterAPI(server.type);
    const result = await adapter.playlist.getPlaylistTrackList(params, server);

    if (result[0]) {
        throw new Error(result[0].message);
    }

    return result[1];
}

export function usePlaylistTrackList(server: AuthServer, params: AdapterPlaylistTrackListRequest) {
    const query = useSuspenseQuery({
        queryFn: () => getPlaylistTrackList(server, params),
        queryKey: [server.id, ServerItemType.PLAYLIST, params.query.id, params],
    });

    return query;
}

export function queryPlaylistTrackList(
    queryClient: QueryClient,
    server: AuthServer,
    params: AdapterPlaylistTrackListRequest,
) {
    return queryClient.ensureQueryData(
        {
            queryFn: () => getPlaylistTrackList(server, params),
            queryKey: [server.id, ServerItemType.PLAYLIST, params.query.id, params],
        },
    );
}

export async function prefetchPlaylistTrackList(
    server: AuthServer,
    params: AdapterPlaylistTrackListRequest,
    queryClient: QueryClient,
) {
    await queryClient.prefetchQuery({ queryKey: [server.id, ServerItemType.PLAYLIST, params.query.id, params] });
}
