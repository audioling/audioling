import { Suspense, useCallback, useEffect, useState } from 'react';
import { LibraryItemType } from '@repo/shared-types';
import type { Row, Table } from '@tanstack/react-table';
import type { AlbumItem } from '@/api/api-types.ts';
import { useGetApiLibraryIdAlbumsSuspense } from '@/api/openapi-generated/albums/albums.ts';
import type { GetApiLibraryIdAlbumsParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import type { AlbumGridItemContext } from '@/features/albums/list/album-grid-item.tsx';
import {
    useAlbumListActions,
    useAlbumListState,
} from '@/features/albums/stores/album-list-store.ts';
import { PrefetchController } from '@/features/controllers/prefetch-controller.tsx';
import { ListWrapper } from '@/features/shared/list-wrapper/list-wrapper.tsx';
import { useItemTable } from '@/features/ui/item-list/item-table/hooks/use-item-table.ts';
import { useMultiRowSelection } from '@/features/ui/item-list/item-table/hooks/use-table-row-selection.ts';
import { ItemTable } from '@/features/ui/item-list/item-table/item-table.tsx';
import type { ItemListPaginationState } from '@/features/ui/item-list/types.ts';
import { Pagination } from '@/features/ui/pagination/pagination.tsx';
import { EmptyPlaceholder } from '@/features/ui/placeholders/empty-placeholder.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { useListPagination } from '@/hooks/use-list.ts';
import type { DragData } from '@/utils/drag-drop.ts';
import { dndUtils, DragOperation, DragTarget } from '@/utils/drag-drop.ts';

interface PaginatedAlbumTableProps {
    baseUrl: string;
    itemCount: number;
    libraryId: string;
    listKey: string;
    pagination: ItemListPaginationState;
    params: GetApiLibraryIdAlbumsParams;
    setPagination: (pagination: ItemListPaginationState) => void;
}

export function PaginatedAlbumTable(props: PaginatedAlbumTableProps) {
    const { itemCount, pagination, setPagination } = props;
    const paginationProps = useListPagination({ pagination, setPagination });

    return (
        <Stack h="100%">
            <Suspense fallback={<EmptyPlaceholder />}>
                <PaginatedAlbumTableContent {...props} />
            </Suspense>
            <Pagination
                currentPage={pagination.currentPage}
                itemCount={itemCount}
                itemsPerPage={pagination.itemsPerPage}
                justify="end"
                {...paginationProps}
            />
        </Stack>
    );
}

function PaginatedAlbumTableContent(props: PaginatedAlbumTableProps) {
    const { baseUrl, libraryId, params, pagination } = props;

    const { data: fetchedData } = useGetApiLibraryIdAlbumsSuspense(libraryId, {
        ...params,
        limit: pagination.itemsPerPage.toString(),
        offset: ((pagination.currentPage - 1) * pagination.itemsPerPage).toString(),
    });

    const [data, setData] = useState<Map<number, AlbumItem>>(new Map());

    useEffect(() => {
        const newData = new Map(fetchedData.data.map((album, index) => [index, album]));
        setData(newData);
    }, [fetchedData.data]);

    const { onRowClick } = useMultiRowSelection<AlbumItem>();

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
        <ListWrapper id="album-list-content" listKey={props.listKey}>
            <ItemTable<AlbumItem, AlbumGridItemContext>
                columnOrder={columnOrder}
                columns={columns}
                context={{ baseUrl, libraryId }}
                data={data}
                enableHeader={true}
                enableMultiRowSelection={true}
                itemCount={fetchedData.data.length || pagination.itemsPerPage}
                itemType={LibraryItemType.ALBUM}
                onChangeColumnOrder={setColumnOrder}
                onRowClick={onRowClick}
                onRowDrag={onRowDrag}
                onRowDragData={onRowDragData}
            />
        </ListWrapper>
    );
}
