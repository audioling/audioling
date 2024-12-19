import { useParams, useSearchParams } from 'react-router';
import { useGetApiLibraryIdAlbumsCountSuspense } from '@/api/openapi-generated/albums/albums.ts';
import { InfiniteAlbumGrid } from '@/features/albums/list/infinite-album-grid.tsx';
import { InfiniteAlbumTable } from '@/features/albums/list/infinite-album-table.tsx';
import { PaginatedAlbumGrid } from '@/features/albums/list/paginated-album-grid.tsx';
import { PaginatedAlbumTable } from '@/features/albums/list/paginated-album-table.tsx';
import { useAlbumListStore } from '@/features/albums/stores/album-list-store.ts';
import { useAuthBaseUrl } from '@/features/authentication/stores/auth-store.ts';
import { ItemListDisplayType, ItemListPaginationType } from '@/features/ui/item-list/types.ts';
import { useListKey } from '@/hooks/use-list.ts';

export function AlbumListContent() {
    const { libraryId } = useParams() as { libraryId: string };
    const [searchParams] = useSearchParams();

    const folderId = useAlbumListStore.use.folderId();
    const sortBy = useAlbumListStore.use.sortBy();
    const sortOrder = useAlbumListStore.use.sortOrder();
    const { data: itemCount } = useGetApiLibraryIdAlbumsCountSuspense(libraryId, {
        folderId,
        searchTerm: searchParams.get('search') ?? undefined,
        sortBy,
        sortOrder,
    });

    return <ListComponent itemCount={itemCount} />;
}

function ListComponent({ itemCount }: { itemCount: number }) {
    const { libraryId } = useParams() as { libraryId: string };
    const [searchParams] = useSearchParams();

    const listId = useAlbumListStore.use.listId();
    const sortBy = useAlbumListStore.use.sortBy();
    const folderId = useAlbumListStore.use.folderId();
    const sortOrder = useAlbumListStore.use.sortOrder();
    const pagination = useAlbumListStore.use.pagination();
    const displayType = useAlbumListStore.use.displayType();
    const paginationType = useAlbumListStore.use.paginationType();
    const setPagination = useAlbumListStore.use.setPagination();

    const baseUrl = useAuthBaseUrl();

    const listKey = useListKey({
        displayType,
        folderId,
        listId,
        pagination,
        paginationType,
        sortBy,
        sortOrder,
    });

    const params = {
        folderId,
        searchTerm: searchParams.get('search') ?? undefined,
        sortBy,
        sortOrder,
    };

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
                        params={params}
                        setPagination={setPagination}
                    />
                );
            case ItemListPaginationType.INFINITE:
                return (
                    <InfiniteAlbumGrid
                        baseUrl={baseUrl}
                        itemCount={itemCount}
                        libraryId={libraryId}
                        listKey={listKey}
                        pagination={pagination}
                        params={params}
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
                    params={params}
                    setPagination={setPagination}
                />
            );
        case ItemListPaginationType.INFINITE:
            return (
                <InfiniteAlbumTable
                    baseUrl={baseUrl}
                    itemCount={itemCount}
                    libraryId={libraryId}
                    listKey={listKey}
                    pagination={pagination}
                    params={params}
                />
            );
    }
}
