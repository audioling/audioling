import type { AlbumListSortOptions, TrackListSortOptions } from '@repo/shared-types';
import { ArtistListSortOptions, LibraryItemType, ListSortOrder } from '@repo/shared-types';
import type { Omit } from 'lodash';
import { type AdapterApi } from '@/adapters/types/index.js';
import { CONSTANTS } from '@/constants.js';
import type { AppDatabase } from '@/database/init-database.js';
import { apiError } from '@/modules/error-handler/index.js';
import {
    type FindByIdServiceArgs,
    type FindManyServiceArgs,
    serviceHelpers,
} from '@/services/service-helpers.js';

// SECTION - Album Artist Service
export const initAlbumArtistService = (modules: { db: AppDatabase }) => {
    const { db } = modules;

    return {
        // ANCHOR - Detail
        detail: async (adapter: AdapterApi, args: FindByIdServiceArgs) => {
            const [err, result] = await adapter.getAlbumArtistDetail({ query: { id: args.id } });

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            return {
                ...result,
                imageUrl: serviceHelpers.getImageUrl(
                    result.id,
                    adapter._getLibrary().id,
                    LibraryItemType.ALBUM_ARTIST,
                ),
            };
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

            return {
                ...result,
                items: result.items.map((item) => ({
                    ...item,
                })),
            };
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

            return {
                ...result,
                items: result.items.map((item) => ({
                    ...item,
                    imageUrl: serviceHelpers.getImageUrls([
                        {
                            id: item.id,
                            libraryId: adapter._getLibrary().id,
                            type: LibraryItemType.TRACK,
                        },
                        {
                            id: item.albumId,
                            libraryId: adapter._getLibrary().id,
                            type: LibraryItemType.ALBUM,
                        },
                    ]),
                })),
            };
        },

        // ANCHOR - Favorite
        favorite: async (adapter: AdapterApi, args: { ids: string[] }) => {
            const [err, result] = await adapter.setFavorite({
                body: { entry: args.ids.map((id) => ({ favorite: true, id, type: 'artist' })) },
                query: null,
            });

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            return result;
        },

        // ANCHOR - Invalidate counts
        invalidateCounts: async (adapter: AdapterApi) => {
            db.kv.deleteByIncludes(`${adapter._getLibrary().id}::artist`);
            return null;
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
                    searchTerm: args.searchTerm,
                    sortBy: args.sortBy || ArtistListSortOptions.NAME,
                    sortOrder: args.sortOrder || ListSortOrder.ASC,
                },
            });

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            return {
                ...result,
                items: result.items.map((item) => ({
                    ...item,
                    imageUrl: serviceHelpers.getImageUrl(
                        item.id,
                        adapter._getLibrary().id,
                        LibraryItemType.ALBUM_ARTIST,
                    ),
                })),
            };
        },

        // ANCHOR - Count
        listCount: async (
            adapter: AdapterApi,
            args: Omit<FindManyServiceArgs<ArtistListSortOptions>, 'sortBy' | 'sortOrder'>,
        ) => {
            const [err, result] = await adapter.getAlbumArtistListCount({
                query: {
                    folderId: args.folderId,
                    searchTerm: args.searchTerm,
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
                body: { entry: args.ids.map((id) => ({ favorite: false, id, type: 'artist' })) },
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
