import type { AdapterAlbumListQuery } from '@repo/shared-types/adapter-types';
import { AlbumListSortOptions, ListSortOrder } from '@repo/shared-types/app-types';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { useListContext } from '../../shared/context/list-context';
import { ItemListDisplayType, ItemListPaginationType } from '/@/features/shared/components/item-list/types';
import { useListStoreOptions, useListStoreParams } from '/@/stores/list-store';

// export function useAlbumListOptions() {
//     const [searchParams, setSearchParams] = useSearchParams();

//     const sortBy = (searchParams.get('sortBy') || AlbumListSortOptions.NAME) as AlbumListSortOptions;
//     const sortOrder = (searchParams.get('sortOrder') || ListSortOrder.ASC) as ListSortOrder;
//     const folderId = searchParams.get('folderId')?.split('[]') || undefined;
//     const searchTerm = searchParams.get('searchTerm') || undefined;

//     const currentPage = (searchParams.get('currentPage') || '1') as string;
//     const itemsPerPage = (searchParams.get('itemsPerPage') || '100') as string;

//     const setParams = useCallback((params: {
//         currentPage?: string;
//         displayType?: ItemListDisplayType;
//         folderId?: string;
//         searchTerm?: string;
//         sortBy?: AlbumListSortOptions;
//         sortOrder?: ListSortOrder;
//     }) => {
//         setSearchParams((prev) => {
//             Object.entries(params).forEach(([key, value]) => {
//                 if (value !== undefined) {
//                     prev.set(key, value);
//                 }
//             });

//             return prev;
//         });
//     }, [setSearchParams]);

//     return {
//         displayType: ItemListDisplayType.GRID,
//         pagination: {
//             currentPage: currentPage ? Number.parseInt(currentPage) : 1,
//             itemsPerPage: itemsPerPage ? Number.parseInt(itemsPerPage) : 500,
//         },
//         paginationType: ItemListPaginationType.INFINITE,
//         params: {
//             folderId,
//             searchTerm,
//             sortBy,
//             sortOrder,
//         },
//         setParams,
//     };
// }

export function useAlbumListOptions() {
    const { key } = useListContext();

    const {
        columnOrder,
        displayType,
        initialScrollIndex,
        pagination,
        paginationType,
    } = useListStoreOptions(key, {
        displayType: ItemListDisplayType.GRID,
        initialScrollIndex: 0,
        pagination: {
            currentPage: 1,
            itemsPerPage: 100,
        },
        paginationType: ItemListPaginationType.INFINITE,
    });

    return {
        columnOrder,
        displayType,
        initialScrollIndex,
        pagination,
        paginationType,
    };
}

export function useAlbumListParams() {
    const { key } = useListContext();

    const [searchParams] = useSearchParams();

    const overrides = useMemo(() => {
        const params = {
            searchTerm: searchParams.get('searchTerm') || undefined,
            sortBy: (searchParams.get('sortBy') || undefined) as AlbumListSortOptions | undefined,
            sortOrder: (searchParams.get('sortOrder') || undefined) as ListSortOrder | undefined,
        };

        return Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined));
    }, [searchParams]);

    const { params, setParams: setListStoreParams } = useListStoreParams<
        Omit<AdapterAlbumListQuery, 'limit' | 'offset'>
    >(key, {
        defaults: {
            sortBy: AlbumListSortOptions.NAME,
            sortOrder: ListSortOrder.ASC,
        },
        overrides,
    });

    const componentKey = useMemo(() => {
        return JSON.stringify(params);
    }, [params]);

    const setParams = useCallback((params: Record<string, unknown>) => {
        setListStoreParams(key, params);
    }, [key, setListStoreParams]);

    return {
        componentKey,
        params,
        setParams,
    };
}
