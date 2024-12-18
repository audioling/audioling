import { useCallback, useEffect, useRef, useState } from 'react';
import { LibraryItemType } from '@repo/shared-types';
import { useQueryClient } from '@tanstack/react-query';
import type { Row, Table } from '@tanstack/react-table';
import type { GenreItem } from '@/api/api-types.ts';
import type { GetApiLibraryIdGenresParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import {
    getApiLibraryIdGenres,
    getGetApiLibraryIdGenresQueryKey,
} from '@/api/openapi-generated/genres/genres.ts';
import { PrefetchController } from '@/features/controllers/prefetch-controller.tsx';
import { useGenreListStore } from '@/features/genres/stores/genre-list-store.ts';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { useItemTable } from '@/features/ui/item-list/item-table/hooks/use-item-table.ts';
import { useMultiRowSelection } from '@/features/ui/item-list/item-table/hooks/use-table-row-selection.ts';
import { ItemTable } from '@/features/ui/item-list/item-table/item-table.tsx';
import type { ItemListPaginationState } from '@/features/ui/item-list/types.ts';
import type { DragData } from '@/utils/drag-drop.ts';
import { dndUtils, DragOperation, DragTarget } from '@/utils/drag-drop.ts';
import { throttle } from '@/utils/throttle.ts';

type GenreTableItemContext = {
    baseUrl: string;
    libraryId: string;
};

interface InfiniteGenreTableProps {
    baseUrl: string;
    itemCount: number;
    libraryId: string;
    listKey: string;
    pagination: ItemListPaginationState;
    params: GetApiLibraryIdGenresParams;
}

export function InfiniteGenreTable({
    baseUrl,
    itemCount,
    libraryId,
    listKey,
    params,
    pagination,
}: InfiniteGenreTableProps) {
    const queryClient = useQueryClient();
    const [data, setData] = useState<(GenreItem | undefined)[]>(Array(itemCount).fill(undefined));

    const loadedPages = useRef<Record<number, boolean>>({});

    useEffect(() => {
        loadedPages.current = itemListHelpers.getPageMap(itemCount, pagination.itemsPerPage);
    }, [itemCount, pagination.itemsPerPage]);

    const { onRowClick } = useMultiRowSelection<GenreItem>();

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
                        queryFn: () => getApiLibraryIdGenres(libraryId, paramsWithPagination),
                        queryKey: getGetApiLibraryIdGenresQueryKey(libraryId, paramsWithPagination),
                        staleTime: 30 * 1000,
                    });

                    console.log(currentOffset, currentOffset + data.length);

                    setData((prevData) => {
                        const newData = [...prevData];
                        data.forEach((item, index) => {
                            newData[currentOffset + index] = item;
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
        (row: Row<GenreItem>, table: Table<GenreItem | undefined>): DragData => {
            const isSelfSelected = row.getIsSelected();

            if (isSelfSelected) {
                const selectedRowIds = table
                    .getSelectedRowModel()
                    .rows.map((row) => row.original?.id)
                    .filter((id): id is string => id !== undefined);

                return dndUtils.generateDragData({
                    id: selectedRowIds,
                    operation: [DragOperation.ADD],
                    type: DragTarget.GENRE,
                });
            }

            return dndUtils.generateDragData({
                id: [row.original?.id],
                operation: [DragOperation.ADD],
                type: DragTarget.GENRE,
            });
        },
        [],
    );

    const onRowDrag = useCallback((row: Row<GenreItem>, table: Table<GenreItem | undefined>) => {
        const isSelfSelected = row.getIsSelected();

        if (isSelfSelected) {
            const selectedRowIds = table
                .getSelectedRowModel()
                .rows.map((row) => row.original?.id)
                .filter((id): id is string => id !== undefined);

            return PrefetchController.call({
                cmd: {
                    tracksByAlbumId: {
                        id: selectedRowIds,
                    },
                },
            });
        }

        return PrefetchController.call({
            cmd: {
                tracksByAlbumId: {
                    id: [row.original.id],
                },
            },
        });
    }, []);

    useEffect(() => {
        setData(Array(itemCount).fill(undefined));
        loadedPages.current = {};
    }, [itemCount, listKey]);

    const columnOrder = useGenreListStore.use.columnOrder();
    const setColumnOrder = useGenreListStore.use.setColumnOrder();

    const { columns } = useItemTable<GenreItem>(columnOrder, setColumnOrder);

    return (
        <ItemTable<GenreItem, GenreTableItemContext>
            columnOrder={columnOrder}
            columns={columns}
            context={{ baseUrl, libraryId }}
            data={data}
            enableHeader={true}
            enableMultiRowSelection={true}
            itemCount={itemCount}
            itemType={LibraryItemType.GENRE}
            rowsKey={listKey}
            onChangeColumnOrder={setColumnOrder}
            onRangeChanged={throttledOnRangeChanged}
            onRowClick={onRowClick}
            onRowDrag={onRowDrag}
            onRowDragData={onRowDragData}
        />
    );
}