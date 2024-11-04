import type { LibraryFeatures } from '@repo/shared-types';
import { AlbumListSortOptions } from '@repo/shared-types';
import { useParams } from 'react-router-dom';
import {
    useAlbumListActions,
    useAlbumListState,
} from '@/features/albums/stores/album-list-store.ts';
import { useLibraryFeatures } from '@/features/authentication/stores/auth-store.ts';
import { ListHeader } from '@/features/shared/list-header/list-header.tsx';
import { ListSortByButton } from '@/features/shared/list-sort-by-button/list-sort-by-button.tsx';
import { RefreshButton } from '@/features/shared/refresh-button/refresh-button.tsx';
import { SortOrderButton } from '@/features/shared/sort-order-button/sort-order-button.tsx';
import { Group } from '@/features/ui/group/group.tsx';
import { IconButton, IconButtonWithTooltip } from '@/features/ui/icon-button/icon-button.tsx';

export function AlbumListHeader() {
    const { libraryId } = useParams() as { libraryId: string };

    const features = useLibraryFeatures(libraryId);
    const sortOptions = getSortOptions(features);

    const { sortBy, sortOrder } = useAlbumListState();
    const { setSortBy, setSortOrder } = useAlbumListActions();

    return (
        <ListHeader>
            <ListHeader.Left>
                <ListHeader.Title>Albums</ListHeader.Title>
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
                        <RefreshButton onRefresh={() => {}} />
                    </Group>
                </ListHeader.Left>
                <ListHeader.Right>
                    <Group gap="xs" wrap="nowrap">
                        <IconButtonWithTooltip
                            icon="layoutGrid"
                            size="lg"
                            tooltipProps={{ label: 'Grid', position: 'bottom' }}
                        />
                        <IconButtonWithTooltip
                            icon="listInfinite"
                            size="lg"
                            tooltipProps={{ label: 'Infinite', position: 'bottom' }}
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
