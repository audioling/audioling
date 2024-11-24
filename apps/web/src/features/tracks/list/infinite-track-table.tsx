import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LibraryItemType } from '@repo/shared-types';
import { useQueryClient } from '@tanstack/react-query';
import type { Row, Table } from '@tanstack/react-table';
import type { TrackItem } from '@/api/api-types.ts';
import type { GetApiLibraryIdTracksParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import {
    getApiLibraryIdTracks,
    getGetApiLibraryIdTracksQueryKey,
} from '@/api/openapi-generated/tracks/tracks.ts';
import {
    useTrackListActions,
    useTrackListState,
} from '@/features/tracks/store/track-list-store.ts';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { useItemTable } from '@/features/ui/item-list/item-table/hooks/use-item-table.ts';
import { useMultiRowSelection } from '@/features/ui/item-list/item-table/hooks/use-table-row-selection.ts';
import { ItemTable } from '@/features/ui/item-list/item-table/item-table.tsx';
import type { ItemListPaginationState } from '@/features/ui/item-list/types.ts';
import type { DragData } from '@/utils/drag-drop.ts';
import { dndUtils, DragOperation, DragTarget } from '@/utils/drag-drop.ts';
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

    const { onRowClick } = useMultiRowSelection<TrackItem>();

    const onRangeChanged = useCallback(
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

    const throttledOnRangeChanged = throttle(onRangeChanged, 200);

    const onRowDragData = useCallback(
        (row: Row<TrackItem>, table: Table<TrackItem | undefined>): DragData => {
            const isSelfSelected = row.getIsSelected();

            if (isSelfSelected) {
                const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original);

                return dndUtils.generateDragData(
                    {
                        id: selectedRows
                            .map((row) => row?.id)
                            .filter((id): id is string => id !== undefined),
                        operation: [DragOperation.ADD],
                        type: DragTarget.TRACK,
                    },
                    {
                        items: selectedRows,
                    },
                );
            }

            return dndUtils.generateDragData(
                {
                    id: [row.original?.id],
                    operation: [DragOperation.ADD],
                    type: DragTarget.TRACK,
                },
                {
                    items: [row.original],
                },
            );
        },
        [],
    );

    const { columnOrder } = useTrackListState();
    const { setColumnOrder } = useTrackListActions();

    const { columns } = useItemTable<TrackItem>(columnOrder, setColumnOrder);

    const tableContext = useMemo(() => ({ baseUrl, libraryId }), [baseUrl, libraryId]);

    return (
        <ItemTable<TrackItem, TrackTableItemContext>
            columnOrder={columnOrder}
            columns={columns}
            context={tableContext}
            data={data}
            enableHeader={true}
            enableMultiRowSelection={true}
            enableRowSelection={true}
            itemCount={itemCount}
            itemType={LibraryItemType.TRACK}
            onChangeColumnOrder={setColumnOrder}
            onRangeChanged={throttledOnRangeChanged}
            onRowClick={onRowClick}
            onRowDragData={onRowDragData}
        />
    );
}
