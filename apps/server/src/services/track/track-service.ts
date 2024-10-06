import { ListSortOrder, TrackListSortOptions } from '@repo/shared-types';
import { type AdapterApi } from '@/adapters/types/index.js';
import { CONSTANTS } from '@/constants.js';
import type { AppDatabase } from '@/database/init-database.js';
import { apiError } from '@/modules/error-handler/index.js';
import type { FindByIdServiceArgs, FindManyServiceArgs } from '@/services/service-helpers.js';

// SECTION - Track Service
export const initTrackService = (modules: { db: AppDatabase }) => {
    const { db } = modules;

    return {
        // ANCHOR - Detail
        detail: async (adapter: AdapterApi, args: FindByIdServiceArgs) => {
            const [err, result] = await adapter.getTrackDetail({ query: { id: args.id } });

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            const libraryId = adapter._getLibrary().id;

            return {
                ...result,
                thumbHash: db.thumbhash.findById(libraryId, result.id) || null,
            };
        },
        // ANCHOR - Favorite by id
        favoriteById: async (adapter: AdapterApi, args: FindByIdServiceArgs) => {
            const [err, result] = await adapter.setFavorite({
                body: { entry: [{ favorite: true, id: args.id, type: 'track' }] },
                query: null,
            });

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            return result;
        },
        // ANCHOR - List
        list: async (adapter: AdapterApi, args: FindManyServiceArgs<TrackListSortOptions>) => {
            const limit = args.limit ?? CONSTANTS.DEFAULT_PAGINATION_LIMIT;
            const offset = args.offset ?? 0;

            const [err, result] = await adapter.getTrackList({
                query: {
                    folderId: args.folderId,
                    limit,
                    offset,
                    sortBy: args.sortBy || TrackListSortOptions.NAME,
                    sortOrder: args.sortOrder || ListSortOrder.ASC,
                },
            });

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            const libraryId = adapter._getLibrary().id;

            return {
                ...result,
                items: result.items.map((item) => ({
                    ...item,
                    thumbHash: db.thumbhash.findById(libraryId, item.id) || null,
                })),
            };
        },
        // ANCHOR - Unfavorite by id
        unfavoriteById: async (adapter: AdapterApi, args: FindByIdServiceArgs) => {
            const [err, result] = await adapter.setFavorite({
                body: { entry: [{ favorite: false, id: args.id, type: 'track' }] },
                query: null,
            });

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            return result;
        },
    };
};

export type TrackService = ReturnType<typeof initTrackService>;
