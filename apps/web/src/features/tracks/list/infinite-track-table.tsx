import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { ColumnOrderState } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import type { TrackItem } from '@/api/api-types.ts';
import type { GetApiLibraryIdTracksParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import {
    getApiLibraryIdTracks,
    getGetApiLibraryIdTracksQueryKey,
} from '@/api/openapi-generated/tracks/tracks.ts';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { InfiniteItemTable } from '@/features/ui/item-list/item-table/item-table.tsx';
import type { ItemListPaginationState } from '@/features/ui/item-list/types.ts';
import { Skeleton } from '@/features/ui/skeleton/skeleton.tsx';
import { throttle } from '@/utils/throttle.ts';

type TrackTableItemContext = {
    baseUrl: string;
    libraryId: string;
};

interface InfiniteTrackTableProps {
    baseUrl: string;
    itemCount: number;
    libraryId: string;
    pagination: ItemListPaginationState;
    params: GetApiLibraryIdTracksParams;
}

export function InfiniteTrackTable({
    baseUrl,
    itemCount,
    libraryId,
    params,
    pagination,
}: InfiniteTrackTableProps) {
    const queryClient = useQueryClient();
    const [data, setData] = useState<Map<number, TrackItem>>(new Map());

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
                        queryFn: () => getApiLibraryIdTracks(libraryId, paramsWithPagination),
                        queryKey: getGetApiLibraryIdTracksQueryKey(libraryId, paramsWithPagination),
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

    const columnHelper = createColumnHelper<TrackItem | undefined>();

    const columns = useMemo(
        () => [
            columnHelper.display({
                cell: ({ row }) => {
                    const item = row.original;
                    if (!item) {
                        return <Skeleton height={20} width={30} />;
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
                    const item = row.original;
                    if (!item) {
                        return <Skeleton height={20} width={100} />;
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
                    const item = row.original;
                    if (!item) {
                        return <Skeleton height={20} width={100} />;
                    }
                    return <div>{item.album}</div>;
                },
                enableResizing: true,
                header: 'Album Name',
                id: 'albumName',
                size: itemListHelpers.table.numberToColumnSize(1, 'fr'),
            }),
            columnHelper.display({
                cell: ({ row }) => {
                    const item = row.original;
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
        [columnHelper],
    );

    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([
        'index',
        'name',
        'albumName',
        'artists',
    ]);

    const tableContext = useMemo(() => ({ baseUrl, libraryId }), [baseUrl, libraryId]);

    return (
        <InfiniteItemTable<TrackItem, TrackTableItemContext>
            columnOrder={columnOrder}
            columns={columns}
            context={tableContext}
            data={data}
            itemCount={itemCount}
            setColumnOrder={setColumnOrder}
            onRangeChanged={throttledHandleRangeChanged}
        />
    );
}
