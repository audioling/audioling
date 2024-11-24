import { useCallback, useEffect, useRef, useState } from 'react';
import { LibraryItemType } from '@repo/shared-types';
import { useQueryClient } from '@tanstack/react-query';
import type { Row, Table } from '@tanstack/react-table';
import type { AlbumItem } from '@/api/api-types.ts';
import {
    getApiLibraryIdAlbums,
    getGetApiLibraryIdAlbumsQueryKey,
} from '@/api/openapi-generated/albums/albums.ts';
import type { GetApiLibraryIdAlbumsParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import {
    useAlbumListActions,
    useAlbumListState,
} from '@/features/albums/stores/album-list-store.ts';
import { PrefetchController } from '@/features/controllers/prefetch-controller.tsx';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { useItemTable } from '@/features/ui/item-list/item-table/hooks/use-item-table.ts';
import { useMultiRowSelection } from '@/features/ui/item-list/item-table/hooks/use-table-row-selection.ts';
import { ItemTable } from '@/features/ui/item-list/item-table/item-table.tsx';
import type { ItemListPaginationState } from '@/features/ui/item-list/types.ts';
import type { DragData } from '@/utils/drag-drop.ts';
import { dndUtils, DragOperation, DragTarget } from '@/utils/drag-drop.ts';
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

    const { onRowClick } = useMultiRowSelection<AlbumItem>();

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

    const throttledOnRangeChanged = throttle(onRangeChanged, 200);

    const onRowDragData = useCallback(
        (row: Row<AlbumItem>, table: Table<AlbumItem | undefined>): DragData => {
            const isSelfSelected = row.getIsSelected();

            if (isSelfSelected) {
                const selectedRowIds = table
                    .getSelectedRowModel()
                    .rows.map((row) => row.original?.id)
                    .filter((id): id is string => id !== undefined);

                return dndUtils.generateDragData({
                    id: selectedRowIds,
                    operation: [DragOperation.ADD],
                    type: DragTarget.ALBUM,
                });
            }

            return dndUtils.generateDragData({
                id: [row.original?.id],
                operation: [DragOperation.ADD],
                type: DragTarget.ALBUM,
            });
        },
        [],
    );

    const onRowDrag = useCallback((row: Row<AlbumItem>, table: Table<AlbumItem | undefined>) => {
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

    const { columnOrder } = useAlbumListState();
    const { setColumnOrder } = useAlbumListActions();

    const { columns } = useItemTable<AlbumItem>(columnOrder, setColumnOrder);

    return (
        <ItemTable<AlbumItem, AlbumTableItemContext>
            columnOrder={columnOrder}
            columns={columns}
            context={{ baseUrl, libraryId }}
            data={data}
            enableHeader={true}
            enableMultiRowSelection={true}
            itemCount={itemCount}
            itemType={LibraryItemType.ALBUM}
            onChangeColumnOrder={setColumnOrder}
            onRangeChanged={throttledOnRangeChanged}
            onRowClick={onRowClick}
            onRowDrag={onRowDrag}
            onRowDragData={onRowDragData}
        />
    );
}
