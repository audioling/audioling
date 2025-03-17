import type { TrackItem } from '/@/app-types';
import type { AdapterGenreTrackListRequest } from '@repo/shared-types/adapter-types';
import type { QueryClient } from '@tanstack/react-query';
import { adapterAPI } from '@repo/adapter-api';
import { type AuthServer, ServerItemType } from '@repo/shared-types/app-types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { apiHelpers } from '/@/app-types';

export async function getGenreTrackList(server: AuthServer, params: AdapterGenreTrackListRequest) {
    const adapter = adapterAPI(server.type);
    const result = await adapter.genre.getGenreTrackList(params, server);

    if (result[0]) {
        throw new Error(result[0].message);
    }

    return {
        ...result[1],
        items: result[1].items.map(track => apiHelpers.transform(track, { _serverId: server.id })) as TrackItem[],
    };
}

export function useGenreTrackList(server: AuthServer, params: AdapterGenreTrackListRequest) {
    const query = useSuspenseQuery({
        queryFn: () => getGenreTrackList(server, params),
        queryKey: [server.id, ServerItemType.GENRE, params.query.id, params],
    });

    return query;
}

export function queryGenreTrackList(
    queryClient: QueryClient,
    server: AuthServer,
    params: AdapterGenreTrackListRequest,
) {
    return queryClient.ensureQueryData({
        queryFn: () => getGenreTrackList(server, params),
        queryKey: [server.id, ServerItemType.GENRE, params.query.id, params],
    });
}

export async function prefetchGenreTrackList(
    queryClient: QueryClient,
    server: AuthServer,
    params: AdapterGenreTrackListRequest,
) {
    await queryClient.prefetchQuery({
        queryFn: () => getGenreTrackList(server, params),
        queryKey: [server.id, ServerItemType.GENRE, params.query.id, params],
    });
}
