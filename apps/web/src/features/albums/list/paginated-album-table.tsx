import { LibraryItemType } from '@repo/shared-types';
import type { GetApiLibraryIdAlbumsParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { AlbumTableServerItem } from '@/features/albums/list/album-table-item.tsx';
import { useAlbumListStore } from '@/features/albums/stores/album-list-store.ts';
import { ListWrapper } from '@/features/shared/list-wrapper/list-wrapper.tsx';
import type { PaginatedItemListProps } from '@/features/ui/item-list/helpers.ts';
import { useItemTable } from '@/features/ui/item-list/item-table/hooks/use-item-table.ts';
import { useMultiRowSelection } from '@/features/ui/item-list/item-table/hooks/use-table-row-selection.ts';
import { ItemTable } from '@/features/ui/item-list/item-table/item-table.tsx';
import { Pagination } from '@/features/ui/pagination/pagination.tsx';
import { Paper } from '@/features/ui/paper/paper.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { useListPagination, usePaginatedListData } from '@/hooks/use-list.ts';

interface PaginatedAlbumTableProps extends PaginatedItemListProps<GetApiLibraryIdAlbumsParams> {}

export function PaginatedAlbumTable(props: PaginatedAlbumTableProps) {
    const { itemCount, pagination, setPagination } = props;
    const paginationProps = useListPagination({ pagination, setPagination });

    return (
        <Stack h="100%">
            <PaginatedAlbumTableContent {...props} />
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

function PaginatedAlbumTableContent(props: PaginatedAlbumTableProps) {
    const { libraryId, listKey, params, pagination } = props;

    const { data } = usePaginatedListData({
        libraryId,
        listKey,
        pagination,
        params,
        type: LibraryItemType.ALBUM,
    });

    const { onRowClick } = useMultiRowSelection<string>();

    const columnOrder = useAlbumListStore.use.columnOrder();
    const setColumnOrder = useAlbumListStore.use.setColumnOrder();
    const { columns } = useItemTable<string>(columnOrder, setColumnOrder);

    return (
        <ListWrapper listKey={listKey}>
            <ItemTable<string>
                ItemComponent={AlbumTableServerItem}
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
                itemType={LibraryItemType.ALBUM}
                rowsKey={props.listKey}
                onChangeColumnOrder={setColumnOrder}
                onRowClick={onRowClick}
            />
        </ListWrapper>
    );
}
