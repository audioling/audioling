import { useParams } from 'react-router';
import { useGetApiLibraryIdTracksCountSuspense } from '@/api/openapi-generated/tracks/tracks.ts';
import { useAuthBaseUrl } from '@/features/authentication/stores/auth-store.ts';
import { InfiniteTrackTable } from '@/features/tracks/list/infinite-track-table.tsx';
import { PaginatedTrackTable } from '@/features/tracks/list/paginated-track-table.tsx';
import {
    useTrackListActions,
    useTrackListState,
} from '@/features/tracks/store/track-list-store.ts';
import { ItemListDisplayType, ItemListPaginationType } from '@/features/ui/item-list/types.ts';
import { useListKey } from '@/hooks/use-list.ts';

export function TrackListContent() {
    const { libraryId } = useParams() as { libraryId: string };
    const { sortBy, sortOrder } = useTrackListState();
    const { data: itemCount } = useGetApiLibraryIdTracksCountSuspense(libraryId, {
        sortBy,
        sortOrder,
    });

    return <ListComponent itemCount={itemCount} />;
}

function ListComponent({ itemCount }: { itemCount: number }) {
    const { libraryId } = useParams() as { libraryId: string };
    const { listId, sortBy, sortOrder, pagination, displayType, paginationType } =
        useTrackListState();
    const { setPagination } = useTrackListActions();
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
                    params={{ sortBy, sortOrder }}
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
                    params={{ sortBy, sortOrder }}
                />
            );
    }
}
