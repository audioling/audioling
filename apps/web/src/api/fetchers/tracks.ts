import type { QueryClient } from '@tanstack/react-query';
import { apiInstance } from '@/api/api-instance.ts';
import type {
    GetApiLibraryIdTracks200,
    GetApiLibraryIdTracksId200,
    GetApiLibraryIdTracksParams,
} from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import {
    getGetApiLibraryIdTracksIdQueryKey,
    getGetApiLibraryIdTracksQueryKey,
} from '@/api/openapi-generated/tracks/tracks.ts';

export const fetchTrack = async (queryClient: QueryClient, libraryId: string, id: string) => {
    return queryClient.fetchQuery({
        queryFn: () => {
            return apiInstance<GetApiLibraryIdTracksId200>({
                method: 'GET',
                url: `/api/${libraryId}/tracks/${id}`,
            });
        },
        queryKey: getGetApiLibraryIdTracksIdQueryKey(libraryId, id),
    });
};

export const fetchTrackList = async (
    queryClient: QueryClient,
    libraryId: string,
    params: GetApiLibraryIdTracksParams,
) => {
    return queryClient.fetchQuery({
        gcTime: 0,
        queryFn: () => {
            return apiInstance<GetApiLibraryIdTracks200>({
                method: 'GET',
                params,
                url: `/api/${libraryId}/tracks`,
            });
        },
        queryKey: getGetApiLibraryIdTracksQueryKey(libraryId, params),
        staleTime: 0,
    });
};

export const fetchTrackListIndex = async (
    queryClient: QueryClient,
    libraryId: string,
    params: GetApiLibraryIdTracksParams,
) => {
    const result = await queryClient.fetchQuery({
        queryFn: () => {
            return apiInstance<GetApiLibraryIdTracks200>({
                method: 'GET',
                params,
                url: `/api/${libraryId}/tracks`,
            });
        },
        queryKey: getGetApiLibraryIdTracksQueryKey(libraryId, params),
    });

    return result.data;
};
