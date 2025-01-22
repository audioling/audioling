import { useMemo } from 'react';
import { LibraryItemType } from '@repo/shared-types';
import type { GetApiLibraryIdTracksParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { TrackTableServerItem } from '@/features/tracks/list/track-table-item.tsx';
import { useTrackListStore } from '@/features/tracks/store/track-list-store.ts';
import { useItemTable } from '@/features/ui/item-list/item-table/hooks/use-item-table.ts';
import { useMultiRowSelection } from '@/features/ui/item-list/item-table/hooks/use-table-row-selection.ts';
import { ItemTable } from '@/features/ui/item-list/item-table/item-table.tsx';
import type { ItemListPaginationState } from '@/features/ui/item-list/types.ts';
import { useInfiniteListData } from '@/hooks/use-list.ts';

export type TrackTableItemContext = {
    baseUrl: string;
    libraryId: string;
};

interface InfiniteTrackTableProps {
    baseUrl: string;
    itemCount: number;
    libraryId: string;
    listKey: string;
    pagination: ItemListPaginationState;
    params: GetApiLibraryIdTracksParams;
}

export function InfiniteTrackTable({
    baseUrl,
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

    const tableContext = useMemo(
        () => ({ baseUrl, libraryId, listKey }),
        [baseUrl, libraryId, listKey],
    );

    return (
        <ItemTable<string>
            ItemComponent={TrackTableServerItem}
            columnOrder={columnOrder}
            columns={columns}
            context={tableContext}
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
