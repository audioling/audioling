import type { LibraryFeatures } from '@repo/shared-types';
import { TrackListSortOptions } from '@repo/shared-types';
import { useIsFetching } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useLibraryFeatures } from '@/features/authentication/stores/auth-store.ts';
import { ListDisplayTypeButton } from '@/features/shared/display-type-button/list-display-type-button.tsx';
import { ListHeader } from '@/features/shared/list-header/list-header.tsx';
import { ListPaginationTypeButton } from '@/features/shared/list-pagination-type-button/list-pagination-type-button.tsx';
import { ListSortByButton } from '@/features/shared/list-sort-by-button/list-sort-by-button.tsx';
import { RefreshButton } from '@/features/shared/refresh-button/refresh-button.tsx';
import { SortOrderButton } from '@/features/shared/sort-order-button/sort-order-button.tsx';
import {
    useTrackListActions,
    useTrackListState,
} from '@/features/tracks/store/track-list-store.ts';
import { Group } from '@/features/ui/group/group.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import { useRefreshList } from '@/hooks/use-list.ts';

export function TrackListHeader() {
    const { libraryId } = useParams() as { libraryId: string };

    const features = useLibraryFeatures(libraryId);
    const sortOptions = getSortOptions(features);

    const { sortBy, sortOrder, displayType, paginationType } = useTrackListState();
    const { setSortBy, setSortOrder, setDisplayType, setListId, setPaginationType } =
        useTrackListActions();

    const handleRefresh = useRefreshList({
        queryKey: [`/api/${libraryId}/albums`],
        setListId,
    });

    const isFetching = useIsFetching({ queryKey: [`/api/${libraryId}/tracks`] });

    return (
        <ListHeader>
            <ListHeader.Left>
                <ListHeader.Title>Tracks</ListHeader.Title>
            </ListHeader.Left>
            <ListHeader.Right>
                <Group gap="xs">
                    <IconButton icon="search" size="lg" />
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
                        <SortOrderButton order={sortOrder} onOrderChanged={setSortOrder} />
                        <RefreshButton isLoading={Boolean(isFetching)} onRefresh={handleRefresh} />
                    </Group>
                </ListHeader.Left>
                <ListHeader.Right>
                    <Group gap="xs" wrap="nowrap">
                        <ListDisplayTypeButton
                            displayType={displayType}
                            onChangeDisplayType={setDisplayType}
                        />
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
