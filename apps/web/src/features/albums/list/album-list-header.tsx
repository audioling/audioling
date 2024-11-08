import type { LibraryFeatures } from '@repo/shared-types';
import { AlbumListSortOptions } from '@repo/shared-types';
import { useIsFetching } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {
    useAlbumListActions,
    useAlbumListState,
} from '@/features/albums/stores/album-list-store.ts';
import { useLibraryFeatures } from '@/features/authentication/stores/auth-store.ts';
import { ListDisplayTypeButton } from '@/features/shared/display-type-button/list-display-type-button.tsx';
import { ListHeader } from '@/features/shared/list-header/list-header.tsx';
import { ListPaginationTypeButton } from '@/features/shared/list-pagination-type-button/list-pagination-type-button.tsx';
import { ListSortByButton } from '@/features/shared/list-sort-by-button/list-sort-by-button.tsx';
import { RefreshButton } from '@/features/shared/refresh-button/refresh-button.tsx';
import { SearchButton } from '@/features/shared/search-button/search-button.tsx';
import { SortOrderButton } from '@/features/shared/sort-order-button/sort-order-button.tsx';
import { Group } from '@/features/ui/group/group.tsx';
import { useRefreshList } from '@/hooks/use-list.ts';

export function AlbumListHeader() {
    const { libraryId } = useParams() as { libraryId: string };

    const features = useLibraryFeatures(libraryId);
    const sortOptions = getSortOptions(features);

    const { sortBy, sortOrder, displayType, paginationType } = useAlbumListState();
    const { setSortBy, setSortOrder, setDisplayType, setListId, setPaginationType } =
        useAlbumListActions();

    const handleRefresh = useRefreshList({
        queryKey: [`/api/${libraryId}/albums`],
        setListId,
    });

    const isFetching = useIsFetching({ queryKey: [`/api/${libraryId}/albums`] });

    return (
        <ListHeader>
            <ListHeader.Left>
                <ListHeader.Title>Albums</ListHeader.Title>
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

const albumSortLabelMap = {
    [AlbumListSortOptions.ALBUM_ARTIST]: 'Album Artist',
    [AlbumListSortOptions.ARTIST]: 'Artist',
    [AlbumListSortOptions.COMMUNITY_RATING]: 'Community Rating',
    [AlbumListSortOptions.CRITIC_RATING]: 'Critic Rating',
    [AlbumListSortOptions.DATE_ADDED]: 'Date Added',
    [AlbumListSortOptions.DATE_PLAYED]: 'Date Played',
    [AlbumListSortOptions.DURATION]: 'Duration',
    [AlbumListSortOptions.IS_FAVORITE]: 'Is Favorite',
    [AlbumListSortOptions.NAME]: 'Name',
    [AlbumListSortOptions.PLAY_COUNT]: 'Play Count',
    [AlbumListSortOptions.RANDOM]: 'Random',
    [AlbumListSortOptions.RATING]: 'Rating',
    [AlbumListSortOptions.RELEASE_DATE]: 'Release Date',
    [AlbumListSortOptions.TRACK_COUNT]: 'Track Count',
    [AlbumListSortOptions.YEAR]: 'Year',
};

function getSortOptions(
    features: LibraryFeatures,
): { label: string; value: AlbumListSortOptions }[] {
    const albumSortFeatures = Object.keys(features)
        .filter((key) => key.includes('album:list:filter'))
        .filter((key) => features[key as keyof LibraryFeatures]);

    return albumSortFeatures.map((feature) => {
        const option = feature.replace('album:list:filter:', '') as AlbumListSortOptions;
        return {
            label: albumSortLabelMap[option],
            value: option,
        };
    });
}
