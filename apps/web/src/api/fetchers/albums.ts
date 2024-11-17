import type { QueryClient } from '@tanstack/react-query';
import { apiInstance } from '@/api/api-instance.ts';
import { getGetApiLibraryIdAlbumsIdTracksQueryKey } from '@/api/openapi-generated/albums/albums.ts';
import type {
    GetApiLibraryIdAlbumsIdTracks200,
    GetApiLibraryIdAlbumsIdTracksParams,
} from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';

export const fetchAlbumTracks = async (
    queryClient: QueryClient,
    libraryId: string,
    id: string,
    params: GetApiLibraryIdAlbumsIdTracksParams,
) => {
    return queryClient.fetchQuery({
        queryFn: () => {
            return apiInstance<GetApiLibraryIdAlbumsIdTracks200>({
                method: 'GET',
                params,
                url: `/api/${libraryId}/albums/${id}/tracks`,
            });
        },
        queryKey: getGetApiLibraryIdAlbumsIdTracksQueryKey(libraryId, id, params),
    });
};
