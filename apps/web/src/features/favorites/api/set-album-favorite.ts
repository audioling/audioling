import type { SetFavoriteRequest, SetFavoriteResponse } from '/@/features/favorites/api/set-favorite';
import type { AdapterError } from '@repo/shared-types/adapter-types';
import { ServerItemType } from '@repo/shared-types/app-types';
import { useMutation } from '@tanstack/react-query';
import { setFavorite } from '/@/features/favorites/api/set-favorite';
import { getAuthServerById } from '/@/stores/auth-store';

export function useFavoriteAlbum() {
    const mutation = useMutation<SetFavoriteResponse, AdapterError, SetFavoriteRequest>({
        mutationFn: (params) => {
            const server = getAuthServerById(params.serverId);

            return setFavorite(server, {
                body: {
                    entry: params.ids.map(id => ({
                        favorite: true,
                        id,
                        type: ServerItemType.ALBUM,
                    })),
                },
                query: null,
            });
        },
        onSuccess: () => {
            // TODO: Update the album in AppDB
        },
    });

    return mutation;
}

export function useUnfavoriteAlbum() {
    const mutation = useMutation<SetFavoriteResponse, AdapterError, SetFavoriteRequest>({
        mutationFn: (params) => {
            const server = getAuthServerById(params.serverId);

            return setFavorite(server, {
                body: {
                    entry: params.ids.map(id => ({
                        favorite: false,
                        id,
                        type: ServerItemType.ALBUM,
                    })),
                },
                query: null,
            });
        },
    });

    return mutation;
}
