import { useCallback, useEffect, useState } from 'react';
import { LibraryItemType } from '@repo/shared-types';
import { useQueryClient } from '@tanstack/react-query';
import type { Row, Table } from '@tanstack/react-table';
import type { TrackItem } from '@/api/api-types.ts';
import type { GetApiLibraryIdTracksParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import {
    getApiLibraryIdTracks,
    getGetApiLibraryIdTracksQueryKey,
} from '@/api/openapi-generated/tracks/tracks.ts';
import { PrefetchController } from '@/features/controllers/prefetch-controller.tsx';
import { ListWrapper } from '@/features/shared/list-wrapper/list-wrapper.tsx';
import type { TrackTableItemContext } from '@/features/tracks/list/infinite-track-table.tsx';
import {
    useTrackListActions,
    useTrackListState,
} from '@/features/tracks/store/track-list-store.ts';
import { useItemTable } from '@/features/ui/item-list/item-table/hooks/use-item-table.ts';
import { useMultiRowSelection } from '@/features/ui/item-list/item-table/hooks/use-table-row-selection.ts';
import { ItemTable } from '@/features/ui/item-list/item-table/item-table.tsx';
import type { ItemListPaginationState } from '@/features/ui/item-list/types.ts';
import { Pagination } from '@/features/ui/pagination/pagination.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { useListPagination } from '@/hooks/use-list.ts';
import type { DragData } from '@/utils/drag-drop.ts';
import { dndUtils, DragOperation, DragTarget } from '@/utils/drag-drop.ts';

interface PaginatedTrackTableProps {
    baseUrl: string;
    itemCount: number;
    libraryId: string;
    listKey: string;
    pagination: ItemListPaginationState;
    params: GetApiLibraryIdTracksParams;
    setPagination: (pagination: ItemListPaginationState) => void;
}

export function PaginatedTrackTable(props: PaginatedTrackTableProps) {
    const { itemCount, pagination, setPagination } = props;
    const paginationProps = useListPagination({ pagination, setPagination });

    return (
        <Stack h="100%">
            <PaginatedTrackTableContent {...props} />
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

function PaginatedTrackTableContent(props: PaginatedTrackTableProps) {
    const { baseUrl, libraryId, params, pagination } = props;
    const queryClient = useQueryClient();

    const [data, setData] = useState<(TrackItem | undefined)[]>(
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
                queryFn: () => getApiLibraryIdTracks(libraryId, paramsWithPagination),
                queryKey: getGetApiLibraryIdTracksQueryKey(libraryId, paramsWithPagination),
                staleTime: 30 * 1000,
            });

            setData(data.data);
        };

        fetchData();
    }, [pagination.currentPage, pagination.itemsPerPage, params, queryClient, libraryId]);

    const { onRowClick } = useMultiRowSelection<TrackItem>();

    const onRowDragData = useCallback(
        (row: Row<TrackItem>, table: Table<TrackItem | undefined>): DragData => {
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

    const onRowDrag = useCallback((row: Row<TrackItem>, table: Table<TrackItem | undefined>) => {
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

    const { columnOrder } = useTrackListState();
    const { setColumnOrder } = useTrackListActions();
    const { columns } = useItemTable<TrackItem>(columnOrder, setColumnOrder);

    return (
        <ListWrapper id="track-list-content">
            <ItemTable<TrackItem, TrackTableItemContext>
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
