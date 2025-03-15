import type { TrackItem } from '/@/app-types';
import type { AdapterAlbumTrackListRequest, AdapterRequestOptions } from '@repo/shared-types/adapter-types';
import type { QueryClient } from '@tanstack/react-query';
import { adapterAPI } from '@repo/adapter-api';
import { type AuthServer, ServerItemType } from '@repo/shared-types/app-types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { apiHelpers } from '/@/app-types';

export function getAlbumTrackListQueryKey(server: AuthServer, request?: AdapterAlbumTrackListRequest) {
    if (!request) {
        return [server.id, ServerItemType.ALBUM];
    }

    return [server.id, ServerItemType.ALBUM, request.query.id, request];
}

export async function getAlbumTrackList(
    server: AuthServer,
    request: AdapterAlbumTrackListRequest,
    options?: AdapterRequestOptions,
) {
    const adapter = adapterAPI(server.type);
    const result = await adapter.album.getAlbumTrackList(request, server, options);

    if (result[0]) {
        throw new Error(result[0].message);
    }

    return {
        ...result[1],
        items: result[1].items.map(track => apiHelpers.transform(track, { _serverId: server.id })) as TrackItem[],
    };
}

export function useAlbumTrackList(server: AuthServer, params: AdapterAlbumTrackListRequest) {
    const query = useSuspenseQuery({
        queryFn: ({ signal }) => getAlbumTrackList(server, params, { signal }),
        queryKey: getAlbumTrackListQueryKey(server, params),
    });

    return query;
}

export function queryAlbumTrackList(
    queryClient: QueryClient,
    server: AuthServer,
    params: AdapterAlbumTrackListRequest,
) {
    return queryClient.ensureQueryData(
        {
            queryFn: () => getAlbumTrackList(server, params),
            queryKey: getAlbumTrackListQueryKey(server, params),

        },
    );
}

export async function prefetchAlbumTrackList(
    queryClient: QueryClient,
    server: AuthServer,
    params: AdapterAlbumTrackListRequest,
) {
    await queryClient.prefetchQuery({ queryKey: getAlbumTrackListQueryKey(server, params) });
}
