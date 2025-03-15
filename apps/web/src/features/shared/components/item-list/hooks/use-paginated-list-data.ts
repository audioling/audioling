import type { AppDBType } from '/@/api/app-db';
import type { ItemListPaginationState } from '/@/features/shared/components/item-list/types';
import type { AuthServer, ServerItemType } from '@repo/shared-types/app-types';
import type { QueryClient, QueryOptions } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { appDBTypeMap } from '/@/api/app-db';
import { useAppContext } from '/@/features/authentication/context/app-context';
import { itemListHelpers } from '/@/features/shared/components/item-list/helpers';

export function usePaginatedListData<
    TParams extends Record<string, any>,
    TData extends Record<string, any>,
>(server: AuthServer, args: {
    itemCount: number;
    pagination: ItemListPaginationState;
    params: Omit<TParams, 'limit' | 'offset'>;
    queryFn: (
        queryClient: QueryClient,
        server: AuthServer,
        params: TParams,
        options?: QueryOptions
    ) => Promise<TData>;
    type: ServerItemType;
}) {
    const { appDB } = useAppContext();
    const { pagination, params, queryFn, type } = args;

    const queryClient = useQueryClient();

    const [data, setData] = useState<(string | undefined)[]>(
        itemListHelpers.getInitialData(pagination.itemsPerPage),
    );

    useEffect(() => {
        const fetchData = async () => {
            if (!queryFn) {
                return;
            }

            const fetchParams = {
                ...params,
                limit: pagination.itemsPerPage,
                offset: pagination.currentPage * pagination.itemsPerPage,
            };

            const { items } = await queryFn(queryClient, server, fetchParams as unknown as TParams);

            queueMicrotask(() => {
                setData(items.map((item: { id: string }) => item.id));

                appDB.setBatch(
                    appDBTypeMap[type as keyof typeof appDBTypeMap] as AppDBType,
                    items.map((item: { id: string }) => ({
                        key: item.id,
                        value: item,
                    })),
                );
            });
        };

        fetchData();
    }, [
        pagination.currentPage,
        pagination.itemsPerPage,
        params,
        queryFn,
        queryClient,
        type,
        server,
        appDB,
    ]);

    return { data, setData };
}
