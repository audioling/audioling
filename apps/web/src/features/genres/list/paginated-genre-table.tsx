import { LibraryItemType } from '@repo/shared-types';
import type { GenreItem } from '@/api/api-types.ts';
import type { GetApiLibraryIdGenresParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { useGenreListStore } from '@/features/genres/stores/genre-list-store.ts';
import { ListTableServerItem } from '@/features/shared/list/list-table-server-item.tsx';
import { ListWrapper } from '@/features/shared/list-wrapper/list-wrapper.tsx';
import type { PaginatedItemListProps } from '@/features/ui/item-list/helpers.ts';
import { useItemTable } from '@/features/ui/item-list/item-table/hooks/use-item-table.ts';
import { ItemTable } from '@/features/ui/item-list/item-table/item-table.tsx';
import { Pagination } from '@/features/ui/pagination/pagination.tsx';
import { Paper } from '@/features/ui/paper/paper.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { useListPagination, usePaginatedListData } from '@/hooks/use-list.ts';

interface PaginatedGenreTableProps extends PaginatedItemListProps<GetApiLibraryIdGenresParams> {}

export function PaginatedGenreTable(props: PaginatedGenreTableProps) {
    const { itemCount, listKey, pagination, setPagination } = props;
    const paginationProps = useListPagination({ pagination, setPagination });

    return (
        <Stack h="100%">
            <ListWrapper listKey={listKey}>
                <PaginatedGenreTableContent {...props} />
            </ListWrapper>
            <Paper>
                <Pagination
                    currentPage={pagination.currentPage}
                    itemCount={itemCount}
                    itemsPerPage={pagination.itemsPerPage}
                    justify="end"
                    variant="outline"
                    {...paginationProps}
                />
            </Paper>
        </Stack>
    );
}

function PaginatedGenreTableContent(props: PaginatedGenreTableProps) {
    const { libraryId, listKey, pagination, params } = props;

    const { data } = usePaginatedListData({
        libraryId,
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
            context={{ libraryId, listKey }}
            data={data}
            enableHeader={true}
            enableMultiRowSelection={true}
            itemCount={data.length || pagination.itemsPerPage}
            itemType={LibraryItemType.GENRE}
            rowsKey={props.listKey}
            onChangeColumnOrder={setColumnOrder}
        />
    );
}
