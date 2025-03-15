import type {
    AdapterAlbumListCountRequest,
    AdapterRequestOptions,
} from '@repo/shared-types/adapter-types';
import { adapterAPI } from '@repo/adapter-api';
import { type AuthServer, ServerItemType } from '@repo/shared-types/app-types';
import { useSuspenseQuery } from '@tanstack/react-query';

function getParams(request?: AdapterAlbumListCountRequest) {
    if (!request) {
        return {};
    }

    return {
        folderId: request.query.folderId,
        searchTerm: request.query.searchTerm,
        sortBy: request.query.sortBy,
    };
}

export function getAlbumListCountQueryKey(server: AuthServer, request?: AdapterAlbumListCountRequest) {
    if (!request) {
        return [server.id, ServerItemType.ALBUM, 'count'];
    }

    return [server.id, ServerItemType.ALBUM, 'count', getParams(request)];
}

export async function getAlbumListCount(
    server: AuthServer,
    request: AdapterAlbumListCountRequest,
    options?: AdapterRequestOptions,
) {
    const adapter = adapterAPI(server.type);
    const result = await adapter.album.getAlbumListCount(request, server, options);

    if (result[0]) {
        throw new Error(result[0].message);
    }

    return result[1];
}

export function useAlbumListCount(server: AuthServer, request: AdapterAlbumListCountRequest) {
    const query = useSuspenseQuery({
        queryFn: async () => await getAlbumListCount(server, request),
        queryKey: getAlbumListCountQueryKey(server, request),
    });

    return query;
}
