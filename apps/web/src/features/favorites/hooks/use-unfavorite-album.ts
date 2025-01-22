import { LibraryItemType } from '@repo/shared-types';
import { useQueryClient } from '@tanstack/react-query';
import { usePostApiLibraryIdAlbumsUnfavorite } from '@/api/openapi-generated/albums/albums.ts';
import type { ItemListQueryData } from '@/hooks/use-list.ts';
import { useChangeStoreBase } from '@/store/change-store.ts';

export function useUnfavoriteAlbum() {
    const queryClient = useQueryClient();

    const mutation = usePostApiLibraryIdAlbumsUnfavorite({
        mutation: {
            onSuccess: (_data, variables) => {
                const albumIds = variables.data.ids;

                // Invalidate all queries
                queryClient.invalidateQueries();

                // Update all list queries
                queryClient.setQueriesData<ItemListQueryData>(
                    {
                        exact: false,
                        queryKey: [variables.libraryId, 'list', LibraryItemType.ALBUM],
                    },
                    (prev) => {
                        const updates: ItemListQueryData = {
                            data: { ...prev?.data },
                            uniqueIdToId: { ...prev?.uniqueIdToId },
                        };

                        for (const id of albumIds) {
                            if (!prev?.data[id]) continue;
                            updates.data[id] = { ...prev.data[id], userFavorite: false };
                        }

                        return updates;
                    },
                );

                // Update values in the change store for client-side updates
                useChangeStoreBase.getState().addAlbumUnfavorite(albumIds);
            },
        },
    });
    return mutation;
}
