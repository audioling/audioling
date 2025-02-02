import { LibraryItemType } from '@repo/shared-types';
import type { GenreItem } from '@/api/api-types.ts';
import type { GetApiLibraryIdGenresParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { useGenreListStore } from '@/features/genres/stores/genre-list-store.ts';
import { ListTableServerItem } from '@/features/shared/list/list-table-server-item.tsx';
import type { InfiniteItemListProps } from '@/features/ui/item-list/helpers.ts';
import { useItemTable } from '@/features/ui/item-list/item-table/hooks/use-item-table.ts';
import { ItemTable } from '@/features/ui/item-list/item-table/item-table.tsx';
import { useInfiniteListData } from '@/hooks/use-list.ts';

interface InfiniteGenreTableProps extends InfiniteItemListProps<GetApiLibraryIdGenresParams> {}

export function InfiniteGenreTable(props: InfiniteGenreTableProps) {
    const { itemCount, libraryId, listKey, pagination, params } = props;

    const { data, handleRangeChanged } = useInfiniteListData({
        itemCount,
        libraryId,
        listKey,
        pagination,
        params,
        type: LibraryItemType.GENRE,
    });

    const columnOrder = useGenreListStore.use.columnOrder();
    const setColumnOrder = useGenreListStore.use.setColumnOrder();

    const { columns } = useItemTable(columnOrder);

    return (
        <ItemTable<string, GenreItem>
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
            itemCount={itemCount}
            itemType={LibraryItemType.GENRE}
            rowsKey={listKey}
            onChangeColumnOrder={setColumnOrder}
            onRangeChanged={handleRangeChanged}
        />
    );
}
