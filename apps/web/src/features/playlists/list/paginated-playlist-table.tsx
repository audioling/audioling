import { LibraryItemType } from '@repo/shared-types';
import type { GetApiLibraryIdPlaylistsParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { PlaylistTableServerItem } from '@/features/playlists/list/playlist-table-item.tsx';
import { usePlaylistListStore } from '@/features/playlists/stores/playlist-list-store.ts';
import { ListWrapper } from '@/features/shared/list-wrapper/list-wrapper.tsx';
import type { PaginatedItemListProps } from '@/features/ui/item-list/helpers.ts';
import { useItemTable } from '@/features/ui/item-list/item-table/hooks/use-item-table.ts';
import { useMultiRowSelection } from '@/features/ui/item-list/item-table/hooks/use-table-row-selection.ts';
import { ItemTable } from '@/features/ui/item-list/item-table/item-table.tsx';
import { Pagination } from '@/features/ui/pagination/pagination.tsx';
import { Paper } from '@/features/ui/paper/paper.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { useListPagination, usePaginatedListData } from '@/hooks/use-list.ts';

interface PaginatedPlaylistTableProps
    extends PaginatedItemListProps<GetApiLibraryIdPlaylistsParams> {}

export function PaginatedPlaylistTable(props: PaginatedPlaylistTableProps) {
    const { itemCount, listKey, pagination, setPagination } = props;
    const paginationProps = useListPagination({ pagination, setPagination });

    return (
        <Stack h="100%">
            <ListWrapper listKey={listKey}>
                <PaginatedPlaylistTableContent {...props} />
            </ListWrapper>
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

function PaginatedPlaylistTableContent(props: PaginatedPlaylistTableProps) {
    const { libraryId, listKey, params, pagination } = props;

    const { data } = usePaginatedListData({
        libraryId,
        listKey,
        pagination,
        params,
        type: LibraryItemType.PLAYLIST,
    });

    const { onRowClick } = useMultiRowSelection<string>();

    const columnOrder = usePlaylistListStore().columnOrder;
    const setColumnOrder = usePlaylistListStore().setColumnOrder;
    const { columns } = useItemTable<string>(columnOrder, setColumnOrder);

    return (
        <ItemTable<string>
            ItemComponent={PlaylistTableServerItem}
            columnOrder={columnOrder}
            columns={columns}
            context={{
                libraryId,
                listKey,
                startIndex: (pagination.currentPage - 1) * pagination.itemsPerPage,
            }}
            data={data}
            enableHeader={true}
            enableMultiRowSelection={true}
            itemCount={data.length || pagination.itemsPerPage}
            itemType={LibraryItemType.PLAYLIST}
            rowsKey={props.listKey}
            onChangeColumnOrder={setColumnOrder}
            onRowClick={onRowClick}
        />
    );
}
