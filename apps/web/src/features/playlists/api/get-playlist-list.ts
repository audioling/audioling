import type { AdapterPlaylistListRequest } from '@repo/shared-types/adapter-types';
import { adapterAPI } from '@repo/adapter-api';
import { type AuthServer, ServerItemType } from '@repo/shared-types/app-types';
import { useSuspenseQuery } from '@tanstack/react-query';

export async function getPlaylistList(server: AuthServer, params: AdapterPlaylistListRequest) {
    const adapter = adapterAPI(server.type);
    const result = await adapter.playlist.getPlaylistList(params, server);

    if (result[0]) {
        throw new Error(result[0].message);
    }

    return result[1];
}

export function usePlaylistList(server: AuthServer, params: AdapterPlaylistListRequest) {
    const query = useSuspenseQuery({
        queryFn: () => getPlaylistList(server, params),
        queryKey: [server.id, ServerItemType.PLAYLIST, params],
    });

    return query;
}
