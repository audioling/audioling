import { useParams, useSearchParams } from 'react-router';
import { useGetApiLibraryIdGenresCountSuspense } from '@/api/openapi-generated/genres/genres.ts';
import { InfiniteGenreTable } from '@/features/genres/list/infinite-genre-table.tsx';
import { PaginatedGenreTable } from '@/features/genres/list/paginated-genre-table.tsx';
import { useGenreListStore } from '@/features/genres/stores/genre-list-store.ts';
import { ListWrapper } from '@/features/shared/list-wrapper/list-wrapper.tsx';
import { ItemListPaginationType } from '@/features/ui/item-list/types.ts';
import { useListKey } from '@/hooks/use-list.ts';

export function GenreListContent() {
    const { libraryId } = useParams() as { libraryId: string };
    const [searchParams] = useSearchParams();
    const sortBy = useGenreListStore.use.sortBy();
    const sortOrder = useGenreListStore.use.sortOrder();
    const { data: itemCount } = useGetApiLibraryIdGenresCountSuspense(libraryId, {
        searchTerm: searchParams.get('search') ?? undefined,
        sortBy,
        sortOrder,
    });

    return <ListComponent itemCount={itemCount} />;
}

function ListComponent({ itemCount }: { itemCount: number }) {
    const { libraryId } = useParams() as { libraryId: string };

    const listId = useGenreListStore.use.listId();
    const sortBy = useGenreListStore.use.sortBy();
    const sortOrder = useGenreListStore.use.sortOrder();
    const pagination = useGenreListStore.use.pagination();
    const displayType = useGenreListStore.use.displayType();
    const paginationType = useGenreListStore.use.paginationType();
    const setPagination = useGenreListStore.use.setPagination();

    const listKey = useListKey({
        displayType,
        listId,
        pagination,
        paginationType,
        sortBy,
        sortOrder,
    });

    switch (paginationType) {
        case ItemListPaginationType.PAGINATED:
            return (
                <PaginatedGenreTable
                    itemCount={itemCount}
                    libraryId={libraryId}
                    listKey={listKey}
                    pagination={pagination}
                    params={{ sortBy, sortOrder }}
                    setPagination={setPagination}
                />
            );
        case ItemListPaginationType.INFINITE:
            return (
                <ListWrapper listKey={listKey}>
                    <InfiniteGenreTable
                        itemCount={itemCount}
                        libraryId={libraryId}
                        listKey={listKey}
                        pagination={pagination}
                        params={{ sortBy, sortOrder }}
                    />
                </ListWrapper>
            );
    }
}
