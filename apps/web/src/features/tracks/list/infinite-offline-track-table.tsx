import { LibraryItemType } from '@repo/shared-types';
import type { TrackItem } from '@/api/api-types.ts';
import { OfflineListTableServerItem } from '@/features/shared/list/list-table-server-item.tsx';
import {
    useInfiniteOfflineListData,
    useOfflineListCountSuspense,
} from '@/features/shared/offline-filters/use-offline-list.ts';
import { useTrackListStore } from '@/features/tracks/store/track-list-store.ts';
import { Center } from '@/features/ui/center/center.tsx';
import { useItemTable } from '@/features/ui/item-list/item-table/hooks/use-item-table.ts';
import { ItemTable } from '@/features/ui/item-list/item-table/item-table.tsx';
import type { ItemListPaginationState } from '@/features/ui/item-list/types.ts';
import type { QueryFilter } from '@/features/ui/query-builder/query-builder.tsx';
import { Text } from '@/features/ui/text/text.tsx';

interface InfiniteOfflineTrackTableProps {
    libraryId: string;
    listKey: string;
    pagination: ItemListPaginationState;
    query: QueryFilter;
}

export function InfiniteOfflineTrackTable({
    libraryId,
    listKey,
    pagination,
    query,
}: InfiniteOfflineTrackTableProps) {
    const { data: itemCount } = useOfflineListCountSuspense({
        filter: query,
        libraryId,
        type: LibraryItemType.TRACK,
    });

    const { data, handleRangeChanged } = useInfiniteOfflineListData({
        filter: query,
        itemCount: itemCount,
        libraryId,
        pagination,
        type: LibraryItemType.TRACK,
    });

    const columnOrder = useTrackListStore.use.columnOrder();
    const setColumnOrder = useTrackListStore.use.setColumnOrder();

    const { columns } = useItemTable(columnOrder);

    if (itemCount === undefined) {
        return (
            <Center>
                <Text>Query not available</Text>
            </Center>
        );
    }

    if (itemCount === 0) {
        return (
            <Center>
                <Text>No tracks found</Text>
            </Center>
        );
    }

    return (
        <ItemTable<string, TrackItem>
            ItemComponent={OfflineListTableServerItem}
            columnOrder={columnOrder}
            columns={columns}
            context={{ libraryId, listKey }}
            data={data}
            enableHeader={true}
            enableMultiRowSelection={true}
            itemCount={itemCount}
            itemType={LibraryItemType.TRACK}
            rowsKey={listKey}
            onChangeColumnOrder={setColumnOrder}
            onRangeChanged={handleRangeChanged}
        />
    );
}
