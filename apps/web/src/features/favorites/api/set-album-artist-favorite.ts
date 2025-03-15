import type { SetFavoriteResponse } from '/@/features/favorites/api/set-favorite';
import type { AdapterError } from '@repo/shared-types/adapter-types';
import { ServerItemType } from '@repo/shared-types/app-types';
import { useMutation } from '@tanstack/react-query';
import { setFavorite } from '/@/features/favorites/api/set-favorite';
import { getAuthServerById } from '/@/stores/auth-store';

interface SetFavoriteAlbumArtistRequest {
    ids: string[];
    serverId: string;
}

export function useFavoriteAlbumArtist() {
    const mutation = useMutation<SetFavoriteResponse, AdapterError, SetFavoriteAlbumArtistRequest>({
        mutationFn: (params) => {
            const server = getAuthServerById(params.serverId);

            return setFavorite(server, {
                body: {
                    entry: params.ids.map(id => ({
                        favorite: true,
                        id,
                        type: ServerItemType.ARTIST,
                    })),
                },
                query: null,
            });
        },
        onSuccess: () => {
            // TODO: Update the artist in AppDB
        },
    });

    return mutation;
}

export function useUnfavoriteAlbumArtist() {
    const mutation = useMutation<SetFavoriteResponse, AdapterError, SetFavoriteAlbumArtistRequest>({
        mutationFn: (params) => {
            const server = getAuthServerById(params.serverId);

            return setFavorite(server, {
                body: {
                    entry: params.ids.map(id => ({
                        favorite: false,
                        id,
                        type: ServerItemType.ARTIST,
                    })),
                },
                query: null,
            });
        },
        onSuccess: () => {
            // TODO: Update the artist in AppDB
        },
    });

    return mutation;
}
