import { LibraryItemType, ListSortOrder, TrackListSortOptions } from '@repo/shared-types';
import orderBy from 'lodash/orderBy.js';
import md5 from 'md5';
import stringify from 'safe-stable-stringify';
import { adapterHelpers } from '@/adapters/adapter-helpers.js';
import type { AdapterTrack } from '@/adapters/types/adapter-track-types.js';
import type { AdapterApi } from '@/adapters/types/index.js';
import { CONSTANTS } from '@/constants.js';
import type { TrackQuery } from '@/controllers/track/track-api-types.js';
import { trackHelpers } from '@/controllers/track/track-helpers.js';
import type { AppDatabase } from '@/database/init-database.js';
import { apiError } from '@/modules/error-handler/index.js';
import { type QueryModule, TRACK_INDEX_JOB_ID } from '@/modules/query/index.js';
import {
    type FindByIdServiceArgs,
    type FindManyServiceArgs,
    serviceHelpers,
} from '@/services/service-helpers.js';
import { date } from '@/utils/date.js';

// SECTION - Track Service
export const initTrackService = (modules: { db: AppDatabase; queryModule: QueryModule }) => {
    const { db, queryModule } = modules;

    return {
        // ANCHOR - Abort index
        abortIndexJob: async () => {
            queryModule.abort({ id: TRACK_INDEX_JOB_ID });
        },

        // ANCHOR - Abort query
        abortQueryById: async (args: { id: string }) => {
            queryModule.abort(args);
        },

        // ANCHOR - Start index
        buildQueryIndex: async (adapter: AdapterApi) => {
            queryModule.create({
                id: TRACK_INDEX_JOB_ID,
                metadata: {
                    dateFinished: null,
                    dateStarted: date.now(),
                    isRunning: true,
                    totalRecordCount: null,
                },
            });

            const fetcher = async (page: number, limit: number) => {
                const [err, result] = await adapter.getTrackList({
                    query: {
                        limit,
                        offset: page * limit,
                        sortBy: TrackListSortOptions.NAME,
                        sortOrder: ListSortOrder.ASC,
                    },
                });

                if (err) {
                    throw new apiError.internalServer({ message: err.message });
                }

                return result.items;
            };

            serviceHelpers.fetchAllRecords({
                count: 0,
                currentPage: 0,
                fetcher,
                isAbortedFn: async () => queryModule.isAborted({ id: TRACK_INDEX_JOB_ID }),
                onAborted: () => {
                    queryModule.update({
                        id: TRACK_INDEX_JOB_ID,
                        metadata: () => ({
                            dateFinished: null,
                            dateStarted: null,
                            isRunning: false,
                            totalRecordCount: null,
                        }),
                    });
                },
                onFinish: async (count) => {
                    queryModule.update({
                        id: TRACK_INDEX_JOB_ID,
                        metadata: (prev) => ({
                            ...prev,
                            dateFinished: date.now(),
                            isRunning: false,
                            totalRecordCount: count,
                        }),
                    });

                    await serviceHelpers.writeIndexStatus({
                        id: TRACK_INDEX_JOB_ID,
                        libraryId: adapter._getLibrary().id,
                        status: {
                            dateFinished: date.now(),
                            totalRecordCount: count,
                        },
                    });
                },
                onRecords: async (records, progress) => {
                    queryModule.update({
                        id: TRACK_INDEX_JOB_ID,
                        metadata: (prev) => ({
                            ...prev,
                            progress,
                        }),
                    });

                    await serviceHelpers.writeIndex({
                        id: progress.toString(),
                        libraryId: adapter._getLibrary().id,
                        parentId: TRACK_INDEX_JOB_ID,
                        records,
                    });
                },
                onStart: async () => {
                    await queryModule.update({
                        id: TRACK_INDEX_JOB_ID,
                        metadata: (prev) => ({
                            ...prev,
                            dateFinished: null,
                            dateStarted: date.now(),
                            isRunning: true,
                            totalRecordCount: null,
                        }),
                    });

                    await serviceHelpers.deleteIndexStatus({
                        id: TRACK_INDEX_JOB_ID,
                        libraryId: adapter._getLibrary().id,
                    });

                    await serviceHelpers.deleteIndex({
                        id: TRACK_INDEX_JOB_ID,
                        libraryId: adapter._getLibrary().id,
                    });
                },
            });
        },

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

        // ANCHOR - Favorite
        favorite: async (adapter: AdapterApi, args: { ids: string[] }) => {
            const [err, result] = await adapter.setFavorite({
                body: { entry: args.ids.map((id) => ({ favorite: true, id, type: 'track' })) },
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

        // ANCHOR - Invalidate counts
        invalidateCounts: async (adapter: AdapterApi) => {
            db.kv.deleteByIncludes(`${adapter._getLibrary().id}::track`);
            return null;
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

        // ANCHOR - List count
        listCount: async (
            adapter: AdapterApi,
            args: Omit<FindManyServiceArgs<TrackListSortOptions>, 'sortOrder'>,
        ) => {
            const [err, result] = await adapter.getTrackListCount({
                query: {
                    folderId: args.folderId,
                    searchTerm: args.searchTerm,
                    sortBy: args.sortBy,
                },
            });

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            return result;
        },

        // ANCHOR - Query the track index
        queryIndex: async (
            adapter: AdapterApi,
            args: {
                forceRefresh?: boolean;
                limit?: number;
                offset?: number;
                query: TrackQuery;
            },
        ) => {
            const limit = args.limit ?? CONSTANTS.DEFAULT_PAGINATION_LIMIT;
            const offset = args.offset ?? 0;

            // Check if query is valid
            if (!args.query.rules.conditions) {
                throw new apiError.badRequest({
                    message: 'Invalid query',
                });
            }

            const indexQueryStatus = await serviceHelpers.checkIndexStatus({
                id: TRACK_INDEX_JOB_ID,
                libraryId: adapter._getLibrary().id,
            });

            // Check if the index status file exists
            if (!indexQueryStatus) {
                throw new apiError.badRequest({
                    message: 'Index job has not been run, please run the index job first',
                });
            }

            const currentIndexQuery = await queryModule.find({ id: TRACK_INDEX_JOB_ID });

            // Check if index job is running
            if (currentIndexQuery?.metadata?.isRunning) {
                throw new apiError.badRequest({
                    message: 'Index job is running, please wait for it to finish',
                });
            }

            const queryId = md5(stringify(args.query));

            if (args.forceRefresh) {
                await serviceHelpers.deleteQueryByType({
                    id: queryId,
                    libraryId: adapter._getLibrary().id,
                    type: 'track',
                });
            }

            const cachedQueryResults = await serviceHelpers.getQuery<AdapterTrack>({
                id: queryId,
                libraryId: adapter._getLibrary().id,
                type: 'track',
            });

            if (cachedQueryResults) {
                const paginated = adapterHelpers.paginate(cachedQueryResults, offset, limit);

                return {
                    items: paginated.items.map((item) => ({
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
                    limit: paginated.limit,
                    offset: paginated.offset,
                    totalRecordCount: cachedQueryResults.length,
                };
            }

            const results: AdapterTrack[] = [];

            await serviceHelpers.iterateIndex<AdapterTrack>({
                id: TRACK_INDEX_JOB_ID,
                libraryId: adapter._getLibrary().id,
                onRecords: async (records) => {
                    const result = await trackHelpers.query(records, args.query);
                    results.push(...result);
                },
            });

            const sortFields = args.query.sortBy.map((item) => item.field);
            const sortOrders = args.query.sortBy.map((item) => item.direction);
            const sorted = orderBy(results, sortFields, sortOrders);

            // Store the results to the query directory
            await serviceHelpers.saveQuery({
                id: queryId,
                libraryId: adapter._getLibrary().id,
                records: sorted,
                type: 'track',
            });

            const paginated = adapterHelpers.paginate(sorted, offset, limit);

            return {
                items: paginated.items.map((item) => ({
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
                limit: paginated.limit,
                offset: paginated.offset,
                totalRecordCount: results.length,
            };
        },

        // ANCHOR - Query status
        queryStatus: async (adapter: AdapterApi) => {
            const queries = await queryModule.findAll();

            const status = await serviceHelpers.checkIndexStatus({
                id: TRACK_INDEX_JOB_ID,
                libraryId: adapter._getLibrary().id,
            });

            const result = {
                index: status,
                queries: Object.fromEntries(
                    Object.entries(queries).filter(([key]) => key !== TRACK_INDEX_JOB_ID),
                ),
            };

            return result;
        },

        // ANCHOR - Unfavorite
        unfavorite: async (adapter: AdapterApi, args: { ids: string[] }) => {
            const [err, result] = await adapter.setFavorite({
                body: { entry: args.ids.map((id) => ({ favorite: false, id, type: 'track' })) },
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
