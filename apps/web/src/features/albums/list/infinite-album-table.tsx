import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { ColumnOrderState } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import type { AlbumItem } from '@/api/api-types.ts';
import {
    getApiLibraryIdAlbums,
    getGetApiLibraryIdAlbumsQueryKey,
} from '@/api/openapi-generated/albums/albums.ts';
import type { GetApiLibraryIdAlbumsParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { InfiniteItemTable } from '@/features/ui/item-list/item-table/item-table.tsx';
import type { ItemListPaginationState } from '@/features/ui/item-list/types.ts';
import { Skeleton } from '@/features/ui/skeleton/skeleton.tsx';
import { throttle } from '@/utils/throttle.ts';

type AlbumTableItemContext = {
    baseUrl: string;
    libraryId: string;
};

interface InfiniteAlbumTableProps {
    baseUrl: string;
    itemCount: number;
    libraryId: string;
    pagination: ItemListPaginationState;
    params: GetApiLibraryIdAlbumsParams;
}

export function InfiniteAlbumTable({
    baseUrl,
    itemCount,
    libraryId,
    params,
    pagination,
}: InfiniteAlbumTableProps) {
    const queryClient = useQueryClient();
    const [data, setData] = useState<Map<number, AlbumItem>>(new Map());

    const loadedPages = useRef<Record<number, boolean>>({});

    useEffect(() => {
        loadedPages.current = itemListHelpers.getPageMap(itemCount, pagination.itemsPerPage);
    }, [itemCount, pagination.itemsPerPage]);

    const handleRangeChanged = useCallback(
        async (event: { endIndex: number; startIndex: number }) => {
            const { startIndex, endIndex } = event;
            const pagesToLoad = itemListHelpers.getPagesToLoad(
                startIndex,
                endIndex,
                pagination.itemsPerPage,
                loadedPages.current,
            );

            if (pagesToLoad.length > 0) {
                for (const page of pagesToLoad) {
                    loadedPages.current[page] = true;

                    const currentOffset = page * pagination.itemsPerPage;

                    const paramsWithPagination = {
                        ...params,
                        limit: pagination.itemsPerPage.toString(),
                        offset: currentOffset.toString(),
                    };

                    const { data } = await queryClient.fetchQuery({
                        queryFn: () => getApiLibraryIdAlbums(libraryId, paramsWithPagination),
                        queryKey: getGetApiLibraryIdAlbumsQueryKey(libraryId, paramsWithPagination),
                        staleTime: 30 * 1000,
                    });

                    setData((prevData) => {
                        const newData = new Map(prevData);
                        data.forEach((item, index) => {
                            newData.set(currentOffset + index, item);
                        });
                        return newData;
                    });
                }
            }
        },
        [libraryId, pagination.itemsPerPage, params, queryClient],
    );

    const throttledHandleRangeChanged = throttle(handleRangeChanged, 200);

    const columnHelper = createColumnHelper<AlbumItem | undefined>();

    const columns = useMemo(
        () => [
            columnHelper.display({
                cell: ({ row }) => {
                    const item = data.get(row.index);
                    if (!item) {
                        return <Skeleton width={30} />;
                    }
                    return <div>{row.index + 1}</div>;
                },
                enableResizing: true,
                header: 'Index',
                id: 'index',
                size: itemListHelpers.table.numberToColumnSize(50, 'px'),
            }),
            columnHelper.display({
                cell: ({ row }) => {
                    const item = data.get(row.index);
                    if (!item) {
                        return <Skeleton width={100} />;
                    }
                    return <div>{item.name}</div>;
                },
                enableResizing: true,
                header: 'Name',
                id: 'name',
                size: itemListHelpers.table.numberToColumnSize(1, 'fr'),
            }),
            columnHelper.display({
                cell: ({ row }) => {
                    const item = data.get(row.index);
                    console.log('item', item);
                    if (!item) {
                        return <Skeleton height={20} width={100} />;
                    }
                    return <div>{item.artists.map((artist) => artist.name).join(', ')}</div>;
                },
                enableResizing: true,
                header: 'Artists',
                id: 'artists',
                size: itemListHelpers.table.numberToColumnSize(1, 'fr'),
            }),
        ],
        [columnHelper, data],
    );

    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([
        'index',
        'name',
        'albumName',
        'artists',
    ]);

    return (
        <InfiniteItemTable<AlbumItem, AlbumTableItemContext>
            columnOrder={columnOrder}
            columns={columns}
            context={{ baseUrl, libraryId }}
            data={data}
            itemCount={itemCount}
            setColumnOrder={setColumnOrder}
            onRangeChanged={throttledHandleRangeChanged}
        />
    );
}
