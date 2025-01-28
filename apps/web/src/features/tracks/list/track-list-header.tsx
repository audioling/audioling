import type { LibraryFeatures } from '@repo/shared-types';
import { TrackListSortOptions } from '@repo/shared-types';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router';
import { getGetApiLibraryIdTracksCountQueryKey } from '@/api/openapi-generated/tracks/tracks.ts';
import { useLibraryFeatures } from '@/features/authentication/stores/auth-store.ts';
import { ListFolderFilterButton } from '@/features/shared/list-folder-filter-button/list-folder-filter-button.tsx';
import { ListHeader } from '@/features/shared/list-header/list-header.tsx';
import { ListOptionsButton } from '@/features/shared/list-options-button/list-options-button.tsx';
import { ListSortByButton } from '@/features/shared/list-sort-by-button/list-sort-by-button.tsx';
import { RefreshButton } from '@/features/shared/refresh-button/refresh-button.tsx';
import { SearchButton } from '@/features/shared/search-button/search-button.tsx';
import { SortOrderButton } from '@/features/shared/sort-order-button/sort-order-button.tsx';
import { useTrackListStore } from '@/features/tracks/store/track-list-store.ts';
import { Group } from '@/features/ui/group/group.tsx';
import { ItemListColumn } from '@/features/ui/item-list/helpers.ts';

export function TrackListHeader({ handleRefresh }: { handleRefresh: () => void }) {
    const { libraryId } = useParams() as { libraryId: string };
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();

    const features = useLibraryFeatures(libraryId);
    const sortOptions = getSortOptions(features);

    const folderId = useTrackListStore.use.folderId();
    const sortBy = useTrackListStore.use.sortBy();
    const sortOrder = useTrackListStore.use.sortOrder();
    const paginationType = useTrackListStore.use.paginationType();
    const columnOrder = useTrackListStore.use.columnOrder();
    const setColumnOrder = useTrackListStore.use.setColumnOrder();

    const setFolderId = useTrackListStore.use.setFolderId();
    const setSortBy = useTrackListStore.use.setSortBy();
    const setSortOrder = useTrackListStore.use.setSortOrder();
    const setPaginationType = useTrackListStore.use.setPaginationType();

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
                    <ListOptionsButton
                        columnOptions={trackColumnOptions}
                        columns={columnOrder}
                        paginationType={paginationType}
                        onChangeColumns={setColumnOrder}
                        onChangePaginationType={setPaginationType}
                    />
                </ListHeader.Right>
            </ListHeader.Footer>
        </ListHeader>
    );
}

export const trackColumnOptions = [
    { label: 'Row Index', value: ItemListColumn.ROW_INDEX },
    { label: 'Image', value: ItemListColumn.IMAGE },
    { label: 'Name (Combined)', value: ItemListColumn.STANDALONE_COMBINED },
    { label: 'Name', value: ItemListColumn.NAME },
    { label: 'Album', value: ItemListColumn.ALBUM },
    { label: 'Duration', value: ItemListColumn.DURATION },
    { label: 'Artists', value: ItemListColumn.ARTISTS },
    { label: 'Genre', value: ItemListColumn.GENRE },
    { label: 'Release Date', value: ItemListColumn.RELEASE_DATE },
    { label: 'Track Number', value: ItemListColumn.TRACK_NUMBER },
    { label: 'Year', value: ItemListColumn.YEAR },
    { label: 'Last Played', value: ItemListColumn.LAST_PLAYED },
    { label: 'Favorite', value: ItemListColumn.FAVORITE },
    { label: 'Rating', value: ItemListColumn.RATING },
    { label: 'Actions', value: ItemListColumn.ACTIONS },
];

export const trackSortLabelMap = {
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
