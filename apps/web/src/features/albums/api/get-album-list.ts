import type { AlbumItem } from '/@/app-types';
import type {
    AdapterAlbumListQuery,
    AdapterAlbumListRequest,
    AdapterRequestOptions,
} from '@repo/shared-types/adapter-types';
import type { QueryClient, QueryOptions } from '@tanstack/react-query';
import { adapterAPI } from '@repo/adapter-api';
import { type AuthServer, ServerItemType } from '@repo/shared-types/app-types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { apiHelpers } from '/@/app-types';

export function getAlbumListQueryKey(server: AuthServer, request?: AdapterAlbumListRequest) {
    if (!request) {
        return [server.id, ServerItemType.ALBUM];
    }

    return [server.id, ServerItemType.ALBUM, request.query];
}

export async function getAlbumList(
    server: AuthServer,
    params: AdapterAlbumListRequest,
    options?: AdapterRequestOptions,
) {
    const adapter = adapterAPI(server.type);
    const result = await adapter.album.getAlbumList(params, server, options);

    if (result[0]) {
        throw new Error(result[0].message);
    }

    return {
        ...result[1],
        items: result[1].items.map(album => apiHelpers.transform(album, { _serverId: server.id })) as AlbumItem[],
    };
}

export function useAlbumList(server: AuthServer, params: AdapterAlbumListRequest) {
    const query = useSuspenseQuery({
        queryFn: ({ signal }) => getAlbumList(server, params, { signal }),
        queryKey: getAlbumListQueryKey(server, params),
    });

    return query;
}

export function queryAlbumList(
    queryClient: QueryClient,
    server: AuthServer,
    params: AdapterAlbumListQuery,
    options?: QueryOptions,
) {
    const requestParams: AdapterAlbumListRequest = {
        query: params,
    };

    return queryClient.ensureQueryData(
        {
            queryFn: ({ signal }) => getAlbumList(server, requestParams, { signal }),
            queryKey: getAlbumListQueryKey(server, requestParams),
            ...options,
        },
    );
}

export async function prefetchAlbumList(
    queryClient: QueryClient,
    server: AuthServer,
    params: AdapterAlbumListRequest,
) {
    await queryClient.prefetchQuery({ queryKey: getAlbumListQueryKey(server, params) });
}
