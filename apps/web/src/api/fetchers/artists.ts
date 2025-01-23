import type { QueryClient } from '@tanstack/react-query';
import { apiInstance } from '@/api/api-instance.ts';
import { getGetApiLibraryIdAlbumArtistsIdTracksQueryKey } from '@/api/openapi-generated/album-artists/album-artists.ts';
import type {
    GetApiLibraryIdAlbumArtistsIdTracks200,
    GetApiLibraryIdAlbumArtistsIdTracksParams,
} from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';

export const fetchTracksByAlbumArtistId = async (
    queryClient: QueryClient,
    libraryId: string,
    id: string,
    params: GetApiLibraryIdAlbumArtistsIdTracksParams,
) => {
    return queryClient.ensureQueryData({
        queryFn: () => {
            return apiInstance<GetApiLibraryIdAlbumArtistsIdTracks200>({
                method: 'GET',
                params,
                url: `/api/${libraryId}/album-artists/${id}/tracks`,
            });
        },
        queryKey: getGetApiLibraryIdAlbumArtistsIdTracksQueryKey(libraryId, id, params),
    });
};

export const prefetchTracksByAlbumArtistId = async (
    queryClient: QueryClient,
    libraryId: string,
    id: string,
    params: GetApiLibraryIdAlbumArtistsIdTracksParams,
) => {
    await queryClient.prefetchQuery({
        gcTime: 30 * 1000,
        queryFn: () => {
            return apiInstance<GetApiLibraryIdAlbumArtistsIdTracks200>({
                method: 'GET',
                params,
                url: `/api/${libraryId}/album-artists/${id}/tracks`,
            });
        },
        queryKey: getGetApiLibraryIdAlbumArtistsIdTracksQueryKey(libraryId, id, params),
        staleTime: 30 * 1000,
    });
};
