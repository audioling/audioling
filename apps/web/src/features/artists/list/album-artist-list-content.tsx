import { useParams, useSearchParams } from 'react-router';
import { useGetApiLibraryIdAlbumArtistsCountSuspense } from '@/api/openapi-generated/album-artists/album-artists.ts';
import { InfiniteAlbumArtistGrid } from '@/features/artists/list/infinite-album-artist-grid.tsx';
import { InfiniteAlbumArtistTable } from '@/features/artists/list/infinite-album-artist-table.tsx';
import { PaginatedAlbumArtistGrid } from '@/features/artists/list/paginated-album-artist-grid.tsx';
import { PaginatedArtistTable } from '@/features/artists/list/paginated-album-artist-table.tsx';
import { useArtistListStore } from '@/features/artists/stores/artist-list-store.ts';
import { ListWrapper } from '@/features/shared/list-wrapper/list-wrapper.tsx';
import { ItemListDisplayType, ItemListPaginationType } from '@/features/ui/item-list/types.ts';
import { useListKey } from '@/hooks/use-list.ts';

export function AlbumArtistListContent() {
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
                    <PaginatedAlbumArtistGrid
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
                    <ListWrapper listKey={listKey}>
                        <InfiniteAlbumArtistGrid
                            itemCount={itemCount}
                            libraryId={libraryId}
                            listKey={listKey}
                            pagination={pagination}
                            params={params}
                        />
                    </ListWrapper>
                );
        }
    }

    switch (paginationType) {
        case ItemListPaginationType.PAGINATED:
            return (
                <PaginatedArtistTable
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
                <ListWrapper listKey={listKey}>
                    <InfiniteAlbumArtistTable
                        itemCount={itemCount}
                        libraryId={libraryId}
                        listKey={listKey}
                        pagination={pagination}
                        params={params}
                    />
                </ListWrapper>
            );
    }
}
