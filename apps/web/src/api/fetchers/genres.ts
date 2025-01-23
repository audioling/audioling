import type { QueryClient } from '@tanstack/react-query';
import { apiInstance } from '@/api/api-instance.ts';
import type {
    GetApiLibraryIdGenresIdTracks200,
    GetApiLibraryIdGenresIdTracksParams,
} from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { getGetApiLibraryIdGenresIdTracksQueryKey } from '@/api/openapi-generated/genres/genres.ts';

export const fetchTracksByGenreId = async (
    queryClient: QueryClient,
    libraryId: string,
    id: string,
    params: GetApiLibraryIdGenresIdTracksParams,
) => {
    return queryClient.ensureQueryData({
        queryFn: () => {
            return apiInstance<GetApiLibraryIdGenresIdTracks200>({
                method: 'GET',
                params,
                url: `/api/${libraryId}/genres/${id}/tracks`,
            });
        },
        queryKey: getGetApiLibraryIdGenresIdTracksQueryKey(libraryId, id, params),
    });
};

export const prefetchTracksByGenreId = async (
    queryClient: QueryClient,
    libraryId: string,
    id: string,
    params: GetApiLibraryIdGenresIdTracksParams,
) => {
    await queryClient.prefetchQuery({
        gcTime: 30 * 1000,
        queryFn: () => {
            return apiInstance<GetApiLibraryIdGenresIdTracks200>({
                method: 'GET',
                params,
                url: `/api/${libraryId}/genres/${id}/tracks`,
            });
        },
        queryKey: getGetApiLibraryIdGenresIdTracksQueryKey(libraryId, id, params),
        staleTime: 30 * 1000,
    });
};
