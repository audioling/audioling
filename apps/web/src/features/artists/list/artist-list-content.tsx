import { useParams, useSearchParams } from 'react-router';
import { useGetApiLibraryIdAlbumArtistsCountSuspense } from '@/api/openapi-generated/album-artists/album-artists.ts';
import { InfiniteArtistGrid } from '@/features/artists/list/infinite-artist-grid.tsx';
import { InfiniteArtistTable } from '@/features/artists/list/infinite-artist-table.tsx';
import { PaginatedArtistGrid } from '@/features/artists/list/paginated-album-grid.tsx';
import { PaginatedArtistTable } from '@/features/artists/list/paginated-album-table.tsx';
import { useArtistListStore } from '@/features/artists/stores/artist-list-store.ts';
import { useAuthBaseUrl } from '@/features/authentication/stores/auth-store.ts';
import { ItemListDisplayType, ItemListPaginationType } from '@/features/ui/item-list/types.ts';
import { useListKey } from '@/hooks/use-list.ts';

export function ArtistListContent() {
    const { libraryId } = useParams() as { libraryId: string };
    const [searchParams] = useSearchParams();

    const folderId = useArtistListStore.use.folderId();
    const sortBy = useArtistListStore.use.sortBy();
    const sortOrder = useArtistListStore.use.sortOrder();
    const { data: itemCount } = useGetApiLibraryIdAlbumArtistsCountSuspense(libraryId, {
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

    const listId = useArtistListStore.use.listId();
    const sortBy = useArtistListStore.use.sortBy();
    const folderId = useArtistListStore.use.folderId();
    const sortOrder = useArtistListStore.use.sortOrder();
    const pagination = useArtistListStore.use.pagination();
    const displayType = useArtistListStore.use.displayType();
    const paginationType = useArtistListStore.use.paginationType();
    const setPagination = useArtistListStore.use.setPagination();

    const baseUrl = useAuthBaseUrl();

    const params = {
        folderId,
        searchTerm: searchParams.get('search') ?? undefined,
        sortBy,
        sortOrder,
    };

    const listKey = useListKey({
        displayType,
        listId,
        pagination,
        paginationType,
        params,
    });

    if (displayType === ItemListDisplayType.GRID) {
        switch (paginationType) {
            case ItemListPaginationType.PAGINATED:
                return (
                    <PaginatedArtistGrid
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
                    <InfiniteArtistGrid
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
                <PaginatedArtistTable
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
                <InfiniteArtistTable
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
