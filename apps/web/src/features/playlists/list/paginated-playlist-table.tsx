import { useCallback, useEffect, useState } from 'react';
import { LibraryItemType } from '@repo/shared-types';
import { useQueryClient } from '@tanstack/react-query';
import type { Row, Table } from '@tanstack/react-table';
import type { PlaylistItem } from '@/api/api-types.ts';
import type { GetApiLibraryIdPlaylistsParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import {
    getApiLibraryIdPlaylists,
    getGetApiLibraryIdPlaylistsQueryKey,
} from '@/api/openapi-generated/playlists/playlists.ts';
import { PrefetchController } from '@/features/controllers/prefetch-controller.tsx';
import type { PlaylistTableItemContext } from '@/features/playlists/list/infinite-playlist-table.tsx';
import { usePlaylistListStore } from '@/features/playlists/stores/playlist-list-store.ts';
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

interface PaginatedPlaylistTableProps {
    baseUrl: string;
    itemCount: number;
    libraryId: string;
    listKey: string;
    pagination: ItemListPaginationState;
    params: GetApiLibraryIdPlaylistsParams;
    setPagination: (pagination: ItemListPaginationState) => void;
}

export function PaginatedPlaylistTable(props: PaginatedPlaylistTableProps) {
    const { itemCount, pagination, setPagination } = props;
    const paginationProps = useListPagination({ pagination, setPagination });

    return (
        <Stack h="100%">
            <PaginatedPlaylistTableContent {...props} />
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

function PaginatedPlaylistTableContent(props: PaginatedPlaylistTableProps) {
    const { baseUrl, libraryId, params, pagination } = props;
    const queryClient = useQueryClient();

    const [data, setData] = useState<(PlaylistItem | undefined)[]>(
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
                queryFn: () => getApiLibraryIdPlaylists(libraryId, paramsWithPagination),
                queryKey: getGetApiLibraryIdPlaylistsQueryKey(libraryId, paramsWithPagination),
                staleTime: 30 * 1000,
            });

            setData(data.data);
        };

        fetchData();
    }, [pagination.currentPage, pagination.itemsPerPage, params, queryClient, libraryId]);

    const { onRowClick } = useMultiRowSelection<PlaylistItem>();

    const onRowDragData = useCallback(
        (row: Row<PlaylistItem>, table: Table<PlaylistItem | undefined>): DragData => {
            const isSelfSelected = row.getIsSelected();

            if (isSelfSelected) {
                const selectedRowIds = table
                    .getSelectedRowModel()
                    .rows.map((row) => row.original?.id)
                    .filter((id): id is string => id !== undefined);

                return dndUtils.generateDragData({
                    id: selectedRowIds,
                    operation: [DragOperation.ADD],
                    type: DragTarget.PLAYLIST,
                });
            }

            return dndUtils.generateDragData({
                id: [row.original?.id],
                operation: [DragOperation.ADD],
                type: DragTarget.PLAYLIST,
            });
        },
        [],
    );

    const onRowDrag = useCallback(
        (row: Row<PlaylistItem>, table: Table<PlaylistItem | undefined>) => {
            const isSelfSelected = row.getIsSelected();

            if (isSelfSelected) {
                const selectedRowIds = table
                    .getSelectedRowModel()
                    .rows.map((row) => row.original?.id)
                    .filter((id): id is string => id !== undefined);

                return PrefetchController.call({
                    cmd: {
                        tracksByPlaylistId: {
                            id: selectedRowIds,
                        },
                    },
                });
            }

            return PrefetchController.call({
                cmd: {
                    tracksByPlaylistId: {
                        id: [row.original.id],
                    },
                },
            });
        },
        [],
    );

    const columnOrder = usePlaylistListStore().columnOrder;
    const setColumnOrder = usePlaylistListStore().setColumnOrder;
    const { columns } = useItemTable<PlaylistItem>(columnOrder, setColumnOrder);

    return (
        <ListWrapper>
            <ItemTable<PlaylistItem, PlaylistTableItemContext>
                columnOrder={columnOrder}
                columns={columns}
                context={{ baseUrl, libraryId }}
                data={data}
                enableHeader={true}
                enableMultiRowSelection={true}
                itemCount={data.length || pagination.itemsPerPage}
                itemType={LibraryItemType.PLAYLIST}
                rowsKey={props.listKey}
                onChangeColumnOrder={setColumnOrder}
                onRowClick={onRowClick}
                onRowDrag={onRowDrag}
                onRowDragData={onRowDragData}
            />
        </ListWrapper>
    );
}
