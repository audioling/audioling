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
import { throttle } from '@/utils/throttle.ts';

const PAGE_SIZE = 500;

type TrackTableItemContext = {
    baseUrl: string;
    libraryId: string;
};

interface InfiniteTrackTableProps {
    baseUrl: string;
    itemCount: number;
    libraryId: string;
    params: GetApiLibraryIdTracksParams;
}

export function InfiniteTrackTable({
    baseUrl,
    itemCount,
    libraryId,
    params,
}: InfiniteTrackTableProps) {
    const queryClient = useQueryClient();
    const [data, setData] = useState<(TrackItem | undefined)[]>(
        itemListHelpers.getInitialData(itemCount),
    );

    const loadedPages = useRef<Record<number, boolean>>({});

    useEffect(() => {
        loadedPages.current = itemListHelpers.getPageMap(itemCount, PAGE_SIZE);
    }, [itemCount]);

    const handleRangeChanged = useCallback(
        async (event: { endIndex: number; startIndex: number }) => {
            const { startIndex, endIndex } = event;
            const pagesToLoad = itemListHelpers.getPagesToLoad(
                startIndex,
                endIndex,
                PAGE_SIZE,
                loadedPages.current,
            );

            if (pagesToLoad.length > 0) {
                for (const page of pagesToLoad) {
                    loadedPages.current[page] = true;

                    const currentOffset = page * PAGE_SIZE;

                    const { data } = await queryClient.fetchQuery({
                        queryFn: () =>
                            getApiLibraryIdTracks(libraryId, {
                                ...params,
                                limit: PAGE_SIZE.toString(),
                                offset: currentOffset.toString(),
                            }),
                        queryKey: getGetApiLibraryIdTracksQueryKey(libraryId, params),
                        staleTime: 60 * 1000,
                    });

                    setData((prevData) => {
                        const newData = [...prevData];
                        const startIndex = currentOffset;
                        data.forEach((item, index) => {
                            newData[startIndex + index] = item;
                        });
                        return newData;
                    });
                }
            }
        },
        [libraryId, params, queryClient],
    );

    const throttledHandleRangeChanged = throttle(handleRangeChanged, 200);

    const columnHelper = createColumnHelper<TrackItem | undefined>();

    const columns = useMemo(
        () => [
            columnHelper.display({
                cell: ({ row }) => {
                    return <div>{row.index + 1}</div>;
                },
                enableResizing: true,
                header: 'Index',
                id: 'index',
                size: itemListHelpers.table.numberToColumnSize(50, 'px'),
            }),
            columnHelper.display({
                cell: ({ row }) => {
                    return <div>{row.original?.name}</div>;
                },
                enableResizing: true,
                header: 'Name',
                id: 'name',
                size: itemListHelpers.table.numberToColumnSize(1, 'fr'),
            }),
            columnHelper.display({
                cell: ({ row }) => {
                    return <div>{row.original?.album}</div>;
                },
                enableResizing: true,
                header: 'Album Name',
                id: 'albumName',
                size: itemListHelpers.table.numberToColumnSize(1, 'fr'),
            }),
            columnHelper.display({
                cell: ({ row }) => {
                    return (
                        <div>{row.original?.artists.map((artist) => artist.name).join(', ')}</div>
                    );
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

    return (
        <InfiniteItemTable<TrackItem, TrackTableItemContext>
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
