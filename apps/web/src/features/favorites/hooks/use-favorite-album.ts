import { LibraryItemType } from '@repo/shared-types';
import { useQueryClient } from '@tanstack/react-query';
import { appDb } from '@/api/db/app-db.ts';
import { usePostApiLibraryIdAlbumsFavorite } from '@/api/openapi-generated/albums/albums.ts';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import type { ItemQueryData } from '@/hooks/use-list.ts';
import { useChangeStoreBase } from '@/store/change-store.ts';

export function useFavoriteAlbum() {
    const queryClient = useQueryClient();

    const mutation = usePostApiLibraryIdAlbumsFavorite({
        mutation: {
            onSuccess: async (_data, variables) => {
                const albumIds = variables.data.ids;

                // Invalidate all queries
                queryClient.invalidateQueries();

                // Update all list queries
                queryClient.setQueriesData<ItemQueryData>(
                    {
                        exact: true,
                        queryKey: itemListHelpers.getDataQueryKey(
                            variables.libraryId,
                            LibraryItemType.ALBUM,
                        ),
                    },
                    (prev) => {
                        const updates: ItemQueryData = {
                            ...prev,
                        };

                        for (const id of albumIds) {
                            if (!prev?.[id]) continue;
                            updates[id] = { ...prev[id], userFavorite: true };
                        }

                        return updates;
                    },
                );

                // Update value in the app db
                for (const id of albumIds) {
                    const album = await appDb?.get(LibraryItemType.ALBUM, id);

                    if (!album) continue;

                    await appDb?.set(LibraryItemType.ALBUM, {
                        key: id,
                        value: { ...album, userFavorite: true },
                    });
                }

                // Update values in the change store for client-side updates
                useChangeStoreBase.getState().addAlbumFavorite(albumIds);
            },
        },
    });
    return mutation;
}
