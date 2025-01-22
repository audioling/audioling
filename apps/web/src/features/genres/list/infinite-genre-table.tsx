import { LibraryItemType } from '@repo/shared-types';
import type { GetApiLibraryIdGenresParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { GenreTableServerItem } from '@/features/genres/list/genre-table-item.tsx';
import { useGenreListStore } from '@/features/genres/stores/genre-list-store.ts';
import type { InfiniteItemListProps } from '@/features/ui/item-list/helpers.ts';
import { useItemTable } from '@/features/ui/item-list/item-table/hooks/use-item-table.ts';
import { useMultiRowSelection } from '@/features/ui/item-list/item-table/hooks/use-table-row-selection.ts';
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

    const { onRowClick } = useMultiRowSelection<string>();

    const columnOrder = useGenreListStore.use.columnOrder();
    const setColumnOrder = useGenreListStore.use.setColumnOrder();

    const { columns } = useItemTable<string>(columnOrder, setColumnOrder);

    return (
        <ItemTable<string>
            ItemComponent={GenreTableServerItem}
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
            onRowClick={onRowClick}
        />
    );
}
