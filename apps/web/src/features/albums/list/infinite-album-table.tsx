import { LibraryItemType } from '@repo/shared-types';
import type { AlbumItem } from '@/api/api-types.ts';
import type { GetApiLibraryIdAlbumsParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { useAlbumListStore } from '@/features/albums/stores/album-list-store.ts';
import { ListTableServerItem } from '@/features/shared/list/list-table-server-item.tsx';
import { type InfiniteItemListProps } from '@/features/ui/item-list/helpers.ts';
import { useItemTable } from '@/features/ui/item-list/item-table/hooks/use-item-table.ts';
import { ItemTable } from '@/features/ui/item-list/item-table/item-table.tsx';
import { useInfiniteListData } from '@/hooks/use-list.ts';

interface InfiniteAlbumTableProps extends InfiniteItemListProps<GetApiLibraryIdAlbumsParams> {}

export function InfiniteAlbumTable(props: InfiniteAlbumTableProps) {
    const { itemCount, libraryId, listKey, params, pagination } = props;

    const { data, handleRangeChanged } = useInfiniteListData({
        itemCount,
        libraryId,
        pagination,
        params,
        type: LibraryItemType.ALBUM,
    });

    const columnOrder = useAlbumListStore.use.columnOrder();
    const setColumnOrder = useAlbumListStore.use.setColumnOrder();

    const { columns } = useItemTable(columnOrder);

    return (
        <ItemTable<string, AlbumItem>
            ItemComponent={ListTableServerItem}
            columnOrder={columnOrder}
            columns={columns}
            context={{ libraryId, listKey }}
            data={data}
            enableHeader={true}
            enableMultiRowSelection={true}
            itemCount={itemCount}
            itemType={LibraryItemType.ALBUM}
            rowsKey={listKey}
            onChangeColumnOrder={setColumnOrder}
            onRangeChanged={handleRangeChanged}
        />
    );
}
