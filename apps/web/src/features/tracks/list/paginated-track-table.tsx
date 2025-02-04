import { LibraryItemType } from '@repo/shared-types';
import type { TrackItem } from '@/api/api-types.ts';
import type { GetApiLibraryIdTracksParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { ListTableServerItem } from '@/features/shared/list/list-table-server-item.tsx';
import { ListWrapper } from '@/features/shared/list-wrapper/list-wrapper.tsx';
import { useTrackListStore } from '@/features/tracks/store/track-list-store.ts';
import type { PaginatedItemListProps } from '@/features/ui/item-list/helpers.ts';
import { useItemTable } from '@/features/ui/item-list/item-table/hooks/use-item-table.ts';
import { ItemTable } from '@/features/ui/item-list/item-table/item-table.tsx';
import { PaginationWithCount } from '@/features/ui/pagination/pagination.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { useListPagination, usePaginatedListData } from '@/hooks/use-list.ts';

interface PaginatedTrackTableProps extends PaginatedItemListProps<GetApiLibraryIdTracksParams> {}

export function PaginatedTrackTable(props: PaginatedTrackTableProps) {
    const { itemCount, listKey, pagination, setPagination } = props;
    const paginationProps = useListPagination({ pagination, setPagination });

    return (
        <Stack h="100%">
            <ListWrapper listKey={listKey}>
                <PaginatedTrackTableContent {...props} />
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

function PaginatedTrackTableContent(props: PaginatedTrackTableProps) {
    const { libraryId, listKey, params, pagination } = props;

    const { data } = usePaginatedListData({
        libraryId,
        pagination,
        params,
        type: LibraryItemType.TRACK,
    });

    const columnOrder = useTrackListStore.use.columnOrder();
    const setColumnOrder = useTrackListStore.use.setColumnOrder();
    const { columns } = useItemTable(columnOrder);

    return (
        <ItemTable<string, TrackItem>
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
            itemType={LibraryItemType.TRACK}
            rowsKey={listKey}
            onChangeColumnOrder={setColumnOrder}
        />
    );
}
