import type { QueryClient } from '@tanstack/react-query';
import { apiInstance } from '@/api/api-instance.ts';
import type { GetApiLibraryIdTracksId200 } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { getGetApiLibraryIdTracksIdQueryKey } from '@/api/openapi-generated/tracks/tracks.ts';

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
