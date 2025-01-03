import { LibraryItemType, ListSortOrder, TrackListSortOptions } from '@repo/shared-types';
import { type AdapterApi } from '@/adapters/types/index.js';
import { CONSTANTS } from '@/constants.js';
import { apiError } from '@/modules/error-handler/index.js';
import {
    type FindByIdServiceArgs,
    type FindManyServiceArgs,
    serviceHelpers,
} from '@/services/service-helpers.js';

// SECTION - Track Service
export const initTrackService = () => {
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
                imageUrl: serviceHelpers.getImageUrls([
                    { id: result.id, libraryId, type: LibraryItemType.TRACK },
                    { id: result.albumId, libraryId, type: LibraryItemType.ALBUM },
                ]),
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

        // ANCHOR - Get stream url
        getStreamUrl: async (adapter: AdapterApi, args: FindByIdServiceArgs) => {
            const streamUrl = adapter._getStreamUrl({
                id: args.id,
                libraryId: adapter._getLibrary().id,
            });

            return streamUrl;
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
                    imageUrl: serviceHelpers.getImageUrls([
                        { id: item.id, libraryId, type: LibraryItemType.TRACK },
                        { id: item.albumId, libraryId, type: LibraryItemType.ALBUM },
                    ]),
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
