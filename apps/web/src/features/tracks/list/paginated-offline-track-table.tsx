import { LibraryItemType } from '@repo/shared-types';
import type { TrackItem } from '@/api/api-types.ts';
import { OfflineListTableServerItem } from '@/features/shared/list/list-table-server-item.tsx';
import { ListWrapper } from '@/features/shared/list-wrapper/list-wrapper.tsx';
import {
    useOfflineListCountSuspense,
    usePaginatedOfflineListData,
} from '@/features/shared/offline-filters/use-offline-list.ts';
import { useTrackListStore } from '@/features/tracks/store/track-list-store.ts';
import { useItemTable } from '@/features/ui/item-list/item-table/hooks/use-item-table.ts';
import { ItemTable } from '@/features/ui/item-list/item-table/item-table.tsx';
import type { ItemListPaginationState } from '@/features/ui/item-list/types.ts';
import { PaginationWithCount } from '@/features/ui/pagination/pagination.tsx';
import type { QueryFilter } from '@/features/ui/query-builder/query-builder.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { useListPagination } from '@/hooks/use-list.ts';

interface PaginatedOfflineTrackTableProps {
    libraryId: string;
    listKey: string;
    pagination: ItemListPaginationState;
    query: QueryFilter;
    setPagination: (pagination: ItemListPaginationState) => void;
}

export function PaginatedOfflineTrackTable(props: PaginatedOfflineTrackTableProps) {
    const { libraryId, listKey, pagination, query, setPagination } = props;
    const paginationProps = useListPagination({ pagination, setPagination });

    const { data: itemCount } = useOfflineListCountSuspense({
        filter: query,
        libraryId,
        type: LibraryItemType.TRACK,
    });

    return (
        <Stack h="100%">
            <ListWrapper listKey={listKey}>
                <PaginatedOfflineTrackTableContent {...props} />
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

function PaginatedOfflineTrackTableContent(props: PaginatedOfflineTrackTableProps) {
    const { libraryId, listKey, pagination, query } = props;

    const { data } = usePaginatedOfflineListData({
        libraryId,
        pagination,
        query,
        type: LibraryItemType.TRACK,
    });

    const columnOrder = useTrackListStore.use.columnOrder();
    const setColumnOrder = useTrackListStore.use.setColumnOrder();
    const { columns } = useItemTable(columnOrder);

    return (
        <ItemTable<string, TrackItem>
            ItemComponent={OfflineListTableServerItem}
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
