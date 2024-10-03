import { AlbumListSortOptions, ListSortOrder, TrackListSortOptions } from '@repo/shared-types';
import { type AdapterApi } from '@/adapters/types/index.js';
import { CONSTANTS } from '@/constants.js';
import { apiError } from '@/modules/error-handler/index.js';
import type { FindByIdServiceArgs, FindManyServiceArgs } from '@/services/service-utils.js';

// SECTION - Album Service
export const initAlbumService = () => {
    return {
        // ANCHOR - Detail
        detail: async (adapter: AdapterApi, args: FindByIdServiceArgs) => {
            const [err, result] = await adapter.getAlbumDetail({ query: { id: args.id } });

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            return result;
        },
        // ANCHOR - Detail track list
        detailTrackList: async (
            adapter: AdapterApi,
            args: FindByIdServiceArgs & FindManyServiceArgs<TrackListSortOptions>,
        ) => {
            const limit = args.limit ?? CONSTANTS.DEFAULT_PAGINATION_LIMIT;
            const offset = args.offset ?? 0;

            const [err, result] = await adapter.getAlbumTrackList({
                query: {
                    id: args.id,
                    limit,
                    offset,
                    sortBy: args.sortBy || TrackListSortOptions.NAME,
                    sortOrder: args.sortOrder || ListSortOrder.ASC,
                },
            });

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            return result;
        },
        // ANCHOR - Favorite by id
        favoriteById: async (adapter: AdapterApi, args: FindByIdServiceArgs) => {
            const [err, result] = await adapter.setFavorite({
                body: { entry: [{ favorite: true, id: args.id, type: 'album' }] },
                query: null,
            });

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            return result;
        },
        // ANCHOR - List
        list: async (adapter: AdapterApi, args: FindManyServiceArgs<AlbumListSortOptions>) => {
            const limit = args.limit ?? CONSTANTS.DEFAULT_PAGINATION_LIMIT;
            const offset = args.offset ?? 0;

            const [err, result] = await adapter.getAlbumList({
                query: {
                    folderId: args.folderId,
                    limit,
                    offset,
                    sortBy: args.sortBy || AlbumListSortOptions.NAME,
                    sortOrder: args.sortOrder || ListSortOrder.ASC,
                },
            });

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            return result;
        },
        // ANCHOR - Unfavorite by id
        unfavoriteById: async (adapter: AdapterApi, args: FindByIdServiceArgs) => {
            const [err, result] = await adapter.setFavorite({
                body: { entry: [{ favorite: false, id: args.id, type: 'album' }] },
                query: null,
            });

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            return result;
        },
    };
};

export type AlbumService = ReturnType<typeof initAlbumService>;
