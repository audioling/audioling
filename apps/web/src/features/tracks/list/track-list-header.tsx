import type { LibraryFeatures } from '@repo/shared-types';
import { LibraryItemType, TrackListSortOptions } from '@repo/shared-types';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router';
import { getGetApiLibraryIdTracksCountQueryKey } from '@/api/openapi-generated/tracks/tracks.ts';
import { useLibraryFeatures } from '@/features/authentication/stores/auth-store.ts';
import { ListFolderFilterButton } from '@/features/shared/list-folder-filter-button/list-folder-filter-button.tsx';
import { ListHeader } from '@/features/shared/list-header/list-header.tsx';
import { ListPaginationTypeButton } from '@/features/shared/list-pagination-type-button/list-pagination-type-button.tsx';
import { ListSortByButton } from '@/features/shared/list-sort-by-button/list-sort-by-button.tsx';
import { RefreshButton } from '@/features/shared/refresh-button/refresh-button.tsx';
import { SearchButton } from '@/features/shared/search-button/search-button.tsx';
import { SortOrderButton } from '@/features/shared/sort-order-button/sort-order-button.tsx';
import { useTrackListStore } from '@/features/tracks/store/track-list-store.ts';
import { Group } from '@/features/ui/group/group.tsx';
import { useRefreshList } from '@/hooks/use-list.ts';

export function TrackListHeader() {
    const { libraryId } = useParams() as { libraryId: string };
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();

    const features = useLibraryFeatures(libraryId);
    const sortOptions = getSortOptions(features);

    const setListId = useTrackListStore.use.setListId();
    const folderId = useTrackListStore.use.folderId();
    const sortBy = useTrackListStore.use.sortBy();
    const sortOrder = useTrackListStore.use.sortOrder();
    const paginationType = useTrackListStore.use.paginationType();

    const setFolderId = useTrackListStore.use.setFolderId();
    const setSortBy = useTrackListStore.use.setSortBy();
    const setSortOrder = useTrackListStore.use.setSortOrder();
    const setPaginationType = useTrackListStore.use.setPaginationType();

    const handleRefresh = useRefreshList({
        itemType: LibraryItemType.TRACK,
        libraryId,
        queryKey: [`/api/${libraryId}/tracks`],
        setListId,
    });

    const itemCountQueryKey = getGetApiLibraryIdTracksCountQueryKey(libraryId, {
        searchTerm: searchParams.get('search') ?? undefined,
        sortBy,
        sortOrder,
    });

    const itemCount = queryClient.getQueryData<number | undefined>(itemCountQueryKey);
    const isFetchingItemCount = useIsFetching({ queryKey: itemCountQueryKey });

    const isFetching = useIsFetching({ queryKey: [`/api/${libraryId}/tracks`] });

    return (
        <ListHeader>
            <ListHeader.Left>
                <ListHeader.Title>Tracks</ListHeader.Title>
                <ListHeader.ItemCount value={isFetchingItemCount ? 0 : (itemCount ?? 0)} />
            </ListHeader.Left>
            <ListHeader.Right>
                <Group gap="xs">
                    <SearchButton />
                </Group>
            </ListHeader.Right>
            <ListHeader.Footer>
                <ListHeader.Left>
                    <Group gap="xs" wrap="nowrap">
                        <ListSortByButton
                            options={sortOptions}
                            sort={sortBy}
                            onSortChanged={setSortBy}
                        />
                        <ListFolderFilterButton folderId={folderId} onFolderChanged={setFolderId} />
                        <SortOrderButton order={sortOrder} onOrderChanged={setSortOrder} />
                        <RefreshButton isLoading={Boolean(isFetching)} onRefresh={handleRefresh} />
                    </Group>
                </ListHeader.Left>
                <ListHeader.Right>
                    <Group gap="xs" wrap="nowrap">
                        <ListPaginationTypeButton
                            paginationType={paginationType}
                            onChangePaginationType={setPaginationType}
                        />
                    </Group>
                </ListHeader.Right>
            </ListHeader.Footer>
        </ListHeader>
    );
}

const trackSortLabelMap = {
    [TrackListSortOptions.ALBUM]: 'Album',
    [TrackListSortOptions.ALBUM_ARTIST]: 'Album Artist',
    [TrackListSortOptions.ARTIST]: 'Artist',
    [TrackListSortOptions.BPM]: 'BPM',
    [TrackListSortOptions.CHANNELS]: 'Channels',
    [TrackListSortOptions.COMMENT]: 'Comment',
    [TrackListSortOptions.DURATION]: 'Duration',
    [TrackListSortOptions.GENRE]: 'Genre',
    [TrackListSortOptions.ID]: 'Id',
    [TrackListSortOptions.IS_FAVORITE]: 'Is Favorite',
    [TrackListSortOptions.NAME]: 'Name',
    [TrackListSortOptions.PLAY_COUNT]: 'Play Count',
    [TrackListSortOptions.RANDOM]: 'Random',
    [TrackListSortOptions.RATING]: 'Rating',
    [TrackListSortOptions.RECENTLY_ADDED]: 'Recently Added',
    [TrackListSortOptions.RECENTLY_PLAYED]: 'Recently Played',
    [TrackListSortOptions.RELEASE_DATE]: 'Release Date',
    [TrackListSortOptions.YEAR]: 'Year',
};

function getSortOptions(
    features: LibraryFeatures,
): { label: string; value: TrackListSortOptions }[] {
    const trackSortFeatures = Object.keys(features)
        .filter((key) => key.includes('track:list:filter'))
        .filter((key) => features[key as keyof LibraryFeatures]);

    return trackSortFeatures.map((feature) => {
        const option = feature.replace('track:list:filter:', '') as TrackListSortOptions;
        return {
            label: trackSortLabelMap[option],
            value: option,
        };
    });
}
