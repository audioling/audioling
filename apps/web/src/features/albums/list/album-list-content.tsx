import { useParams, useSearchParams } from 'react-router-dom';
import { useGetApiLibraryIdAlbumsCountSuspense } from '@/api/openapi-generated/albums/albums.ts';
import { InfiniteAlbumGrid } from '@/features/albums/list/infinite-album-grid.tsx';
import { InfiniteAlbumTable } from '@/features/albums/list/infinite-album-table.tsx';
import { PaginatedAlbumGrid } from '@/features/albums/list/paginated-album-grid.tsx';
import { PaginatedAlbumTable } from '@/features/albums/list/paginated-album-table.tsx';
import {
    useAlbumListActions,
    useAlbumListState,
} from '@/features/albums/stores/album-list-store.ts';
import { useAuthBaseUrl } from '@/features/authentication/stores/auth-store.ts';
import { ItemListDisplayType, ItemListPaginationType } from '@/features/ui/item-list/types.ts';
import { useListKey } from '@/hooks/use-list.ts';

export function AlbumListContent() {
    const { libraryId } = useParams() as { libraryId: string };
    const [searchParams] = useSearchParams();
    const { sortBy, sortOrder } = useAlbumListState();
    const { data: itemCount } = useGetApiLibraryIdAlbumsCountSuspense(libraryId, {
        searchTerm: searchParams.get('search') ?? undefined,
        sortBy,
        sortOrder,
    });

    return <ListComponent itemCount={itemCount} />;
}

function ListComponent({ itemCount }: { itemCount: number }) {
    const { libraryId } = useParams() as { libraryId: string };
    const [searchParams] = useSearchParams();
    const { listId, sortBy, sortOrder, pagination, displayType, paginationType } =
        useAlbumListState();
    const { setPagination } = useAlbumListActions();
    const baseUrl = useAuthBaseUrl();

    const listKey = useListKey({
        displayType,
        listId,
        pagination,
        paginationType,
        sortBy,
        sortOrder,
    });

    if (displayType === ItemListDisplayType.GRID) {
        switch (paginationType) {
            case ItemListPaginationType.PAGINATED:
                return (
                    <PaginatedAlbumGrid
                        baseUrl={baseUrl}
                        itemCount={itemCount}
                        libraryId={libraryId}
                        listKey={listKey}
                        pagination={pagination}
                        params={{
                            searchTerm: searchParams.get('search') ?? undefined,
                            sortBy,
                            sortOrder,
                        }}
                        setPagination={setPagination}
                    />
                );
            case ItemListPaginationType.INFINITE:
                return (
                    <InfiniteAlbumGrid
                        key={listKey}
                        baseUrl={baseUrl}
                        itemCount={itemCount}
                        libraryId={libraryId}
                        pagination={pagination}
                        params={{
                            searchTerm: searchParams.get('search') ?? undefined,
                            sortBy,
                            sortOrder,
                        }}
                    />
                );
        }
    }

    switch (paginationType) {
        case ItemListPaginationType.PAGINATED:
            return (
                <PaginatedAlbumTable
                    baseUrl={baseUrl}
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
                <InfiniteAlbumTable
                    baseUrl={baseUrl}
                    itemCount={itemCount}
                    libraryId={libraryId}
                    pagination={pagination}
                    params={{ sortBy, sortOrder }}
                />
            );
    }
}
