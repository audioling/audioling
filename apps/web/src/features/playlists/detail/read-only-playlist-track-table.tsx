import { useMemo } from 'react';
import { LibraryItemType } from '@repo/shared-types';
import type { PlaylistItem, PlaylistTrackItem } from '@/api/api-types.ts';
import type { GetApiLibraryIdTracksParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { ListTableServerItem } from '@/features/shared/list/list-table-server-item.tsx';
import { useTrackListStore } from '@/features/tracks/store/track-list-store.ts';
import type { InfiniteItemListProps } from '@/features/ui/item-list/helpers.ts';
import { useItemTable } from '@/features/ui/item-list/item-table/hooks/use-item-table.ts';
import { ItemTable } from '@/features/ui/item-list/item-table/item-table.tsx';
import { useInfiniteListData } from '@/hooks/use-list.ts';

interface ReadOnlyPlaylistTrackTableProps
    extends InfiniteItemListProps<GetApiLibraryIdTracksParams> {
    HeaderComponent?: React.ComponentType<{ playlist: PlaylistItem }>;
    playlistId: string;
}

export function ReadOnlyPlaylistTrackTable({
    HeaderComponent,
    itemCount,
    libraryId,
    listKey,
    pagination,
    params,
    playlistId,
}: ReadOnlyPlaylistTrackTableProps) {
    const { data, handleRangeChanged } = useInfiniteListData({
        itemCount,
        libraryId,
        pagination,
        params,
        pathParams: {
            id: playlistId,
        },
        type: LibraryItemType.PLAYLIST_TRACK,
    });

    const dataWithHeader = useMemo(() => {
        return [undefined, ...data];
    }, [data]);

    const columnOrder = useTrackListStore.use.columnOrder();
    const setColumnOrder = useTrackListStore.use.setColumnOrder();

    const { columns } = useItemTable(columnOrder);

    return (
        <ItemTable<string, PlaylistTrackItem>
            HeaderComponent={HeaderComponent}
            ItemComponent={ListTableServerItem}
            columnOrder={columnOrder}
            columns={columns}
            context={{ libraryId, listKey, startIndex: -1 }}
            data={dataWithHeader}
            enableHeader={false}
            enableMultiRowSelection={true}
            enableStickyHeader={true}
            itemCount={itemCount}
            itemType={LibraryItemType.PLAYLIST_TRACK}
            onChangeColumnOrder={setColumnOrder}
            onRangeChanged={handleRangeChanged}
        />
    );
}
