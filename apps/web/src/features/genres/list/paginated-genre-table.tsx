import { useCallback, useEffect, useState } from 'react';
import { LibraryItemType } from '@repo/shared-types';
import { useQueryClient } from '@tanstack/react-query';
import type { Row, Table } from '@tanstack/react-table';
import type { GenreItem } from '@/api/api-types.ts';
import type { GetApiLibraryIdGenresParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import {
    getApiLibraryIdGenres,
    getGetApiLibraryIdGenresQueryKey,
} from '@/api/openapi-generated/genres/genres.ts';
import type { AlbumGridItemContext } from '@/features/albums/list/album-grid-item.tsx';
import { PrefetchController } from '@/features/controllers/prefetch-controller.tsx';
import { useGenreListStore } from '@/features/genres/stores/genre-list-store.ts';
import { ListWrapper } from '@/features/shared/list-wrapper/list-wrapper.tsx';
import { useItemTable } from '@/features/ui/item-list/item-table/hooks/use-item-table.ts';
import { useMultiRowSelection } from '@/features/ui/item-list/item-table/hooks/use-table-row-selection.ts';
import { ItemTable } from '@/features/ui/item-list/item-table/item-table.tsx';
import type { ItemListPaginationState } from '@/features/ui/item-list/types.ts';
import { Pagination } from '@/features/ui/pagination/pagination.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { useListPagination } from '@/hooks/use-list.ts';
import type { DragData } from '@/utils/drag-drop.ts';
import { dndUtils, DragOperation, DragTarget } from '@/utils/drag-drop.ts';

interface PaginatedGenreTableProps {
    baseUrl: string;
    itemCount: number;
    libraryId: string;
    listKey: string;
    pagination: ItemListPaginationState;
    params: GetApiLibraryIdGenresParams;
    setPagination: (pagination: ItemListPaginationState) => void;
}

export function PaginatedGenreTable(props: PaginatedGenreTableProps) {
    const { itemCount, pagination, setPagination } = props;
    const paginationProps = useListPagination({ pagination, setPagination });

    return (
        <Stack h="100%">
            <PaginatedGenreTableContent {...props} />
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

function PaginatedGenreTableContent(props: PaginatedGenreTableProps) {
    const { baseUrl, libraryId, params, pagination } = props;
    const queryClient = useQueryClient();

    const [data, setData] = useState<(GenreItem | undefined)[]>(
        Array(pagination.itemsPerPage).fill(undefined),
    );

    useEffect(() => {
        const fetchData = async () => {
            const paramsWithPagination = {
                ...params,
                limit: pagination.itemsPerPage.toString(),
                offset: ((pagination.currentPage - 1) * pagination.itemsPerPage).toString(),
            };

            const data = await queryClient.fetchQuery({
                queryFn: () => getApiLibraryIdGenres(libraryId, paramsWithPagination),
                queryKey: getGetApiLibraryIdGenresQueryKey(libraryId, paramsWithPagination),
                staleTime: 30 * 1000,
            });

            setData(data.data);
        };

        fetchData();
    }, [pagination.currentPage, pagination.itemsPerPage, params, queryClient, libraryId]);

    const { onRowClick } = useMultiRowSelection<GenreItem>();

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

    const columnOrder = useGenreListStore.use.columnOrder();
    const setColumnOrder = useGenreListStore.use.setColumnOrder();
    const { columns } = useItemTable<GenreItem>(columnOrder, setColumnOrder);

    return (
        <ListWrapper id="genre-list-content">
            <ItemTable<GenreItem, AlbumGridItemContext>
                columnOrder={columnOrder}
                columns={columns}
                context={{ baseUrl, libraryId }}
                data={data}
                enableHeader={true}
                enableMultiRowSelection={true}
                itemCount={data.length || pagination.itemsPerPage}
                itemType={LibraryItemType.ALBUM}
                rowsKey={props.listKey}
                onChangeColumnOrder={setColumnOrder}
                onRowClick={onRowClick}
                onRowDrag={onRowDrag}
                onRowDragData={onRowDragData}
            />
        </ListWrapper>
    );
}
