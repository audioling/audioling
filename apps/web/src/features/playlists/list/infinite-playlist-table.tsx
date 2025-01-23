import { LibraryItemType } from '@repo/shared-types';
import type { GetApiLibraryIdPlaylistsParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { usePlaylistListStore } from '@/features/playlists/stores/playlist-list-store.ts';
import { ListTableServerItem } from '@/features/shared/list/list-table-server-item.tsx';
import { ListWrapper } from '@/features/shared/list-wrapper/list-wrapper.tsx';
import type { InfiniteItemListProps } from '@/features/ui/item-list/helpers.ts';
import { useItemTable } from '@/features/ui/item-list/item-table/hooks/use-item-table.ts';
import { useMultiRowSelection } from '@/features/ui/item-list/item-table/hooks/use-table-row-selection.ts';
import { ItemTable } from '@/features/ui/item-list/item-table/item-table.tsx';
import { useInfiniteListData } from '@/hooks/use-list.ts';

interface InfinitePlaylistTableProps
    extends InfiniteItemListProps<GetApiLibraryIdPlaylistsParams> {}

export function InfinitePlaylistTable({
    itemCount,
    libraryId,
    listKey,
    params,
    pagination,
}: InfinitePlaylistTableProps) {
    const { data, handleRangeChanged } = useInfiniteListData({
        itemCount,
        libraryId,
        listKey,
        pagination,
        params,
        type: LibraryItemType.PLAYLIST,
    });

    const { onRowClick } = useMultiRowSelection<string>();

    const columnOrder = usePlaylistListStore.use.columnOrder();
    const setColumnOrder = usePlaylistListStore.use.setColumnOrder();

    const { columns } = useItemTable<string>(columnOrder, setColumnOrder);

    return (
        <ListWrapper>
            <ItemTable<string>
                ItemComponent={ListTableServerItem}
                columnOrder={columnOrder}
                columns={columns}
                context={{ libraryId, listKey }}
                data={data}
                enableHeader={true}
                enableMultiRowSelection={true}
                itemCount={itemCount}
                itemType={LibraryItemType.PLAYLIST}
                rowsKey={listKey}
                onChangeColumnOrder={setColumnOrder}
                onRangeChanged={handleRangeChanged}
                onRowClick={onRowClick}
            />
        </ListWrapper>
    );
}
