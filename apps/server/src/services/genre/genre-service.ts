import { GenreListSortOptions, ListSortOrder } from '@repo/shared-types';
import { type AdapterApi } from '@/adapters/types/index.js';
import { CONSTANTS } from '@/constants.js';
import type { AppDatabase } from '@/database/init-database.js';
import { apiError } from '@/modules/error-handler/index.js';
import type { initAlbumService } from '@/services/album/album-service.js';
import type { FindManyServiceArgs } from '@/services/service-utils.js';

// SECTION - Genre Service
export const initGenreService = (modules: { db: AppDatabase }) => {
    const { db } = modules;

    return {
        // ANCHOR - List
        list: async (adapter: AdapterApi, args: FindManyServiceArgs<GenreListSortOptions>) => {
            const limit = args.limit ?? CONSTANTS.DEFAULT_PAGINATION_LIMIT;
            const offset = args.offset ?? 0;

            const [err, result] = await adapter.getGenreList({
                query: {
                    folderId: args.folderId,
                    limit,
                    offset,
                    sortBy: args.sortBy || GenreListSortOptions.NAME,
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
    };
};

export type AlbumService = ReturnType<typeof initAlbumService>;
