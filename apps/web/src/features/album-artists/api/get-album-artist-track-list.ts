import type { TrackItem } from '/@/app-types';
import type { AdapterArtistTrackListRequest } from '@repo/shared-types/adapter-types';
import type { QueryClient } from '@tanstack/react-query';
import { adapterAPI } from '@repo/adapter-api';
import { type AuthServer, ServerItemType } from '@repo/shared-types/app-types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { apiHelpers } from '/@/app-types';

export async function getAlbumArtistTrackList(server: AuthServer, params: AdapterArtistTrackListRequest) {
    const adapter = adapterAPI(server.type);
    const result = await adapter.albumArtist.getAlbumArtistTrackList(params, server);

    if (result[0]) {
        throw new Error(result[0].message);
    }

    return {
        ...result[1],
        items: result[1].items.map(track => apiHelpers.transform(track, { _serverId: server.id })) as TrackItem[],
    };
}

export function useAlbumArtistTrackList(server: AuthServer, params: AdapterArtistTrackListRequest) {
    const query = useSuspenseQuery({
        queryFn: () => getAlbumArtistTrackList(server, params),
        queryKey: [server.id, ServerItemType.ALBUM_ARTIST, params.query.id, params],
    });

    return query;
}

export function queryAlbumArtistTrackList(
    queryClient: QueryClient,
    server: AuthServer,
    params: AdapterArtistTrackListRequest,
) {
    const query = queryClient.ensureQueryData(
        {
            queryFn: () => getAlbumArtistTrackList(server, params),
            queryKey: [server.id, ServerItemType.ALBUM_ARTIST, params.query.id, params],
        },
    );

    return query;
}

export async function prefetchAlbumArtistTrackList(
    queryClient: QueryClient,
    server: AuthServer,
    params: AdapterArtistTrackListRequest,
) {
    await queryClient.prefetchQuery({ queryKey: [server.id, ServerItemType.ALBUM_ARTIST, params.query.id, params] });
}
