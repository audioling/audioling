import type { SetFavoriteRequest, SetFavoriteResponse } from '/@/features/favorites/api/set-favorite';
import type { AdapterError } from '@repo/shared-types/adapter-types';
import { ServerItemType } from '@repo/shared-types/app-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getAppDBItemQueryKey, updateDBItem } from '/@/api/app-db';
import { useAppContext } from '/@/features/authentication/context/app-context';
import { setFavorite } from '/@/features/favorites/api/set-favorite';

export function useFavoriteTrack() {
    const { appDB, server } = useAppContext();
    const queryClient = useQueryClient();

    const mutation = useMutation<SetFavoriteResponse, AdapterError, SetFavoriteRequest>({
        mutationFn: (variables) => {
            return setFavorite(server, {
                body: {
                    entry: variables.ids.map(id => ({
                        favorite: true,
                        id,
                        type: ServerItemType.TRACK,
                    })),
                },
                query: null,
            });
        },
        onSuccess: async (_data, variables) => {
            for (const id of variables.ids) {
                await updateDBItem(appDB, ServerItemType.TRACK, id, {
                    userFavorite: true,
                });

                queryClient.invalidateQueries({
                    queryKey: getAppDBItemQueryKey(server, ServerItemType.TRACK, id),
                });
            }
        },
    });

    return mutation;
}

export function useUnfavoriteTrack() {
    const { appDB, server } = useAppContext();
    const queryClient = useQueryClient();

    const mutation = useMutation<SetFavoriteResponse, AdapterError, SetFavoriteRequest>({
        mutationFn: (params) => {
            return setFavorite(server, {
                body: {
                    entry: params.ids.map(id => ({
                        favorite: false,
                        id,
                        type: ServerItemType.TRACK,
                    })),
                },
                query: null,
            });
        },
        onSuccess: async (_data, variables) => {
            for (const id of variables.ids) {
                await updateDBItem(appDB, ServerItemType.TRACK, id, {
                    userFavorite: false,
                });

                queryClient.invalidateQueries({
                    queryKey: getAppDBItemQueryKey(server, ServerItemType.TRACK, id),
                });
            }
        },
    });

    return mutation;
}
