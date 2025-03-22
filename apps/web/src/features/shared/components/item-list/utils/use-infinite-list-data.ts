import type { AppDBType } from '/@/api/app-db';
import type { ItemListPaginationState } from '/@/features/shared/components/item-list/types';
import type { AuthServer, ServerItemType } from '@repo/shared-types/app-types';
import type { QueryClient, QueryOptions } from '@tanstack/react-query';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import debounce from 'lodash/debounce';
import { useCallback, useRef } from 'react';
import { appDBTypeMap } from '/@/api/app-db';
import { useAppContext } from '/@/features/authentication/context/app-context';
import { itemListHelpers } from '/@/features/shared/components/item-list/utils/helpers';
import { listDataQueryKey } from '/@/features/shared/components/item-list/utils/hooks';
import { toMs } from '/@/utils/to-ms';

export function useInfiniteListData<
    TParams extends Record<string, any>,
    TData extends Record<string, any>,
>(
    server: AuthServer,
    args: {
        itemCount: number;
        key: string;
        pagination: ItemListPaginationState;
        params: Omit<TParams, 'limit' | 'offset'>;
        queryFn: (
            queryClient: QueryClient,
            server: AuthServer,
            params: TParams,
            options?: QueryOptions
        ) => Promise<TData>;
        type: ServerItemType;
    },
) {
    const { appDB } = useAppContext();
    const { itemCount, pagination, params, queryFn, type } = args;

    const queryClient = useQueryClient();
    const dataQueryKey = listDataQueryKey(server, type, args.key, params);

    const { data } = useSuspenseQuery({
        gcTime: toMs.hours(1),
        queryFn: () => {
            return {
                items: itemListHelpers.getInitialData(itemCount) as (string | undefined)[],
                loadedPages: {},
            };
        },
        queryKey: dataQueryKey,
        staleTime: toMs.hours(1),
    });

    const setItems = useCallback((data: { id: string }[], startIndex: number) => {
        queryClient.setQueryData(dataQueryKey, (
            prev: {
                items: (string | undefined)[];
                loadedPages: Record<number, boolean>;
            }) => {
            const newItems = [...prev.items];

            data.forEach((item, index: number) => {
                newItems[startIndex + index] = item.id;
            });

            return {
                items: newItems,
                loadedPages: prev.loadedPages,
            };
        });
    }, [queryClient, dataQueryKey]);

    const setLoadedPages = useCallback((loadedPages: Record<number, boolean>) => {
        queryClient.setQueryData(dataQueryKey, (
            prev: {
                items: (string | undefined)[];
                loadedPages: Record<number, boolean>;
            }) => {
            return {
                ...prev,
                loadedPages,
            };
        });
    }, [queryClient, dataQueryKey]);

    const lastStartIndex = useRef(0);

    const handleRangeChanged = useCallback(
        async (event: { endIndex: number; startIndex: number }) => {
            const { endIndex, startIndex } = event;

            if (!queryFn) {
                return;
            }

            lastStartIndex.current = startIndex;

            const pagesToLoad = itemListHelpers.getPagesToLoad({
                endIndex,
                loadedPages: data.loadedPages,
                pageSize: pagination.itemsPerPage,
                startIndex,
            });

            if (pagesToLoad.length > 0) {
                for (const page of pagesToLoad) {
                    setLoadedPages({ ...data.loadedPages, [page]: true });

                    const currentOffset = page * pagination.itemsPerPage;
                    const fetchParams = {
                        ...params,
                        limit: pagination.itemsPerPage.toString(),
                        offset: currentOffset.toString(),
                    };

                    const { items: pageData } = await queryFn(queryClient, server, fetchParams as unknown as TParams);

                    queueMicrotask(() => {
                        setItems(pageData, currentOffset);

                        appDB.setBatch(
                            appDBTypeMap[type as keyof typeof appDBTypeMap] as AppDBType,
                            pageData.map((item: { id: string }) => ({
                                key: item.id,
                                value: item,
                            })),
                        );
                    });
                }
            }
        },
        [
            queryFn,
            data.loadedPages,
            pagination.itemsPerPage,
            setLoadedPages,
            params,
            queryClient,
            server,
            setItems,
            appDB,
            type,
        ],
    );

    const debouncedHandleRangeChanged = debounce(handleRangeChanged, 100);

    return { data: data.items, handleRangeChanged: debouncedHandleRangeChanged, itemCount, setItems };
}
