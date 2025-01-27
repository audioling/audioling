import { LibraryItemType } from '@repo/shared-types';
import { useQueryClient } from '@tanstack/react-query';
import { usePostApiLibraryIdAlbumArtistsUnfavorite } from '@/api/openapi-generated/album-artists/album-artists.ts';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import type { ItemQueryData } from '@/hooks/use-list.ts';
import { useChangeStoreBase } from '@/store/change-store.ts';

export function useUnfavoriteAlbumArtist() {
    const queryClient = useQueryClient();

    const mutation = usePostApiLibraryIdAlbumArtistsUnfavorite({
        mutation: {
            onSuccess: (_data, variables) => {
                const albumArtistIds = variables.data.ids;

                // Invalidate all queries
                queryClient.invalidateQueries();

                // Update all list queries
                queryClient.setQueriesData<ItemQueryData>(
                    {
                        exact: true,
                        queryKey: itemListHelpers.getDataQueryKey(
                            variables.libraryId,
                            LibraryItemType.ALBUM_ARTIST,
                        ),
                    },
                    (prev) => {
                        const updates: ItemQueryData = {
                            ...prev,
                        };

                        for (const id of albumArtistIds) {
                            if (!prev?.[id]) continue;
                            updates[id] = { ...prev[id], userFavorite: false };
                        }

                        return updates;
                    },
                );

                // Update values in the change store for client-side updates
                useChangeStoreBase.getState().addAlbumArtistUnfavorite(albumArtistIds);
            },
        },
    });
    return mutation;
}
