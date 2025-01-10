import { useCallback, useEffect, useState } from 'react';
import { LibraryItemType } from '@repo/shared-types';
import { useQueryClient } from '@tanstack/react-query';
import type { Row, Table } from '@tanstack/react-table';
import type { ArtistItem } from '@/api/api-types.ts';
import {
    getApiLibraryIdAlbumArtists,
    getGetApiLibraryIdAlbumArtistsQueryKey,
} from '@/api/openapi-generated/album-artists/album-artists.ts';
import type { GetApiLibraryIdAlbumArtistsParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import type { ArtistGridItemContext } from '@/features/artists/list/artist-grid-item.tsx';
import { useArtistListStore } from '@/features/artists/stores/artist-list-store.ts';
import { PrefetchController } from '@/features/controllers/prefetch-controller.tsx';
import { ListWrapper } from '@/features/shared/list-wrapper/list-wrapper.tsx';
import { useItemTable } from '@/features/ui/item-list/item-table/hooks/use-item-table.ts';
import { useMultiRowSelection } from '@/features/ui/item-list/item-table/hooks/use-table-row-selection.ts';
import { ItemTable } from '@/features/ui/item-list/item-table/item-table.tsx';
import type { ItemListPaginationState } from '@/features/ui/item-list/types.ts';
import { Pagination } from '@/features/ui/pagination/pagination.tsx';
import { Paper } from '@/features/ui/paper/paper.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { useListPagination } from '@/hooks/use-list.ts';
import type { DragData } from '@/utils/drag-drop.ts';
import { dndUtils, DragOperation, DragTarget } from '@/utils/drag-drop.ts';

interface PaginatedArtistTableProps {
    baseUrl: string;
    itemCount: number;
    libraryId: string;
    listKey: string;
    pagination: ItemListPaginationState;
    params: GetApiLibraryIdAlbumArtistsParams;
    setPagination: (pagination: ItemListPaginationState) => void;
}

export function PaginatedArtistTable(props: PaginatedArtistTableProps) {
    const { itemCount, pagination, setPagination } = props;
    const paginationProps = useListPagination({ pagination, setPagination });

    return (
        <Stack h="100%">
            <PaginatedArtistTableContent {...props} />
            <Paper>
                <Pagination
                    currentPage={pagination.currentPage}
                    itemCount={itemCount}
                    itemsPerPage={pagination.itemsPerPage}
                    justify="end"
                    variant="outline"
                    {...paginationProps}
                />
            </Paper>
        </Stack>
    );
}

function PaginatedArtistTableContent(props: PaginatedArtistTableProps) {
    const { baseUrl, libraryId, params, pagination } = props;
    const queryClient = useQueryClient();

    const [data, setData] = useState<(ArtistItem | undefined)[]>(
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
                queryFn: () => getApiLibraryIdAlbumArtists(libraryId, paramsWithPagination),
                queryKey: getGetApiLibraryIdAlbumArtistsQueryKey(libraryId, paramsWithPagination),
                staleTime: 30 * 1000,
            });

            setData(data.data);
        };

        fetchData();
    }, [pagination.currentPage, pagination.itemsPerPage, params, queryClient, libraryId]);

    const { onRowClick } = useMultiRowSelection<ArtistItem>();

    const onRowDragData = useCallback(
        (row: Row<ArtistItem>, table: Table<ArtistItem | undefined>): DragData => {
            const isSelfSelected = row.getIsSelected();

            if (isSelfSelected) {
                const selectedRowIds = table
                    .getSelectedRowModel()
                    .rows.map((row) => row.original?.id)
                    .filter((id): id is string => id !== undefined);

                return dndUtils.generateDragData({
                    id: selectedRowIds,
                    operation: [DragOperation.ADD],
                    type: DragTarget.ARTIST,
                });
            }

            return dndUtils.generateDragData({
                id: [row.original?.id],
                operation: [DragOperation.ADD],
                type: DragTarget.ARTIST,
            });
        },
        [],
    );

    const onRowDrag = useCallback((row: Row<ArtistItem>, table: Table<ArtistItem | undefined>) => {
        const isSelfSelected = row.getIsSelected();

        if (isSelfSelected) {
            const selectedRowIds = table
                .getSelectedRowModel()
                .rows.map((row) => row.original?.id)
                .filter((id): id is string => id !== undefined);

            return PrefetchController.call({
                cmd: {
                    tracksByAlbumArtistId: {
                        id: selectedRowIds,
                    },
                },
            });
        }

        return PrefetchController.call({
            cmd: {
                tracksByAlbumArtistId: {
                    id: [row.original.id],
                },
            },
        });
    }, []);

    const columnOrder = useArtistListStore.use.columnOrder();
    const setColumnOrder = useArtistListStore.use.setColumnOrder();
    const { columns } = useItemTable<ArtistItem>(columnOrder, setColumnOrder);

    return (
        <ListWrapper>
            <ItemTable<ArtistItem, ArtistGridItemContext>
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
