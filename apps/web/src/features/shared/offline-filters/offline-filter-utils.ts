import { type LibraryItemType } from '@repo/shared-types';
import dayjs from 'dayjs';
import orderBy from 'lodash/orderBy.js';
import stringify from 'safe-stable-stringify';
import { getDbItems } from '@/api/db/app-db-api.ts';
import type { AppDbType } from '@/api/db/app-db.ts';
import { appDb, appDbTypeMap } from '@/api/db/app-db.ts';
import { jsonataHelpers } from '@/features/shared/offline-filters/jsonata.ts';
import type {
    QueryFilter,
    SerializedQueryFilter,
} from '@/features/ui/query-builder/query-builder.tsx';
import { serializeFilter } from '@/features/ui/query-builder/query-builder.tsx';

export type IndexStatus = {
    lastUpdatedDate: string;
    status: 'running' | 'finished' | 'aborted';
    totalRecordCount?: number;
};

export const libraryIndexStatus = {
    abort: async (itemType: LibraryItemType) => {
        await appDb?.set('indexes', {
            key: itemType,
            value: { lastUpdatedDate: dayjs().utc().format(), status: 'aborted' },
        });
    },
    delete: async (itemType: LibraryItemType) => {
        await appDb?.delete('indexes', itemType);
    },
    finish: async (itemType: LibraryItemType, totalRecordCount: number) => {
        await appDb?.set('indexes', {
            key: itemType,
            value: {
                lastUpdatedDate: dayjs().utc().format(),
                status: 'finished',
                totalRecordCount,
            },
        });
    },
    get: async (itemType: LibraryItemType) => {
        return appDb?.get('indexes', itemType);
    },
    getIsAborted: async (itemType: LibraryItemType) => {
        const status = await appDb?.get('indexes', itemType);
        return (status as IndexStatus)?.status === 'aborted';
    },
    set: async (itemType: LibraryItemType, status: IndexStatus) => {
        await appDb?.set('indexes', {
            key: itemType,
            value: status,
        });
    },
    start: async (itemType: LibraryItemType) => {
        await appDb?.set('indexes', {
            key: itemType,
            value: { lastUpdatedDate: dayjs().utc().format(), status: 'running' },
        });
    },
};

export const libraryIndex = {
    buildIndex: async <T>(
        itemType: LibraryItemType,
        handlers: {
            fetcher: (page: number, limit: number) => Promise<T[]>;
            isAbortedFn?: () => Promise<boolean>;
            onAborted?: () => void;
            onFinish?: (totalCount: number) => void;
            onRecords?: (records: T[], progress: number) => Promise<void>;
            onStart?: () => void;
        },
        options?: {
            concurrentFetches?: number;
            limitPerPage?: number;
        },
    ) => {
        fetchAllRecords(
            {
                count: 0,
                currentPage: 0,
                fetcher: (page, limit) => handlers?.fetcher(page, limit),
                isAbortedFn: async () => {
                    if (!handlers?.isAbortedFn) {
                        return libraryIndexStatus.getIsAborted(itemType);
                    }

                    return handlers?.isAbortedFn?.();
                },
                onAborted: () => {
                    libraryIndexStatus.abort(itemType);
                    handlers?.onAborted?.();
                },
                onFinish: (totalCount) => {
                    libraryIndexStatus.finish(itemType, totalCount);
                    handlers?.onFinish?.(totalCount);
                },
                onRecords: async (records, progress) => {
                    await handlers?.onRecords?.(records, progress);
                    await appDb?.setBatch(
                        appDbTypeMap[itemType as keyof typeof appDbTypeMap] as AppDbType,
                        records.map((record) => ({
                            key: (record as { id: string }).id,
                            value: record,
                        })),
                    );
                },
                onStart: () => {
                    libraryIndexStatus.start(itemType);
                    handlers?.onStart?.();
                },
            },
            options,
        );
    },
    clearIndex: async (itemType: LibraryItemType) => {
        await appDb?.delete('indexes', itemType);
    },
    clearQueryIndexes: async (itemType: LibraryItemType) => {
        const keys = await appDb?.getKeys('indexes');

        if (!keys) {
            return;
        }

        for (const key of keys) {
            if (key.includes(`${itemType}-`)) {
                await appDb?.delete('indexes', key);
            }
        }
    },
    getCountQueryKey: (libraryId: string, itemType: LibraryItemType, serializedFilter: string) => {
        return [libraryId, itemType, 'count', serializedFilter];
    },
    getQueryId: (itemType: LibraryItemType, serializedFilter: string) => {
        return getQueryId(itemType, serializedFilter);
    },
    getQueryResult: async <T>(
        itemType: LibraryItemType,
        query: QueryFilter,
        limit: number,
        offset: number,
    ) => {
        const serializedFilter = serializeFilter(query);
        const queryId = getQueryId(itemType, stringify(serializedFilter));
        const existingQueryIndex = (await appDb?.get('indexes', queryId)) as string[] | undefined;
        return getQueryResult<T>(itemType, existingQueryIndex || [], offset, limit);
    },
    runQuery: async <T>(
        itemType: LibraryItemType,
        query: QueryFilter,
        options: { force?: boolean },
    ) => {
        const serializedFilter = serializeFilter(query);
        const expression = jsonataHelpers.getExpression(serializedFilter.rules, trackQueryFields);

        const queryRulesId = getQueryId(itemType, stringify(serializedFilter.rules));
        const queryId = getQueryId(itemType, stringify(serializedFilter));

        const existingQueryIndex = (await appDb?.exists('indexes', queryId)) as boolean | undefined;

        if (existingQueryIndex && !options.force) {
            return;
        }

        let ids: string[] = [];
        const existingRulesIndex = (await appDb?.get('indexes', queryRulesId)) as
            | string[]
            | undefined;

        if (existingRulesIndex && !options.force) {
            ids = existingRulesIndex as string[];
        } else {
            await appDb?.iterate(appDbTypeMap[itemType as keyof typeof appDbTypeMap] as AppDbType, {
                onFinish: async () => {
                    writeRulesIndex(queryRulesId, ids);
                },
                onProgress: async (items) => {
                    const result = await jsonataHelpers.getResult(expression, items);

                    result.forEach((item) => {
                        ids.push(item.id);
                    });
                },
            });
        }

        const items = (await getDbItems(
            appDbTypeMap[itemType as keyof typeof appDbTypeMap] as AppDbType,
            ids,
        )) as T[];

        const sortedItems = sortQueryResult(items, query);
        const sortedIds = sortedItems.map((item) => (item as { id: string }).id);

        await writeQueryIndex(queryId, sortedIds);
        return;
    },
};

async function getQueryResult<T>(
    itemType: LibraryItemType,
    ids: string[],
    offset: number,
    limit: number,
) {
    const paginatedIds = paginateQueryIds(ids, offset, limit);

    const items = await getDbItems(
        appDbTypeMap[itemType as keyof typeof appDbTypeMap] as AppDbType,
        paginatedIds,
    );

    return items as T[];
}

function getQueryId(itemType: LibraryItemType, id: string) {
    return `${itemType}-${id}`;
}

async function writeRulesIndex(indexId: string, ids: string[]) {
    await appDb?.set('indexes', {
        key: indexId,
        value: ids,
    });
}

async function writeQueryIndex(indexId: string, ids: string[]) {
    await appDb?.set('indexes', {
        key: indexId,
        value: ids,
    });
}

function sortQueryResult<T>(items: T[], query: SerializedQueryFilter) {
    const sortFields = query.sortBy.map((item) => item.field);
    const sortOrders = query.sortBy.map((item) => item.direction);
    const sorted = orderBy(items, sortFields, sortOrders);
    return sorted;
}

function paginateQueryIds(ids: string[], offset: number, limit: number) {
    // Return all results after offset if limit is -1
    if (limit === -1) {
        return ids.slice(offset);
    }

    // Return paginated subset of ids from offset to offset + limit
    return ids.slice(offset, offset + limit);
}

export async function fetchAllRecords<T>(
    args: {
        count: number;
        currentPage: number;
        fetcher: (page: number, limit: number) => Promise<T[]>;
        isAbortedFn?: () => Promise<boolean>;
        onAborted?: () => void;
        onFinish?: (totalCount: number) => void;
        onRecords: (records: T[], progress: number) => void;
        onStart?: () => void;
    },
    options?: {
        concurrentFetches?: number;
        limitPerPage?: number;
    },
) {
    const { count, currentPage, fetcher, isAbortedFn, onAborted, onFinish, onRecords, onStart } =
        args;

    const { concurrentFetches = 5, limitPerPage = 500 } = options ?? {};

    // Run onStart if this is the first page
    if (currentPage === 0) {
        onStart?.();
    }

    const isAborted = await isAbortedFn?.();
    if (isAborted) {
        onAborted?.();
        return;
    }

    // Create array of concurrent fetch promises
    const fetchPromises = Array.from({ length: concurrentFetches }, (_, i) =>
        fetcher(currentPage + i, limitPerPage),
    );

    // Wait for all fetches to complete
    const results = await Promise.all(fetchPromises);

    // Process all results
    let totalRecords = 0;
    for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.length === 0) {
            onFinish?.(count + totalRecords);
            return;
        }
        onRecords(result, (currentPage + i) * limitPerPage);
        totalRecords += result.length;
    }

    // If any batch had fewer items than limit, we've reached the end
    if (results.some((result) => result.length < limitPerPage)) {
        onFinish?.(count + totalRecords);
        return;
    }

    // Continue with next batch of pages
    return fetchAllRecords(
        {
            count: count + totalRecords,
            currentPage: currentPage + concurrentFetches,
            fetcher,
            isAbortedFn,
            onAborted,
            onFinish,
            onRecords,
            onStart,
        },
        {
            concurrentFetches,
            limitPerPage,
        },
    );
}

export const trackQueryFields: Record<string, { type: string; value: string }> = {
    album: { type: 'text', value: 'album' },
    'albumArtists.id': { type: 'text', value: 'albumArtists.id' },
    'albumArtists.name': { type: 'text', value: 'albumArtists.name' },
    albumId: { type: 'text', value: 'albumId' },
    'artists.id': { type: 'text', value: 'artists.id' },
    'artists.name': { type: 'text', value: 'artists.name' },
    bitDepth: { type: 'number', value: 'bitDepth' },
    bitRate: { type: 'number', value: 'bitRate' },
    bpm: { type: 'number', value: 'bpm' },
    channelCount: { type: 'number', value: 'channelCount' },
    comment: { type: 'text', value: 'comment' },
    createdDate: { type: 'date', value: 'createdDate' },
    discNumber: { type: 'number', value: 'discNumber' },
    discSubtitle: { type: 'text', value: 'discSubtitle' },
    duration: { type: 'number', value: 'duration' },
    fileContainer: { type: 'text', value: 'fileContainer' },
    filePath: { type: 'text', value: 'filePath' },
    fileSize: { type: 'number', value: 'fileSize' },
    'genres.id': { type: 'text', value: 'genres.id' },
    'genres.name': { type: 'text', value: 'genres.name' },
    isCompilation: { type: 'boolean', value: 'isCompilation' },
    moods: { type: 'text', value: 'moods' },
    name: { type: 'text', value: 'name' },
    releaseYear: { type: 'number', value: 'releaseYear' },
    sortName: { type: 'text', value: 'sortName' },
    trackNumber: { type: 'number', value: 'trackNumber' },
    updatedDate: { type: 'date', value: 'updatedDate' },
    userFavorite: { type: 'boolean', value: 'userFavorite' },
    userFavoriteDate: { type: 'date', value: 'userFavoriteDate' },
    userLastPlayedDate: { type: 'date', value: 'userLastPlayedDate' },
    userPlayCount: { type: 'number', value: 'userPlayCount' },
    userRating: { type: 'number', value: 'userRating' },
};
