import { TrackListSortOptions } from '@repo/shared-types';
import { ListSortOrder, PlaylistListSortOptions } from '@repo/shared-types';
import { type AdapterApi } from '@/adapters/types/index.js';
import { CONSTANTS } from '@/constants.js';
import type { AppDatabase } from '@/database/init-database.js';
import { apiError } from '@/modules/error-handler/index.js';
import type { FindByIdServiceArgs, FindManyServiceArgs } from '@/services/service-helpers.js';
import type { initTrackService } from '@/services/track/track-service.js';

// SECTION - Playlist Service
export const initPlaylistService = (modules: { db: AppDatabase }) => {
    const { db } = modules;

    return {
        // ANCHOR - Detail
        detail: async (adapter: AdapterApi, args: FindByIdServiceArgs) => {
            const [err, result] = await adapter.getPlaylistDetail({ query: { id: args.id } });

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            const libraryId = adapter._getLibrary().id;

            return {
                ...result,
                thumbHash: db.thumbhash.findById(libraryId, result.id)?.[1] || null,
            };
        },

        // ANCHOR - Track List
        detailTrackList: async (
            adapter: AdapterApi,
            args: FindByIdServiceArgs & FindManyServiceArgs<TrackListSortOptions>,
        ) => {
            const [err, result] = await adapter.getPlaylistTrackList({
                query: {
                    id: args.id,
                    limit: args.limit ?? CONSTANTS.DEFAULT_PAGINATION_LIMIT,
                    offset: args.offset ?? 0,
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
                    thumbHash: db.thumbhash.findById(libraryId, item.id)?.[1] || null,
                })),
            };
        },
        // ANCHOR - List
        list: async (adapter: AdapterApi, args: FindManyServiceArgs<PlaylistListSortOptions>) => {
            const limit = args.limit ?? CONSTANTS.DEFAULT_PAGINATION_LIMIT;
            const offset = args.offset ?? 0;

            const [err, result] = await adapter.getPlaylistList({
                query: {
                    limit,
                    offset,
                    sortBy: args.sortBy || PlaylistListSortOptions.NAME,
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
                    thumbHash: db.thumbhash.findById(libraryId, item.id)?.[1] || null,
                })),
            };
        },
    };
};

export type TrackService = ReturnType<typeof initTrackService>;
