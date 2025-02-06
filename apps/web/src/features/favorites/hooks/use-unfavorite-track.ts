import { LibraryItemType } from '@repo/shared-types';
import { useQueryClient } from '@tanstack/react-query';
import { appDb } from '@/api/db/app-db.ts';
import { usePostApiLibraryIdTracksUnfavorite } from '@/api/openapi-generated/tracks/tracks.ts';
import { updateQueueFavorites } from '@/features/player/stores/player-store.tsx';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import type { ItemQueryData } from '@/hooks/use-list.ts';
import { useChangeStoreBase } from '@/store/change-store.ts';

export function useUnfavoriteTrack() {
    const queryClient = useQueryClient();

    const mutation = usePostApiLibraryIdTracksUnfavorite({
        mutation: {
            onSuccess: async (_data, variables) => {
                const trackIds = variables.data.ids;

                // Invalidate all queries
                queryClient.invalidateQueries();

                // Update all changed tracks in the player queue
                updateQueueFavorites(trackIds, false);

                // Update all track list queries
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

                // Update all offline track list queries
                queryClient.setQueriesData<ItemQueryData>(
                    {
                        exact: true,
                        queryKey: itemListHelpers.getDataQueryKey(
                            variables.libraryId,
                            LibraryItemType.TRACK,
                            true,
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

                // Update all playlist track list queries
                queryClient.setQueriesData<ItemQueryData>(
                    {
                        exact: true,
                        queryKey: itemListHelpers.getDataQueryKey(
                            variables.libraryId,
                            LibraryItemType.PLAYLIST_TRACK,
                        ),
                    },
                    (prev) => {
                        const updates: ItemQueryData = {
                            ...prev,
                        };

                        for (const id of trackIds) {
                            if (!prev?.[id]) continue;
                            updates[id] = { ...prev[id], userFavorite: false };
                        }

                        return updates;
                    },
                );

                // Update value in the app db
                for (const id of trackIds) {
                    const track = await appDb?.get(LibraryItemType.TRACK, id);

                    if (!track) continue;

                    await appDb?.set(LibraryItemType.TRACK, {
                        key: id,
                        value: { ...track, userFavorite: false },
                    });
                }

                // Update values in the change store for client-side updates
                useChangeStoreBase.getState().addTrackUnfavorite(trackIds);
            },
        },
    });
    return mutation;
}
