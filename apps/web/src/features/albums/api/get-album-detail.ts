import type {
    AdapterAlbumDetailRequest,
    AdapterRequestOptions,
} from '@repo/shared-types/adapter-types';
import { adapterAPI } from '@repo/adapter-api';
import { type AuthServer, ServerItemType } from '@repo/shared-types/app-types';
import { useSuspenseQuery } from '@tanstack/react-query';

export function getAlbumDetailQueryKey(server: AuthServer, request?: AdapterAlbumDetailRequest) {
    if (!request) {
        return [server.id, ServerItemType.ALBUM];
    }

    return [server.id, ServerItemType.ALBUM, request.query];
}

export async function getAlbumDetail(
    server: AuthServer,
    params: AdapterAlbumDetailRequest,
    options?: AdapterRequestOptions,
) {
    const adapter = adapterAPI(server.type);
    const result = await adapter.album.getAlbumDetail(params, server, options);

    if (result[0]) {
        throw new Error(result[0].message);
    }

    return result[1];
}

export function useAlbumDetail(server: AuthServer, params: AdapterAlbumDetailRequest) {
    const query = useSuspenseQuery({
        queryFn: ({ signal }) => getAlbumDetail(server, params, { signal }),
        queryKey: getAlbumDetailQueryKey(server, params),
    });

    return query;
}
