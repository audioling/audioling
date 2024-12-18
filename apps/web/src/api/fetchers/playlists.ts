import type { QueryClient } from '@tanstack/react-query';
import { apiInstance } from '@/api/api-instance.ts';
import type {
    GetApiLibraryIdPlaylistsIdTracks200,
    GetApiLibraryIdPlaylistsIdTracksParams,
} from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { getGetApiLibraryIdPlaylistsIdTracksQueryKey } from '@/api/openapi-generated/playlists/playlists.ts';

export const fetchTracksByPlaylistId = async (
    queryClient: QueryClient,
    libraryId: string,
    id: string,
    params: GetApiLibraryIdPlaylistsIdTracksParams,
) => {
    return queryClient.fetchQuery({
        queryFn: () => {
            return apiInstance<GetApiLibraryIdPlaylistsIdTracks200>({
                method: 'GET',
                params,
                url: `/api/${libraryId}/playlists/${id}/tracks`,
            });
        },
        queryKey: getGetApiLibraryIdPlaylistsIdTracksQueryKey(libraryId, id, params),
    });
};

export const prefetchTracksByPlaylistId = async (
    queryClient: QueryClient,
    libraryId: string,
    id: string,
    params: GetApiLibraryIdPlaylistsIdTracksParams,
) => {
    await queryClient.prefetchQuery({
        gcTime: 30 * 1000,
        queryFn: () => {
            return apiInstance<GetApiLibraryIdPlaylistsIdTracks200>({
                method: 'GET',
                params,
                url: `/api/${libraryId}/playlists/${id}/tracks`,
            });
        },
        queryKey: getGetApiLibraryIdPlaylistsIdTracksQueryKey(libraryId, id, params),
        staleTime: 30 * 1000,
    });
};
