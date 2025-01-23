import { LibraryItemType } from '@repo/shared-types';
import type { GetApiLibraryIdTracksParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { ListTableServerItem } from '@/features/shared/list/list-table-server-item.tsx';
import { useTrackListStore } from '@/features/tracks/store/track-list-store.ts';
import type { InfiniteItemListProps } from '@/features/ui/item-list/helpers.ts';
import { useItemTable } from '@/features/ui/item-list/item-table/hooks/use-item-table.ts';
import { useMultiRowSelection } from '@/features/ui/item-list/item-table/hooks/use-table-row-selection.ts';
import { ItemTable } from '@/features/ui/item-list/item-table/item-table.tsx';
import { useInfiniteListData } from '@/hooks/use-list.ts';

interface InfiniteTrackTableProps extends InfiniteItemListProps<GetApiLibraryIdTracksParams> {}

export function InfiniteTrackTable({
    itemCount,
    libraryId,
    listKey,
    pagination,
    params,
}: InfiniteTrackTableProps) {
    const { data, handleRangeChanged } = useInfiniteListData({
        itemCount,
        libraryId,
        listKey,
        pagination,
        params,
        type: LibraryItemType.TRACK,
    });

    const { onRowClick } = useMultiRowSelection<string>();

    const columnOrder = useTrackListStore.use.columnOrder();
    const setColumnOrder = useTrackListStore.use.setColumnOrder();

    const { columns } = useItemTable<string>(columnOrder, setColumnOrder);

    return (
        <ItemTable<string>
            ItemComponent={ListTableServerItem}
            columnOrder={columnOrder}
            columns={columns}
            context={{ libraryId, listKey }}
            data={data}
            enableHeader={true}
            enableMultiRowSelection={true}
            enableRowSelection={true}
            itemCount={itemCount}
            itemType={LibraryItemType.TRACK}
            onChangeColumnOrder={setColumnOrder}
            onRangeChanged={handleRangeChanged}
            onRowClick={onRowClick}
        />
    );
}
