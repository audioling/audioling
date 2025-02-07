import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LibraryItemType } from '@repo/shared-types';
import { useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { useParams } from 'react-router';
import stringify from 'safe-stable-stringify';
import { appDb } from '@/api/db/app-db.ts';
import type { IndexStatus } from '@/features/shared/offline-filters/offline-filter-utils.ts';
import { libraryIndex } from '@/features/shared/offline-filters/offline-filter-utils.ts';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import type { ItemListPaginationState } from '@/features/ui/item-list/types.ts';
import { type QueryFilter, serializeFilter } from '@/features/ui/query-builder/query-builder.tsx';
import type { ItemQueryData } from '@/hooks/use-list.ts';

export function usePaginatedOfflineListData(args: {
    libraryId: string;
    pagination: ItemListPaginationState;
    query: QueryFilter;
    type: LibraryItemType;
}) {
    const { libraryId, pagination, query, type } = args;

    const queryClient = useQueryClient();
    const [data, setData] = useState<(string | undefined)[]>(
        itemListHelpers.getInitialData(pagination.itemsPerPage),
    );

    useEffect(() => {
        const fetchData = async () => {
            const data = await libraryIndex.getQueryResult(
                type,
                query,
                pagination.itemsPerPage,
                (pagination.currentPage - 1) * pagination.itemsPerPage,
            );

            const dataQueryKey = itemListHelpers.getDataQueryKey(libraryId, type, true);

            queryClient.setQueryData(dataQueryKey, (prev: ItemQueryData | undefined) => {
                const updates: ItemQueryData = {
                    ...prev,
                };

                for (const item of data) {
                    updates[(item as { id: string }).id] = item;
                }
                return updates;
            });

            setData(data.map((item) => (item as { id: string }).id));
        };

        fetchData();
    }, [libraryId, pagination.currentPage, pagination.itemsPerPage, query, queryClient, type]);

    return { data, setData };
}

export function useInfiniteOfflineListData(args: {
    filter: QueryFilter;
    itemCount: number;
    libraryId: string;
    maxLoadedPages?: number;
    pagination: ItemListPaginationState;
    type: LibraryItemType;
}) {
    const { libraryId, pagination, filter, type, maxLoadedPages = 3, itemCount } = args;

    const queryClient = useQueryClient();

    const [data, setData] = useState<(string | undefined)[]>(
        itemListHelpers.getInitialData(itemCount),
    );

    const loadedPages = useRef<Record<number, boolean>>({});

    useEffect(() => {
        loadedPages.current = itemListHelpers.getPageMap(itemCount, pagination.itemsPerPage);
    }, [itemCount, pagination.itemsPerPage]);

    const query = useMemo(() => {
        if (type === LibraryItemType.TRACK) {
            return {
                queryFn: libraryIndex.getQueryResult,
            };
        }

        return null;
    }, [type]);

    const dataQueryKey = itemListHelpers.getDataQueryKey(libraryId, type, true);

    const lastStartIndex = useRef(0);

    const handleRangeChanged = useCallback(
        async (event: { endIndex: number; startIndex: number }) => {
            const { startIndex, endIndex } = event;

            if (!filter) return;

            const scrollingUp = startIndex < lastStartIndex.current;
            lastStartIndex.current = startIndex;

            const pagesToLoad = itemListHelpers.getPagesToLoad({
                endIndex,
                loadedPages: loadedPages,
                pageSize: pagination.itemsPerPage,
                startIndex,
            });

            if (pagesToLoad.length > 0) {
                const currentLoadedPages = Object.entries(loadedPages.current)
                    .filter(([, isLoaded]) => isLoaded)
                    .map(([page]) => Number(page));

                if (currentLoadedPages.length + pagesToLoad.length > maxLoadedPages) {
                    const currentPageRange = {
                        end: Math.ceil(endIndex / pagination.itemsPerPage),
                        start: Math.floor(startIndex / pagination.itemsPerPage),
                    };

                    const sortedPages = currentLoadedPages.sort((a, b) => {
                        // Calculate distances from both edges of viewport
                        const aStartDist = Math.abs(a - currentPageRange.start);
                        const aEndDist = Math.abs(a - currentPageRange.end);
                        const bStartDist = Math.abs(b - currentPageRange.start);
                        const bEndDist = Math.abs(b - currentPageRange.end);

                        // Get the minimum distance for each page
                        const aMinDist = Math.min(aStartDist, aEndDist);
                        const bMinDist = Math.min(bStartDist, bEndDist);

                        if (aMinDist !== bMinDist) {
                            return bMinDist - aMinDist; // Sort by distance, furthest first
                        }

                        // If distances are equal, use scroll direction to break tie
                        if (scrollingUp) {
                            return b - a; // When scrolling up, prefer unloading higher numbered pages
                        } else {
                            return a - b; // When scrolling down, prefer unloading lower numbered pages
                        }
                    });

                    const pagesToUnloadCount =
                        currentLoadedPages.length + pagesToLoad.length - maxLoadedPages;
                    const pagesToUnload = sortedPages.slice(0, pagesToUnloadCount);

                    queueMicrotask(() => {
                        pagesToUnload.forEach((page) => {
                            delete loadedPages.current[page];
                            const startIdx = page * pagination.itemsPerPage;
                            const endIdx = startIdx + pagination.itemsPerPage;

                            const unloadedIds = data
                                .slice(startIdx, endIdx)
                                .filter((id): id is string => id !== undefined);

                            queryClient.setQueryData(
                                dataQueryKey,
                                (prev: ItemQueryData | undefined) => {
                                    if (!prev) return prev;
                                    const updates = { ...prev };
                                    unloadedIds.forEach((id) => {
                                        delete updates[id];
                                    });
                                    return updates;
                                },
                            );
                        });
                    });
                }

                for (const page of pagesToLoad) {
                    loadedPages.current[page] = true;

                    const currentOffset = page * pagination.itemsPerPage;
                    const fetchParams = {
                        limit: pagination.itemsPerPage,
                        offset: currentOffset,
                    };

                    if (!query) return;

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const fn = query.queryFn(type, filter, fetchParams.limit, fetchParams.offset);

                    const pageData = await fn;

                    // Queue the data updates in a microtask
                    queueMicrotask(() => {
                        queryClient.setQueryData(
                            dataQueryKey,
                            (prev: ItemQueryData | undefined) => {
                                const updates: ItemQueryData = {
                                    ...prev,
                                };

                                for (const item of pageData) {
                                    updates[(item as { id: string }).id] = item;
                                }

                                return updates;
                            },
                        );

                        setData((prevData) => {
                            const newData = [...prevData];
                            const startIndex = currentOffset;
                            pageData.forEach((item, index) => {
                                newData[startIndex + index] = (item as { id: string }).id;
                            });
                            return newData;
                        });
                    });
                }
            }
        },
        [
            filter,
            pagination.itemsPerPage,
            maxLoadedPages,
            data,
            queryClient,
            dataQueryKey,
            query,
            type,
        ],
    );

    const debouncedHandleRangeChanged = debounce(handleRangeChanged, 100);

    return { data, handleRangeChanged: debouncedHandleRangeChanged, setData };
}

export function useOfflineListCountSuspense(args: {
    filter: QueryFilter;
    libraryId: string;
    type: LibraryItemType;
}) {
    const { libraryId, filter, type } = args;

    return useSuspenseQuery({
        queryFn: async () => {
            const serializedFilter = serializeFilter(filter);
            const queryId = libraryIndex.getQueryId(type, stringify(serializedFilter));

            const result = (await appDb?.get('indexes', queryId)) as string[] | undefined;
            return result?.length || 0;
        },
        queryKey: libraryIndex.getCountQueryKey(
            libraryId,
            type,
            stringify(serializeFilter(filter)),
        ),
    });
}

export function useOfflineListCount(args: {
    enabled?: boolean;
    filter: QueryFilter;
    libraryId: string;
    type: LibraryItemType;
}) {
    const { libraryId, filter, type, enabled = true } = args;

    return useQuery({
        enabled,
        queryFn: async () => {
            const serializedFilter = serializeFilter(filter);
            const queryId = libraryIndex.getQueryId(type, stringify(serializedFilter));

            const result = (await appDb?.get('indexes', queryId)) as string[] | undefined;
            return result?.length || 0;
        },
        queryKey: libraryIndex.getCountQueryKey(
            libraryId,
            type,
            stringify(serializeFilter(filter)),
        ),
    });
}

export function useIsIndexed(args: { type: LibraryItemType }) {
    const { type } = args;
    const { libraryId } = useParams() as { libraryId: string };

    return useSuspenseQuery({
        queryFn: async () => {
            const result = await appDb?.get('indexes', type);
            return result !== undefined;
        },
        queryKey: [libraryId, 'index', type],
    });
}

export function useIndexStatus(args: { type: LibraryItemType }) {
    const { type } = args;
    const { libraryId } = useParams() as { libraryId: string };

    return useSuspenseQuery({
        queryFn: async () => {
            const result = await appDb?.get('indexes', type);
            return (result as IndexStatus | undefined) || null;
        },
        queryKey: [libraryId, 'index', type, 'status'],
    });
}
