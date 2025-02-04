import { LibraryItemType } from '@repo/shared-types';
import type { AlbumArtistItem } from '@/api/api-types.ts';
import type { GetApiLibraryIdAlbumArtistsParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { useArtistListStore } from '@/features/artists/stores/artist-list-store.ts';
import { ListTableServerItem } from '@/features/shared/list/list-table-server-item.tsx';
import { ListWrapper } from '@/features/shared/list-wrapper/list-wrapper.tsx';
import type { PaginatedItemListProps } from '@/features/ui/item-list/helpers.ts';
import { useItemTable } from '@/features/ui/item-list/item-table/hooks/use-item-table.ts';
import { ItemTable } from '@/features/ui/item-list/item-table/item-table.tsx';
import { PaginationWithCount } from '@/features/ui/pagination/pagination.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { useListPagination, usePaginatedListData } from '@/hooks/use-list.ts';

interface PaginatedArtistTableProps
    extends PaginatedItemListProps<GetApiLibraryIdAlbumArtistsParams> {}

export function PaginatedArtistTable(props: PaginatedArtistTableProps) {
    const { itemCount, listKey, pagination, setPagination } = props;
    const paginationProps = useListPagination({ pagination, setPagination });

    return (
        <Stack h="100%">
            <ListWrapper listKey={listKey}>
                <PaginatedArtistTableContent {...props} />
            </ListWrapper>
            <PaginationWithCount
                currentPage={pagination.currentPage}
                itemCount={itemCount}
                itemsPerPage={pagination.itemsPerPage}
                justify="end"
                onItemsPerPageChange={(e) => {
                    setPagination({
                        ...pagination,
                        itemsPerPage: parseInt(e),
                    });
                }}
                {...paginationProps}
            />
        </Stack>
    );
}

function PaginatedArtistTableContent(props: PaginatedArtistTableProps) {
    const { libraryId, listKey, params, pagination } = props;

    const { data } = usePaginatedListData({
        libraryId,
        pagination,
        params,
        type: LibraryItemType.ALBUM_ARTIST,
    });

    const columnOrder = useArtistListStore.use.columnOrder();
    const setColumnOrder = useArtistListStore.use.setColumnOrder();
    const { columns } = useItemTable(columnOrder);

    return (
        <ItemTable<string, AlbumArtistItem>
            ItemComponent={ListTableServerItem}
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
            itemType={LibraryItemType.ALBUM_ARTIST}
            rowsKey={listKey}
            onChangeColumnOrder={setColumnOrder}
        />
    );
}
