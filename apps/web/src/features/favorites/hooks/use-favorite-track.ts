import { useQueryClient } from '@tanstack/react-query';
import { usePostApiLibraryIdTracksFavorite } from '@/api/openapi-generated/tracks/tracks.ts';
import { updateQueueFavorites } from '@/features/player/stores/player-store.tsx';
import { useChangeStoreBase } from '@/store/change-store.ts';

export function useFavoriteTrack() {
    const queryClient = useQueryClient();

    const mutation = usePostApiLibraryIdTracksFavorite({
        mutation: {
            onSuccess: (_data, variables) => {
                const trackIds = variables.data.ids;

                // Update all changed tracks in the player queue
                updateQueueFavorites(trackIds, true);

                // Invalidate all queries
                queryClient.invalidateQueries();

                // Update values in the change store for client-side updates
                useChangeStoreBase.getState().addTrackFavorite(trackIds);
            },
        },
    });
    return mutation;
}
