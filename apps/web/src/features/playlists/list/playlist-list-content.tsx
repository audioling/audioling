import { useParams, useSearchParams } from 'react-router';
import { useGetApiLibraryIdPlaylistsCountSuspense } from '@/api/openapi-generated/playlists/playlists.ts';
import { InfinitePlaylistGrid } from '@/features/playlists/list/infinite-playlist-grid.tsx';
import { InfinitePlaylistTable } from '@/features/playlists/list/infinite-playlist-table.tsx';
import { PaginatedPlaylistGrid } from '@/features/playlists/list/paginated-playlist-grid.tsx';
import { PaginatedPlaylistTable } from '@/features/playlists/list/paginated-playlist-table.tsx';
import { usePlaylistListStore } from '@/features/playlists/stores/playlist-list-store.ts';
import { ListWrapper } from '@/features/shared/list-wrapper/list-wrapper.tsx';
import { ItemListDisplayType, ItemListPaginationType } from '@/features/ui/item-list/types.ts';
import { useListKey } from '@/hooks/use-list.ts';

export function PlaylistListContent() {
    const { libraryId } = useParams() as { libraryId: string };
    const [searchParams] = useSearchParams();
    const sortBy = usePlaylistListStore.use.sortBy();
    const sortOrder = usePlaylistListStore.use.sortOrder();
    const { data: itemCount } = useGetApiLibraryIdPlaylistsCountSuspense(libraryId, {
        searchTerm: searchParams.get('search') ?? undefined,
        sortBy,
        sortOrder,
    });

    return <ListComponent itemCount={itemCount} />;
}

function ListComponent({ itemCount }: { itemCount: number }) {
    const { libraryId } = useParams() as { libraryId: string };
    const [searchParams] = useSearchParams();

    const listId = usePlaylistListStore.use.listId();
    const sortBy = usePlaylistListStore.use.sortBy();
    const sortOrder = usePlaylistListStore.use.sortOrder();
    const pagination = usePlaylistListStore.use.pagination();
    const displayType = usePlaylistListStore.use.displayType();
    const paginationType = usePlaylistListStore.use.paginationType();
    const setPagination = usePlaylistListStore.use.setPagination();

    const params = {
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
                    <PaginatedPlaylistGrid
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
                        <InfinitePlaylistGrid
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
                <PaginatedPlaylistTable
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
                    <InfinitePlaylistTable
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
