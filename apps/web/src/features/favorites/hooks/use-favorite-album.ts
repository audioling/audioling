import { useQueryClient } from '@tanstack/react-query';
import { usePostApiLibraryIdAlbumsFavorite } from '@/api/openapi-generated/albums/albums.ts';
import { useChangeStoreBase } from '@/store/change-store.ts';

export function useFavoriteAlbum() {
    const queryClient = useQueryClient();

    const mutation = usePostApiLibraryIdAlbumsFavorite({
        mutation: {
            onSuccess: (_data, variables) => {
                const albumIds = variables.data.ids;

                // Invalidate all queries
                queryClient.invalidateQueries();

                // Update values in the change store for client-side updates
                useChangeStoreBase.getState().addAlbumFavorite(albumIds);
            },
        },
    });
    return mutation;
}
