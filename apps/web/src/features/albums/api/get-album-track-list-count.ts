import type { AdapterAlbumTrackListRequest, AdapterRequestOptions } from '@repo/shared-types/adapter-types';
import { adapterAPI } from '@repo/adapter-api';
import { type AuthServer, ServerItemType } from '@repo/shared-types/app-types';
import { useSuspenseQuery } from '@tanstack/react-query';

export function getAlbumTrackListCountQueryKey(server: AuthServer, request: AdapterAlbumTrackListRequest) {
    if (!request) {
        return [server.id, ServerItemType.ALBUM];
    }

    return [server.id, ServerItemType.ALBUM, request.query.id, 'count', request];
}

export async function getAlbumTrackListCount(
    server: AuthServer,
    request: AdapterAlbumTrackListRequest,
    options?: AdapterRequestOptions,
) {
    const adapter = adapterAPI(server.type);
    const result = await adapter.album.getAlbumTrackListCount(request, server, options);

    if (result[0]) {
        throw new Error(result[0].message);
    }

    return result[1];
}

export function useAlbumTrackListCount(server: AuthServer, request: AdapterAlbumTrackListRequest) {
    const query = useSuspenseQuery({
        queryFn: ({ signal }) => getAlbumTrackListCount(server, request, { signal }),
        queryKey: getAlbumTrackListCountQueryKey(server, request),
    });

    return query;
}
