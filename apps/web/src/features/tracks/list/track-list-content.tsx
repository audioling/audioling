import { useParams, useSearchParams } from 'react-router';
import stringify from 'safe-stable-stringify';
import { useGetApiLibraryIdTracksCountSuspense } from '@/api/openapi-generated/tracks/tracks.ts';
import { ListWrapper } from '@/features/shared/list-wrapper/list-wrapper.tsx';
import { InfiniteOfflineTrackTable } from '@/features/tracks/list/infinite-offline-track-table.tsx';
import { InfiniteTrackTable } from '@/features/tracks/list/infinite-track-table.tsx';
import { PaginatedOfflineTrackTable } from '@/features/tracks/list/paginated-offline-track-table.tsx';
import { PaginatedTrackTable } from '@/features/tracks/list/paginated-track-table.tsx';
import { useTrackListStore } from '@/features/tracks/store/track-list-store.ts';
import { Center } from '@/features/ui/center/center.tsx';
import { ItemListDisplayType, ItemListPaginationType } from '@/features/ui/item-list/types.ts';
import { Spinner } from '@/features/ui/spinner/spinner.tsx';
import { useListKey } from '@/hooks/use-list.ts';

export function TrackListContent() {
    const { libraryId } = useParams() as { libraryId: string };
    const sortBy = useTrackListStore.use.sortBy();
    const sortOrder = useTrackListStore.use.sortOrder();

    const [searchParams] = useSearchParams();
    const { data: itemCount } = useGetApiLibraryIdTracksCountSuspense(libraryId, {
        searchTerm: searchParams.get('search') ?? undefined,
        sortBy,
        sortOrder,
    });

    return <ListComponent itemCount={itemCount} />;
}

function ListComponent({ itemCount }: { itemCount: number }) {
    const { libraryId } = useParams() as { libraryId: string };
    const [searchParams] = useSearchParams();
    const listId = useTrackListStore.use.listId();
    const folderId = useTrackListStore.use.folderId();
    const sortBy = useTrackListStore.use.sortBy();
    const sortOrder = useTrackListStore.use.sortOrder();
    const mode = useTrackListStore.use.mode();
    const query = useTrackListStore.use.queryBuilder?.();
    const isQuerying = useTrackListStore.use.isQuerying?.();

    const pagination = useTrackListStore.use.pagination();
    const displayType = useTrackListStore.use.displayType();
    const paginationType = useTrackListStore.use.paginationType();
    const setPagination = useTrackListStore.use.setPagination();

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

    if (mode === 'offline') {
        const offlineListKey = `${stringify(query)}-${pagination.currentPage}`;

        if (!offlineListKey || !query) {
            return null;
        }

        if (isQuerying) {
            return (
                <Center>
                    <Spinner />
                </Center>
            );
        }

        switch (paginationType) {
            case ItemListPaginationType.PAGINATED:
                return (
                    <PaginatedOfflineTrackTable
                        libraryId={libraryId}
                        listKey={offlineListKey}
                        pagination={pagination}
                        query={query}
                        setPagination={setPagination}
                    />
                );
            case ItemListPaginationType.INFINITE:
                return (
                    <ListWrapper listKey={offlineListKey}>
                        <InfiniteOfflineTrackTable
                            libraryId={libraryId}
                            listKey={offlineListKey}
                            pagination={pagination}
                            query={query}
                        />
                    </ListWrapper>
                );
        }
    }

    if (displayType === ItemListDisplayType.GRID) {
        switch (paginationType) {
            case ItemListPaginationType.PAGINATED:
                return null;
            case ItemListPaginationType.INFINITE:
                return null;
        }
    }

    switch (paginationType) {
        case ItemListPaginationType.PAGINATED:
            return (
                <PaginatedTrackTable
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
                    <InfiniteTrackTable
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
