import type { AlbumListSortOptions, TrackListSortOptions } from '@repo/shared-types';
import { ArtistListSortOptions, ListSortOrder } from '@repo/shared-types';
import { type AdapterApi } from '@/adapters/types/index.js';
import { CONSTANTS } from '@/constants.js';
import { apiError } from '@/modules/error-handler/index.js';
import type { FindByIdServiceArgs, FindManyServiceArgs } from '@/services/service-utils.js';

// SECTION - Album Artist Service
export const initAlbumArtistService = () => {
    return {
        // ANCHOR - Detail
        detail: async (adapter: AdapterApi, args: FindByIdServiceArgs) => {
            const [err, result] = await adapter.getAlbumArtistDetail({ query: { id: args.id } });

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            return result;
        },
        // ANCHOR - Detail Album List
        detailAlbumList: async (
            adapter: AdapterApi,
            args: FindByIdServiceArgs & FindManyServiceArgs<AlbumListSortOptions>,
        ) => {
            const limit = args.limit ?? CONSTANTS.DEFAULT_PAGINATION_LIMIT;
            const offset = args.offset ?? 0;

            const [err, result] = await adapter.getAlbumArtistAlbumList({
                query: {
                    id: args.id,
                    limit,
                    offset,
                    sortBy: args.sortBy,
                    sortOrder: args.sortOrder,
                },
            });

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            return result;
        },
        // ANCHOR - Detail Track List
        detailTrackList: async (
            adapter: AdapterApi,
            args: FindByIdServiceArgs & FindManyServiceArgs<TrackListSortOptions>,
        ) => {
            const limit = args.limit ?? CONSTANTS.DEFAULT_PAGINATION_LIMIT;
            const offset = args.offset ?? 0;

            const [err, result] = await adapter.getAlbumArtistTrackList({
                query: {
                    id: args.id,
                    limit,
                    offset,
                    sortBy: args.sortBy,
                    sortOrder: args.sortOrder,
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
                body: { entry: [{ favorite: true, id: args.id, type: 'artist' }] },
                query: null,
            });

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            return result;
        },

        // ANCHOR - List
        list: async (adapter: AdapterApi, args: FindManyServiceArgs<ArtistListSortOptions>) => {
            const limit = args.limit ?? CONSTANTS.DEFAULT_PAGINATION_LIMIT;
            const offset = args.offset ?? 0;

            const [err, result] = await adapter.getAlbumArtistList({
                query: {
                    folderId: args.folderId,
                    limit,
                    offset,
                    sortBy: args.sortBy || ArtistListSortOptions.NAME,
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
                body: { entry: [{ favorite: false, id: args.id, type: 'artist' }] },
                query: null,
            });

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            return result;
        },
    };
};

export type AlbumArtistService = ReturnType<typeof initAlbumArtistService>;
