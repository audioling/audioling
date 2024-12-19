import { useParams } from 'react-router';
import { useGetApiLibraryIdTracksCountSuspense } from '@/api/openapi-generated/tracks/tracks.ts';
import { useAuthBaseUrl } from '@/features/authentication/stores/auth-store.ts';
import { InfiniteTrackTable } from '@/features/tracks/list/infinite-track-table.tsx';
import { PaginatedTrackTable } from '@/features/tracks/list/paginated-track-table.tsx';
import { useTrackListStore } from '@/features/tracks/store/track-list-store.ts';
import { ItemListDisplayType, ItemListPaginationType } from '@/features/ui/item-list/types.ts';
import { useListKey } from '@/hooks/use-list.ts';

export function TrackListContent() {
    const { libraryId } = useParams() as { libraryId: string };
    const sortBy = useTrackListStore.use.sortBy();
    const sortOrder = useTrackListStore.use.sortOrder();

    const { data: itemCount } = useGetApiLibraryIdTracksCountSuspense(libraryId, {
        sortBy,
        sortOrder,
    });

    return <ListComponent itemCount={itemCount} />;
}

function ListComponent({ itemCount }: { itemCount: number }) {
    const { libraryId } = useParams() as { libraryId: string };

    const listId = useTrackListStore.use.listId();
    const folderId = useTrackListStore.use.folderId();
    const sortBy = useTrackListStore.use.sortBy();
    const sortOrder = useTrackListStore.use.sortOrder();
    const pagination = useTrackListStore.use.pagination();
    const displayType = useTrackListStore.use.displayType();
    const paginationType = useTrackListStore.use.paginationType();
    const setPagination = useTrackListStore.use.setPagination();

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
        sortBy,
        sortOrder,
    };

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
                <InfiniteTrackTable
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
