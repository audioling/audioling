import { LibraryItemType } from '@repo/shared-types';
import { useQueryClient } from '@tanstack/react-query';
import { usePostApiLibraryIdTracksUnfavorite } from '@/api/openapi-generated/tracks/tracks.ts';
import { updateQueueFavorites } from '@/features/player/stores/player-store.tsx';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import type { ItemQueryData } from '@/hooks/use-list.ts';
import { useChangeStoreBase } from '@/store/change-store.ts';

export function useUnfavoriteTrack() {
    const queryClient = useQueryClient();

    const mutation = usePostApiLibraryIdTracksUnfavorite({
        mutation: {
            onSuccess: (_data, variables) => {
                const trackIds = variables.data.ids;

                // Invalidate all queries
                queryClient.invalidateQueries();

                // Update all changed tracks in the player queue
                updateQueueFavorites(trackIds, false);

                // Update all list queries
                queryClient.setQueriesData<ItemQueryData>(
                    {
                        exact: true,
                        queryKey: itemListHelpers.getDataQueryKey(
                            variables.libraryId,
                            LibraryItemType.TRACK,
                        ),
                    },
                    (prev) => {
                        const updates: ItemQueryData = { ...prev };
                        for (const id of trackIds) {
                            if (!prev?.[id]) continue;
                            updates[id] = { ...prev[id], userFavorite: false };
                        }
                        return updates;
                    },
                );

                // Update values in the change store for client-side updates
                useChangeStoreBase.getState().addTrackUnfavorite(trackIds);
            },
        },
    });
    return mutation;
}
