import {
    GenreListSortOptions,
    LibraryItemType,
    ListSortOrder,
    TrackListSortOptions,
} from '@repo/shared-types';
import { type AdapterApi } from '@/adapters/types/index.js';
import { CONSTANTS } from '@/constants.js';
import { apiError } from '@/modules/error-handler/index.js';
import type { initAlbumService } from '@/services/album/album-service.js';
import { type FindManyServiceArgs, serviceHelpers } from '@/services/service-helpers.js';

// SECTION - Genre Service
export const initGenreService = () => {
    return {
        // ANCHOR - Detail tracks
        detailTrackList: async (
            adapter: AdapterApi,
            args: FindManyServiceArgs<TrackListSortOptions> & { id: string },
        ) => {
            const limit = args.limit ?? CONSTANTS.DEFAULT_PAGINATION_LIMIT;
            const offset = args.offset ?? 0;

            const [err, result] = await adapter.getGenreTrackList({
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

        // ANCHOR - List
        list: async (adapter: AdapterApi, args: FindManyServiceArgs<GenreListSortOptions>) => {
            const limit = args.limit ?? CONSTANTS.DEFAULT_PAGINATION_LIMIT;
            const offset = args.offset ?? 0;

            const [err, result] = await adapter.getGenreList({
                query: {
                    folderId: args.folderId,
                    limit,
                    offset,
                    searchTerm: args.searchTerm,
                    sortBy: args.sortBy || GenreListSortOptions.NAME,
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
                })),
            };
        },
    };
};

export type AlbumService = ReturnType<typeof initAlbumService>;
