import type { AlbumListSortOptions, ListSortOrder } from '@repo/shared-types';
import { useParams, useSearchParams } from 'react-router';
import { useGetApiLibraryIdAlbumsCountSuspense } from '@/api/openapi-generated/albums/albums.ts';
import { InfiniteAlbumGrid } from '@/features/albums/list/infinite-album-grid.tsx';
import { InfiniteAlbumTable } from '@/features/albums/list/infinite-album-table.tsx';
import { PaginatedAlbumGrid } from '@/features/albums/list/paginated-album-grid.tsx';
import { PaginatedAlbumTable } from '@/features/albums/list/paginated-album-table.tsx';
import { useAlbumListStore } from '@/features/albums/stores/album-list-store.ts';
import { ListWrapper } from '@/features/shared/list-wrapper/list-wrapper.tsx';
import type { ItemListPaginationState } from '@/features/ui/item-list/types.ts';
import { ItemListDisplayType, ItemListPaginationType } from '@/features/ui/item-list/types.ts';
import { useListKey } from '@/hooks/use-list.ts';

export function AlbumListContent() {
    const { libraryId } = useParams() as { libraryId: string };
    const [searchParams] = useSearchParams();

    const folderId = useAlbumListStore.use.folderId();
    const sortBy = useAlbumListStore.use.sortBy();
    const sortOrder = useAlbumListStore.use.sortOrder();
    const pagination = useAlbumListStore.use.pagination();
    const displayType = useAlbumListStore.use.displayType();
    const paginationType = useAlbumListStore.use.paginationType();
    const setPagination = useAlbumListStore.use.setPagination();

    const params = {
        folderId,
        searchTerm: searchParams.get('search') ?? undefined,
        sortBy,
        sortOrder,
    };

    const { data: itemCount } = useGetApiLibraryIdAlbumsCountSuspense(libraryId, params);

    return (
        <AlbumList
            displayType={displayType}
            itemCount={itemCount}
            pagination={pagination}
            paginationType={paginationType}
            params={params}
            setPagination={setPagination}
        />
    );
}

interface AlbumListProps {
    displayType: ItemListDisplayType;
    itemCount: number;
    pagination: ItemListPaginationState;
    paginationType: ItemListPaginationType;
    params: {
        folderId: string[];
        searchTerm: string | undefined;
        sortBy: AlbumListSortOptions;
        sortOrder: ListSortOrder;
    };
    setPagination: (pagination: ItemListPaginationState) => void;
}

export function AlbumList({
    displayType,
    itemCount,
    pagination,
    paginationType,
    params,
    setPagination,
}: AlbumListProps) {
    const { libraryId } = useParams() as { libraryId: string };

    const listKey = useListKey({
        displayType,
        pagination,
        paginationType,
        params,
    });

    if (displayType === ItemListDisplayType.GRID) {
        switch (paginationType) {
            case ItemListPaginationType.PAGINATED:
                return (
                    <PaginatedAlbumGrid
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
                        <InfiniteAlbumGrid
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
                <PaginatedAlbumTable
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
                    <InfiniteAlbumTable
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
