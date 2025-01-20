import {
    AlbumListSortOptions,
    LibraryItemType,
    ListSortOrder,
    TrackListSortOptions,
} from '@repo/shared-types';
import { type AdapterApi } from '@/adapters/types/index.js';
import { CONSTANTS } from '@/constants.js';
import type { AppDatabase } from '@/database/init-database.js';
import { apiError } from '@/modules/error-handler/index.js';
import {
    type FindByIdServiceArgs,
    type FindManyServiceArgs,
    serviceHelpers,
} from '@/services/service-helpers.js';

// SECTION - Album Service
export const initAlbumService = (modules: { db: AppDatabase }) => {
    const { db } = modules;
    return {
        // ANCHOR - Detail
        detail: async (adapter: AdapterApi, args: FindByIdServiceArgs) => {
            const [err, result] = await adapter.getAlbumDetail({ query: { id: args.id } });

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            const libraryId = adapter._getLibrary().id;

            return {
                ...result,
                imageUrl: serviceHelpers.getImageUrl(result.id, libraryId, LibraryItemType.ALBUM),
            };
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

        // ANCHOR - Favorite
        favorite: async (adapter: AdapterApi, args: { ids: string[] }) => {
            const [err, result] = await adapter.setFavorite({
                body: { entry: args.ids.map((id) => ({ favorite: true, id, type: 'album' })) },
                query: null,
            });

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            return result;
        },

        // ANCHOR - Invalidate counts
        invalidateCounts: async (adapter: AdapterApi) => {
            db.kv.deleteByIncludes(`${adapter._getLibrary().id}::album`);
            return null;
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
                    searchTerm: args.searchTerm,
                    sortBy: args.sortBy || AlbumListSortOptions.NAME,
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
                    imageUrl: serviceHelpers.getImageUrl(item.id, libraryId, LibraryItemType.ALBUM),
                })),
            };
        },

        // ANCHOR - List count
        listCount: async (adapter: AdapterApi, args: FindManyServiceArgs<AlbumListSortOptions>) => {
            const [err, result] = await adapter.getAlbumListCount({
                query: {
                    folderId: args.folderId,
                    searchTerm: args.searchTerm,
                    sortBy: args.sortBy || AlbumListSortOptions.NAME,
                },
            });

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            return result;
        },

        // ANCHOR - Unfavorite
        unfavorite: async (adapter: AdapterApi, args: { ids: string[] }) => {
            const [err, result] = await adapter.setFavorite({
                body: { entry: args.ids.map((id) => ({ favorite: false, id, type: 'album' })) },
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
